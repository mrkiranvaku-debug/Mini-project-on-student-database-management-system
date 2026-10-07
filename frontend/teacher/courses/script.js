const teacher = JSON.parse(localStorage.getItem("teacher"));
if (!teacher || !teacher.teacherId) window.location.href = "../../login/index.html";
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

let allCourses = [];
let departments = [];

async function loadDepartments() {
  try {
    const res = await fetch(`${BASE}/api/departments`);
    departments = await res.json();
    const sel = document.getElementById("modalDept");
    sel.innerHTML = '<option value="">-- Select department --</option>';
    departments.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.departmentId;
      opt.textContent = `${d.departmentCode} — ${d.departmentName}`;
      sel.appendChild(opt);
    });
  } catch (e) { console.error(e); }
}

async function loadCourses() {
  const tbody = document.getElementById("coursesBody");
  tbody.innerHTML = '<tr class="state-row"><td colspan="5">Loading…</td></tr>';
  try {
    const res = await fetch(`${BASE}/api/courses`);
    allCourses = await res.json();
    renderCourses(allCourses);
  } catch (e) {
    tbody.innerHTML = '<tr class="state-row"><td colspan="5">Error loading courses.</td></tr>';
  }
}

function renderCourses(list) {
  const tbody = document.getElementById("coursesBody");
  if (!list.length) {
    tbody.innerHTML = '<tr class="state-row"><td colspan="5">No courses found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(c => `<tr>
    <td><span class="badge badge-info">${c.courseCode}</span></td>
    <td>${c.courseName}</td>
    <td>${c.credits}</td>
    <td>${c.department ? c.department.departmentName : "—"}</td>
    <td><div class="action-group">
      <button class="btn btn-sm btn-primary" onclick="openEdit(${c.courseId},'${esc(c.courseCode)}','${esc(c.courseName)}',${c.credits},${c.department?.departmentId||''})">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteCourse(${c.courseId},'${esc(c.courseName)}')">Delete</button>
    </div></td>
  </tr>`).join("");
}

function esc(s) { return String(s).replace(/'/g,"\\'"); }

// Search
document.getElementById("searchInput").addEventListener("input", function() {
  const q = this.value.toLowerCase();
  renderCourses(allCourses.filter(c =>
    c.courseCode.toLowerCase().includes(q) || c.courseName.toLowerCase().includes(q)
  ));
});

// ADD
document.getElementById("addCourseBtn").addEventListener("click", () => {
  document.getElementById("modalTitle").textContent = "Add Course";
  document.getElementById("modalMode").value = "add";
  document.getElementById("modalCourseId").value = "";
  document.getElementById("modalCode").value = "";
  document.getElementById("modalName").value = "";
  document.getElementById("modalCredits").value = "";
  document.getElementById("modalDept").value = "";
  document.getElementById("courseModal").classList.add("open");
});

function openEdit(courseId, code, name, credits, deptId) {
  document.getElementById("modalTitle").textContent = "Edit Course";
  document.getElementById("modalMode").value = "edit";
  document.getElementById("modalCourseId").value = courseId;
  document.getElementById("modalCode").value = code;
  document.getElementById("modalName").value = name;
  document.getElementById("modalCredits").value = credits;
  document.getElementById("modalDept").value = deptId || "";
  document.getElementById("courseModal").classList.add("open");
}

document.getElementById("modalCancelBtn").addEventListener("click", () => document.getElementById("courseModal").classList.remove("open"));
document.getElementById("courseModal").addEventListener("click", function(e) { if (e.target === this) this.classList.remove("open"); });

document.getElementById("modalSaveBtn").addEventListener("click", async () => {
  const mode = document.getElementById("modalMode").value;
  const courseCode = document.getElementById("modalCode").value.trim();
  const courseName = document.getElementById("modalName").value.trim();
  const credits = parseInt(document.getElementById("modalCredits").value);
  const departmentId = document.getElementById("modalDept").value;

  if (!courseCode) { showAlert("Course code is required.", "error"); return; }
  if (!courseName) { showAlert("Course name is required.", "error"); return; }
  if (!credits || credits < 1) { showAlert("Credits must be at least 1.", "error"); return; }
  if (!departmentId) { showAlert("Please select a department.", "error"); return; }

  const body = { courseCode, courseName, credits, departmentId: parseInt(departmentId) };
  const courseId = document.getElementById("modalCourseId").value;
  const url = mode === "add" ? `${BASE}/api/courses` : `${BASE}/api/courses/${courseId}`;
  const method = mode === "add" ? "POST" : "PUT";

  try {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || "Failed to save.", "error"); return; }
    document.getElementById("courseModal").classList.remove("open");
    showAlert(mode === "add" ? "Course created." : "Course updated.");
    loadCourses();
  } catch (e) { showAlert("Server error.", "error"); }
});

async function deleteCourse(courseId, name) {
  if (!confirm(`Delete course "${name}"? This may fail if students are enrolled.`)) return;
  try {
    const res = await fetch(`${BASE}/api/courses/${courseId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || "Failed to delete.", "error"); return; }
    showAlert("Course deleted.");
    loadCourses();
  } catch (e) { showAlert("Server error.", "error"); }
}

loadDepartments();
loadCourses();
