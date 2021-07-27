const searchBar = document.querySelector(".search-input");
const filterContainer = document.querySelector(".filter-notes-container");
const domainListContainer = document.querySelector(".sidebar");

//initializing an empty array and pushing keys(url) from localStorage
var currentColor = JSON.parse(window.localStorage.getItem("color"));
document.documentElement.style.setProperty("--color-theme", currentColor);

var urlKeys = [];
for (let i = 0; i < Object.keys(localStorage).length; i++) {
  let key = localStorage.key(i);
  var obj = JSON.parse(localStorage.getItem(key));
  if (typeof obj === "object") {
    urlKeys.push(key);
  }
}

// creating a map urls with same hostname in a single array

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

var domainList = [];
addAllDomainNamesInDomainList();
renderDomainList();
highlightAndDisplayNotesOfFirstDomain();
handleDomainClickEvent();
handleNoteDeletion();

searchBar.addEventListener("keyup", () => {
  var searchTerm = searchBar.value;
  clearResult();
  filterDomainsAndUpdateDomainList(searchTerm);
  renderDomainList();
  highlightAndDisplayNotesOfFirstDomain();
  handleDomainClickEvent();
  handleNoteDeletion();
});
//fetching and adding domain names in domainList array
function addAllDomainNamesInDomainList() {
  urlMap.forEach(function (value, key) {
    domainList.push(key);
  });
}

//render domainList in side bar
function renderDomainList() {
  domainListContainer.innerHTML = "";
  let domainCount = domainList.length;
  let counter = document.createElement("h1");
  counter.className = "websites-heading";
  counter.innerText = `Websites  [ ${domainCount} ]`;
  domainListContainer.appendChild(counter);
  let list = document.createElement("ul");
  list.className = "website-list";
  for (let i = 0; i < domainCount; i++) {
    var domainListItem = document.createElement("li");
    domainListItem.className = "list-item";
    domainListItem.innerHTML = `<button class="website-btn">${domainList[i]}</button>`;
    list.appendChild(domainListItem);
  }
  domainListContainer.appendChild(list);
  handleNoteDeletion();
}

function highlightAndDisplayNotesOfFirstDomain() {
  const sitelist = document.querySelectorAll(".website-btn");
  var firstItem = sitelist[0].innerText;
  sitelist[0].classList.add("active");
  var siteArr = getArrayFromMap(firstItem);

  if (searchBar.value.length === 0) {
    /*displaying notes of first list item*/
    for (let i = 0; i < siteArr.length; i++) {
      let obj = getObjectFromLocalStorage(siteArr[i]);
      let notetab = displayNotesInDOM(obj.title, obj.notes, siteArr[i]);
      filterContainer.appendChild(notetab);
    }
  } else {
    filterNotesOfFirstDomainOnKeyUp(searchBar.value);
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

function displayNotesInDOM(tabTitle, tabNote, url) {
  const noteTab = document.createElement("details");
  const tempUrl = new URL(url);
  noteTab.className = "all-notes-tab";
  noteTab.innerHTML = `
    <summary class="summary-heading">
      <div class="sum"><span>${tabTitle}</span>
        <div class="ctrl-div">
          <a class="visit visit-btn" target="_blank" href=${url}>
            <svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 0.75V3.25H18.9875L6.7 15.5375L8.4625 17.3L20.75 5.0125V9.5H23.25V0.75H14.5ZM20.75 20.75H3.25V3.25H12V0.75H3.25C1.8625 0.75 0.75 1.875 0.75 3.25V20.75C0.75 21.413 1.01339 22.0489 1.48223 22.5178C1.95107 22.9866 2.58696 23.25 3.25 23.25H20.75C21.413 23.25 22.0489 22.9866 22.5178 22.5178C22.9866 22.0489 23.25 21.413 23.25 20.75V12H20.75V20.75Z" fill="white"/>
            </svg>
          </a>
          <button id="${url}" class="delete-btn">
            <svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.0992 3.75V5H5.10181V7.5H6.30128V23.75C6.30128 24.413 6.55403 25.0489 7.00392 25.5178C7.45381 25.9866 8.06399 26.25 8.70023 26.25H20.695C21.3312 26.25 21.9414 25.9866 22.3913 25.5178C22.8412 25.0489 23.0939 24.413 23.0939 23.75V7.5H24.2934V5H18.296V3.75H11.0992ZM8.70023 7.5H20.695V23.75H8.70023V7.5ZM11.0992 10V21.25H13.4981V10H11.0992ZM15.8971 10V21.25H18.296V10H15.8971Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </summary>
    <div class="readonly">${tabNote}</div>
  `;

  if (!tempUrl.hostname) {
    const visit = noteTab.querySelector(".visit");
    visit.addEventListener("click", () => {
      chrome.tabs.create({ url: url });
    });
  }
  return noteTab;
}

function clearResult() {
  filterContainer.innerHTML = "";
}

function handleDomainClickEvent() {
  var btnContainer = document.querySelector(".website-list");

  var btns = btnContainer.getElementsByClassName("website-btn");

  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
      showNotesOfActiveDomain();
    });
  }
  handleNoteDeletion();
}

function showNotesOfActiveDomain() {
  clearResult();
  const activeDomain = document.querySelector(".active").innerText;
  var arr = getArrayFromMap(activeDomain);
  if (searchBar.value.length === 0) {
    for (let i = 0; i < arr.length; i++) {
      let obj = getObjectFromLocalStorage(arr[i]);
      let notetab = displayNotesInDOM(obj.title, obj.notes, arr[i]);
      filterContainer.appendChild(notetab);
    }
  } else {
    filterNotesOfActiveDomainOnClick(searchBar.value, arr);
  }
  handleNoteDeletion();
}

function filterDomainsAndUpdateDomainList(query) {
  var tempArr = [];
  urlMap.forEach(function (value, key) {
    var matched = false;
    for (let i = 0; i < value.length; i++) {
      let obj = getObjectFromLocalStorage(value[i]);
      let title = obj.title;
      let notes = obj.notes;
      let compareTitle = isSubstring(query, title);
      let compareNotes = isSubstring(query, notes);
      if (compareTitle == -1 && compareNotes == -1) {
        const e = 0;
      } else if (matched === false) {
        matched = true;
        tempArr.push(key);
      }
    }
  });
  domainList = tempArr;
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

function filterNotesOfActiveDomainOnClick(input, arr) {
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

function handleNoteDeletion() {
  document.querySelectorAll(".delete-btn").forEach((item) =>
    item.addEventListener("click", () => {
      var tabs = document.querySelectorAll(".all-notes-tab");
      let temp = item.parentNode.parentNode.parentNode;
      temp.parentNode.remove();
      window.localStorage.removeItem(item.id);
      var arr = updateArray();
      updateMap(arr);

      if (tabs.length === 1) {
        clearResult();
        domainList = [];
        if (searchBar.value !== "") {
          filterDomainsAndUpdateDomainList(searchBar.value);
          renderDomainList();
          highlightAndDisplayNotesOfFirstDomain();
          handleDomainClickEvent();
        } else {
          addAllDomainNamesInDomainList();
          renderDomainList();
          highlightAndDisplayNotesOfFirstDomain();
          handleDomainClickEvent();
        }
      }
    })
  );
}

function updateArray() {
  var urls = [];
  for (let i = 0; i < Object.keys(localStorage).length; i++) {
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

function filterNotesOfFirstDomainOnKeyUp(input) {
  clearResult();
  const sitelist = document.querySelectorAll(".website-btn");
  var firstItem = sitelist[0].innerText;
  var siteArr = getArrayFromMap(firstItem);
  if (input.length !== 0) {
    for (let i = 0; i < siteArr.length; i++) {
      var obj = getObjectFromLocalStorage(siteArr[i]);
      var compareTitle = isSubstring(input, obj.title);
      var compareNotes = isSubstring(input, obj.notes);
      if (compareTitle == -1 && compareNotes == -1) {
        const e = 0;
      } else {
        var noteTab = displayNotesInDOM(obj.title, obj.notes, siteArr[i]);
        filterContainer.appendChild(noteTab);
      }
    }
  } else {
    for (let j = 0; j < siteArr.length; j++) {
      let obj = getObjectFromLocalStorage(siteArr[j]);
      let notetab = displayNotesInDOM(obj.title, obj.notes, siteArr[j]);
      filterContainer.appendChild(notetab);
    }
  }
}
