const container = document.querySelector(".all-notes-container");
const searchBar = document.querySelector(".search-input");
const filterContainer = document.querySelector(".filter-notes-container");
const filterList = document.querySelector(".filter-list");
const websiteList = document.querySelector(".website-list");
const checkbox = document.querySelector(".all-notes-check");
const defaultHeading = document.querySelector(".websites-heading");
const defaultList = document.querySelector(".default-container");
const heading = document.querySelector(".filter-heading");

var urlKeys = [];
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  var obj = JSON.parse(localStorage.getItem(key));
  if (typeof obj === "object") {
    urlKeys.push(key);
  }
}

var urlMap = new Map();

for (let x = 0; x < urlKeys.length; x++) {
  var tempUrl = new URL(urlKeys[x]);
  var key = tempUrl.hostname;

  if (urlMap.has(key)) {
    var fetchedArr = urlMap.get(key);
    fetchedArr.push(urlKeys[x]);
    urlMap.set(key, fetchedArr);
  } else {
    var arr = [];
    arr.push(urlKeys[x]);
    urlMap.set(key, arr);
  }
}

heading.style.display = "none";
container.style.display = "none";

checkbox.addEventListener("change", () => {
  if (checkbox.checked == true) {
    searchBar.value = "";
    clearResult();
    heading.style.display = "none";
    showAllNotes();
    filterList.innerHTML = "";
    hideList();
  } else {
    displayActiveNotes();
    hideAllNotes();
    showList();
  }
});
var counter = 0;
urlMap.forEach(function (value, key) {
  var websiteListItem = document.createElement("li");
  websiteListItem.className = "list-item";
  websiteListItem.innerHTML = `<button class="website-btn">${key}</button>`;
  websiteList.appendChild(websiteListItem);
  counter++;
});
defaultHeading.innerText = `Websites [ ${counter} ]`;

highlighAndDisplayNotesOfFirstDomain();

document
  .querySelectorAll(".list-item")
  .forEach((item) =>
    item.addEventListener(
      "click",
      () => (
        clearResult(), showNotesOnClick(item.innerText), (searchBar.value = "")
      )
    )
  );

/*changing color of active domain from list*/

var btnContainer = document.querySelector(".website-list");

var btns = btnContainer.getElementsByClassName("website-btn");

for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

/* notes searching*/

searchBar.addEventListener("keyup", () => {
  if (searchBar.value.length === 0) {
    clearResult();
    displayActiveNotes();
    showList();
    filterList.innerHTML = "";
    heading.style.display = "none";
  }
  if (searchBar.value.length > 0) {
    var userInput = searchBar.value.toLowerCase();
    clearResult();
    hideList();
    heading.style.display = "block";
    searchResult(userInput);
    searchDomain(userInput);
    highlightFirstFilteredDomain();
    setFilteredSiteActiveOnClick();
    filterActiveDomainNotesOnKeyUp(userInput);
  }
});
searchBar.addEventListener("focus", () => {
  if (checkbox.checked == true) {
    checkbox.checked = false;
    hideAllNotes();
    showList();
    //heading.style.display = "block";
    displayActiveNotes();
  }
});
function clearResult() {
  filterContainer.innerHTML = "";
}

/* function to display notes tab inside container*/

function displayNotesInDOM(tabTitle, tabNote, url) {
  const noteTab = document.createElement("details");
  noteTab.className = "all-notes-tab";
  noteTab.innerHTML = `
            <summary class="summary-heading">${tabTitle}</summary>
            <div class="readonly">${tabNote}</div>
            <div class="ctrl-div"><a class="visit" target="_blank" href=${url}>VISIT THIS PAGE</a><button id="${url}" class="delete-btn"><img src="/img/trash.png"></button></div>
          `;
  return noteTab;
}

/* function to show all notes created by user*/

function showAllNotes() {
  container.style.display = "block";
  urlMap.forEach(function (value, key) {
    const subContainer = document.createElement("div");
    subContainer.innerHTML = `<h1 style ="color:rgb(41, 61, 81);font-size:1.7rem;">${key}</h1>`;
    subContainer.className = "site-notes";
    for (let i = 0; i < value.length; i++) {
      const userObj = getObjectFromLocalStorage(value[i]);

      var tabTitle = userObj.title;
      var tabNote = userObj.notes;
      var currenturl = value[i];
      var noteTab = displayNotesInDOM(tabTitle, tabNote, currenturl);

      subContainer.appendChild(noteTab);
    }
    container.appendChild(subContainer);
  });
}

/*function to show filtered notes of particular domain*/

function showNotesOnClick(siteTitle) {
  var fetchedUrlArr = getArrayFromMap(siteTitle);
  for (let i = 0; i < fetchedUrlArr.length; i++) {
    var urlObject = getObjectFromLocalStorage(fetchedUrlArr[i]);

    var noteTab = displayNotesInDOM(
      urlObject.title,
      urlObject.notes,
      fetchedUrlArr[i]
    );

    filterContainer.appendChild(noteTab);
  }
}

function filterNotesOnClick(siteTitle, userInput) {
  var fetchedUrlArr = getArrayFromMap(siteTitle);
  for (let i = 0; i < fetchedUrlArr.length; i++) {
    var obj = getObjectFromLocalStorage(fetchedUrlArr[i]);

    var compareTitle = isSubstring(userInput, obj.title);
    var compareNotes = isSubstring(userInput, obj.notes);
    if (compareTitle == -1 && compareNotes == -1) {
      const e = 0;
    } else {
      var noteTab = displayNotesInDOM(obj.title, obj.notes, fetchedUrlArr[i]);
      filterContainer.appendChild(noteTab);
    }
  }
}

/*function to for searching results from local storage*/

function searchResult(userInput) {
  for (let k = 0; k < urlKeys.length; k++) {
    var fetchedObj = getObjectFromLocalStorage(urlKeys[k]);

    var displayTitle = fetchedObj.title;
    var objTitle = fetchedObj.title.toLowerCase();
    var objNote = fetchedObj.notes;

    var compareTitle = isSubstring(userInput, objTitle);
    var compareNotes = isSubstring(userInput, objNote);
    if (compareTitle == -1 && compareNotes == -1) {
      const e = 0;
    } else {
      var noteTab = displayNotesInDOM(displayTitle, objNote, urlKeys[k]);
      filterContainer.appendChild(noteTab);
    }
  }
}

function searchDomain(userInput) {
  var input = userInput;
  filterList.innerHTML = "";
  var counter = 0;
  urlMap.forEach(function (value, key) {
    var matched = false;
    for (let i = 0; i < value.length; i++) {
      var obj = getObjectFromLocalStorage(value[i]);
      var title = obj.title;
      var notes = obj.notes;
      var compareTitle = isSubstring(input, title);
      var compareNotes = isSubstring(input, notes);
      if (compareTitle == -1 && compareNotes == -1) {
        const e = 0;
      } else if (matched === false) {
        matched = true;
        const domain = document.createElement("li");
        domain.className = "filter-item";
        domain.innerHTML = `<button class="filter-btn">${key}</button>`;
        filterList.appendChild(domain);
        counter++;
      }
    }
    heading.innerText = `Websites [ ${counter} ]`;
    document
      .querySelectorAll(".filter-item")
      .forEach((item) =>
        item.addEventListener(
          "click",
          () => (
            clearResult(), filterNotesOnClick(item.innerText, searchBar.value)
          )
        )
      );
  });
}

/* function to check is search query matches any page title or notes*/

function isSubstring(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  var query = s1.length;
  var string = s2.length;
  for (var i = 0; i <= string - query; i++) {
    var j;
    for (j = 0; j < query; j++) if (s2[i + j] != s1[j]) break;

    if (j == query) return i;
  }

  return -1;
}

function hideAllNotes() {
  container.style.display = "none";
  container.innerHTML = "";
}

function hideList() {
  defaultList.style.display = "none";
}

function showList() {
  defaultList.style.display = "block";
}

function highlighAndDisplayNotesOfFirstDomain() {
  /*setting color for first list item*/
  const sitelist = document.querySelectorAll(".website-btn");
  var firstItem = sitelist[0].innerText;
  sitelist[0].classList.add("active");

  /*displaying notes of first list item*/
  var siteArr = getArrayFromMap(firstItem);
  for (let i = 0; i < siteArr.length; i++) {
    var obj = getObjectFromLocalStorage(siteArr[i]);
    var notetab = displayNotesInDOM(obj.title, obj.notes, siteArr[i]);
    filterContainer.appendChild(notetab);
  }
}

function highlightFirstFilteredDomain() {
  const sitelist = document.querySelectorAll(".filter-btn");
  var firstItem = sitelist[0].innerText;
  sitelist[0].classList.add("filter-active");

  /*displaying notes of first list item*/
}

function displayActiveNotes() {
  const activeSite = document.querySelector(".active").innerText;
  var arr = getArrayFromMap(activeSite);
  for (let i = 0; i < arr.length; i++) {
    var obj = getObjectFromLocalStorage(arr[i]);
    var noteTab = displayNotesInDOM(obj.title, obj.notes, arr[i]);
    filterContainer.appendChild(noteTab);
  }
}
function setFilteredSiteActiveOnClick() {
  const container = document.querySelector(".filter-list");
  const filteredSites = container.querySelectorAll(".filter-btn");

  for (let i = 0; i < filteredSites.length; i++) {
    filteredSites[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("filter-active");
      current[0].className = current[0].className.replace(" filter-active", "");
      this.className += " filter-active";
    });
  }
}
function filterActiveDomainNotesOnKeyUp(input) {
  var title = document.querySelector(".filter-active").innerText;
  var arr = getArrayFromMap(title);
  clearResult();
  for (let i = 0; i < arr.length; i++) {
    var obj = getObjectFromLocalStorage(arr[i]);
    var compareTitle = isSubstring(input, obj.title);
    var compareNotes = isSubstring(input, obj.notes);
    if (compareTitle == -1 && compareNotes == -1) {
      const e = 0;
    } else {
      var noteTab = displayNotesInDOM(obj.title, obj.notes, arr[i]);
      filterContainer.appendChild(noteTab);
    }
  }
}

function getArrayFromMap(key) {
  let arr = urlMap.get(key);
  return arr;
}

function getObjectFromLocalStorage(key) {
  let obj = JSON.parse(localStorage.getItem(key));
  return obj;
}
/*
function deleteNotesOnClick() {
  document.querySelectorAll(".delete-btn").forEach((item) =>
    item.addEventListener("click", () => {
      let temp = item.parentNode;
      temp.parentNode.innerHTML = "";
      window.localStorage.removeItem(item.id);
      if ((filterContainer.innerHTML = "")) {
        removeActiveColorAndDeleteItem();
        highlightFirstFilteredDomain();
        displayActiveNotes();
      }
    })
  );
}
function removeActiveColorAndDeleteItem() {
  const sitelist = document.querySelectorAll(".filter-btn");
  const active = sitelist.querySelector(".active");
  active.classList.remove("active");
  active.style.display = "none";
}
*/
