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

const ATTENDANCE_API = `http://localhost:8080/api/attendance/student/${studentId}`;

/* --------------------------------
   DOM Elements
-------------------------------- */

const studentName = document.getElementById("studentName");

const studentRegisterNumber = document.getElementById("studentRegisterNumber");

const profileAvatar = document.getElementById("profileAvatar");

const overallAttendance = document.getElementById("overallAttendance");

const classesAttended = document.getElementById("classesAttended");

const classesHeld = document.getElementById("classesHeld");

const attendanceCount = document.getElementById("attendanceCount");

const attendanceList = document.getElementById("attendanceList");

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
   Load Attendance
-------------------------------- */

async function loadAttendance() {
  try {
    attendanceList.innerHTML = `
      <div class="loading-state">
        Loading attendance records...
      </div>
    `;

    const response = await fetch(ATTENDANCE_API);

    if (!response.ok) {
      throw new Error(`Attendance API failed: ${response.status}`);
    }

    const attendance = await response.json();

    displaySummary(attendance);

    displayAttendance(attendance);
  } catch (error) {
    console.error("Attendance loading error:", error);

    attendanceList.innerHTML = `
      <div class="loading-state">
        Unable to load attendance records.
      </div>
    `;
  }
}

/* --------------------------------
   Calculate Overall Attendance
-------------------------------- */

function calculateOverallAttendance(attendance) {
  if (!attendance.length) {
    return 0;
  }

  let totalHeld = 0;
  let totalAttended = 0;

  attendance.forEach((record) => {
    totalHeld += Number(record.classesHeld || 0);

    totalAttended += Number(record.classesAttended || 0);
  });

  if (totalHeld === 0) {
    return 0;
  }

  return (totalAttended / totalHeld) * 100;
}

/* --------------------------------
   Display Summary
-------------------------------- */

function displaySummary(attendance) {
  let totalHeld = 0;
  let totalAttended = 0;

  attendance.forEach((record) => {
    totalHeld += Number(record.classesHeld || 0);

    totalAttended += Number(record.classesAttended || 0);
  });

  const overall = totalHeld > 0 ? (totalAttended / totalHeld) * 100 : 0;

  overallAttendance.textContent = `${overall.toFixed(2)}%`;

  classesAttended.textContent = totalAttended;

  classesHeld.textContent = totalHeld;

  attendanceCount.textContent = `${attendance.length} ${
    attendance.length === 1 ? "course" : "courses"
  }`;
}

/* --------------------------------
   Get Attendance Status
-------------------------------- */

function getAttendanceStatus(percentage) {
  if (percentage >= 85) {
    return {
      className: "good",
      label: "Good",
    };
  }

  if (percentage >= 75) {
    return {
      className: "warning",
      label: "Needs Attention",
    };
  }

  return {
    className: "low",
    label: "Low Attendance",
  };
}

/* --------------------------------
   Display Attendance
-------------------------------- */

function displayAttendance(attendance) {
  if (!attendance.length) {
    attendanceList.innerHTML = `
      <div class="loading-state">
        No attendance records found.
      </div>
    `;

    return;
  }

  attendanceList.innerHTML = "";

  attendance.forEach((record) => {
    const course = record.course;

    const courseCode = course?.courseCode || "N/A";

    const courseName = course?.courseName || "Unknown Course";

    const held = Number(record.classesHeld || 0);

    const attended = Number(record.classesAttended || 0);

    const percentage = held > 0 ? (attended / held) * 100 : 0;

    const status = getAttendanceStatus(percentage);

    const item = document.createElement("div");

    item.className = "attendance-item";

    item.innerHTML = `
      <div class="attendance-top">

        <div class="course-info">

          <div class="course-icon">
            ${courseCode.substring(0, 2)}
          </div>

          <div>

            <strong>
              ${courseName}
            </strong>

            <span>
              ${courseCode}
            </span>

          </div>

        </div>


        <div class="attendance-percentage">
          ${percentage.toFixed(2)}%
        </div>

      </div>


      <div class="progress-track">

        <div
          class="progress-bar ${status.className}"
          style="width: ${Math.min(percentage, 100)}%"
        ></div>

      </div>


      <div class="attendance-bottom">

        <span class="class-count">
          ${attended} of ${held} classes attended
        </span>


        <span
          class="attendance-status ${status.className}"
        >

          <span class="status-dot"></span>

          ${status.label}

        </span>

      </div>
    `;

    attendanceList.appendChild(item);
  });
}

/* --------------------------------
   Initialize
-------------------------------- */

displayStudentInformation();

loadAttendance();
