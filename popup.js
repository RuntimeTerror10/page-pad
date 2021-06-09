const notesContainer = document.querySelector(".notes-container");
const textBox = document.getElementById("notes");
const showCheckBox = document.querySelector(".js-show-notes-checkbox");
const allNotes = document.querySelector(".js-show-all-notes");
const allNotesContainer = document.querySelector(".all-notes-container");
const popUpBody = document.querySelector("body");
const SiteName = document.querySelector(".site-name");

chrome.tabs.query({ active: true }, function (tabs) {
  var currentUrl = tabs[0].url;

  if (localStorage.getItem(currentUrl) === null) {
    displayNotesContaniner();
    hideNresetAllNotes();
    textBox.focus();
  } else {
    displayNotesContaniner();
    textBox.focus();
    let str = JSON.parse(window.localStorage.getItem(currentUrl));
    textBox.value = str;
  }

  textBox.addEventListener("blur", () => {
    var userNotes = textBox.value;

    if (userNotes.length == 0) {
      // if user clears all the notes
      removeNotes(currentUrl);
      chrome.browserAction.setBadgeText({ text: "" });
    }
    if (userNotes.length >= 1) {
      //if user has added some notes
      storeNotes(currentUrl, userNotes);
      displayNotesContaniner();
      chrome.browserAction.setBadgeBackgroundColor({ color: "green" });
      chrome.browserAction.setBadgeText({ text: "*" });
    }
  });
  showCheckBox.addEventListener("change", () => {
    if (showCheckBox.checked === true) {
      hideDisplayNotes();
      SiteName.style.display = "block";
      showAllNotesContainer();
      var urlKeys = [];
      for (let key in localStorage) {
        urlKeys.push(key);
      }
      var currentOpenedSite = new URL(currentUrl);
      var currentHostName = currentOpenedSite.hostname;
      SiteName.innerText = currentHostName;
      for (let i = 0; i < urlKeys.length; i++) {
        var tempUrl = new URL(urlKeys[i]);
        var tempHostName = tempUrl.hostname;
        var tempDispUrl = tempUrl.href;
        var pageId = tempDispUrl.substr(tempDispUrl.indexOf("/", 8) + 1);
        if (currentHostName == tempHostName) {
          var pageNotes = JSON.parse(window.localStorage.getItem(tempUrl));
          var noteTab = document.createElement("details");
          noteTab.className = "all-notes-tab";
          noteTab.innerHTML = `<summary class="summary-heading">${pageId}</summary><hr class="all-notes-hr"/><textarea rows="6" cols="30" spellcheck="false" readonly class="readonly-textarea" >${pageNotes}</textarea>`;
          allNotesContainer.appendChild(noteTab);
        } else {
          console.log("not a match");
        }
      }
    } else {
      displayNotesContaniner();
      hideNresetAllNotes();
      SiteName.style.display = "none";
    }
  });
});

popUpBody.addEventListener("blur", () => {
  var userNote = textBox.value;
  if (userNote.length == 0) {
    // if user clears all the notes
    chrome.browserAction.setBadgeText({ text: "" });
  }
  if (userNote.length >= 1) {
    //if user has added some notes

    chrome.browserAction.setBadgeBackgroundColor({ color: "green" });
    chrome.browserAction.setBadgeText({ text: "*" });
  }
});

function storeNotes(url, notes) {
  window.localStorage.setItem(url, JSON.stringify(notes));
}
function removeNotes(url) {
  window.localStorage.removeItem(url);
}
function displayNotesContaniner() {
  notesContainer.style.display = "block";
}
function hideDisplayNotes() {
  notesContainer.style.display = "none";
}
function hideNresetAllNotes() {
  allNotesContainer.style.display = "none";
  allNotesContainer.innerHTML = "";
}

function showAllNotesContainer() {
  allNotesContainer.style.display = "block";
}
