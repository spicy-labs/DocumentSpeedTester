import type { TestData } from "./types.ts";

export function createTestData(): TestData {
  return {
    testIndex: 0,
    testLength: 0,
    foundUrls: [],
    startTime: 0,
    lastRequestTimings: [],
    trackedUrls: [],
    mode: "skip",
    reload: false,
    sleep: false,
    maxSleepTime: 0
  }
}

// This is a cheap verification, objects and arrays will not be checked properly
function anyObjectIntoTestData(data: { [key: string]: any }) {
  const tempData: { [key: string]: any } = createTestData();
  return { ...tempData, ...data } as TestData
}

export function getLocalData(callback: (data: TestData, error: boolean) => void) {
  chrome.storage.local.get("testData", (d: any) => {
    if (chrome.runtime.lastError) {
      throw new Error(chrome.runtime.lastError.message)
    }

    const testData = (d.testData == null) ? createTestData() : anyObjectIntoTestData(d.testData);
    callback(testData, chrome.runtime.lastError != null);
  })
}

export function setLocalData(data: TestData, callback?: (error: boolean) => void) {
  chrome.storage.local.set({ testData: data }, function() {
    if (chrome.runtime.lastError) {
      throw new Error(chrome.runtime.lastError.message)
    }

    if (callback) callback(chrome.runtime.lastError != null);

    // getLocalData((d) => {
    //   console.log("afterSet", d)
    //   if (callback) callback(chrome.runtime.lastError != null);
    // });

  })
}
