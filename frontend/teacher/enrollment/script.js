const teacher = JSON.parse(localStorage.getItem("teacher"));

if (!teacher || !teacher.teacherId) {
  window.location.href = "../../login/index.html";
}

const teacherId = teacher.teacherId;
const COURSES_API_URL = `http://localhost:8080/api/teacher-courses/teacher/${teacherId}`;

// Elements
const teacherName = document.getElementById("teacherName");
const teacherCode = document.getElementById("teacherCode");
const profileAvatar = document.getElementById("profileAvatar");
const logoutBtn = document.getElementById("logoutBtn");

const courseSelect = document.getElementById("courseSelect");
const enrollmentSection = document.getElementById("enrollmentSection");
const availableList = document.getElementById("availableList");
const enrolledList = document.getElementById("enrolledList");

function displayTeacherInformation() {
  const name = teacher.name || "Teacher";
  const code = teacher.teacherCode || "";
  teacherName.textContent = name;
  teacherCode.textContent = code;
  profileAvatar.textContent = name.charAt(0).toUpperCase();
}

async function loadCourses() {
  try {
    const response = await fetch(COURSES_API_URL);
    if (!response.ok) throw new Error("Failed to load courses");
    const teacherCourses = await response.json();
    
    teacherCourses.forEach(tc => {
      if (tc.course) {
        const option = document.createElement("option");
        option.value = tc.course.courseId;
        option.textContent = `${tc.course.courseCode} - ${tc.course.courseName}`;
        courseSelect.appendChild(option);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

courseSelect.addEventListener("change", (e) => {
  const courseId = e.target.value;
  if (!courseId) {
    enrollmentSection.style.display = "none";
    return;
  }
  enrollmentSection.style.display = "grid";
  loadEnrollmentData(courseId);
});

async function loadEnrollmentData(courseId) {
  availableList.innerHTML = "Loading...";
  enrolledList.innerHTML = "Loading...";

  try {
    const [enrolledRes, availableRes] = await Promise.all([
      fetch(`http://localhost:8080/api/teacher-enrollments/teacher/${teacherId}/course/${courseId}/students`),
      fetch(`http://localhost:8080/api/teacher-enrollments/teacher/${teacherId}/course/${courseId}/available-students`)
    ]);

    const enrolledStudents = await enrolledRes.json();
    const availableStudents = await availableRes.json();

    renderAvailable(availableStudents, courseId);
    renderEnrolled(enrolledStudents, courseId);
  } catch (error) {
    console.error(error);
    availableList.innerHTML = "Error loading data.";
    enrolledList.innerHTML = "Error loading data.";
  }
}

function renderAvailable(students, courseId) {
  availableList.innerHTML = "";
  if (students.length === 0) {
    availableList.innerHTML = "<p>No available students.</p>";
    return;
  }
  
  students.forEach(student => {
    const div = document.createElement("div");
    div.className = "student-item";
    div.innerHTML = `
      <div class="student-info">
        <strong>${student.name || '-'}</strong>
        <span>${student.registerNumber || '-'}</span>
      </div>
      <button class="btn-enroll" onclick="enrollStudent(${courseId}, ${student.studentId})">Enroll</button>
    `;
    availableList.appendChild(div);
  });
}

function renderEnrolled(students, courseId) {
  enrolledList.innerHTML = "";
  if (students.length === 0) {
    enrolledList.innerHTML = "<p>No enrolled students.</p>";
    return;
  }
  
  students.forEach(student => {
    const div = document.createElement("div");
    div.className = "student-item";
    div.innerHTML = `
      <div class="student-info">
        <strong>${student.studentName || '-'}</strong>
        <span>${student.registerNumber || '-'}</span>
      </div>
      <button class="btn-remove" onclick="removeStudent(${courseId}, ${student.studentId})">Remove</button>
    `;
    enrolledList.appendChild(div);
  });
}

async function enrollStudent(courseId, studentId) {
  try {
    await fetch(`http://localhost:8080/api/teacher-enrollments/teacher/${teacherId}/course/${courseId}/student/${studentId}`, {
      method: "POST"
    });
    loadEnrollmentData(courseId);
  } catch (error) {
    console.error(error);
    alert("Error enrolling student");
  }
}

async function removeStudent(courseId, studentId) {
  if(!confirm("Are you sure you want to remove this student?")) return;
  
  try {
    await fetch(`http://localhost:8080/api/teacher-enrollments/teacher/${teacherId}/course/${courseId}/student/${studentId}`, {
      method: "DELETE"
    });
    loadEnrollmentData(courseId);
  } catch (error) {
    console.error(error);
    alert("Error removing student");
  }
}

logoutBtn.addEventListener("click", function (event) {
  event.preventDefault();
  localStorage.removeItem("teacher");
  window.location.href = "../../login/index.html";
});

// Initialize
displayTeacherInformation();
loadCourses();
