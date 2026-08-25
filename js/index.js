const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const menuLinks = document.querySelectorAll("#menu a");
burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  menu.classList.toggle("active");
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    burger.classList.remove("active");
    menu.classList.remove("active");
  });
});
