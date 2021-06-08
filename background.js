chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.getSelected(null, function (tab) {
    var url = tab.url;
    var currentTabId = tab.tabId;
    if (localStorage.getItem(url) !== null) {
      chrome.browserAction.setBadgeBackgroundColor({ color: "green" }, () => {
        chrome.browserAction.setBadgeText({ tabId: currentTabId, text: "*" });
      });
    } else {
      chrome.browserAction.setBadgeBackgroundColor({ color: "green" }, () => {
        chrome.browserAction.setBadgeText({
          tabId: currentTabId,
          text: "",
        });
      });
    }
  });
});

chrome.tabs.onUpdated.addListener(function (activeInfo) {
  chrome.tabs.getSelected(null, function (tab) {
    var url = tab.url;
    var currentTabId = tab.tabId;
    if (localStorage.getItem(url) !== null) {
      chrome.browserAction.setBadgeBackgroundColor({ color: "green" }, () => {
        chrome.browserAction.setBadgeText({
          tabId: currentTabId,
          text: "*",
        });
      });
    } else {
      chrome.browserAction.setBadgeBackgroundColor({ color: "green" }, () => {
        chrome.browserAction.setBadgeText({
          tabId: currentTabId,
          text: "",
        });
      });
    }
  });
});
