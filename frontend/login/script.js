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
   Login Form
-------------------------------- */

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginMessage.textContent = "";

  /* Student Login */

  if (selectedRole === "STUDENT") {
    if (registerNumber.value.trim() === "") {
      loginMessage.textContent = "Please enter your register number.";
      return;
    }

    if (password.value.trim() === "") {
      loginMessage.textContent = "Please enter your password.";
      return;
    }

    const loginData = {
      registerNumber: registerNumber.value.trim(),
      password: password.value,
    };

    try {
      loginMessage.textContent = "Logging in...";

      const response = await fetch(
        "http://localhost:8080/api/auth/student/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(loginData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        loginMessage.textContent = data.message;

        // Store logged-in student information
        localStorage.setItem("student", JSON.stringify(data.student));

        console.log("Student login successful:", data);

        // Open student dashboard
        window.location.href = "../dashboard/index.html";
      } else {
        loginMessage.textContent = data.message || "Login failed.";
      }
    } catch (error) {
      console.error("Login error:", error);

      loginMessage.textContent = "Unable to connect to the server.";
    }

    return;
  }

  /* Teacher Login */

  if (selectedRole === "TEACHER") {
    if (teacherId.value.trim() === "") {
      loginMessage.textContent = "Please enter your teacher ID.";
      return;
    }

    if (password.value.trim() === "") {
      loginMessage.textContent = "Please enter your password.";
      return;
    }

    const loginData = {
      teacherCode: teacherId.value.trim(),
      password: password.value,
    };

    try {
      loginMessage.textContent = "Logging in...";

      const response = await fetch(
        "http://localhost:8080/api/auth/teacher/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(loginData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        loginMessage.textContent = data.message;

        console.log("Teacher login successful:", data);
      } else {
        loginMessage.textContent = data.message || "Login failed.";
      }
    } catch (error) {
      console.error("Teacher login error:", error);

      loginMessage.textContent = "Unable to connect to the server.";
    }
  }
});
