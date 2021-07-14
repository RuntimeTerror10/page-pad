const menuBtn = document.querySelector(".menu-btn");
const burger = document.querySelector(".menu-btn-burger");
const menu = document.querySelector(".menu-container");
const themeContainer = document.querySelector(".colors-container");

var currentColor = JSON.parse(window.localStorage.getItem("color"));
document.documentElement.style.setProperty("--color-app-bg", currentColor);

removeDefaultandSetActiveColor();

let menuOpen = false;
menuBtn.addEventListener("click", () => {
  if (!menuOpen) {
    menuBtn.classList.add("open");
    menu.style.left = 0;
    menuOpen = true;
  } else {
    menuBtn.classList.remove("open");
    menu.style.left = "-420px";
    menuOpen = false;
  }
});

var colors = themeContainer.getElementsByClassName("color-picker");

for (let i = 0; i < colors.length; i++) {
  colors[i].addEventListener("click", function () {
    let current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

document.querySelectorAll(".color-picker").forEach((item) =>
  item.addEventListener("click", () => {
    document.documentElement.style.setProperty("--color-app-bg", item.id);
    window.localStorage.setItem("color", JSON.stringify(item.id));
  })
);
function removeDefaultandSetActiveColor() {
  var colors = themeContainer.getElementsByClassName("color-picker");
  for (let i = 0; i < colors.length; i++) {
    colors[i].classList.remove("active");
  }
  var activeColor = JSON.parse(window.localStorage.getItem("color"));
  for (let j = 0; j < colors.length; j++) {
    var rgb = colors[j].id;
    if (activeColor === rgb) {
      colors[j].classList.add("active");
    }
  }
}
