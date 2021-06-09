chrome.tabs.onActivated.addListener(function (activeInfo) {
  setTimeout(() => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      var url = tab.url;
      var currentTabId = tab.tabId;
      if (localStorage.getItem(url) !== null) {
        showBadge(currentTabId);
      } else {
        hideBadge(currentTabId);
      }
    });
  }, 500);
});

chrome.tabs.onUpdated.addListener(function (activeInfo) {
  chrome.tabs.getSelected(null, function (tab) {
    var url = tab.url;
    var currentTabId = tab.tabId;
    if (localStorage.getItem(url) !== null) {
      showBadge(currentTabId);
    } else {
      hideBadge(currentTabId);
    }
  });
});

function showBadge(tabid) {
  chrome.browserAction.setBadgeBackgroundColor({ color: "green" }, () => {
    chrome.browserAction.setBadgeText({ tabId: tabid, text: "*" });
  });
}

function hideBadge(tabid) {
  chrome.browserAction.setBadgeBackgroundColor({ color: "green" }, () => {
    chrome.browserAction.setBadgeText({
      tabId: tabid,
      text: "",
    });
  });
}
