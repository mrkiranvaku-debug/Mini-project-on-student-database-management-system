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
   API URLs
-------------------------------- */

const studentId = student.studentId;

const ENROLLMENT_API = `http://localhost:8080/api/enrollments/student/${studentId}`;

const MARKS_API = `http://localhost:8080/api/marks/student/${studentId}`;

/* --------------------------------
   DOM Elements
-------------------------------- */

const studentName = document.getElementById("studentName");
const studentRegisterNumber = document.getElementById("studentRegisterNumber");

const profileAvatar = document.getElementById("profileAvatar");

const totalCourses = document.getElementById("totalCourses");

const completedCourses = document.getElementById("completedCourses");

const totalCredits = document.getElementById("totalCredits");

const courseCount = document.getElementById("courseCount");

const courseGrid = document.getElementById("courseGrid");

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
   Load Courses
-------------------------------- */

async function loadCourses() {
  try {
    courseGrid.innerHTML = `
      <div class="loading-state">
        Loading your courses...
      </div>
    `;

    /*
     * Fetch enrolled courses and marks
     * at the same time.
     */
    const [enrollmentResponse, marksResponse] = await Promise.all([
      fetch(ENROLLMENT_API),
      fetch(MARKS_API),
    ]);

    if (!enrollmentResponse.ok) {
      throw new Error(`Enrollment API failed: ${enrollmentResponse.status}`);
    }

    const enrollments = await enrollmentResponse.json();

    let marks = [];

    if (marksResponse.ok) {
      marks = await marksResponse.json();
    }

    displayCourseSummary(enrollments, marks);

    displayCourses(enrollments, marks);
  } catch (error) {
    console.error("Course loading error:", error);

    courseGrid.innerHTML = `
      <div class="loading-state">
        Unable to load your courses.
        Please try again.
      </div>
    `;
  }
}

/* --------------------------------
   Course Summary
-------------------------------- */

function displayCourseSummary(enrollments, marks) {
  const courseTotal = enrollments.length;

  const completedTotal = marks.length;

  let credits = 0;

  enrollments.forEach((enrollment) => {
    if (enrollment.course && enrollment.course.credits) {
      credits += Number(enrollment.course.credits);
    }
  });

  totalCourses.textContent = courseTotal;

  completedCourses.textContent = completedTotal;

  totalCredits.textContent = credits;

  courseCount.textContent = `${courseTotal} ${
    courseTotal === 1 ? "course" : "courses"
  }`;
}

/* --------------------------------
   Display Course Cards
-------------------------------- */

function displayCourses(enrollments, marks) {
  if (!enrollments.length) {
    courseGrid.innerHTML = `
      <div class="loading-state">
        No courses are currently enrolled.
      </div>
    `;

    return;
  }

  courseGrid.innerHTML = "";

  enrollments.forEach((enrollment) => {
    const course = enrollment.course;

    if (!course) {
      return;
    }

    const courseCode = course.courseCode || "COURSE";

    const courseName = course.courseName || "Unnamed Course";

    const credits = course.credits || 0;

    /*
     * Check whether this course
     * has a marks record.
     */
    const hasResult = marks.some(
      (mark) => mark.course && mark.course.courseId === course.courseId,
    );

    const courseCard = document.createElement("div");

    courseCard.className = "course-card";

    courseCard.innerHTML = `
      <div class="course-top">

        <div class="course-icon">
          ${courseCode.substring(0, 2)}
        </div>

        <span class="course-code">
          ${courseCode}
        </span>

      </div>


      <h3>
        ${courseName}
      </h3>


      <p>
        ${course.department?.departmentName || "Academic Course"}
      </p>


      <div class="course-bottom">

        <span class="course-status">

          <span class="status-dot"></span>

          ${hasResult ? "Result available" : "Currently enrolled"}

        </span>


        <span class="course-credits">
          ${credits} ${Number(credits) === 1 ? "Credit" : "Credits"}
        </span>

      </div>
    `;

    courseGrid.appendChild(courseCard);
  });
}

/* --------------------------------
   Initialize Page
-------------------------------- */

displayStudentInformation();

loadCourses();
