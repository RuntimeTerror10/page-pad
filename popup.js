const notesContainer = document.querySelector(".notes-container");
const textBox = document.getElementById("notes");
const showCheckBox = document.querySelector(".js-show-notes-checkbox");
const allNotes = document.querySelector(".js-show-all-notes");
const allNotesContainer = document.querySelector(".all-notes-container");
const popUpBody = document.querySelector("body");
const siteName = document.querySelector(".site-name");
const noNotes = document.querySelector(".no-notes");
const allNotesPagelink = document.querySelector(".all-web-notes");
const toolbar = document.querySelector("#trix-toolbar");

allNotesPagelink.href = `chrome-extension://${chrome.runtime.id}/index.html`;

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var currentUrl = tabs[0].url;
  var currentTitle = tabs[0].title;

  if (localStorage.getItem(currentUrl) === null) {
    displayNotesContaniner();
    hideNresetAllNotes();
    textBox.focus();
  } else {
    displayNotesContaniner();
    textBox.focus();
    let getObj = JSON.parse(localStorage.getItem(currentUrl));
    textBox.value = getObj.notes;
  }

  textBox.addEventListener("blur", () => {
    var userNotes = textBox.value;
    var userTabTitle = currentTitle;

    const userObj = { title: userTabTitle, notes: userNotes };

    if (userNotes.length == 0) {
      // if user clears all the notes
      removeNotes(currentUrl);
      chrome.browserAction.setBadgeText({ text: "" });
    }
    if (userNotes.length >= 1) {
      //if user has added some notes
      storeNotes(currentUrl, userObj);
      displayNotesContaniner();
      chrome.browserAction.setBadgeBackgroundColor({ color: "green" });
      chrome.browserAction.setBadgeText({ text: "*" });
    }
  });

  showCheckBox.addEventListener("change", () => {
    if (showCheckBox.checked === true) {
      toolbar.style.display = "none";
      noNotes.style.display = "block";
      hideDisplayNotes();
      siteName.style.display = "block";
      var urlKeys = [];
      for (let key in localStorage) {
        var obj = JSON.parse(localStorage.getItem(key));
        if (typeof obj === "object") {
          urlKeys.push(key);
        }
      }
      var currentOpenedSite = new URL(currentUrl);
      var currentHostName =
        currentOpenedSite.hostname || currentOpenedSite.protocol.slice(0, -1);
      siteName.innerHTML = `<svg class="site-svg" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.45 15.5C18.55 14.675 18.625 13.85 18.625 13C18.625 12.15 18.55 11.325 18.45 10.5H22.675C22.875 11.3 23 12.1375 23 13C23 13.8625 22.875 14.7 22.675 15.5H18.45ZM16.2375 22.45C16.9875 21.0625 17.5625 19.5625 17.9625 18H21.65C20.45 20.0625 18.5375 21.6625 16.2375 22.45ZM15.925 15.5H10.075C9.95 14.675 9.875 13.85 9.875 13C9.875 12.15 9.95 11.3125 10.075 10.5H15.925C16.0375 11.3125 16.125 12.15 16.125 13C16.125 13.85 16.0375 14.675 15.925 15.5ZM13 22.95C11.9625 21.45 11.125 19.7875 10.6125 18H15.3875C14.875 19.7875 14.0375 21.45 13 22.95ZM8 8H4.35C5.5375 5.925 7.4625 4.325 9.75 3.55C9 4.9375 8.4375 6.4375 8 8ZM4.35 18H8C8.4375 19.5625 9 21.0625 9.75 22.45C7.4625 21.6625 5.5375 20.0625 4.35 18ZM3.325 15.5C3.125 14.7 3 13.8625 3 13C3 12.1375 3.125 11.3 3.325 10.5H7.55C7.45 11.325 7.375 12.15 7.375 13C7.375 13.85 7.45 14.675 7.55 15.5H3.325ZM13 3.0375C14.0375 4.5375 14.875 6.2125 15.3875 8H10.6125C11.125 6.2125 11.9625 4.5375 13 3.0375ZM21.65 8H17.9625C17.5625 6.4375 16.9875 4.9375 16.2375 3.55C18.5375 4.3375 20.45 5.925 21.65 8ZM13 0.5C6.0875 0.5 0.5 6.125 0.5 13C0.5 16.3152 1.81696 19.4946 4.16117 21.8388C5.3219 22.9996 6.69989 23.9203 8.21646 24.5485C9.73303 25.1767 11.3585 25.5 13 25.5C16.3152 25.5 19.4946 24.183 21.8388 21.8388C24.183 19.4946 25.5 16.3152 25.5 13C25.5 11.3585 25.1767 9.73303 24.5485 8.21646C23.9203 6.69989 22.9996 5.3219 21.8388 4.16117C20.6781 3.00043 19.3001 2.07969 17.7835 1.45151C16.267 0.823322 14.6415 0.5 13 0.5Z"/>
</svg>
 ${currentHostName}`;

      for (let i = 0; i < urlKeys.length; i++) {
        const tempUrl = new URL(urlKeys[i]);
        const tempHostName = tempUrl.hostname || tempUrl.protocol.slice(0, -1);

        // remove protocol and hostname
        if (currentHostName == tempHostName) {
          showAllNotesContainer();
          noNotes.style.display = "none";

          const fetchedObj = JSON.parse(window.localStorage.getItem(tempUrl));
          const pageNotes = fetchedObj.notes;
          const pageId = fetchedObj.title;
          const noteTab = document.createElement("details");

          noteTab.className = "all-notes-tab";
          noteTab.innerHTML = `
            <summary class="summary-heading">
              <div class="summary-content">
                <span>${pageId}</span>
                <button class="delete-btn" id="${tempUrl}">
                  <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                  <path fill="#fff" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
                  </svg>
                </button>
              </div>
            </summary>
            <div class="readonly" >${pageNotes}</div>
            
          `;
          allNotesContainer.appendChild(noteTab);
          deleteNotesOnclick();
        } else {
          console.log("not a match");
        }
      }
    } else {
      if (window.localStorage.getItem(currentUrl) == null) {
        textBox.value = "";
      }
      displayNotesContaniner();
      hideNresetAllNotes();
      siteName.style.display = "none";
      noNotes.style.display = "none";
      toolbar.style.display = "block";
    }
  });
});

popUpBody.addEventListener("blur", () => {
  var userNote = textBox.value;
  if (userNote.length == 0) {
    // if user clears all the notes
    chrome.browserAction.setBadgeText({ text: "" });
  }
  if (userNote.length >= 1) {
    //if user has added some notes

    chrome.browserAction.setBadgeBackgroundColor({ color: "green" });
    chrome.browserAction.setBadgeText({ text: "*" });
  }
});

function storeNotes(url, userPara) {
  window.localStorage.setItem(url, JSON.stringify(userPara));
}
function removeNotes(url) {
  window.localStorage.removeItem(url);
}
function displayNotesContaniner() {
  notesContainer.style.display = "block";
}
function hideDisplayNotes() {
  notesContainer.style.display = "none";
}
function hideNresetAllNotes() {
  allNotesContainer.style.display = "none";
  allNotesContainer.innerHTML = "";
}

function showAllNotesContainer() {
  allNotesContainer.style.display = "block";
}

function deleteNotesOnclick() {
  document.querySelectorAll(".delete-btn").forEach((item) =>
    item.addEventListener("click", () => {
      let temp = item.parentNode.parentNode.parentNode;
      temp.remove();
      window.localStorage.removeItem(item.id);
    })
  );
}
