const notesContainer = document.querySelector(".notes-container");
const textBox = document.getElementById("notes");
const showCheckBox = document.querySelector(".js-show-notes-checkbox");
const allNotes = document.querySelector(".js-show-all-notes");
const allNotesContainer = document.querySelector(".all-notes-container");
const popUpBody = document.querySelector("body");
const siteName = document.querySelector(".site-name");
const noNotes = document.querySelector(".no-notes");

chrome.tabs.query({ active: true }, function (tabs) {
  const currentUrl = tabs[0].url;
  const url = new URL(currentUrl);
  const storageKey = `${url.origin}${url.pathname}`;

  const fetchedItem = localStorage.getItem(storageKey);

  if (fetchedItem === null) {
    displayNotesContaniner();
    hideNresetAllNotes();
    textBox.focus();
  } else {
    displayNotesContaniner();
    textBox.focus();
    let str = JSON.parse(fetchedItem);
    textBox.value = str;
  }

  textBox.addEventListener("blur", () => {
    var userNotes = textBox.value;

    if (userNotes.length == 0) {
      // if user clears all the notes
      removeNotes(storageKey);
      chrome.browserAction.setBadgeText({ text: "" });
    }
    if (userNotes.length >= 1) {
      //if user has added some notes
      storeNotes(storageKey, userNotes);
      displayNotesContaniner();
      chrome.browserAction.setBadgeBackgroundColor({ color: "green" });
      chrome.browserAction.setBadgeText({ text: "*" });
    }
  });
  showCheckBox.addEventListener("change", () => {
    if (showCheckBox.checked === true) {
      noNotes.style.display = "block";
      hideDisplayNotes();
      siteName.style.display = "block";
      showAllNotesContainer();
      var urlKeys = [];
      for (let key in localStorage) {
        urlKeys.push(key);
      }
      var currentOpenedSite = new URL(storageKey);
      var currentHostName = currentOpenedSite.hostname;
      siteName.innerText = currentHostName;

      for (let i = 0; i < urlKeys.length; i++) {
        const tempUrl = new URL(urlKeys[i]);
        const tempHostName = tempUrl.hostname;

        // remove protocol and hostname
        const pageId = tempUrl.pathname;

        if (currentHostName == tempHostName) {
          noNotes.style.display = "none";
          const pageNotes = JSON.parse(window.localStorage.getItem(tempUrl));
          const noteTab = document.createElement("details");
          noteTab.className = "all-notes-tab";
          noteTab.innerHTML = `
            <summary class="summary-heading">${pageId}</summary>
            <textarea rows="6" cols="30" spellcheck="false" readonly class="readonly-textarea notepad" >${pageNotes}</textarea>
          `;
          allNotesContainer.appendChild(noteTab);
        } else {
          console.log("not a match");
        }
      }
    } else {
      displayNotesContaniner();
      hideNresetAllNotes();
      siteName.style.display = "none";
      noNotes.style.display = "none";
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
