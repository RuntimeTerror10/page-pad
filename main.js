const searchBar = document.querySelector(".search-input");
const filterContainer = document.querySelector(".filter-notes-container");
const filterList = document.querySelector(".filter-list");
const filterDomainContainer = document.querySelector(".filter-container");
const websiteList = document.querySelector(".website-list");
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
  var key = tempUrl.hostname || tempUrl.protocol.slice(0, -1);

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
renderDefaultList();
highlighAndDisplayNotesOfFirstDomain();
clickonDefaultListItems();
deleteNotesOnClick();
/*changing color of active domain from list*/

setFirstElementActiveofDefaultList();

/* notes searching*/

searchBar.addEventListener("keyup", () => {
  if (searchBar.value.length === 0) {
    clearResult();
    defaultList.innerHTML = "";
    renderDefaultList();
    highlighAndDisplayNotesOfFirstDomain();
    setFirstElementActiveofDefaultList();
    clickonDefaultListItems();
    filterDomainContainer.innerHTML = "";
  }
  if (searchBar.value.length > 0) {
    var userInput = searchBar.value.toLowerCase();
    clearResult();
    hideList();
    searchDomain(userInput);
    highlighAndDisplayNotesOfFirstDomain();
    setFilteredSiteActiveOnClick();
    filterActiveDomainNotesOnKeyUp(userInput);
  }
});

function clearResult() {
  filterContainer.innerHTML = "";
}

/* function to display notes tab inside container*/

function displayNotesInDOM(tabTitle, tabNote, url) {
  const noteTab = document.createElement("details");
  const tempUrl = new URL(url);
  noteTab.className = "all-notes-tab";
  noteTab.innerHTML = `
            <summary class="summary-heading">${tabTitle}</summary>
            <div class="readonly">${tabNote}</div>
            <div class="ctrl-div"><a class="visit" target="_blank" href=${url}>VISIT THIS PAGE</a><button id="${url}" class="delete-btn"><img src="/img/trash.png"></button></div>
          `;
  if (!tempUrl.hostname) {
    const visit = noteTab.querySelector(".visit");
    visit.addEventListener("click", () => {
      chrome.tabs.create({ url: url });
    });
  }
  return noteTab;
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
  deleteNotesOnClick();
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
  deleteNotesOnClick();
}

function searchDomain(userInput) {
  var input = userInput;
  filterDomainContainer.innerHTML = "";
  var counter = 0;
  const heading = document.createElement("h1");
  heading.className = "filter-heading";
  const list = document.createElement("ul");
  list.className = "website-list";
  filterDomainContainer.appendChild(heading);
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
        domain.className = "list-item";
        domain.innerHTML = `<button class="website-btn">${key}</button>`;
        list.appendChild(domain);
        counter++;
      }
    }
    document
      .querySelectorAll(".website-btn")
      .forEach((item) =>
        item.addEventListener(
          "click",
          () => (
            clearResult(), filterNotesOnClick(item.innerText, searchBar.value)
          )
        )
      );
  });

  filterDomainContainer.appendChild(list);
  heading.innerText = `Websites [ ${counter} ]`;
  deleteNotesOnClick();
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

function hideList() {
  defaultList.innerHTML = "";
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
  const sitelist = document.querySelectorAll(".website-btn");
  var firstItem = sitelist[0].innerText;
  sitelist[0].classList.add("active");

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
  const container = document.querySelector(".website-list");
  const filteredSites = container.querySelectorAll(".website-btn");

  for (let i = 0; i < filteredSites.length; i++) {
    filteredSites[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace("active", "");
      this.className += " active";
    });
  }
}
function filterActiveDomainNotesOnKeyUp(input) {
  var title = document.querySelector(".active").innerText;
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
  clickOnFilteredListItems();
}

function getArrayFromMap(key) {
  let arr = urlMap.get(key);
  return arr;
}

function getObjectFromLocalStorage(key) {
  let obj = JSON.parse(localStorage.getItem(key));
  return obj;
}

function renderDefaultList() {
  const heading = document.createElement("h1");
  heading.className = "websites-heading";
  defaultList.appendChild(heading);
  const list = document.createElement("ul");
  list.className = "website-list";
  var counter = 0;
  urlMap.forEach(function (value, key) {
    var websiteListItem = document.createElement("li");
    websiteListItem.className = "list-item";
    websiteListItem.innerHTML = `<button class="website-btn">${key}</button>`;
    list.appendChild(websiteListItem);
    counter++;
  });

  defaultList.appendChild(list);
  heading.innerText = `Websites [ ${counter} ]`;
}

function setFirstElementActiveofDefaultList() {
  var btnContainer = document.querySelector(".website-list");

  var btns = btnContainer.getElementsByClassName("website-btn");

  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }
}
function clickonDefaultListItems() {
  document
    .querySelectorAll(".list-item")
    .forEach((item) =>
      item.addEventListener(
        "click",
        () => (
          clearResult(),
          showNotesOnClick(item.innerText),
          (searchBar.value = "")
        )
      )
    );
  deleteNotesOnClick();
}
function clickOnFilteredListItems() {
  document
    .querySelectorAll(".list-item")
    .forEach((item) =>
      item.addEventListener(
        "click",
        () => (
          clearResult(), filterNotesOnClick(item.innerText, searchBar.value)
        )
      )
    );
  deleteNotesOnClick();
}
function deleteNotesOnClick() {
  document.querySelectorAll(".delete-btn").forEach((item) =>
    item.addEventListener("click", () => {
      var tabs = document.querySelectorAll(".all-notes-tab");
      let temp = item.parentNode;
      temp.parentNode.remove();
      window.localStorage.removeItem(item.id);
      var arr = updateArray();
      updateMap(arr);

      if (tabs.length === 1) {
        if (searchBar.value.length > 0) {
          filterDomainContainer.innerHTML = "";
          searchDomain(searchBar.value);
          highlighAndDisplayNotesOfFirstDomain();
          setFilteredSiteActiveOnClick();
          filterActiveDomainNotesOnKeyUp(searchBar.value);
          defaultList.innerHTML = "";
        } else {
          defaultList.innerHTML = "";
          renderDefaultList();
          highlighAndDisplayNotesOfFirstDomain();
          setFirstElementActiveofDefaultList();
          clickonDefaultListItems();
        }
      }
    })
  );
}

function updateArray() {
  var urls = [];
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    var obj = JSON.parse(localStorage.getItem(key));
    if (typeof obj === "object") {
      urls.push(key);
    }
  }
  urlKeys = urls;
  return urls;
}
function updateMap(arr) {
  var map = new Map();

  for (let x = 0; x < arr.length; x++) {
    var tempUrl = new URL(arr[x]);
    var key = tempUrl.hostname || tempUrl.protocol.slice(0, -1);

    if (map.has(key)) {
      var fetchedArr = map.get(key);
      fetchedArr.push(arr[x]);
      map.set(key, fetchedArr);
    } else {
      var ar = [];
      ar.push(arr[x]);
      map.set(key, ar);
    }
  }
  urlMap = map;
}
