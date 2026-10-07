/* =========================================
   SIDEBAR NAVIGATION
========================================= */

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuButton = document.getElementById("menuButton");
const closeSidebar = document.getElementById("closeSidebar");

const logoutBtn =
  document.getElementById("logoutBtn") ||
  document.getElementById("settingsLogout");

function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("show");
}

function closeSidebarMenu() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("show");
}

menuButton.addEventListener("click", openSidebar);

closeSidebar.addEventListener("click", closeSidebarMenu);

sidebarOverlay.addEventListener("click", closeSidebarMenu);

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();

    localStorage.removeItem("student");

    window.location.href = "../../login/index.html";
  });
}

/* =========================================
   STUDENT INFORMATION
========================================= */

const student = JSON.parse(localStorage.getItem("student"));

if (!student || !student.studentId) {
  window.location.href = "../../login/index.html";
}

const studentName = document.getElementById("studentName");

const studentRegisterNumber = document.getElementById("studentRegisterNumber");

const profileAvatar = document.getElementById("profileAvatar");

const themeSelect = document.getElementById("themeSelect");

const compactToggle = document.getElementById("compactToggle");

const academicNotifications = document.getElementById("academicNotifications");

const courseNotifications = document.getElementById("courseNotifications");

const settingsLogout = document.getElementById("settingsLogout");

function displayStudentInformation() {
  const name = student.name || "Student";

  const registerNumber = student.registerNumber || "";

  studentName.textContent = name;

  studentRegisterNumber.textContent = registerNumber;

  profileAvatar.textContent = name.charAt(0).toUpperCase();
}

/* =========================================
   THEME
========================================= */

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");

    themeSelect.value = "dark";
  } else {
    document.body.classList.remove("dark-theme");

    themeSelect.value = "light";
  }
}

themeSelect.addEventListener("change", () => {
  const selectedTheme = themeSelect.value;

  if (selectedTheme === "dark") {
    document.body.classList.add("dark-theme");

    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-theme");

    localStorage.setItem("theme", "light");
  }
});

/* =========================================
   COMPACT MODE
========================================= */

function loadCompactMode() {
  const compact = localStorage.getItem("compactMode") === "true";

  compactToggle.checked = compact;
}

compactToggle.addEventListener("change", () => {
  localStorage.setItem("compactMode", compactToggle.checked);
});

/* =========================================
   NOTIFICATIONS
========================================= */

function loadNotificationSettings() {
  academicNotifications.checked =
    localStorage.getItem("academicNotifications") !== "false";

  courseNotifications.checked =
    localStorage.getItem("courseNotifications") !== "false";
}

academicNotifications.addEventListener("change", () => {
  localStorage.setItem("academicNotifications", academicNotifications.checked);
});

courseNotifications.addEventListener("change", () => {
  localStorage.setItem("courseNotifications", courseNotifications.checked);
});

/* =========================================
   SETTINGS LOGOUT
========================================= */

if (settingsLogout) {
  settingsLogout.addEventListener("click", () => {
    localStorage.removeItem("student");

    window.location.href = "../../login/index.html";
  });
}

/* =========================================
   INITIALIZE
========================================= */

displayStudentInformation();

loadTheme();

loadCompactMode();

loadNotificationSettings();
