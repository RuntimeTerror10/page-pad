const container = document.querySelector(".all-notes-container");
const searchBar = document.querySelector(".search-input");
const filterContainer = document.querySelector(".filter-notes-container");
const websiteList = document.querySelector(".website-list");

var urlKeys = [];
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  urlKeys.push(key);
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
console.log(urlMap);

urlMap.forEach(function (value, key) {
  var websiteListItem = document.createElement("li");
  websiteListItem.className = "list-item";
  websiteListItem.innerHTML = `<button class="website-btn">${key}</button>`;
  websiteList.appendChild(websiteListItem);

  const subContainer = document.createElement("div");
  subContainer.innerHTML = `<h1 style ="color:#333;font-size:1.7rem;">${key}</h1>`;
  subContainer.className = "site-notes";
  for (let i = 0; i < value.length; i++) {
    const userObj = JSON.parse(localStorage.getItem(value[i]));
    var tabTitle = userObj.title;
    var tabNote = userObj.notes;
    const noteTab = document.createElement("details");

    noteTab.className = "all-notes-tab";
    noteTab.innerHTML = `
            <summary class="summary-heading">${tabTitle}</summary>
            <div class="readonly">${tabNote}</div>
            <div class="link-wrap"><a class="visit-link" target="_blank" href=${value[i]}>VISIT THIS PAGE</a></div>
          `;
    subContainer.appendChild(noteTab);
  }
  container.appendChild(subContainer);
});
document
  .querySelectorAll(".list-item")
  .forEach((item) =>
    item.addEventListener(
      "click",
      () => (
        (container.style.display = "none"),
        clearResult(),
        showNotesOnClick(item.innerText)
      )
    )
  );

searchBar.addEventListener("focus", () => {
  container.style.display = "block";
  clearResult();
});
/* notes searching*/

searchBar.addEventListener("keyup", () => {
  if (searchBar.value.length === 0) {
    showAllNotes();
    clearResult();
  }
  if (searchBar.value.length > 0) {
    hideAllNotes();
    var userInput = searchBar.value.toLowerCase();
    clearResult();

    for (let k = 0; k < urlKeys.length; k++) {
      var fetchedObj = JSON.parse(localStorage.getItem(urlKeys[k]));
      var displayTitle = fetchedObj.title;
      var objTitle = fetchedObj.title.toLowerCase();
      var objNote = fetchedObj.notes;

      var compareTitle = isSubstring(userInput, objTitle);
      var compareNotes = isSubstring(userInput, objNote);
      if (compareTitle == -1 && compareNotes == -1) {
        const e = 0;
      } else {
        const noteTab = document.createElement("details");

        noteTab.className = "all-notes-tab";
        noteTab.innerHTML = `
            <summary class="summary-heading">${displayTitle}</summary>
            <div class="readonly">${objNote}</div>
             <div class="link-wrap"><a class="visit-link" target="_blank" href=${urlKeys[k]}>VISIT THIS PAGE</a></div>`;

        filterContainer.appendChild(noteTab);
      }
    }
  }
});

function showAllNotes() {
  container.style.display = "block";
}

function hideAllNotes() {
  container.style.display = "none";
}
function clearResult() {
  filterContainer.innerHTML = "";
}
function isSubstring(s1, s2) {
  var query = s1.length;
  var string = s2.length;

  for (var i = 0; i <= string - query; i++) {
    var j;
    for (j = 0; j < query; j++) if (s2[i + j] != s1[j]) break;

    if (j == query) return i;
  }

  return -1;
}
function showNotesOnClick(siteTitle) {
  var fetchedUrlArr = urlMap.get(siteTitle);
  filterContainer.innerHTML = `<h1 class="site-title">${siteTitle}</h1>`;
  for (let i = 0; i < fetchedUrlArr.length; i++) {
    var urlObject = JSON.parse(localStorage.getItem(fetchedUrlArr[i]));
    const noteTab = document.createElement("details");

    noteTab.className = "all-notes-tab";
    noteTab.innerHTML = `
            <summary class="summary-heading">${urlObject.title}</summary>
            <div class="readonly">${urlObject.notes}</div>
             <div class="link-wrap"><a class="visit-link" target="_blank" href=${fetchedUrlArr[i]}>VISIT THIS PAGE</a></div>`;

    filterContainer.appendChild(noteTab);
  }
}
