(function () {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bgCanvas"), alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const geo = new THREE.BufferGeometry();
  const count = 5000;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 22;
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({ size: 0.012, color: "#8b5cf6" });
  const mesh = new THREE.Points(geo, mat);
  scene.add(mesh);
  camera.position.z = 5;

  (function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.0007;
    mesh.rotation.x += 0.0003;
    renderer.render(scene, camera);
  })();

  window.addEventListener("resize", () => {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  });
})();

setInterval(() => {
  document.getElementById("clock").textContent = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}, 1000);

window.addEventListener("scroll", () => {
  document.getElementById("scrollTop").classList.toggle("visible", scrollY > 300);
});

function showToast(msg, duration = 2800) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), duration);
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("btu_history") || "[]");
  } catch {
    return [];
  }
}
function saveHistory(roll) {
  let h = getHistory().filter((r) => r !== roll);
  h.unshift(roll);
  h = h.slice(0, 6);
  localStorage.setItem("btu_history", JSON.stringify(h));
  renderHistory();
}
function clearHistory() {
  localStorage.removeItem("btu_history");
  renderHistory();
}
function renderHistory() {
  const h = getHistory();
  const sec = document.getElementById("historySection");
  const chips = document.getElementById("historyChips");
  if (!h.length) {
    sec.style.display = "none";
    return;
  }
  sec.style.display = "flex";
  chips.innerHTML = h.map((r) => `<span class="history-chip" onclick="fillAndSearch('${r}')">${r}</span>`).join("");
}
function fillAndSearch(roll) {
  document.getElementById("roll").value = roll;
  getResult();
}
renderHistory();

function applyTilt(el) {
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "";
  });
}

function animateCounter(el, target) {
  const num = parseFloat(target);
  if (isNaN(num)) {
    el.textContent = target;
    return;
  }
  let start = 0;
  const step = num / 45;
  const update = () => {
    start = Math.min(start + step, num);
    el.textContent = start.toFixed(2);
    if (start < num) requestAnimationFrame(update);
    else el.textContent = num.toFixed(2);
  };
  update();
}

function gradeClass(g) {
  if (!g) return "";
  const map = { O: "grade-O", A: "grade-Ap", "A+": "grade-Ap", B: "grade-Bp", "B+": "grade-Bp", C: "grade-C", D: "grade-D", F: "grade-F", P: "grade-O" };
  return map[g] || "grade-B";
}

function shareResult() {
  const roll = document.getElementById("roll").value.trim();
  const url = `${location.href.split("?")[0]}?roll=${roll}`;
  if (navigator.share) {
    navigator.share({ title: "BTU Result", text: `Check result for ${roll}`, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => showToast("🔗 Link copied to clipboard!"));
  }
}

function copyRollNumber() {
  const roll = document.getElementById("roll").value.trim();
  navigator.clipboard.writeText(roll).then(() => showToast("📋 Roll number copied!"));
}

function scrollToSubjects() {
  document.getElementById("subjects-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function getResult() {
  const roll = document.getElementById("roll").value.trim();
  if (roll == "25ELDCS010") {
    showToast("⚠️ Access to this roll number is restricted");
    return;
  }
  const output = document.getElementById("output");
  const btn = document.getElementById("searchBtn");

  if (!roll) {
    showToast("⚠️ Please enter a roll number");
    return;
  }

  output.innerHTML = `
    <div class="loader">
      <div class="loader-ring"></div>
      <p class="loader-text">Fetching your result…</p>
    </div>`;
  document.getElementById("actionRow").classList.remove("visible");
  btn.textContent = "Searching…";
  btn.disabled = true;

  try {
    const res = await fetch("https://bturesult.moreproductive.in/api/result", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rollNumber: roll, examId: "main" }) });
    const data = await res.json();
    btn.textContent = "Search Result";
    btn.disabled = false;

    if (data.STATUS_CODE !== 200) {
      output.innerHTML = `
        <div class="error-box">
          <div class="err-icon">😕</div>
          <h3>Result Not Found</h3>
          <p>No record for roll number <strong>${roll}</strong>. Double-check and try again.</p>
        </div>`;
      return;
    }

    saveHistory(roll);
    renderResult(data.RESPONSE);
    document.getElementById("actionRow").classList.add("visible");
    showToast("✅ Result loaded successfully!");
  } catch (err) {
    btn.textContent = "Search Result";
    btn.disabled = false;
    output.innerHTML = `
      <div class="error-box">
        <div class="err-icon">⚡</div>
        <h3>Connection Error</h3>
        <p>Could not connect to the server. Please check your internet and try again.</p>
      </div>`;
    console.error(err);
  }
}

function renderResult(res) {
  const s = res.student;
  const cur = res.current_semester;
  const subs = cur.subjects || [];
  const prevSems = res.previous_semesters || [];

  const rows = subs
    .map((sub) => {
      const gc = gradeClass(sub.grade);
      const pct = (sub.total_obt != null && sub.total_max != null && parseFloat(sub.total_max) > 0) ? Math.round((parseFloat(sub.total_obt) / parseFloat(sub.total_max)) * 100) : null;
      return `
      <tr>
        <td><code style="color:#a78bfa;font-size:12px">${sub.code || "—"}</code></td>
        <td style="font-weight:600;max-width:220px">${sub.title || "—"}</td>
        <td style="text-align:center">${sub.creditPoint ?? "—"}</td>
        <td style="text-align:center">${sub.end_term_obt ?? "—"}</td>
        <td style="text-align:center">${sub.internal_obt ?? "—"}</td>
        <td style="text-align:center;font-weight:700">${sub.total_obt ?? "—"}</td>
        <td style="text-align:center">
          <span class="grade-pill ${gc}">${sub.grade || "—"}</span>
        </td>
        <td style="text-align:center">${sub.grade_point ?? "—"}</td>
        <td style="text-align:center">${sub.CPoint ?? "—"}</td>
        ${pct !== null
            ? `<td>
          <div style="font-size:12px;margin-bottom:4px;text-align:center">${pct}%</div>
          <div class="progress-bar" style="width:80px">
            <div class="progress-fill" style="width:${pct}%"></div>
          </div>
        </td>`
            : "<td>—</td>"}
      </tr>`;
    })
    .join("");

  const semCards = prevSems.length
    ? prevSems
        .map((sem, i) => `
    <div class="sem-box" style="animation-delay:${i * 0.08}s">
      <div class="sem-num">Semester ${sem.semester}</div>
      <div class="sem-sgpa" style="background:linear-gradient(135deg,#a78bfa,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${sem.sgpa}</div>
      <div class="sem-cgpa">CGPA: ${sem.cgpa}</div>
      <span class="badge ${sem.semester_status === "PASS" ? "pass" : "fail"}">${sem.semester_status}</span>
    </div>`)
        .join("")
    : `<p style="color:var(--muted);padding:14px">No previous semester history found.</p>`;

  const totalCP = subs.reduce((a, b) => a + (parseFloat(b.CPoint) || 0), 0);
  const totalCr = subs.reduce((a, b) => a + (parseFloat(b.creditPoint) || 0), 0);
  const calcSGPA = totalCr > 0 ? (totalCP / totalCr).toFixed(2) : cur.sgpa;

  const isPassed = cur.semester_status === "PASS";

  document.getElementById("output").innerHTML = `

    <div class="grid">
      <div class="card" style="animation-delay:.05s">
        <h3><span class="card-icon">👤</span> Student Information</h3>
        <div class="info"><span class="label">Name</span><span class="info-val">${s.StudentName || "—"}</span></div>
        <div class="info"><span class="label">Father's Name</span><span class="info-val">${s.father_name || "—"}</span></div>
        <div class="info"><span class="label">Mother's Name</span><span class="info-val">${s.mother_name || "—"}</span></div>
        <div class="info"><span class="label">Roll Number</span><span class="info-val">${s.RollNumber || "—"}</span></div>
        <div class="info"><span class="label">Enrollment</span><span class="info-val">${s.enrollment || "—"}</span></div>
        <div class="info"><span class="label">College</span><span class="info-val" style="max-width:200px;text-align:right">${s.college_name || "—"}</span></div>
        <div class="info"><span class="label">Branch</span><span class="info-val">${s.branch || "—"}</span></div>
      </div>

      <div class="card" style="animation-delay:.1s">
        <h3><span class="card-icon">🎓</span> Exam Information</h3>
        <div class="info"><span class="label">Course</span><span class="info-val">${s.courseName || "—"}</span></div>
        <div class="info"><span class="label">Semester</span><span class="info-val">${s.semesterRoman || "—"}</span></div>
        <div class="info"><span class="label">Examination</span><span class="info-val">${s.examination || "—"}</span></div>
        <div class="info"><span class="label">Declaration Date</span><span class="info-val">${s.DeclarationDate || "—"}</span></div>
        <div class="info"><span class="label">Category</span><span class="info-val">${s.Category || "—"}</span></div>
        <div class="info"><span class="label">Exam Type</span><span class="info-val">${s.examType || "—"}</span></div>
        <div class="info"><span class="label">Status</span>
          <span class="badge ${isPassed ? "pass" : "fail"}">${cur.semester_status}</span>
        </div>
      </div>
    </div>

    <div class="stats">
      <div class="stat" style="animation-delay:.15s">
        <div class="stat-icon">🏆</div>
        <h2 class="counter-cgpa" style="background:linear-gradient(135deg,#a78bfa,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent">0.00</h2>
        <p>Cumulative GPA</p>
      </div>
      <div class="stat" style="animation-delay:.2s">
        <div class="stat-icon">📈</div>
        <h2 style="background:linear-gradient(135deg,#06b6d4,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${cur.sgpa}</h2>
        <p>Semester GPA</p>
      </div>
      <div class="stat" style="animation-delay:.25s">
        <div class="stat-icon">📦</div>
        <h2 style="background:linear-gradient(135deg,#ec4899,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${res.total_credit_registered ?? totalCr}</h2>
        <p>Credits Registered</p>
      </div>
      <div class="stat" style="animation-delay:.3s">
        <div class="stat-icon">${isPassed ? "✅" : "❌"}</div>
        <h2 style="font-size:22px;padding-top:8px">
          <span class="badge ${isPassed ? "pass" : "fail"}" style="font-size:15px;padding:12px 24px">${cur.semester_status}</span>
        </h2>
        <p style="margin-top:10px">Semester Result</p>
      </div>
    </div>

    <div class="card table-card" id="subjects-section">
      <div class="table-header">
        <h3><span class="card-icon">📋</span> Subject-wise Marks</h3>
        <span style="font-size:13px;color:var(--muted)">${subs.length} subject${subs.length !== 1 ? "s" : ""}</span>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Subject</th>
              <th>Credits</th>
              <th>External</th>
              <th>Internal</th>
              <th>Total</th>
              <th>Grade</th>
              <th>Grade Pt.</th>
              <th>Credit Pt.</th>
              <th>Score %</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>

    <div class="card" style="animation-delay:.35s">
      <h3><span class="card-icon">📅</span> Semester History</h3>
      <div class="sem-grid">${semCards}</div>
    </div>
  `;

  const cgpaEl = document.querySelector(".counter-cgpa");
  if (cgpaEl) animateCounter(cgpaEl, res.cgpa || 0);

  document.querySelectorAll(".card,.stat").forEach(applyTilt);
}

document.getElementById("roll").addEventListener("keydown", (e) => {
  if (e.key === "Enter") getResult();
});

const urlRoll = new URLSearchParams(location.search).get("roll");
if (urlRoll) {
  document.getElementById("roll").value = urlRoll;
  getResult();
}