const container = document.querySelector(".all-notes-container");
const searchBar = document.querySelector(".search-input");
const filterContainer = document.querySelector(".filter-notes-container");

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

urlMap.forEach(function (value, key) {
  const subContainer = document.createElement("div");
  subContainer.innerHTML = `<h1 style ="color:#333">${key}</h1>`;
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

      var compareResult = isSubstring(userInput, objTitle);
      if (compareResult == -1) {
        const e = 0;
      } else {
        var filterNote = fetchedObj.notes;
        const noteTab = document.createElement("details");

        noteTab.className = "all-notes-tab";
        noteTab.innerHTML = `
            <summary class="summary-heading">${displayTitle}</summary>
            <div class="readonly">${filterNote}</div>`;

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
