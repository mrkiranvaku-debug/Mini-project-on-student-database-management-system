const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuButton = document.getElementById("menuButton");
const closeSidebar = document.getElementById("closeSidebar");
const logoutBtn = document.getElementById("logoutBtn");

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

logoutBtn.addEventListener("click", function (event) {
  event.preventDefault();

  localStorage.removeItem("student");

  window.location.href = "../../login/index.html";
});
const student = JSON.parse(localStorage.getItem("student"));

/* --------------------------------
   Authentication Check
-------------------------------- */

if (!student || !student.studentId) {
  window.location.href = "../../login/index.html";
}

/* --------------------------------
   API
-------------------------------- */

const studentId = student.studentId;

const ENROLLMENT_API = `http://localhost:8080/api/enrollments/student/${studentId}`;

/* --------------------------------
   DOM Elements
-------------------------------- */

const studentName = document.getElementById("studentName");

const studentRegisterNumber = document.getElementById("studentRegisterNumber");

const profileAvatar = document.getElementById("profileAvatar");

const totalCourses = document.getElementById("totalCourses");

const totalCredits = document.getElementById("totalCredits");

const courseCount = document.getElementById("courseCount");

const enrollmentTableBody = document.getElementById("enrollmentTableBody");

/* --------------------------------
   Student Information
-------------------------------- */

function displayStudentInformation() {
  studentName.textContent = student.name || "Student";

  studentRegisterNumber.textContent = student.registerNumber || "";

  if (student.name) {
    profileAvatar.textContent = student.name.charAt(0).toUpperCase();
  }
}

/* --------------------------------
   Load Enrollment
-------------------------------- */

async function loadEnrollment() {
  try {
    enrollmentTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="loading-state">
          Loading enrollment details...
        </td>
      </tr>
    `;

    const response = await fetch(ENROLLMENT_API);

    if (!response.ok) {
      throw new Error(`Enrollment API failed: ${response.status}`);
    }

    const enrollments = await response.json();

    displaySummary(enrollments);

    displayEnrollmentTable(enrollments);
  } catch (error) {
    console.error("Enrollment loading error:", error);

    enrollmentTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="loading-state">
          Unable to load enrollment details.
        </td>
      </tr>
    `;
  }
}

/* --------------------------------
   Summary
-------------------------------- */

function displaySummary(enrollments) {
  totalCourses.textContent = enrollments.length;

  let credits = 0;

  enrollments.forEach((enrollment) => {
    if (enrollment.course && enrollment.course.credits) {
      credits += Number(enrollment.course.credits);
    }
  });

  totalCredits.textContent = credits;

  courseCount.textContent = `${enrollments.length} ${
    enrollments.length === 1 ? "course" : "courses"
  }`;
}

/* --------------------------------
   Enrollment Table
-------------------------------- */

function displayEnrollmentTable(enrollments) {
  if (!enrollments.length) {
    enrollmentTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="loading-state">
          No enrollment records found.
        </td>
      </tr>
    `;

    return;
  }

  enrollmentTableBody.innerHTML = "";

  enrollments.forEach((enrollment, index) => {
    const course = enrollment.course;

    if (!course) {
      return;
    }

    const courseCode = course.courseCode || "N/A";

    const courseName = course.courseName || "Unnamed Course";

    const credits = course.credits || 0;

    const department = course.department?.departmentName || "N/A";

    const row = document.createElement("tr");

    row.innerHTML = `
        <td class="row-number">
          ${index + 1}
        </td>

        <td>
          <span class="course-code">
            ${courseCode}
          </span>
        </td>

        <td class="course-name">
          ${courseName}
        </td>

        <td class="department-name">
          ${department}
        </td>

        <td class="credit-value">
          ${credits}
        </td>

        <td>
          <span class="status-badge">
            <span class="status-dot"></span>
            Enrolled
          </span>
        </td>
      `;

    enrollmentTableBody.appendChild(row);
  });
}

/* --------------------------------
   Initialize
-------------------------------- */

displayStudentInformation();

loadEnrollment();
