const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("eventify-theme");

if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
} else {
  document.documentElement.setAttribute("data-theme", "dark");
}

function updateThemeIcon() {
  if (!themeToggle) return;

  const currentTheme = document.documentElement.getAttribute("data-theme");

  themeToggle.textContent = currentTheme === "light" ? "🌙" : "☀️";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    const newTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", newTheme);

    localStorage.setItem("eventify-theme", newTheme);

    updateThemeIcon();
  });
}

updateThemeIcon();
