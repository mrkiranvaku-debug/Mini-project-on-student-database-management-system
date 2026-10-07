const teacher = JSON.parse(localStorage.getItem("teacher"));
if (!teacher || !teacher.teacherId) window.location.href = "../../login/index.html";
const teacherId = teacher.teacherId;
const BASE = "http://localhost:8080";

// Sidebar
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
document.getElementById("menuButton").addEventListener("click", () => { sidebar.classList.add("open"); overlay.classList.add("show"); });
document.getElementById("closeSidebar").addEventListener("click", () => { sidebar.classList.remove("open"); overlay.classList.remove("show"); });
overlay.addEventListener("click", () => { sidebar.classList.remove("open"); overlay.classList.remove("show"); });

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
let marksRecords = [];

// Grade helper
function calculateGrade(total) {
  if (total >= 90) return { grade: "S", gp: 10 };
  if (total >= 80) return { grade: "A", gp: 9 };
  if (total >= 70) return { grade: "B", gp: 8 };
  if (total >= 60) return { grade: "C", gp: 7 };
  if (total >= 50) return { grade: "D", gp: 6 };
  return { grade: "F", gp: 0 };
}

function updatePreview() {
  const internal = parseFloat(document.getElementById("modalInternal").value) || 0;
  const external = parseFloat(document.getElementById("modalExternal").value) || 0;
  const total = internal + external;
  const { grade } = calculateGrade(total);
  document.getElementById("modalTotal").value = total.toFixed(2);
  document.getElementById("modalGrade").value = grade;
}
document.getElementById("modalInternal").addEventListener("input", updatePreview);
document.getElementById("modalExternal").addEventListener("input", updatePreview);

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
  const section = document.getElementById("marksSection");
  const addBtn = document.getElementById("addMarksBtn");
  if (!currentCourseId) { section.style.display = "none"; addBtn.style.display = "none"; return; }
  section.style.display = "block"; addBtn.style.display = "";
  await loadEnrolledStudents();
  await loadMarks();
});

async function loadEnrolledStudents() {
  try {
    const res = await fetch(`${BASE}/api/teacher-enrollments/teacher/${teacherId}/course/${currentCourseId}/students`);
    enrolledStudents = await res.json();
  } catch (e) { enrolledStudents = []; }
}

async function loadMarks() {
  const tbody = document.getElementById("marksBody");
  tbody.innerHTML = '<tr class="state-row"><td colspan="8">Loading…</td></tr>';
  try {
    const res = await fetch(`${BASE}/api/teacher-marks/teacher/${teacherId}/course/${currentCourseId}`);
    if (!res.ok) throw new Error();
    marksRecords = await res.json();
    renderMarks();
  } catch (e) {
    tbody.innerHTML = '<tr class="state-row"><td colspan="8">Error loading marks.</td></tr>';
  }
}

function renderMarks() {
  const tbody = document.getElementById("marksBody");
  if (!marksRecords.length) {
    tbody.innerHTML = '<tr class="state-row"><td colspan="8">No marks records yet. Click "+ Add Marks" to begin.</td></tr>';
    return;
  }
  tbody.innerHTML = marksRecords.map(r => {
    const gp = parseFloat(r.gradePoint || 0);
    const badgeCls = r.grade === "F" ? "badge-danger" : gp >= 8 ? "badge-success" : "badge-warning";
    return `<tr>
      <td>${r.student ? r.student.name : "—"}</td>
      <td>${r.student ? r.student.registerNumber : "—"}</td>
      <td>${r.internalMarks}</td>
      <td>${r.externalMarks}</td>
      <td><strong>${r.totalMarks}</strong></td>
      <td><span class="badge ${badgeCls}">${r.grade}</span></td>
      <td>${r.gradePoint}</td>
      <td><div class="action-group">
        <button class="btn btn-sm btn-primary" onclick="openEdit(${r.student.studentId}, ${r.internalMarks}, ${r.externalMarks})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteMarks(${r.student.studentId}, '${(r.student.name||'').replace(/'/g,"\\'")}')">Delete</button>
      </div></td>
    </tr>`;
  }).join("");
}

// ADD
document.getElementById("addMarksBtn").addEventListener("click", () => {
  document.getElementById("modalTitle").textContent = "Add Marks";
  document.getElementById("modalMode").value = "add";
  document.getElementById("studentSelectGroup").style.display = "block";
  document.getElementById("modalStudentId").value = "";
  document.getElementById("modalInternal").value = "";
  document.getElementById("modalExternal").value = "";
  document.getElementById("modalTotal").value = "";
  document.getElementById("modalGrade").value = "";

  const existingIds = new Set(marksRecords.map(r => r.student?.studentId));
  const sel = document.getElementById("modalStudentSelect");
  sel.innerHTML = '<option value="">-- Select student --</option>';
  enrolledStudents.filter(s => !existingIds.has(s.studentId)).forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.studentId;
    opt.textContent = `${s.name} (${s.registerNumber})`;
    sel.appendChild(opt);
  });

  document.getElementById("marksModal").classList.add("open");
});

function openEdit(studentId, internal, external) {
  document.getElementById("modalTitle").textContent = "Edit Marks";
  document.getElementById("modalMode").value = "edit";
  document.getElementById("studentSelectGroup").style.display = "none";
  document.getElementById("modalStudentId").value = studentId;
  document.getElementById("modalInternal").value = internal;
  document.getElementById("modalExternal").value = external;
  updatePreview();
  document.getElementById("marksModal").classList.add("open");
}

document.getElementById("modalCancelBtn").addEventListener("click", () => document.getElementById("marksModal").classList.remove("open"));
document.getElementById("marksModal").addEventListener("click", function(e) { if (e.target === this) this.classList.remove("open"); });

document.getElementById("modalSaveBtn").addEventListener("click", async () => {
  const mode = document.getElementById("modalMode").value;
  const internal = parseFloat(document.getElementById("modalInternal").value);
  const external = parseFloat(document.getElementById("modalExternal").value);

  if (isNaN(internal) || internal < 0 || internal > 50) { showAlert("Internal marks must be 0–50.", "error"); return; }
  if (isNaN(external) || external < 0 || external > 50) { showAlert("External marks must be 0–50.", "error"); return; }

  let studentId;
  if (mode === "add") {
    studentId = document.getElementById("modalStudentSelect").value;
    if (!studentId) { showAlert("Please select a student.", "error"); return; }
  } else {
    studentId = document.getElementById("modalStudentId").value;
  }

  const body = { internalMarks: internal, externalMarks: external };
  const url = `${BASE}/api/teacher-marks/teacher/${teacherId}/course/${currentCourseId}/student/${studentId}`;
  const method = mode === "add" ? "POST" : "PUT";

  try {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || "Failed to save.", "error"); return; }
    document.getElementById("marksModal").classList.remove("open");
    showAlert(mode === "add" ? "Marks added." : "Marks updated.");
    await loadMarks();
  } catch (e) {
    showAlert("Server error.", "error");
  }
});

async function deleteMarks(studentId, name) {
  if (!confirm(`Delete marks for "${name}"?`)) return;
  try {
    const res = await fetch(`${BASE}/api/teacher-marks/teacher/${teacherId}/course/${currentCourseId}/student/${studentId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || "Failed to delete.", "error"); return; }
    showAlert("Marks deleted.");
    await loadMarks();
  } catch (e) {
    showAlert("Server error.", "error");
  }
}

loadCourses();
