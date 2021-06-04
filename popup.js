const noContentDiv = document.querySelector(".no-content");
const notesContainer = document.querySelector(".notes-container");
const textBox = document.getElementById("notes");
chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
  var currentUrl = tabs[0].url;

  if (localStorage.getItem(currentUrl) === null) {
    window.addEventListener("keydown", (e) => {
      if ((e.key = "Enter")) {
        hideNoContentDiv();
        notesContainer.style.display = "block";
        textBox.focus();
      }
    });
  } else {
    hideNoContentDiv();
    notesContainer.style.display = "block";
    let str = JSON.parse(window.localStorage.getItem(currentUrl));
    textBox.value = str;
    textBox.focus();
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
