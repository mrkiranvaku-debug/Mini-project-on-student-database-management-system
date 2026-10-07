const teacher = JSON.parse(localStorage.getItem("teacher"));
if (!teacher || !teacher.teacherId) {
  window.location.href = "../../login/index.html";
}
const teacherId = teacher.teacherId;
const BASE = "http://localhost:8080";

// Sidebar
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
const menuBtn = document.getElementById("menuButton");
const closeBtn = document.getElementById("closeSidebar");
menuBtn.addEventListener("click", () => { sidebar.classList.add("open"); overlay.classList.add("show"); });
closeBtn.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);
function closeSidebar() { sidebar.classList.remove("open"); overlay.classList.remove("show"); }

// Teacher info
document.getElementById("teacherName").textContent = teacher.name || "Teacher";
document.getElementById("teacherCode").textContent = teacher.teacherCode || "";
document.getElementById("profileAvatar").textContent = (teacher.name || "T").charAt(0).toUpperCase();

// Logout
document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("teacher");
  window.location.href = "../../login/index.html";
});

// Alert
function showAlert(msg, type = "success") {
  const el = document.getElementById("alertBox");
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
  setTimeout(() => el.classList.remove("show"), 4000);
}

let allStudents = [];

async function loadStudents() {
  const tbody = document.getElementById("studentsBody");
  tbody.innerHTML = '<tr class="state-row"><td colspan="4">Loading…</td></tr>';
  try {
    const res = await fetch(`${BASE}/api/teacher-students/teacher/${teacherId}`);
    if (!res.ok) throw new Error("Failed to load");
    allStudents = await res.json();
    renderStudents(allStudents);
  } catch (e) {
    tbody.innerHTML = '<tr class="state-row"><td colspan="4">Unable to load students.</td></tr>';
    console.error(e);
  }
}

function renderStudents(list) {
  const tbody = document.getElementById("studentsBody");
  if (!list.length) {
    tbody.innerHTML = '<tr class="state-row"><td colspan="4">No students found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(s => {
    const courses = (s.courses || []).map(c => `<span class="badge badge-info">${c.courseCode}</span>`).join(" ");
    return `<tr>
      <td>${s.registerNumber}</td>
      <td>${s.name}</td>
      <td>${courses || "—"}</td>
      <td>
        <div class="action-group">
          <button class="btn btn-sm btn-primary" onclick="openEdit(${s.studentId}, '${escHtml(s.registerNumber)}', '${escHtml(s.name)}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteStudent(${s.studentId}, '${escHtml(s.name)}')">Delete</button>
        </div>
      </td>
    </tr>`;
  }).join("");
}

function escHtml(str) {
  return String(str).replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

// Search
document.getElementById("searchInput").addEventListener("input", function () {
  const q = this.value.toLowerCase();
  renderStudents(allStudents.filter(s =>
    s.name.toLowerCase().includes(q) || s.registerNumber.toLowerCase().includes(q)
  ));
});

// ADD
document.getElementById("addStudentBtn").addEventListener("click", () => {
  document.getElementById("addRegNum").value = "";
  document.getElementById("addName").value = "";
  document.getElementById("addPassword").value = "";
  document.getElementById("addModal").classList.add("open");
});
document.getElementById("addCancelBtn").addEventListener("click", () => document.getElementById("addModal").classList.remove("open"));
document.getElementById("addSaveBtn").addEventListener("click", async () => {
  const registerNumber = document.getElementById("addRegNum").value.trim();
  const name = document.getElementById("addName").value.trim();
  const password = document.getElementById("addPassword").value.trim();
  if (!registerNumber || !name || !password) { showAlert("All fields are required.", "error"); return; }

  try {
    const res = await fetch(`${BASE}/api/teacher-students?teacherId=${teacherId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registerNumber, name, password })
    });
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || "Failed to add student.", "error"); return; }
    document.getElementById("addModal").classList.remove("open");
    showAlert("Student added successfully.");
    loadStudents();
  } catch (e) {
    showAlert("Server error.", "error");
  }
});

// EDIT
function openEdit(studentId, registerNumber, name) {
  document.getElementById("editStudentId").value = studentId;
  document.getElementById("editRegNum").value = registerNumber;
  document.getElementById("editName").value = name;
  document.getElementById("editModal").classList.add("open");
}
document.getElementById("editCancelBtn").addEventListener("click", () => document.getElementById("editModal").classList.remove("open"));
document.getElementById("editSaveBtn").addEventListener("click", async () => {
  const studentId = document.getElementById("editStudentId").value;
  const registerNumber = document.getElementById("editRegNum").value.trim();
  const name = document.getElementById("editName").value.trim();
  if (!registerNumber || !name) { showAlert("All fields are required.", "error"); return; }

  try {
    const res = await fetch(`${BASE}/api/teacher-students/${studentId}?teacherId=${teacherId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registerNumber, name })
    });
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || "Failed to update.", "error"); return; }
    document.getElementById("editModal").classList.remove("open");
    showAlert("Student updated successfully.");
    loadStudents();
  } catch (e) {
    showAlert("Server error.", "error");
  }
});

// DELETE
async function deleteStudent(studentId, name) {
  if (!confirm(`Delete student "${name}"? This cannot be undone.`)) return;
  try {
    const res = await fetch(`${BASE}/api/teacher-students/${studentId}?teacherId=${teacherId}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || "Failed to delete.", "error"); return; }
    showAlert("Student deleted.");
    loadStudents();
  } catch (e) {
    showAlert("Server error.", "error");
  }
}

// Close modals on backdrop click
document.getElementById("addModal").addEventListener("click", function(e) { if (e.target === this) this.classList.remove("open"); });
document.getElementById("editModal").addEventListener("click", function(e) { if (e.target === this) this.classList.remove("open"); });

loadStudents();
