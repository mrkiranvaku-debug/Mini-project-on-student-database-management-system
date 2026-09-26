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

const MARKS_API = `http://localhost:8080/api/marks/student/${studentId}`;

/* --------------------------------
   DOM Elements
-------------------------------- */

const studentName = document.getElementById("studentName");

const studentRegisterNumber = document.getElementById("studentRegisterNumber");

const profileAvatar = document.getElementById("profileAvatar");

const gpaValue = document.getElementById("gpaValue");

const completedCourses = document.getElementById("completedCourses");

const totalCredits = document.getElementById("totalCredits");

const resultCount = document.getElementById("resultCount");

const resultsTableBody = document.getElementById("resultsTableBody");

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
   Load Results
-------------------------------- */

async function loadResults() {
  try {
    resultsTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="loading-state">
          Loading academic results...
        </td>
      </tr>
    `;

    const response = await fetch(MARKS_API);

    if (!response.ok) {
      throw new Error(`Marks API failed: ${response.status}`);
    }

    const marks = await response.json();

    displaySummary(marks);

    displayResults(marks);
  } catch (error) {
    console.error("Results loading error:", error);

    resultsTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="loading-state">
          Unable to load academic results.
        </td>
      </tr>
    `;
  }
}

/* --------------------------------
   Calculate GPA
-------------------------------- */

function calculateGPA(marks) {
  if (!marks.length) {
    return 0;
  }

  let totalGradePoints = 0;

  let totalCredits = 0;

  marks.forEach((mark) => {
    const gradePoint = Number(mark.gradePoint || 0);

    const credits = Number(mark.course?.credits || 0);

    /*
     * GPA is calculated using
     * course credits.
     */
    totalGradePoints += gradePoint * credits;

    totalCredits += credits;
  });

  if (totalCredits === 0) {
    return 0;
  }

  return totalGradePoints / totalCredits;
}

/* --------------------------------
   Display Summary
-------------------------------- */

function displaySummary(marks) {
  const gpa = calculateGPA(marks);

  let credits = 0;

  marks.forEach((mark) => {
    credits += Number(mark.course?.credits || 0);
  });

  gpaValue.textContent = gpa.toFixed(2);

  completedCourses.textContent = marks.length;

  totalCredits.textContent = credits;

  resultCount.textContent = `${marks.length} ${
    marks.length === 1 ? "result" : "results"
  }`;
}

/* --------------------------------
   Display Results Table
-------------------------------- */

function displayResults(marks) {
  if (!marks.length) {
    resultsTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="loading-state">
          No results are available yet.
        </td>
      </tr>
    `;

    return;
  }

  resultsTableBody.innerHTML = "";

  marks.forEach((mark, index) => {
    const course = mark.course;

    const courseCode = course?.courseCode || "N/A";

    const courseName = course?.courseName || "Unknown Course";

    const internalMarks = Number(mark.internalMarks || 0);

    const externalMarks = Number(mark.externalMarks || 0);

    const totalMarks = Number(mark.totalMarks || 0);

    const grade = mark.grade || "-";

    const gradePoint = Number(mark.gradePoint || 0);

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

      <td class="mark-value">
        ${internalMarks.toFixed(2)}
      </td>

      <td class="mark-value">
        ${externalMarks.toFixed(2)}
      </td>

      <td class="total-mark">
        ${totalMarks.toFixed(2)}
      </td>

      <td>
        <span class="grade-badge">
          ${grade}
        </span>
      </td>

      <td class="grade-point">
        ${gradePoint.toFixed(2)}
      </td>
    `;

    resultsTableBody.appendChild(row);
  });
}

/* --------------------------------
   Initialize
-------------------------------- */

displayStudentInformation();

loadResults();
