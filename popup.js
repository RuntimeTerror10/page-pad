const noContentDiv = document.querySelector(".no-content");
const notesContainer = document.querySelector(".notes-container");
const textBox = document.getElementById("notes");
chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
  var currentUrl = tabs[0].url;

  if (localStorage.getItem(currentUrl) === null) {
    window.addEventListener("keydown", (e) => {
      if ((e.key = "Enter")) {
        hideNoContentDiv();
        displayNotesContaniner();
      }
    });
  } else {
    hideNoContentDiv();
    displayNotesContaniner();
    let str = JSON.parse(window.localStorage.getItem(currentUrl));
    textBox.value = str;
  }
  textBox.addEventListener("blur", () => {
    var userNotes = textBox.value;
    storeNotes(currentUrl, userNotes);
  });
});
function hideNoContentDiv() {
  noContentDiv.style.display = "none";
}
function storeNotes(url, notes) {
  window.localStorage.setItem(url, JSON.stringify(notes));
}
function displayNotesContaniner() {
  notesContainer.style.display = "block";
  textBox.focus();
}
