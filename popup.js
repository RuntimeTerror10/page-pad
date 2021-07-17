const notesContainer = document.querySelector(".notes-container");
const textBox = document.getElementById("notes");
const showCheckBox = document.querySelector(".js-show-notes-checkbox");
const allNotes = document.querySelector(".js-show-all-notes");
const allNotesContainer = document.querySelector(".all-notes-container");
const popUpBody = document.querySelector("body");
const siteName = document.querySelector(".site-name");
const noNotes = document.querySelector(".no-notes");
const allNotesPagelink = document.querySelector(".all-web-notes");
const toolbar = document.querySelector("#trix-toolbar");

allNotesPagelink.href = `chrome-extension://${chrome.runtime.id}/index.html`;

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var currentUrl = tabs[0].url;
  var currentTitle = tabs[0].title;

  if (localStorage.getItem(currentUrl) === null) {
    displayNotesContaniner();
    hideNresetAllNotes();
    textBox.focus();
  } else {
    displayNotesContaniner();
    textBox.focus();
    let getObj = JSON.parse(localStorage.getItem(currentUrl));
    textBox.value = getObj.notes;
  }

  textBox.addEventListener("blur", () => {
    var userNotes = textBox.value;
    var userTabTitle = currentTitle;

    const userObj = { title: userTabTitle, notes: userNotes };

    if (userNotes.length == 0) {
      // if user clears all the notes
      removeNotes(currentUrl);
      chrome.browserAction.setBadgeText({ text: "" });
    }
    if (userNotes.length >= 1) {
      //if user has added some notes
      storeNotes(currentUrl, userObj);
      displayNotesContaniner();
      chrome.browserAction.setBadgeBackgroundColor({ color: "green" });
      chrome.browserAction.setBadgeText({ text: "*" });
    }
  });

  showCheckBox.addEventListener("change", () => {
    if (showCheckBox.checked === true) {
      toolbar.style.display = "none";
      noNotes.style.display = "block";
      hideDisplayNotes();
      siteName.style.display = "block";
      var urlKeys = [];
      for (let key in localStorage) {
        var obj = JSON.parse(localStorage.getItem(key));
        if (typeof obj === "object") {
          urlKeys.push(key);
        }
      }
      var currentOpenedSite = new URL(currentUrl);
      var currentHostName = currentOpenedSite.hostname;
      siteName.innerText = currentHostName;

      for (let i = 0; i < urlKeys.length; i++) {
        const tempUrl = new URL(urlKeys[i]);
        const tempHostName = tempUrl.hostname;

        // remove protocol and hostname
        if (currentHostName == tempHostName) {
          showAllNotesContainer();
          noNotes.style.display = "none";

          const fetchedObj = JSON.parse(window.localStorage.getItem(tempUrl));
          const pageNotes = fetchedObj.notes;
          const pageId = fetchedObj.title;
          const noteTab = document.createElement("details");

          noteTab.className = "all-notes-tab";
          noteTab.innerHTML = `
            <summary class="summary-heading">${pageId}</summary>
            <div class="readonly" >${pageNotes}</div>
            <div class="ctrl-div"><button class="delete-btn" id="${tempUrl}"><img src="/img/trash.png"/></button></div>
            
          `;
          allNotesContainer.appendChild(noteTab);
          deleteNotesOnclick();
        } else {
          console.log("not a match");
        }
      }
    } else {
      displayNotesContaniner();
      hideNresetAllNotes();
      siteName.style.display = "none";
      noNotes.style.display = "none";
      toolbar.style.display = "block";
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

function storeNotes(url, userPara) {
  window.localStorage.setItem(url, JSON.stringify(userPara));
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

function deleteNotesOnclick() {
  document.querySelectorAll(".delete-btn").forEach((item) =>
    item.addEventListener("click", () => {
      let temp = item.parentNode;
      temp.parentNode.style.display = "none";
      window.localStorage.removeItem(item.id);
    })
  );
}
