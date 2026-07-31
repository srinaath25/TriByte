// EduSphere - Connected to FastAPI + Supabase backend
const API_BASE = "http://localhost:8000";
// Keep track of conversation history across turns
let chatHistory = [];

// Optional: Reference to the current question object if your quiz page tracks it
let activeQuizQuestion = null; 

function toggleAIChat() {
  const win = document.getElementById('ai-chat-window');
  win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
}

async function sendStreamedMessage() {
  const inputEl = document.getElementById('ai-chat-input');
  const text = inputEl.value.trim();
  if (!text) return;

  // 1. Render User Message
  appendChatMessage('user', text);
  inputEl.value = '';

  // 2. Create empty bot bubble for streaming text insertion
  const botBubble = createEmptyBotBubble();

  try {
    const response = await fetch('http://localhost:8000/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: chatHistory,
        currentQuestion: activeQuizQuestion
      })
    });

    if (!response.ok) {
      botBubble.textContent = "Server error. Please check your backend logs.";
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullResponseText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode incoming chunk and append to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines from the buffer
      let lines = buffer.split('\n\n');
      // Keep the last incomplete fragment in the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('data: ')) {
          const rawData = trimmedLine.replace(/^data:\s*/, '').trim();

          if (rawData === '[DONE]') break;

          try {
            const parsed = JSON.parse(rawData);
            
            if (parsed.error) {
              botBubble.textContent = `Error: ${parsed.error}`;
              return;
            }

            if (parsed.text) {
              fullResponseText += parsed.text;
              // Replace "..." with the streamed text in real time
              botBubble.textContent = fullResponseText;
              scrollToBottom();
            }
          } catch (e) {
            console.error("JSON parse error on line:", rawData, e);
          }
        }
      }
    }

    // 3. Save to conversation history for multi-turn chat memory
    if (fullResponseText) {
      chatHistory.push({ role: 'user', parts: [{ text: text }] });
      chatHistory.push({ role: 'model', parts: [{ text: fullResponseText }] });
    }

  } catch (err) {
    console.error("Chat error:", err);
    botBubble.textContent = "Connection error. Please try again.";
  }
}
function appendChatMessage(sender, text) {
  const container = document.getElementById('ai-chat-messages');
  const wrapper = document.createElement('div');
  wrapper.style.textAlign = sender === 'user' ? 'right' : 'left';

  const bubble = document.createElement('div');
  bubble.style.cssText = `
    background: ${sender === 'user' ? '#4f46e5' : 'white'};
    color: ${sender === 'user' ? 'white' : '#1f2937'};
    padding: 8px 12px;
    border-radius: 8px;
    display: inline-block;
    max-width: 85%;
    text-align: left;
    border: ${sender === 'user' ? 'none' : '1px solid #e5e7eb'};
    word-break: break-word;
  `;
  bubble.textContent = text;

  wrapper.appendChild(bubble);
  container.appendChild(wrapper);
  scrollToBottom();
}

function createEmptyBotBubble() {
  const container = document.getElementById('ai-chat-messages');
  const wrapper = document.createElement('div');
  wrapper.style.textAlign = 'left';

  const bubble = document.createElement('div');
  bubble.style.cssText = `
    background: white;
    color: #1f2937;
    padding: 8px 12px;
    border-radius: 8px;
    display: inline-block;
    max-width: 85%;
    text-align: left;
    border: 1px solid #e5e7eb;
    white-space: pre-wrap;
    word-break: break-word;
  `;
  bubble.textContent = '...';

  wrapper.appendChild(bubble);
  container.appendChild(wrapper);
  scrollToBottom();
  return bubble;
}

function scrollToBottom() {
  const container = document.getElementById('ai-chat-messages');
  container.scrollTop = container.scrollHeight;
}

let state = {
  id: null,
  name: "",
  email: "",
  class: 10,
  access_token: null,
  subjects: ["math", "physics", "chemistry", "biology"],
  scores: { math: 0, physics: 0, chemistry: 0, biology: 0 },
  strengths: [],
  weaknesses: [],
  completedModules: [],
  xp: 0,
  streak: 0,
  lastVisit: null,
  badges: [],
  quizCorrect: 0,
  quizTotal: 0,
  currentQuestionIndex: 0,
  answers: {},
  diagnosticDone: false,
  diagQuestions: []
};

// ---------- SAVE / LOAD ----------
function saveState() {
  localStorage.setItem("edusphere_state", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("edusphere_state");
  if (saved) {
    try {
      state = { ...state, ...JSON.parse(saved) };
    } catch (e) {}
  }
  updateStreak();
}

function updateStreak() {
  const today = new Date().toDateString();
  if (state.lastVisit === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (state.lastVisit === yesterday.toDateString()) state.streak += 1;
  else state.streak = 1;
  state.lastVisit = today;
  saveState();
}

// ---------- BACKEND ----------
async function checkBackend() {
  try {
    const res = await fetch(API_BASE + "/health", { signal: AbortSignal.timeout(2500) });
    return res.ok;
  } catch {
    return false;
  }
}

async function updateBackendStatus() {
  const el = document.getElementById("backend-status");
  if (!el) return;
  const ok = await checkBackend();
  el.innerHTML = ok
    ? '<span class="text-emerald-600">Backend connected</span>'
    : '<span class="text-red-500">Backend offline — start uvicorn</span>';
}

// ---------- VIEW HELPERS ----------
function showView(viewId) {
  document.querySelectorAll('[id^="view-"]').forEach((el) => {
    el.classList.add("hidden-view");
    el.classList.remove("view");
  });
  const target = document.getElementById("view-" + viewId);
  if (target) {
    target.classList.remove("hidden-view");
    target.classList.add("view");
  }

  const nav = document.getElementById("main-nav");
  if (nav) {
    if (["dashboard", "module", "profile", "results"].includes(viewId)) nav.classList.remove("hidden");
    else nav.classList.add("hidden");
  }

  if (document.getElementById("nav-name")) document.getElementById("nav-name").textContent = state.name || "Student";
  if (document.getElementById("nav-xp")) document.getElementById("nav-xp").textContent = (state.xp || 0) + " XP";
  window.scrollTo(0, 0);
}

// ---------- AUTH ----------
function showAuthScreen() {
  showView("auth");
  switchAuthTab("login");
  updateBackendStatus();
}

function switchAuthTab(tab) {
  const login = document.getElementById("auth-login");
  const signup = document.getElementById("auth-signup");
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  if (!login || !signup) return;

  if (tab === "login") {
    login.classList.remove("hidden");
    signup.classList.add("hidden");
    if (tabLogin) tabLogin.className = "flex-1 py-2.5 rounded-lg text-sm font-semibold bg-white shadow text-violet-700";
    if (tabSignup) tabSignup.className = "flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-500";
  } else {
    signup.classList.remove("hidden");
    login.classList.add("hidden");
    if (tabSignup) tabSignup.className = "flex-1 py-2.5 rounded-lg text-sm font-semibold bg-white shadow text-violet-700";
    if (tabLogin) tabLogin.className = "flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-500";
  }
}

async function doLogin() {
  const email = (document.getElementById("login-email").value || "").trim();
  const password = document.getElementById("login-password").value || "";
  const err = document.getElementById("login-error");
  if (err) {
    err.classList.add("hidden");
    err.textContent = "";
  }

  if (!email || !password) {
    if (err) {
      err.textContent = "Enter email and password";
      err.classList.remove("hidden");
    }
    return;
  }

  try {
    const res = await fetch(API_BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");

    state.id = data.user_id;
    state.email = data.email;
    state.access_token = data.access_token;
    state.name = state.name || email.split("@")[0];
    saveState();
    showToast("Login successful!");
    startOnboarding();
  } catch (e) {
    if (err) {
      err.textContent = e.message || "Login failed";
      err.classList.remove("hidden");
    }
  }
}

async function doSignup() {
  const name = (document.getElementById("signup-name").value || "").trim();
  const email = (document.getElementById("signup-email").value || "").trim();
  const password = document.getElementById("signup-password").value || "";
  const classLevel = parseInt(document.getElementById("signup-class").value || "10");
  const err = document.getElementById("signup-error");
  if (err) {
    err.classList.add("hidden");
    err.textContent = "";
  }

  if (!name || !email || !password) {
    if (err) {
      err.textContent = "Fill all fields";
      err.classList.remove("hidden");
    }
    return;
  }
  if (password.length < 6) {
    if (err) {
      err.textContent = "Password must be at least 6 characters";
      err.classList.remove("hidden");
    }
    return;
  }

  try {
    const res = await fetch(API_BASE + "/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        full_name: name,
        class_level: classLevel
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Signup failed");

    // auto login
    try {
      const loginRes = await fetch(API_BASE + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        state.access_token = loginData.access_token;
        state.id = loginData.user_id;
      } else {
        state.id = data.user_id;
      }
    } catch (_) {
      state.id = data.user_id;
    }

    state.name = name;
    state.email = email;
    state.class = classLevel;
    saveState();
    showToast("Account created!");
    startOnboarding();
  } catch (e) {
    if (err) {
      err.textContent = e.message || "Signup failed";
      err.classList.remove("hidden");
    }
  }
}

function logout() {
  localStorage.removeItem("edusphere_state");
  state = {
    id: null, name: "", email: "", class: 10, access_token: null,
    subjects: ["math", "physics", "chemistry", "biology"],
    scores: { math: 0, physics: 0, chemistry: 0, biology: 0 },
    strengths: [], weaknesses: [], completedModules: [],
    xp: 0, streak: 0, lastVisit: null, badges: [],
    quizCorrect: 0, quizTotal: 0, currentQuestionIndex: 0,
    answers: {}, diagnosticDone: false, diagQuestions: []
  };
  showAuthScreen();
}

// ---------- ONBOARDING ----------
function startOnboarding() {
  showView("onboarding");
  nextOnboardStep(1);
  if (state.name && document.getElementById("user-name")) {
    document.getElementById("user-name").value = state.name;
  }
  selectClass(state.class || 10);
}

function selectClass(cls) {
  state.class = cls;
  document.querySelectorAll(".class-btn").forEach((btn) => {
    btn.classList.remove("border-violet-600", "bg-violet-50", "text-violet-700");
    btn.classList.add("border-slate-200");
    if (parseInt(btn.dataset.class) === cls) {
      btn.classList.add("border-violet-600", "bg-violet-50", "text-violet-700");
      btn.classList.remove("border-slate-200");
    }
  });
}

function nextOnboardStep(step) {
  [1, 2, 3].forEach((s) => {
    const el = document.getElementById("onboard-step-" + s);
    const dot = document.getElementById("step-" + s + "-dot");
    if (el) el.classList.add("hidden");
    if (dot) {
      dot.classList.remove("bg-violet-600");
      dot.classList.add("bg-slate-200");
    }
  });

  const stepEl = document.getElementById("onboard-step-" + step);
  const stepDot = document.getElementById("step-" + step + "-dot");
  if (stepEl) stepEl.classList.remove("hidden");
  if (stepDot) {
    stepDot.classList.add("bg-violet-600");
    stepDot.classList.remove("bg-slate-200");
  }

  if (step === 2) {
    const name = (document.getElementById("user-name")?.value || "").trim();
    if (!name) {
      showToast("Please enter your name");
      nextOnboardStep(1);
      return;
    }
    state.name = name;
    saveState();
  }

  if (step === 3) {
    const checks = document.querySelectorAll('#onboard-step-2 input[type="checkbox"]:checked');
    state.subjects = Array.from(checks).map((c) => c.value);
    if (state.subjects.length === 0) {
      showToast("Select at least one subject");
      nextOnboardStep(2);
      return;
    }
    const preview = document.getElementById("preview-name");
    if (preview) preview.textContent = state.name;
    saveState();
  }
}

function showDemo() {
  showToast("Scroll down to see subjects");
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}


// ---------- DIAGNOSTIC ----------
async function startDiagnostic() {
  showView("diagnostic");
  document.getElementById("question-container").innerHTML = "<p>Loading questions...</p>";

  try {
    const res = await fetch(API_BASE + "/questions/?class_level=" + state.class);
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to load questions");

    const allQuestions = data.questions || [];
    const relevant = allQuestions.filter((q) => state.subjects.includes(q.subject));

    state.diagQuestions = relevant.length ? relevant : allQuestions;
    state.currentQuestionIndex = 0;
    state.answers = {};

    if (!state.diagQuestions.length) {
      document.getElementById("question-container").innerHTML =
        "<p>No questions found for your class/subjects. Check that questions were seeded in Supabase.</p>";
      return;
    }

    renderQuestion();
  } catch (e) {
    document.getElementById("question-container").innerHTML =
      `<p style="color:red">Error loading questions: ${e.message}</p>`;
  }
}

function renderQuestion() {
  if (!state.diagQuestions.length) {
    document.getElementById("question-container").innerHTML = "<p>No questions loaded. Check data.js</p>";
    return;
  }
  const q = state.diagQuestions[state.currentQuestionIndex];
  const total = state.diagQuestions.length;
  document.getElementById("q-current").textContent = state.currentQuestionIndex + 1;
  document.getElementById("q-total").textContent = total;
  document.getElementById("diag-progress").style.width = (((state.currentQuestionIndex + 1) / total) * 100) + "%";

  const sub = SUBJECTS[q.subject];
  const selected = state.answers[q.id];

  document.getElementById("question-container").innerHTML = `
    <div class="flex items-center gap-2 mb-4">
      <span class="px-3 py-1 rounded-full text-xs font-semibold ${sub.bg} ${sub.text}">
        <i class="fas ${sub.icon} mr-1"></i> ${sub.name}
      </span>
    </div>
    <h2 class="text-xl font-semibold mb-6">${q.question}</h2>
    <div class="space-y-3">
      ${q.options.map((opt, i) => `
        <button onclick="selectOption('${q.id}', ${i})"
          class="option-btn w-full text-left px-5 py-3.5 rounded-xl border-2 transition font-medium
          ${selected === i ? "border-violet-500 bg-violet-50 text-violet-800" : "border-slate-200"}">
          <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-sm font-bold mr-3">${String.fromCharCode(65 + i)}</span>
          ${opt}
        </button>
      `).join("")}
    </div>
  `;

  document.getElementById("prev-q-btn").disabled = state.currentQuestionIndex === 0;
  const nextBtn = document.getElementById("next-q-btn");
  nextBtn.innerHTML = state.currentQuestionIndex === total - 1
    ? 'Finish <i class="fas fa-check ml-1"></i>'
    : 'Next <i class="fas fa-arrow-right ml-1"></i>';
}

function selectOption(qid, idx) {
  state.answers[qid] = idx;
  renderQuestion();
}

function prevQuestion() {
  if (state.currentQuestionIndex > 0) {
    state.currentQuestionIndex--;
    renderQuestion();
  }
}

function nextQuestion() {
  const q = state.diagQuestions[state.currentQuestionIndex];
  if (state.answers[q.id] === undefined) {
    showToast("Please select an answer");
    return;
  }
  if (state.currentQuestionIndex < state.diagQuestions.length - 1) {
    state.currentQuestionIndex++;
    renderQuestion();
  } else {
    finishDiagnostic();
  }
}

function finishDiagnostic() {
  const totals = { math: 0, physics: 0, chemistry: 0, biology: 0 };
  const correct = { math: 0, physics: 0, chemistry: 0, biology: 0 };

  state.diagQuestions.forEach((q) => {
    totals[q.subject]++;
    if (state.answers[q.id] === q.correct) correct[q.subject]++;
  });

  state.scores = {};
  state.subjects.forEach((s) => {
    state.scores[s] = totals[s] > 0 ? Math.round((correct[s] / totals[s]) * 100) : 50;
  });

  const sorted = Object.entries(state.scores)
    .filter(([s]) => state.subjects.includes(s))
    .sort((a, b) => b[1] - a[1]);

  state.strengths = sorted.filter(([, score]) => score >= 60).map(([s]) => s);
  state.weaknesses = sorted.filter(([, score]) => score < 60).map(([s]) => s);
  if (!state.strengths.length && sorted.length) state.strengths = [sorted[0][0]];
  if (!state.weaknesses.length && sorted.length > 1) state.weaknesses = [sorted[sorted.length - 1][0]];

  state.diagnosticDone = true;
  state.xp += 30;
  saveState();
  showResults();
}

// ---------- RESULTS ----------
function showResults() {
  showView("results");

  const strEl = document.getElementById("strengths-list");
  strEl.innerHTML = state.strengths.length
    ? state.strengths.map((s) => {
        const sub = SUBJECTS[s];
        return `<div class="flex items-center gap-3 p-3 rounded-xl ${sub.bg}">
          <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center ${sub.text}"><i class="fas ${sub.icon}"></i></div>
          <div class="flex-1"><div class="font-semibold">${sub.name}</div><div class="text-sm opacity-80">${state.scores[s]}% mastery</div></div>
        </div>`;
      }).join("")
    : "<p class='text-slate-500'>Keep practicing!</p>";

  const weakEl = document.getElementById("weaknesses-list");
  weakEl.innerHTML = state.weaknesses.length
    ? state.weaknesses.map((s) => {
        const sub = SUBJECTS[s];
        return `<div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div class="w-10 h-10 rounded-lg ${sub.bg} flex items-center justify-center ${sub.text}"><i class="fas ${sub.icon}"></i></div>
          <div class="flex-1"><div class="font-semibold">${sub.name}</div><div class="text-sm text-slate-500">${state.scores[s]}% — ready to grow</div></div>
        </div>`;
      }).join("")
    : "<p class='text-emerald-600 font-medium'>Strong across the board!</p>";

  let insight = "We'll create personalized bridges between what you know and what you're learning.";
  if (state.strengths.length && state.weaknesses.length) {
    insight = `We'll use your <strong>${SUBJECTS[state.strengths[0]].name}</strong> strength to unlock <strong>${SUBJECTS[state.weaknesses[0]].name}</strong> concepts!`;
  }
  document.getElementById("cross-insight").innerHTML = insight;
  renderRadar();
}

function renderRadar() {
  const ctx = document.getElementById("radar-chart");
  if (!ctx || typeof Chart === "undefined") return;
  if (window.radarChart) window.radarChart.destroy();
  window.radarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: state.subjects.map((s) => SUBJECTS[s].name),
      datasets: [{
        label: "Mastery %",
        data: state.subjects.map((s) => state.scores[s] || 0),
        backgroundColor: "rgba(109, 40, 217, 0.2)",
        borderColor: "rgb(109, 40, 217)",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: { r: { beginAtZero: true, max: 100, ticks: { display: false } } },
      plugins: { legend: { display: false } }
    }
  });
}

// ---------- DASHBOARD ----------
function goToDashboard() {
  showView("dashboard");
  renderDashboard();
}

function renderDashboard() {
  document.getElementById("dash-name").textContent = state.name || "Student";
  document.getElementById("dash-class").textContent = state.class || 10;
  document.getElementById("streak").textContent = state.streak || 0;
  document.getElementById("total-xp").textContent = state.xp || 0;

  let rec = "Explore any module below to start building connections.";
  if (state.weaknesses.length && state.strengths.length) {
    const mod = MODULES.find((m) =>
      state.weaknesses.includes(m.weakSubject) &&
      state.strengths.includes(m.strongSubject) &&
      !state.completedModules.includes(m.id)
    );
    if (mod) {
      rec = `Start with <strong>"${mod.title}"</strong> — uses your ${SUBJECTS[mod.strongSubject].name} strength to master ${SUBJECTS[mod.weakSubject].name}.`;
    }
  }
  document.getElementById("rec-path").innerHTML = rec;

  const grid = document.getElementById("modules-grid");
  grid.innerHTML = MODULES.map((mod) => {
    const done = state.completedModules.includes(mod.id);
    const weak = SUBJECTS[mod.weakSubject];
    const strong = SUBJECTS[mod.strongSubject];
    return `<div class="glass rounded-2xl p-5 card-hover cursor-pointer border ${done ? "border-emerald-200" : "border-transparent"}" onclick="openModule('${mod.id}')">
      <div class="flex items-start justify-between mb-3">
        <div class="flex -space-x-2">
          <div class="w-9 h-9 rounded-lg ${weak.bg} flex items-center justify-center ${weak.text} text-sm border-2 border-white"><i class="fas ${weak.icon}"></i></div>
          <div class="w-9 h-9 rounded-lg ${strong.bg} flex items-center justify-center ${strong.text} text-sm border-2 border-white"><i class="fas ${strong.icon}"></i></div>
        </div>
        ${done ? '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Done</span>' : `<span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">${mod.xp} XP</span>`}
      </div>
      <h3 class="font-bold mb-1">${mod.title}</h3>
      <p class="text-sm text-slate-500 mb-3">${mod.description}</p>
      <div class="flex items-center gap-3 text-xs text-slate-400">
        <span><i class="fas fa-clock mr-1"></i>${mod.duration}</span>
        <span>${mod.difficulty}</span>
      </div>
    </div>`;
  }).join("");

  document.getElementById("stat-modules").textContent = state.completedModules.length;
  const acc = state.quizTotal > 0 ? Math.round((state.quizCorrect / state.quizTotal) * 100) : 0;
  document.getElementById("stat-accuracy").textContent = acc + "%";
  document.getElementById("stat-topics").textContent = state.completedModules.length;
  document.getElementById("stat-badges").textContent = state.badges.length;
}

// ---------- MODULE ----------
function openModule(modId) {
  const mod = MODULES.find((m) => m.id === modId);
  if (!mod) return;
  showView("module");
  const weak = SUBJECTS[mod.weakSubject];
  const strong = SUBJECTS[mod.strongSubject];
  const quiz = mod.content.quiz;

  const sectionsHtml = mod.content.sections.map((sec, i) => `
    <div class="mb-6">
      <h3 class="font-display font-bold text-lg mb-2 flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm">${i + 1}</span>
        ${sec.heading}
      </h3>
      <div class="text-slate-700 leading-relaxed whitespace-pre-line pl-9">${sec.body}</div>
    </div>
  `).join("");

  document.getElementById("module-content").innerHTML = `
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <span class="px-3 py-1 rounded-full text-xs font-semibold ${weak.bg} ${weak.text}">Learning: ${weak.name}</span>
      <span class="text-slate-400"><i class="fas fa-arrow-right"></i></span>
      <span class="px-3 py-1 rounded-full text-xs font-semibold ${strong.bg} ${strong.text}">via ${strong.name}</span>
    </div>
    <h1 class="font-display text-2xl font-bold mb-2">${mod.title}</h1>
    <p class="text-slate-600 mb-6">${mod.content.intro}</p>
    <div class="border-t border-slate-100 pt-6">${sectionsHtml}</div>
    <div class="mt-8 p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-cyan-50 border border-violet-100">
      <h3 class="font-display font-bold text-lg mb-3">Quick Check</h3>
      <p class="font-medium mb-4">${quiz.question}</p>
      <div class="space-y-2 mb-4">
        ${quiz.options.map((opt, i) => `
          <button onclick="answerModuleQuiz('${mod.id}', ${i})" class="module-opt w-full text-left px-4 py-3 rounded-xl border-2 border-slate-200 font-medium text-sm">${opt}</button>
        `).join("")}
      </div>
      <div id="quiz-feedback" class="hidden mt-3 p-3 rounded-xl text-sm"></div>
    </div>
    <div class="mt-6 flex justify-end">
      <button id="complete-mod-btn" onclick="completeModule('${mod.id}')" class="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold" ${state.completedModules.includes(mod.id) ? "" : "disabled"}>
        ${state.completedModules.includes(mod.id) ? "Already Completed" : "Mark as Complete"}
      </button>
    </div>
  `;
  window.currentModuleQuiz = { modId, answered: false, correct: false };
}

function answerModuleQuiz(modId, selectedIdx) {
  if (window.currentModuleQuiz?.answered) return;
  const mod = MODULES.find((m) => m.id === modId);
  const quiz = mod.content.quiz;
  const isCorrect = selectedIdx === quiz.correct;
  window.currentModuleQuiz = { modId, answered: true, correct: isCorrect };

  document.querySelectorAll(".module-opt").forEach((btn, i) => {
    btn.disabled = true;
    if (i === quiz.correct) btn.classList.add("border-emerald-500", "bg-emerald-50");
    else if (i === selectedIdx && !isCorrect) btn.classList.add("border-red-400", "bg-red-50");
  });

  const feedback = document.getElementById("quiz-feedback");
  feedback.classList.remove("hidden");
  if (isCorrect) {
    feedback.className = "mt-3 p-3 rounded-xl text-sm bg-emerald-50 text-emerald-800";
    feedback.innerHTML = `<strong>Correct!</strong> ${quiz.explanation}`;
    state.quizCorrect++;
  } else {
    feedback.className = "mt-3 p-3 rounded-xl text-sm bg-amber-50 text-amber-800";
    feedback.innerHTML = quiz.explanation;
  }
  state.quizTotal++;
  document.getElementById("complete-mod-btn").disabled = false;
  saveState();
}

function completeModule(modId) {
  if (state.completedModules.includes(modId)) {
    showToast("Already completed");
    return;
  }
  const mod = MODULES.find((m) => m.id === modId);
  state.completedModules.push(modId);
  state.xp += mod.xp;
  if (!state.badges.includes("first-step") && state.completedModules.length === 1) state.badges.push("first-step");
  saveState();
  showToast("+" + mod.xp + " XP");
  setTimeout(goToDashboard, 800);
}

// ---------- PROFILE ----------
function renderProfile() {
  document.getElementById("profile-name").value = state.name || "";
  document.getElementById("profile-class").value = state.class || 10;
  document.getElementById("profile-subjects").innerHTML = Object.values(SUBJECTS).map((sub) => `
    <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer">
      <input type="checkbox" value="${sub.id}" class="w-5 h-5" ${state.subjects.includes(sub.id) ? "checked" : ""}>
      <div class="w-9 h-9 rounded-lg ${sub.bg} flex items-center justify-center ${sub.text}"><i class="fas ${sub.icon}"></i></div>
      <span class="font-medium">${sub.name}</span>
    </label>
  `).join("");
}

function saveProfile() {
  const name = document.getElementById("profile-name").value.trim();
  if (!name) return showToast("Name required");
  state.name = name;
  state.class = parseInt(document.getElementById("profile-class").value);
  state.subjects = Array.from(document.querySelectorAll('#profile-subjects input:checked')).map((c) => c.value);
  if (!state.subjects.length) return showToast("Select at least one subject");
  saveState();
  showToast("Saved");
  document.getElementById("nav-name").textContent = state.name;
}

function retakeDiagnostic() {
  if (confirm("Retake diagnostic?")) startDiagnostic();
}

function resetAll() {
  if (confirm("Clear all local data?")) {
    localStorage.removeItem("edusphere_state");
    location.reload();
  }
}

// ---------- TOAST ----------
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  document.getElementById("toast-msg").textContent = msg;
  toast.classList.remove("opacity-0", "pointer-events-none");
  toast.classList.add("opacity-100");
  setTimeout(() => {
    toast.classList.add("opacity-0", "pointer-events-none");
    toast.classList.remove("opacity-100");
  }, 2500);
}

// patch showView for profile render
const _showView = showView;
showView = function (viewId) {
  _showView(viewId);
  if (viewId === "profile") renderProfile();
  if (viewId === "dashboard") renderDashboard();
};

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", function () {
  loadState();
  if (state.access_token && state.id && state.diagnosticDone) {
    showView("dashboard");
    renderDashboard();
  } else if (state.access_token && state.id) {
    startOnboarding();
  } else {
    showView("landing");
  }
});

fetch("http://localhost:8000/subjects")
  .then(res => res.json())
  .then(data => {
    console.log(data);
    // then update the HTML with this data
  });
