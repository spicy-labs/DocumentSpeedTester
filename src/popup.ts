import { getLocalData } from "./chromeStorage";
import { renderPrepare, renderTest } from "./popupRenderer";
import type { TestData } from "./types";

const allowed = ["chili-publish.online", "chili-publish-sandbox.online", "chiligrafx.com", "editor_html.aspx", "/studio/projects/"];

document.addEventListener("DOMContentLoaded", function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const activeTab = tabs[0];
    const url = activeTab.url;
    const activeTabId = activeTab.id;

    if (activeTabId && url && allowed.filter(d => url.includes(d)).length > 1) {
      getLocalData((data => {
        if (data.mode == "skip") {
          renderPrepare(() => popupButton(data, activeTabId));
        }
        if (data.mode == "prepare") {
          renderTest(() => testButton(data, activeTabId));
        }
      }));
    }

  });

});

function popupButton(data: TestData, tabId: number) {
  chrome.runtime.sendMessage({ event: "prepare-ready", tabId });
  window.close();
}

function testButton(data: TestData, tabId: number) {

  const testLength = parseInt((document.getElementById("numberInput") as HTMLInputElement)?.value);
  const maxSleepTime = parseInt((document.getElementById("maxTimeInput") as HTMLInputElement)?.value);
  const sleep = (document.getElementById("randomSleepCheckbox") as HTMLInputElement).checked;

  chrome.runtime.sendMessage({
    event: "test-ready",
    tabId,
    testLength: (isNaN(testLength) || testLength < 0) ? 0 : testLength,
    maxSleepTime: (isNaN(maxSleepTime) || maxSleepTime < 2) ? 2 : maxSleepTime,
    sleep: sleep,
  });
  window.close();
}
