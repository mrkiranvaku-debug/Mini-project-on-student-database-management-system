const studentBtn = document.getElementById("studentBtn");
const teacherBtn = document.getElementById("teacherBtn");

const registerNumberGroup = document.getElementById("registerNumberGroup");
const teacherIdGroup = document.getElementById("teacherIdGroup");

const registerNumber = document.getElementById("registerNumber");
const teacherId = document.getElementById("teacherId");

const password = document.getElementById("password");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

let selectedRole = "STUDENT";

/* -------------------------------
   Student / Teacher Selection
-------------------------------- */

studentBtn.addEventListener("click", () => {
  selectedRole = "STUDENT";

  studentBtn.classList.add("active");
  teacherBtn.classList.remove("active");

  registerNumberGroup.classList.remove("hidden");
  teacherIdGroup.classList.add("hidden");

  registerNumber.value = "";
  teacherId.value = "";
  password.value = "";

  loginMessage.textContent = "";
});

teacherBtn.addEventListener("click", () => {
  selectedRole = "TEACHER";

  teacherBtn.classList.add("active");
  studentBtn.classList.remove("active");

  teacherIdGroup.classList.remove("hidden");
  registerNumberGroup.classList.add("hidden");

  registerNumber.value = "";
  teacherId.value = "";
  password.value = "";

  loginMessage.textContent = "";
});

/* -------------------------------
   Login Form Validation
-------------------------------- */

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  loginMessage.textContent = "";

  if (selectedRole === "STUDENT") {
    if (registerNumber.value.trim() === "") {
      loginMessage.textContent = "Please enter your register number.";
      return;
    }
  } else {
    if (teacherId.value.trim() === "") {
      loginMessage.textContent = "Please enter your teacher ID.";
      return;
    }
  }

  if (password.value.trim() === "") {
    loginMessage.textContent = "Please enter your password.";
    return;
  }

  loginMessage.textContent = "Validation successful.";
});
