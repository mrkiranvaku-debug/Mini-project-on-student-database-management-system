const API_URL = "http://localhost:8080/api/dashboard/student/1";

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuButton = document.getElementById("menuButton");
const closeSidebar = document.getElementById("closeSidebar");
const logoutBtn = document.getElementById("logoutBtn");

const studentName = document.getElementById("studentName");
const studentRegisterNumber = document.getElementById("studentRegisterNumber");
const profileAvatar = document.getElementById("profileAvatar");

const attendanceValue = document.getElementById("attendanceValue");
const coursesValue = document.getElementById("coursesValue");
const coursesDescription = document.getElementById("coursesDescription");
const gpaValue = document.getElementById("gpaValue");

const courseList = document.getElementById("courseList");
const currentDate = document.getElementById("currentDate");

/* =========================
   SIDEBAR
========================= */

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

/* =========================
   CIRCULAR PROGRESS
========================= */

function setCircularProgress(element, percentage) {
  const safePercentage = Math.max(0, Math.min(100, percentage));

  const degrees = safePercentage * 3.6;

  element.style.background = `
        conic-gradient(
            var(--primary) ${degrees}deg,
            #eceef4 ${degrees}deg
        )
    `;
}

/* =========================
   LOAD DASHBOARD
========================= */

async function loadDashboard() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Dashboard API failed: ${response.status}`);
    }

    const data = await response.json();

    displayStudentInformation(data);

    displayMetrics(data);

    displayCourses(data);
  } catch (error) {
    console.error("Dashboard loading error:", error);

    courseList.innerHTML = `
            <div class="loading-state">
                Unable to load dashboard data.
            </div>
        `;
  }
}

/* =========================
   STUDENT INFORMATION
========================= */

function displayStudentInformation(data) {
  studentName.textContent = data.studentName || "Student";

  studentRegisterNumber.textContent = data.registerNumber || "";

  if (data.studentName) {
    profileAvatar.textContent = data.studentName.charAt(0).toUpperCase();
  }
}

/* =========================
   DASHBOARD METRICS
========================= */

function displayMetrics(data) {
  const attendance = Number(data.attendancePercentage || 0);

  const gpa = Number(data.gpa || 0);

  const totalCourses = Number(data.totalCourses || 0);

  const completedCourses = Number(data.completedCourses || 0);

  /* Attendance */

  attendanceValue.textContent = `${attendance.toFixed(2)}%`;

  const attendanceProgress = document.querySelector(".attendance-progress");

  setCircularProgress(attendanceProgress, attendance);

  /* Courses */

  coursesValue.textContent = totalCourses;

  coursesDescription.textContent = `${completedCourses} of ${totalCourses} completed`;

  const coursePercentage =
    totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

  const coursesProgress = document.querySelector(".courses-progress");

  setCircularProgress(coursesProgress, coursePercentage);

  /* GPA */

  gpaValue.textContent = gpa.toFixed(2);

  /*
       GPA is normally measured on a 10-point scale.
       Convert it to a percentage only for
       drawing the circular visualization.
    */

  const gpaProgress = document.querySelector(".gpa-progress");

  const gpaPercentage = (gpa / 10) * 100;

  setCircularProgress(gpaProgress, gpaPercentage);
}

/* =========================
   COURSE LIST
========================= */

function displayCourses(data) {
  const courses = data.courses || [];

  if (courses.length === 0) {
    courseList.innerHTML = `
            <div class="loading-state">
                No courses found.
            </div>
        `;

    return;
  }

  courseList.innerHTML = "";

  courses.forEach((course) => {
    const courseItem = document.createElement("div");

    courseItem.className = "course-item";

    courseItem.innerHTML = `
            <div class="course-left">

                <div class="course-icon">
                    ${course.courseCode.substring(0, 2)}
                </div>

                <div class="course-details">

                    <strong>
                        ${course.courseName}
                    </strong>

                    <span>
                        ${course.courseCode}
                    </span>

                </div>

            </div>

            <span class="course-credit">
                ${course.credits} Credits
            </span>
        `;

    courseList.appendChild(courseItem);
  });
}

/* =========================
   CURRENT DATE
========================= */

function displayCurrentDate() {
  const today = new Date();

  currentDate.textContent = today.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener("click", function (event) {
  event.preventDefault();

  window.location.href = "../login/index.html";
});

/* =========================
   INITIALIZE
========================= */

displayCurrentDate();

loadDashboard();
