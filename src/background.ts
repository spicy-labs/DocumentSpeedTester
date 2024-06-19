import type { TestData } from "./types"
import { getLocalData, setLocalData, createTestData } from "./chromeStorage";

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  sendResponse();
  console.log("Message received from content script:", message);

  if (message.event == "test-ready") {
    getLocalData((data) => {
      data.tabId = message.tabId;
      data.mode = "test";
      data.testLength = message.testLength;
      data.maxSleepTime = message.maxTimeout;
      data.sleep = message.sleep;
      setLocalData(data, function() {
        chrome.tabs.sendMessage(message.tabId, { event: "force-reload" }, () => { });
      });
    });
  }

  if (message.event == "prepare-ready") {
    getLocalData((data) => {
      data.mode = "prepare";
      setLocalData(data, function() {
        chrome.tabs.sendMessage(message.tabId, { event: "force-reload" }, () => { });
      });
    });
  }

});

function prepareTestData(data: TestData, req: chrome.webRequest.WebRequestBodyDetails): TestData {
  const newData = createTestData();
  newData.mode = "prepare";
  newData.type = (req.url.includes("editor_html.aspx")) ? "publisher" : (req.url.includes("/studio/projects/")) ? "studio-ui" : undefined;
  return newData;
}

// @ts-ignore
globalThis.debug = {
  getData: async function() {
    return new Promise(res => getLocalData(res))
  },
  setData: async function(data: TestData) {
    return new Promise(res => setLocalData(data, res))
  },
  modifyData: async function(func: (d: TestData) => TestData) {
    return new Promise(res => getLocalData(function(d) {
      setLocalData(func(d), res);
    }));
  },
  clearData: async function() {
    return new Promise(res => setLocalData(createTestData(), res));
  }
}

const onBeforeRequestFilterUrls = [
  "*://*/*editor_html.aspx*",
  "*://*/*/studio/projects/*"
];


chrome.webRequest.onBeforeRequest.addListener(handleOnBeforeRequest, { urls: onBeforeRequestFilterUrls });
chrome.webRequest.onCompleted.addListener(handleCompleteRequests, { urls: ["<all_urls>"] }, ["responseHeaders", "extraHeaders"]);

function handleOnBeforeRequest(req: chrome.webRequest.WebRequestBodyDetails) {
  const startTime = new Date().getTime();

  getLocalData((data) => {
    const { mode } = data;

    if (mode == "skip") { }

    if (mode == "prepare") {
      setLocalData(prepareTestData(data, req));
    }

    if (mode == "test") {
      data.startTime = startTime;
      data.reload = false;
      setLocalData(data);
    }
  });
}

function handleCompleteRequests(req: chrome.webRequest.WebResponseCacheDetails) {
  const downloadMatchUrls = [
    "resources/External/download",
    "resources/Fonts/download",
    "resources/Assets/download",
    "/font-styles/",
    "preview/highest",
  ]

  if (req.method == "GET" && downloadMatchUrls.filter(match => req.url.includes(match)).length > 0) {
    const endTime = new Date().getTime();

    getLocalData(function(data) {

      if (data.mode == "skip") return;

      if (data.mode == "prepare") {
        data = handleRequestForPrepareMode(data, req);
      }

      if (data.mode == "test") {
        data = handleRequestsForTestMode(data, endTime, req);
      }

      setLocalData(data, function() {
        if (data.tabId != null && data.reload && data.testLength > 0) {
          chrome.tabs.sendMessage(data.tabId, { event: "reload", sleep: data.sleep, maxSleepTime: data.maxSleepTime }, () => { });
        }

        if (data.download) {

          const results = {
            tests: data.lastRequestTimings,
            results: getTimingStats(data.lastRequestTimings)
          }

          dataToURL(JSON.stringify(results, null, 4), "text/json;charset=utf-8", (url) => {
            chrome.downloads.download({
              url: url,
              filename: "results.json",
              saveAs: true
            }, () => { })
          });

          data.download = false;

          setLocalData(data);
        }
      });

    });
  }
}

function handleRequestForPrepareMode(data: TestData, req: chrome.webRequest.WebResponseCacheDetails) {
  data.trackedUrls.push(req.url);
  return data;
}

function handleRequestsForTestMode(data: TestData, endTime: number, req: chrome.webRequest.WebResponseCacheDetails) {

  data.foundUrls.push(req.url);

  if (data.foundUrls.length == data.trackedUrls.length) {
    data.lastRequestTimings.push(endTime - data.startTime);
    data.foundUrls = [];
    data.testIndex += 1;
    data.reload = true;
  }

  if (data.testLength == data.testIndex) {
    data.reload = false;
    data.mode = "skip";
    data.download = true;
  }

  return data;

}

function dataToURL(data: any, dataType: string, callback: (blobUrl: string) => void) {

  // for utf8 bom 
  const blob = new Blob(['\uFEFF' + data], { type: dataType });

  // use BlobReader object to read Blob data
  const reader = new FileReader();
  reader.onload = () => {
    const buffer = reader.result as ArrayBuffer;
    const blobUrl = `data:${blob.type};base64,${btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;
    callback(blobUrl)
  };
  reader.readAsArrayBuffer(blob);
}

function getTimingStats(timings: number[]) {
  const average = timings.reduce((a, b) => a + b, 0) / timings.length;
  const sortedTimings = timings.slice().sort((a, b) => a - b);
  const middle = Math.floor(sortedTimings.length / 2);
  const median = sortedTimings.length % 2 !== 0 ? sortedTimings[middle] : (sortedTimings[middle - 1] + sortedTimings[middle]) / 2;
  const max = Math.max(...timings);

  return {
    average,
    median,
    max
  }
}
