const teacher = JSON.parse(localStorage.getItem("teacher"));
if (!teacher || !teacher.teacherId) window.location.href = "../../login/index.html";
const BASE = "http://localhost:8080";

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
document.getElementById("menuButton").addEventListener("click", () => { sidebar.classList.add("open"); overlay.classList.add("show"); });
document.getElementById("closeSidebar").addEventListener("click", () => { sidebar.classList.remove("open"); overlay.classList.remove("show"); });
overlay.addEventListener("click", () => { sidebar.classList.remove("open"); overlay.classList.remove("show"); });

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

let allDepts = [];

async function loadDepartments() {
  const tbody = document.getElementById("deptsBody");
  tbody.innerHTML = '<tr class="state-row"><td colspan="3">Loading…</td></tr>';
  try {
    const res = await fetch(`${BASE}/api/departments`);
    allDepts = await res.json();
    renderDepts(allDepts);
  } catch (e) {
    tbody.innerHTML = '<tr class="state-row"><td colspan="3">Error loading departments.</td></tr>';
  }
}

function renderDepts(list) {
  const tbody = document.getElementById("deptsBody");
  if (!list.length) {
    tbody.innerHTML = '<tr class="state-row"><td colspan="3">No departments found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(d => `<tr>
    <td><span class="badge badge-info">${d.departmentCode}</span></td>
    <td>${d.departmentName}</td>
    <td><div class="action-group">
      <button class="btn btn-sm btn-primary" onclick="openEdit(${d.departmentId},'${esc(d.departmentCode)}','${esc(d.departmentName)}')">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteDept(${d.departmentId},'${esc(d.departmentName)}')">Delete</button>
    </div></td>
  </tr>`).join("");
}

function esc(s) { return String(s).replace(/'/g,"\\'"); }

document.getElementById("searchInput").addEventListener("input", function() {
  const q = this.value.toLowerCase();
  renderDepts(allDepts.filter(d =>
    d.departmentCode.toLowerCase().includes(q) || d.departmentName.toLowerCase().includes(q)
  ));
});

document.getElementById("addDeptBtn").addEventListener("click", () => {
  document.getElementById("modalTitle").textContent = "Add Department";
  document.getElementById("modalMode").value = "add";
  document.getElementById("modalDeptId").value = "";
  document.getElementById("modalCode").value = "";
  document.getElementById("modalName").value = "";
  document.getElementById("deptModal").classList.add("open");
});

function openEdit(deptId, code, name) {
  document.getElementById("modalTitle").textContent = "Edit Department";
  document.getElementById("modalMode").value = "edit";
  document.getElementById("modalDeptId").value = deptId;
  document.getElementById("modalCode").value = code;
  document.getElementById("modalName").value = name;
  document.getElementById("deptModal").classList.add("open");
}

document.getElementById("modalCancelBtn").addEventListener("click", () => document.getElementById("deptModal").classList.remove("open"));
document.getElementById("deptModal").addEventListener("click", function(e) { if (e.target === this) this.classList.remove("open"); });

document.getElementById("modalSaveBtn").addEventListener("click", async () => {
  const mode = document.getElementById("modalMode").value;
  const departmentCode = document.getElementById("modalCode").value.trim();
  const departmentName = document.getElementById("modalName").value.trim();

  if (!departmentCode) { showAlert("Department code is required.", "error"); return; }
  if (!departmentName) { showAlert("Department name is required.", "error"); return; }

  const body = { departmentCode, departmentName };
  const deptId = document.getElementById("modalDeptId").value;
  const url = mode === "add" ? `${BASE}/api/departments` : `${BASE}/api/departments/${deptId}`;
  const method = mode === "add" ? "POST" : "PUT";

  try {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || "Failed to save.", "error"); return; }
    document.getElementById("deptModal").classList.remove("open");
    showAlert(mode === "add" ? "Department created." : "Department updated.");
    loadDepartments();
  } catch (e) { showAlert("Server error.", "error"); }
});

async function deleteDept(deptId, name) {
  if (!confirm(`Delete department "${name}"? This may fail if courses are assigned to it.`)) return;
  try {
    const res = await fetch(`${BASE}/api/departments/${deptId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { showAlert(data.message || "Failed to delete.", "error"); return; }
    showAlert("Department deleted.");
    loadDepartments();
  } catch (e) { showAlert("Server error.", "error"); }
}

loadDepartments();
