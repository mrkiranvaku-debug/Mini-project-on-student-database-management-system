const teacher = JSON.parse(localStorage.getItem("teacher"));

if (!teacher || !teacher.teacherId) {
  window.location.href = "../../login/index.html";
}

const teacherName = document.getElementById("teacherName");
const teacherCode = document.getElementById("teacherCode");
const profileAvatar = document.getElementById("profileAvatar");
const logoutBtn = document.getElementById("logoutBtn");

const largeAvatar = document.getElementById("largeAvatar");
const profName = document.getElementById("profName");
const profCode = document.getElementById("profCode");
const profId = document.getElementById("profId");

function displayTeacherInformation() {
  const name = teacher.name || "Teacher";
  const code = teacher.teacherCode || "";
  const initial = name.charAt(0).toUpperCase();

  // Topbar
  teacherName.textContent = name;
  teacherCode.textContent = code;
  profileAvatar.textContent = initial;

  // Profile Card
  largeAvatar.textContent = initial;
  profName.textContent = name;
  profCode.textContent = code;
  profId.textContent = teacher.teacherId;
}

logoutBtn.addEventListener("click", function (event) {
  event.preventDefault();
  localStorage.removeItem("teacher");
  window.location.href = "../../login/index.html";
});

// Initialize
displayTeacherInformation();
