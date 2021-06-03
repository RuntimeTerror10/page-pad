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
    if (localStorage.getItem(mylink) !== null) {
      let inputValue = input.value;
      storeNotes(mylink, arrayOfNotes, inputValue);
      let getArray = getNotes(mylink);
      console.log(getArray);
    } else {
      arrayOfNotes = [];
      let inputValue = input.value;
      storeNotes(mylink, arrayOfNotes, inputValue);
      let getArray = getNotes(mylink);
      console.log(getArray);
    }
  });
  input.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      if (localStorage.getItem(mylink) !== null) {
        let inputValue = input.value;
        storeNotes(mylink, arrayOfNotes, inputValue);
        let getArray = getNotes(mylink);
        console.log(getArray);
      } else {
        arrayOfNotes = [];
        let inputValue = input.value;
        storeNotes(mylink, arrayOfNotes, inputValue);
        let getArray = getNotes(mylink);
        console.log(getArray);
      }
    }
  });
});

function storeNotes(url, notes, inputVal) {
  notes.push(inputVal);
  input.value = "";
  window.localStorage.setItem(url, JSON.stringify(notes));
}
function getNotes(url) {
  var getArr = JSON.parse(window.localStorage.getItem(url));
  return getArr;
}
/*var getArray = window.localStorage.getItem(mylink);
    console.log(getArray);*/
