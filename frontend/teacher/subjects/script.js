const teacher = JSON.parse(localStorage.getItem("teacher"));

if (!teacher || !teacher.teacherId) {
  window.location.href = "../../login/index.html";
}

const teacherId = teacher.teacherId;
const API_URL = `http://localhost:8080/api/teacher-courses/teacher/${teacherId}`;

// Elements
const teacherName = document.getElementById("teacherName");
const teacherCode = document.getElementById("teacherCode");
const profileAvatar = document.getElementById("profileAvatar");
const subjectsBody = document.getElementById("subjectsBody");
const logoutBtn = document.getElementById("logoutBtn");

function displayTeacherInformation() {
  const name = teacher.name || "Teacher";
  const code = teacher.teacherCode || "";
  teacherName.textContent = name;
  teacherCode.textContent = code;
  profileAvatar.textContent = name.charAt(0).toUpperCase();
}

async function loadSubjects() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to load subjects");
    
    const teacherCourses = await response.json();
    displaySubjects(teacherCourses);
  } catch (error) {
    console.error(error);
    subjectsBody.innerHTML = `<tr><td colspan="4">Error loading subjects.</td></tr>`;
  }
}

function displaySubjects(teacherCourses) {
  subjectsBody.innerHTML = "";
  if (teacherCourses.length === 0) {
    subjectsBody.innerHTML = `<tr><td colspan="4">No subjects found.</td></tr>`;
    return;
  }
  
  teacherCourses.forEach(tc => {
    const course = tc.course || {};
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${course.courseCode || '-'}</td>
      <td>${course.courseName || '-'}</td>
      <td>${course.credits || '-'}</td>
      <td>${course.semester || '-'}</td>
    `;
    subjectsBody.appendChild(tr);
  });
}

logoutBtn.addEventListener("click", function (event) {
  event.preventDefault();
  localStorage.removeItem("teacher");
  window.location.href = "../../login/index.html";
});

// Initialize
displayTeacherInformation();
loadSubjects();
