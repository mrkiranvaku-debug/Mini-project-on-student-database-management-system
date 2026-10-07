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
   STUDENT PROFILE
========================================= */

const student = JSON.parse(localStorage.getItem("student"));

if (!student || !student.studentId) {
  window.location.href = "../../login/index.html";
}

const headerStudentName = document.getElementById("headerStudentName");

const headerRegisterNumber = document.getElementById("headerRegisterNumber");

const headerAvatar = document.getElementById("headerAvatar");

const largeAvatar = document.getElementById("largeAvatar");

const profileName = document.getElementById("profileName");

const profileRegisterNumber = document.getElementById("profileRegisterNumber");

const detailName = document.getElementById("detailName");

const detailRegisterNumber = document.getElementById("detailRegisterNumber");

const detailRole = document.getElementById("detailRole");

function displayStudentInformation() {
  const name = student.name || "Student";

  const registerNumber = student.registerNumber || "Not available";

  const role = student.role || "STUDENT";

  headerStudentName.textContent = name;

  headerRegisterNumber.textContent = registerNumber;

  profileName.textContent = name;

  profileRegisterNumber.textContent = registerNumber;

  detailName.textContent = name;

  detailRegisterNumber.textContent = registerNumber;

  detailRole.textContent = role;

  const firstLetter = name.charAt(0).toUpperCase();

  headerAvatar.textContent = firstLetter;

  largeAvatar.textContent = firstLetter;
}

displayStudentInformation();
