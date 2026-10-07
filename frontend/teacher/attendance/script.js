const teacher = JSON.parse(localStorage.getItem("teacher"));
if (!teacher || !teacher.teacherId) window.location.href = "../../login/index.html";
const teacherId = teacher.teacherId;
const BASE = "http://localhost:8080";

// Sidebar
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
document.getElementById("menuButton").addEventListener("click", () => { sidebar.classList.add("open"); overlay.classList.add("show"); });
document.getElementById("closeSidebar").addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);
function closeSidebar() { sidebar.classList.remove("open"); overlay.classList.remove("show"); }

// Teacher info
document.getElementById("teacherName").textContent = teacher.name || "Teacher";
document.getElementById("teacherCode").textContent = teacher.teacherCode || "";
document.getElementById("profileAvatar").textContent = (teacher.name || "T").charAt(0).toUpperCase();

document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault(); localStorage.removeItem("teacher"); window.location.href = "../../login/index.html";
});

function showAlert(msg, type = "success") {
  const el = document.getElementById("alertBox");
  el.textContent = msg; el.className = `alert alert-${type} show`;
  setTimeout(() => el.classList.remove("show"), 4000);
}

let currentCourseId = null;
let enrolledStudents = [];
let attendanceRecords = [];

// Load teacher courses
async function loadCourses() {
  try {
    const res = await fetch(`${BASE}/api/teacher-courses/teacher/${teacherId}`);
    const data = await res.json();
    const sel = document.getElementById("courseSelect");
    data.forEach(tc => {
      if (tc.course) {
        const opt = document.createElement("option");
        opt.value = tc.course.courseId;
        opt.textContent = `${tc.course.courseCode} — ${tc.course.courseName}`;
        sel.appendChild(opt);
      }
    });
  } catch (e) { console.error(e); }
}

document.getElementById("courseSelect").addEventListener("change", async (e) => {
  currentCourseId = e.target.value || null;
  const section = document.getElementById("attendanceSection");
  const addBtn = document.getElementById("addAttendanceBtn");
  if (!currentCourseId) { section.style.display = "none"; addBtn.style.display = "none"; return; }
  section.style.display = "block"; addBtn.style.display = "";
  await loadEnrolledStudents();
  await loadAttendance();
});

async function loadEnrolledStudents() {
  try {
    const res = await fetch(`${BASE}/api/teacher-enrollments/teacher/${teacherId}/course/${currentCourseId}/students`);
    enrolledStudents = await res.json();
  } catch (e) { enrolledStudents = []; }
}

async function loadAttendance() {
  const tbody = document.getElementById("attendanceBody");
  tbody.innerHTML = '<tr class="state-row"><td colspan="7">Loading…</td></tr>';
  try {
    const res = await fetch(`${BASE}/api/teacher-attendance/teacher/${teacherId}/course/${currentCourseId}`);
    if (!res.ok) throw new Error();
    attendanceRecords = await res.json();
    renderAttendance();
  } catch (e) {
    tbody.innerHTML = '<tr class="state-row"><td colspan="7">Error loading attendance.</td></tr>';
  }
}

function renderAttendance() {
  const tbody = document.getElementById("attendanceBody");
  if (!attendanceRecords.length) {
    tbody.innerHTML = '<tr class="state-row"><td colspan="7">No attendance records. Click "+ Add Attendance" to begin.</td></tr>';
    return;
  }
  tbody.innerHTML = attendanceRecords.map(r => {
    const pct = parseFloat(r.attendancePercentage || 0);
    const badge = pct >= 75 ? "badge-success" : pct >= 50 ? "badge-warning" : "badge-danger";
    const status = pct >= 75 ? "Good" : pct >= 50 ? "Low" : "Shortage";
    return `<tr>
      <td>${r.student ? r.student.name : "—"}</td>
      <td>${r.student ? r.student.registerNumber : "—"}</td>
      <td>${r.classesHeld}</td>
      <td>${r.classesAttended}</td>
      <td>${pct.toFixed(2)}%</td>
      <td><span class="badge ${badge}">${status}</span></td>
      <td><div class="action-group">
        <button class="btn btn-sm btn-primary" onclick="openEdit(${r.student.studentId}, ${r.classesHeld}, ${r.classesAttended})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteRecord(${r.student.studentId}, '${(r.student.name || "").replace(/'/g,"\\'")}')">Delete</button>
      </div></td>
    </tr>`;
  }).join("");
}

// Percentage preview
function updatePercentagePreview() {
  const held = parseInt(document.getElementById("modalHeld").value) || 0;
  const attended = parseInt(document.getElementById("modalAttended").value) || 0;
  const pct = held > 0 ? ((attended / held) * 100).toFixed(2) : "0.00";
  document.getElementById("modalPercentage").value = pct + "%";
}
document.getElementById("modalHeld").addEventListener("input", updatePercentagePreview);
document.getElementById("modalAttended").addEventListener("input", updatePercentagePreview);

// ADD
document.getElementById("addAttendanceBtn").addEventListener("click", () => {
  document.getElementById("modalTitle").textContent = "Add Attendance";
  document.getElementById("modalMode").value = "add";
  document.getElementById("studentSelectGroup").style.display = "block";
  document.getElementById("modalStudentId").value = "";
  document.getElementById("modalHeld").value = "";
  document.getElementById("modalAttended").value = "";
  document.getElementById("modalPercentage").value = "";

  // Populate student dropdown with enrolled students not already having a record
  const existingIds = new Set(attendanceRecords.map(r => r.student?.studentId));
  const sel = document.getElementById("modalStudentSelect");
  sel.innerHTML = '<option value="">-- Select student --</option>';
  enrolledStudents.filter(s => !existingIds.has(s.studentId)).forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.studentId;
    opt.textContent = `${s.name} (${s.registerNumber})`;
    sel.appendChild(opt);
  });

  document.getElementById("attendanceModal").classList.add("open");
});

function openEdit(studentId, held, attended) {
  document.getElementById("modalTitle").textContent = "Edit Attendance";
  document.getElementById("modalMode").value = "edit";
  document.getElementById("studentSelectGroup").style.display = "none";
  document.getElementById("modalStudentId").value = studentId;
  document.getElementById("modalHeld").value = held;
  document.getElementById("modalAttended").value = attended;
  updatePercentagePreview();
  document.getElementById("attendanceModal").classList.add("open");
}

document.getElementById("modalCancelBtn").addEventListener("click", () => document.getElementById("attendanceModal").classList.remove("open"));
document.getElementById("attendanceModal").addEventListener("click", function(e) { if (e.target === this) this.classList.remove("open"); });

document.getElementById("modalSaveBtn").addEventListener("click", async () => {
  const mode = document.getElementById("modalMode").value;
  const held = parseInt(document.getElementById("modalHeld").value);
  const attended = parseInt(document.getElementById("modalAttended").value);

  if (isNaN(held) || held < 0) { showAlert("Classes held must be a non-negative number.", "error"); return; }
  if (isNaN(attended) || attended < 0) { showAlert("Classes attended must be a non-negative number.", "error"); return; }
  if (attended > held) { showAlert("Classes attended cannot exceed classes held.", "error"); return; }

  let studentId;
  if (mode === "add") {
    studentId = document.getElementById("modalStudentSelect").value;
    if (!studentId) { showAlert("Please select a student.", "error"); return; }
  } else {
    studentId = document.getElementById("modalStudentId").value;
  }

  const body = { classesHeld: held, classesAttended: attended };
  const url = `${BASE}/api/teacher-attendance/teacher/${teacherId}/course/${currentCourseId}/student/${studentId}`;
  const method = mode === "add" ? "POST" : "PUT";

  try {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || "Failed to save.", "error"); return; }
    document.getElementById("attendanceModal").classList.remove("open");
    showAlert(mode === "add" ? "Attendance added." : "Attendance updated.");
    await loadAttendance();
  } catch (e) {
    showAlert("Server error.", "error");
  }
});

async function deleteRecord(studentId, name) {
  if (!confirm(`Delete attendance record for "${name}"?`)) return;
  try {
    const res = await fetch(`${BASE}/api/teacher-attendance/teacher/${teacherId}/course/${currentCourseId}/student/${studentId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || "Failed to delete.", "error"); return; }
    showAlert("Attendance record deleted.");
    await loadAttendance();
  } catch (e) {
    showAlert("Server error.", "error");
  }
}

loadCourses();
