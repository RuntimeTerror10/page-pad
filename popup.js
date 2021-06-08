const noContentDiv = document.querySelector(".no-content");
const notesContainer = document.querySelector(".notes-container");
const textBox = document.getElementById("notes");
const showCheckBox = document.querySelector(".js-show-notes-checkbox");
const allNotes = document.querySelector(".js-show-all-notes");
const allNotesContainer = document.querySelector(".all-notes-container");

chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
  var currentUrl = tabs[0].url;

  if (localStorage.getItem(currentUrl) === null) {
    window.addEventListener("keydown", (e) => {
      if ((e.key = "Enter")) {
        hideNoContentDiv();
        displayNotesContaniner();
        hideCheckBox();
        hideNresetAllNotes();
      }
    });
  } else {
    hideNoContentDiv();
    displayNotesContaniner();
    textBox.focus();
    let str = JSON.parse(window.localStorage.getItem(currentUrl));
    textBox.value = str;
    dispCheckBox();
  }
  textBox.addEventListener("blur", () => {
    var userNotes = textBox.value;
    if (userNotes.length >= 1) {
      storeNotes(currentUrl, userNotes);
    } else {
      showNoContenDiv();
      hideDisplayNotes();
      dispCheckBox();
    }
  });
  showCheckBox.addEventListener("change", () => {
    if (showCheckBox.checked === true) {
      hideDisplayNotes();
      hideNoContentDiv();
      showAllNotesContainer();
      var urlKeys = [];
      for (let key in localStorage) {
        urlKeys.push(key);
      }
      var currentOpenedSite = new URL(currentUrl);
      var currentHostName = currentOpenedSite.hostname;
      for (let i = 0; i < urlKeys.length; i++) {
        var tempUrl = new URL(urlKeys[i]);
        var tempHostName = tempUrl.hostname;
        var dispUrl = tempUrl.href.replace(/(^\w+:|^)\/\//, ""); //removing https:// from url

        if (currentHostName == tempHostName) {
          var pageNotes = JSON.parse(window.localStorage.getItem(tempUrl));
          var noteTab = document.createElement("details");
          noteTab.innerHTML = `<summary>${dispUrl}</summary><p>${pageNotes}</p>`;
          allNotesContainer.appendChild(noteTab);
        } else {
          console.log("not a match");
        }
      }
    } else {
      if (localStorage.getItem(currentUrl) === null) {
        showNoContenDiv();
      } else {
        displayNotesContaniner();
      }
      hideNresetAllNotes();
    }
  });
});
function showNoContenDiv() {
  noContentDiv.style.display = "block";
}
function hideNoContentDiv() {
  noContentDiv.style.display = "none";
}
function storeNotes(url, notes) {
  window.localStorage.setItem(url, JSON.stringify(notes));
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
function hideCheckBox() {
  allNotes.style.display = "none";
}
function dispCheckBox() {
  allNotes.style.display = "block";
}
function showAllNotesContainer() {
  allNotesContainer.style.display = "block";
}
