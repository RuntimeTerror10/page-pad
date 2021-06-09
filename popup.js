const notesContainer = document.querySelector(".notes-container");
const textBox = document.getElementById("notes");
const showCheckBox = document.querySelector(".js-show-notes-checkbox");
const allNotes = document.querySelector(".js-show-all-notes");
const allNotesContainer = document.querySelector(".all-notes-container");

chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
  var currentUrl = tabs[0].url;

  if (localStorage.getItem(currentUrl) === null) {
    displayNotesContaniner();
    dispCheckBox();
    hideNresetAllNotes();
    textBox.focus();
  } else {
    displayNotesContaniner();
    textBox.focus();
    let str = JSON.parse(window.localStorage.getItem(currentUrl));
    textBox.value = str;
    dispCheckBox();
  }

  textBox.addEventListener("blur", () => {
    var userNotes = textBox.value;
    if (userNotes.length == 0) {
      removeNotes(currentUrl);
    }
    if (userNotes.length >= 1) {
      storeNotes(currentUrl, userNotes);
      displayNotesContaniner();
      dispCheckBox();
    }
  });
  showCheckBox.addEventListener("change", () => {
    if (showCheckBox.checked === true) {
      hideDisplayNotes();
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
          noteTab.className = "all-notes-tab";
          noteTab.innerHTML = `<summary class="summary-heading">${dispUrl}</summary><hr class="all-notes-hr"/><textarea rows="6" cols="30" spellcheck="false" readonly class="readonly-textarea" >${pageNotes}</textarea>`;
          allNotesContainer.appendChild(noteTab);
        } else {
          console.log("not a match");
        }
      }
    } else {
      displayNotesContaniner();
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
function hideCheckBox() {
  allNotes.style.display = "none";
}
function dispCheckBox() {
  allNotes.style.display = "block";
}
function showAllNotesContainer() {
  allNotesContainer.style.display = "block";
}
