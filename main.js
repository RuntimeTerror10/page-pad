const container = document.querySelector(".all-notes-container");

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
            <textarea rows="6" cols="30" spellcheck="false" readonly class="readonly-textarea notepad" >${tabNote}</textarea>
            <div class="link-wrap"><a class="visit-link" target="_blank" href=${value[i]}>VISIT THIS PAGE</a></div>
          `;
    subContainer.appendChild(noteTab);
  }
  container.appendChild(subContainer);
});
