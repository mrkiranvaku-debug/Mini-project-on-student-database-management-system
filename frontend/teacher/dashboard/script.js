const teacher = JSON.parse(localStorage.getItem("teacher"));

if (!teacher || !teacher.teacherId) {
  window.location.href = "../../login/index.html";
}

const teacherId = teacher.teacherId;

const API_URL = `http://localhost:8080/api/teacher-dashboard/teacher/${teacherId}`;

/* =========================================
   ELEMENTS
========================================= */

const sidebar = document.getElementById("sidebar");

const sidebarOverlay = document.getElementById("sidebarOverlay");

const menuButton = document.getElementById("menuButton");

const closeSidebar = document.getElementById("closeSidebar");

const logoutBtn = document.getElementById("logoutBtn");

const teacherName = document.getElementById("teacherName");

const teacherCode = document.getElementById("teacherCode");

const profileAvatar = document.getElementById("profileAvatar");

const totalSubjects = document.getElementById("totalSubjects");

const totalStudents = document.getElementById("totalStudents");

const totalEnrollments = document.getElementById("totalEnrollments");

const subjectCount = document.getElementById("subjectCount");

const subjectGrid = document.getElementById("subjectGrid");

/* =========================================
   SIDEBAR
========================================= */

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

/* =========================================
   LOAD DASHBOARD
========================================= */

async function loadDashboard() {
  try {
    subjectGrid.innerHTML = `
            <div class="loading-state">
                Loading your subjects...
            </div>
        `;

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Dashboard API failed: ${response.status}`);
    }

    const data = await response.json();

    displayTeacherInformation(data);

    displaySummary(data);

    displaySubjects(data);
  } catch (error) {
    console.error("Teacher dashboard loading error:", error);

    subjectGrid.innerHTML = `
            <div class="loading-state">
                Unable to load dashboard data.
            </div>
        `;
  }
}

/* =========================================
   TEACHER INFORMATION
========================================= */

function displayTeacherInformation(data) {
  const name = data.teacherName || "Teacher";

  const code = data.teacherCode || "";

  teacherName.textContent = name;

  teacherCode.textContent = code;

  profileAvatar.textContent = name.charAt(0).toUpperCase();
}

/* =========================================
   SUMMARY
========================================= */

function displaySummary(data) {
  const subjects = Number(data.totalSubjects || 0);

  const students = Number(data.totalStudents || 0);

  const enrollments = Number(data.totalEnrollments || 0);

  totalSubjects.textContent = subjects;

  totalStudents.textContent = students;

  totalEnrollments.textContent = enrollments;

  subjectCount.textContent = `${subjects} ${
    subjects === 1 ? "subject" : "subjects"
  }`;
}

/* =========================================
   SUBJECTS
========================================= */

function displaySubjects(data) {
  const subjects = data.subjects || [];

  if (subjects.length === 0) {
    subjectGrid.innerHTML = `
            <div class="loading-state">
                No subjects are currently assigned.
            </div>
        `;

    return;
  }

  subjectGrid.innerHTML = "";

  subjects.forEach((subject) => {
    const courseCode = subject.courseCode || "COURSE";

    const courseName = subject.courseName || "Unnamed Subject";

    const credits = Number(subject.credits || 0);

    const studentCount = Number(subject.studentCount || 0);

    const card = document.createElement("div");

    card.className = "subject-card";

    card.innerHTML = `

            <div class="subject-top">

                <div class="subject-icon">
                    ${courseCode.substring(0, 2)}
                </div>

                <span class="subject-code">
                    ${courseCode}
                </span>

            </div>


            <h3>
                ${courseName}
            </h3>


            <div class="subject-footer">

                <span class="student-count">

                    <span class="student-dot"></span>

                    ${studentCount}

                    ${studentCount === 1 ? "Student" : "Students"}

                </span>


                <span class="subject-credits">

                    ${credits}

                    ${credits === 1 ? "Credit" : "Credits"}

                </span>

            </div>

        `;

    subjectGrid.appendChild(card);
  });
}

/* =========================================
   LOGOUT
========================================= */

logoutBtn.addEventListener("click", function (event) {
  event.preventDefault();

  localStorage.removeItem("teacher");

  window.location.href = "../../login/index.html";
});

/* =========================================
   START
========================================= */

loadDashboard();
