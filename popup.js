var noContentDiv = document.querySelector(".no-content");
var addNoteBtn = document.querySelector(".add-btn");
var inputDiv = document.querySelector(".inputdiv");
var submitNoteBtn = document.querySelector(".plus-btn");
var input = document.querySelector(".inputArea");
var arrayOfNotes = [];

chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
  var mylink = tabs[0].url;
  addNoteBtn.addEventListener("click", () => {
    addNoteBtn.style.display = "none";
    inputDiv.style.display = "flex";
  });
  submitNoteBtn.addEventListener("click", () => {
    var inputValue = input.value;

    if (localStorage.getItem(mylink) === null) {
      let arrayOfNotes = [];
      storeNotes(mylink, arrayOfNotes, inputValue);
      noContentDiv.style.display = "none";
      displayNotes(inputValue);
    } else {
      let tempArr = JSON.parse(window.localStorage.getItem(mylink));
      tempArr.push(inputValue);
      window.localStorage.setItem(mylink, JSON.stringify(tempArr));
      noContentDiv.style.display = "none";
      displayNotes(inputValue);
      clearInputArea();
    }

    //getNotes(mylink);
  });
  input.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      var inputValue = input.value;
      if (localStorage.getItem(mylink) === null) {
        arrayOfNotes = [];
        storeNotes(mylink, arrayOfNotes, inputValue);
        noContentDiv.style.display = "none";
        displayNotes(inputValue);
      } else {
        let tempArr = JSON.parse(window.localStorage.getItem(mylink));
        tempArr.push(inputValue);
        window.localStorage.setItem(mylink, JSON.stringify(tempArr));
        noContentDiv.style.display = "none";
        displayNotes(inputValue);
        clearInputArea();
      }
    }
  });
});

function storeNotes(url, notes, inputVal) {
  notes.push(inputVal);
  input.value = "";
  window.localStorage.setItem(url, JSON.stringify(notes));
}
/*
function getNotes(url) {
  var arr = JSON.parse(window.localStorage.getItem(url));
  for (a = 0; a < arr.length; a++) {
    var note = document.createElement("p");
    note.innerText = arr[a];
    note.className = "note";
    var notesDiv = document.querySelector(".notes-div");
    notesDiv.appendChild(note);
  }
}

/*var getArray = window.localStorage.getItem(mylink);
    console.log(getArray);*/
function clearInputArea() {
  input.value = "";
}
function displayNotes(val) {
  let displayNote = document.createElement("p");
  displayNote.className = "note";
  displayNote.innerText = val;
  var notesDiv = document.querySelector(".notes-div");
  notesDiv.appendChild(displayNote);
}
