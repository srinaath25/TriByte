// EduSphere - Main Application Logic

// ========== STATE ==========
let state = {
  name: '',
  class: 10,
  subjects: ['math', 'physics', 'chemistry', 'biology'],
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
  diagnosticDone: false
};

// ========== PERSISTENCE ==========
function loadState() {
  const saved = localStorage.getItem('edusphere_state');
  if (saved) {
    state = { ...state, ...JSON.parse(saved) };
  }
  updateStreak();
}

function saveState() {
  localStorage.setItem('edusphere_state', JSON.stringify(state));
}

function updateStreak() {
  const today = new Date().toDateString();
  if (state.lastVisit === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (state.lastVisit === yesterday.toDateString()) {
    state.streak += 1;
  } else if (state.lastVisit !== today) {
    state.streak = 1;
  }
  state.lastVisit = today;
  saveState();
}

// ========== VIEW MANAGEMENT ==========
function showView(viewId) {
  document.querySelectorAll('[id^="view-"]').forEach(el => {
    el.classList.add('hidden-view');
    el.classList.remove('view');
  });
  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.classList.remove('hidden-view');
    target.classList.add('view');
  }
  
  const nav = document.getElementById('main-nav');
  if (['dashboard', 'module', 'profile', 'results'].includes(viewId)) {
    nav.classList.remove('hidden');
  } else {
    nav.classList.add('hidden');
  }
  
  // Update nav
  document.getElementById('nav-name').textContent = state.name || 'Student';
  document.getElementById('nav-xp').textContent = `${state.xp} XP`;
  
  window.scrollTo(0, 0);
}

// ========== LANDING & ONBOARDING ==========
function startOnboarding() {
  showView('onboarding');
  nextOnboardStep(1);
}

function selectClass(cls) {
  state.class = cls;
  document.querySelectorAll('.class-btn').forEach(btn => {
    btn.classList.remove('border-violet-600', 'bg-violet-50', 'text-violet-700');
    btn.classList.add('border-slate-200');
    if (parseInt(btn.dataset.class) === cls) {
      btn.classList.add('border-violet-600', 'bg-violet-50', 'text-violet-700');
      btn.classList.remove('border-slate-200');
    }
  });
}

function nextOnboardStep(step) {
  // Hide all steps
  [1,2,3].forEach(s => {
    document.getElementById(`onboard-step-${s}`).classList.add('hidden');
    document.getElementById(`step-${s}-dot`).classList.remove('bg-violet-600');
    document.getElementById(`step-${s}-dot`).classList.add('bg-slate-200');
  });
  
  document.getElementById(`onboard-step-${step}`).classList.remove('hidden');
  document.getElementById(`step-${step}-dot`).classList.add('bg-violet-600');
  document.getElementById(`step-${step}-dot`).classList.remove('bg-slate-200');
  
  if (step === 1) {
    // Preselect class
    selectClass(state.class || 10);
  }
  
  if (step === 2) {
    // Save name
    const name = document.getElementById('user-name').value.trim();
    if (!name) {
      showToast('Please enter your name');
      nextOnboardStep(1);
      return;
    }
    state.name = name;
  }
  
  if (step === 3) {
    // Collect subjects
    const checks = document.querySelectorAll('#onboard-step-2 input[type="checkbox"]:checked');
    state.subjects = Array.from(checks).map(c => c.value);
    if (state.subjects.length === 0) {
      showToast('Select at least one subject');
      nextOnboardStep(2);
      return;
    }
    document.getElementById('preview-name').textContent = state.name;
  }
}

function showDemo() {
  showToast('Scroll down to see the subjects we cover!');
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ========== DIAGNOSTIC ==========
function startDiagnostic() {
  // Get class-appropriate questions (Class 9/10/11/12 have different difficulty)
  const classQuestions = getQuestionsForClass(state.class);
  // Filter to selected subjects
  const relevant = classQuestions.filter(q => state.subjects.includes(q.subject));
  // Fallback if somehow empty
  state.diagQuestions = relevant.length >= 4 ? relevant : classQuestions;
  state.currentQuestionIndex = 0;
  state.answers = {};
  showView('diagnostic');
  renderQuestion();
}

function renderQuestion() {
  const q = state.diagQuestions[state.currentQuestionIndex];
  const total = state.diagQuestions.length;
  document.getElementById('q-current').textContent = state.currentQuestionIndex + 1;
  document.getElementById('q-total').textContent = total;
  document.getElementById('diag-progress').style.width = `${((state.currentQuestionIndex + 1) / total) * 100}%`;
  
  const sub = SUBJECTS[q.subject];
  const selected = state.answers[q.id];
  
  document.getElementById('question-container').innerHTML = `
    <div class="flex items-center gap-2 mb-4">
      <span class="px-3 py-1 rounded-full text-xs font-semibold ${sub.bg} ${sub.text}">
        <i class="fas ${sub.icon} mr-1"></i> ${sub.name}
      </span>
    </div>
    <h2 class="text-xl font-semibold mb-6 leading-relaxed">${q.question}</h2>
    <div class="space-y-3">
      ${q.options.map((opt, i) => `
        <button onclick="selectOption('${q.id}', ${i})" 
          class="option-btn w-full text-left px-5 py-3.5 rounded-xl border-2 transition font-medium
          ${selected === i ? 'border-violet-500 bg-violet-50 text-violet-800' : 'border-slate-200 hover:border-violet-300'}">
          <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-sm font-bold mr-3">${String.fromCharCode(65+i)}</span>
          ${opt}
        </button>
      `).join('')}
    </div>
  `;
  
  // Buttons
  document.getElementById('prev-q-btn').disabled = state.currentQuestionIndex === 0;
  const nextBtn = document.getElementById('next-q-btn');
  if (state.currentQuestionIndex === total - 1) {
    nextBtn.innerHTML = 'Finish <i class="fas fa-check ml-1"></i>';
  } else {
    nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right ml-1"></i>';
  }
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
    showToast('Please select an answer');
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
  // Calculate scores
  const totals = { math: 0, physics: 0, chemistry: 0, biology: 0 };
  const correct = { math: 0, physics: 0, chemistry: 0, biology: 0 };
  
  state.diagQuestions.forEach(q => {
    totals[q.subject]++;
    if (state.answers[q.id] === q.correct) {
      correct[q.subject]++;
    }
  });
  
  state.scores = {};
  state.subjects.forEach(s => {
    state.scores[s] = totals[s] > 0 ? Math.round((correct[s] / totals[s]) * 100) : 50;
  });
  
  // Determine strengths & weaknesses
  const sorted = Object.entries(state.scores)
    .filter(([s]) => state.subjects.includes(s))
    .sort((a, b) => b[1] - a[1]);
  
  state.strengths = sorted.filter(([, score]) => score >= 60).map(([s]) => s);
  state.weaknesses = sorted.filter(([, score]) => score < 60).map(([s]) => s);
  
  // If all strong or all weak, force some variety
  if (state.strengths.length === 0 && sorted.length > 0) {
    state.strengths = [sorted[0][0]];
    state.weaknesses = sorted.slice(1).map(([s]) => s);
  }
  if (state.weaknesses.length === 0 && sorted.length > 1) {
    state.weaknesses = [sorted[sorted.length - 1][0]];
  }
  
  state.diagnosticDone = true;
  state.xp += 30; // Bonus for completing diagnostic
  saveState();
  
  showResults();
}

// ========== RESULTS ==========
function showResults() {
  showView('results');
  
  // Strengths
  const strEl = document.getElementById('strengths-list');
  if (state.strengths.length === 0) {
    strEl.innerHTML = '<p class="text-slate-500">Keep practicing — strengths will emerge!</p>';
  } else {
    strEl.innerHTML = state.strengths.map(s => {
      const sub = SUBJECTS[s];
      return `
        <div class="flex items-center gap-3 p-3 rounded-xl ${sub.bg}">
          <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center ${sub.text}">
            <i class="fas ${sub.icon}"></i>
          </div>
          <div class="flex-1">
            <div class="font-semibold">${sub.name}</div>
            <div class="text-sm opacity-80">${state.scores[s]}% mastery</div>
          </div>
          <i class="fas fa-check-circle text-emerald-500"></i>
        </div>
      `;
    }).join('');
  }
  
  // Weaknesses
  const weakEl = document.getElementById('weaknesses-list');
  if (state.weaknesses.length === 0) {
    weakEl.innerHTML = '<p class="text-slate-500 text-emerald-600 font-medium">Amazing! You\'re strong across the board.</p>';
  } else {
    weakEl.innerHTML = state.weaknesses.map(s => {
      const sub = SUBJECTS[s];
      return `
        <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div class="w-10 h-10 rounded-lg ${sub.bg} flex items-center justify-center ${sub.text}">
            <i class="fas ${sub.icon}"></i>
          </div>
          <div class="flex-1">
            <div class="font-semibold">${sub.name}</div>
            <div class="text-sm text-slate-500">${state.scores[s]}% — ready to grow</div>
          </div>
          <i class="fas fa-arrow-up text-violet-500"></i>
        </div>
      `;
    }).join('');
  }
  
  // Cross insight
  let insight = 'We\'ll create personalized bridges between what you know and what you\'re learning.';
  if (state.strengths.length && state.weaknesses.length) {
    const strong = SUBJECTS[state.strengths[0]].name;
    const weak = SUBJECTS[state.weaknesses[0]].name;
    insight = `We'll use your <strong>${strong}</strong> strength to unlock <strong>${weak}</strong> concepts through real-world connections and analogies that actually stick!`;
  }
  document.getElementById('cross-insight').innerHTML = insight;
  
  // Radar chart
  renderRadar();
}

function renderRadar() {
  const ctx = document.getElementById('radar-chart');
  if (!ctx) return;
  
  // Destroy previous if exists
  if (window.radarChart) window.radarChart.destroy();
  
  const labels = state.subjects.map(s => SUBJECTS[s].name);
  const data = state.subjects.map(s => state.scores[s] || 0);
  
  window.radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: 'Mastery %',
        data,
        backgroundColor: 'rgba(109, 40, 217, 0.2)',
        borderColor: 'rgb(109, 40, 217)',
        pointBackgroundColor: 'rgb(109, 40, 217)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(109, 40, 217)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 20, display: false },
          pointLabels: { font: { size: 13, weight: '600' } }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// ========== DASHBOARD ==========
function goToDashboard() {
  showView('dashboard');
  renderDashboard();
}

function renderDashboard() {
  document.getElementById('dash-name').textContent = state.name;
  document.getElementById('dash-class').textContent = state.class;
  document.getElementById('streak').textContent = state.streak;
  document.getElementById('total-xp').textContent = state.xp;
  
  // Recommended path
  let rec = 'Explore any module below to start building connections.';
  if (state.weaknesses.length && state.strengths.length) {
    const mod = MODULES.find(m => 
      state.weaknesses.includes(m.weakSubject) && 
      state.strengths.includes(m.strongSubject) &&
      !state.completedModules.includes(m.id) &&
      (!m.minClass || m.minClass <= state.class)
    );
    if (mod) {
      rec = `Start with <strong>"${mod.title}"</strong> — it uses your ${SUBJECTS[mod.strongSubject].name} strength to master ${SUBJECTS[mod.weakSubject].name}.`;
    }
  }
  document.getElementById('rec-path').innerHTML = rec;
  
  // Modules
  const grid = document.getElementById('modules-grid');
  // Filter & prioritize: prefer modules suitable for student's class + matching strengths/weaknesses
  const prioritized = [...MODULES]
    .filter(m => !m.minClass || m.minClass <= state.class)
    .sort((a, b) => {
      const aMatch = (state.weaknesses.includes(a.weakSubject) ? 2 : 0) + 
                     (state.strengths.includes(a.strongSubject) ? 1 : 0) +
                     (a.minClass >= 11 && state.class >= 11 ? 1 : 0);
      const bMatch = (state.weaknesses.includes(b.weakSubject) ? 2 : 0) + 
                     (state.strengths.includes(b.strongSubject) ? 1 : 0) +
                     (b.minClass >= 11 && state.class >= 11 ? 1 : 0);
      return bMatch - aMatch;
    });
  
  grid.innerHTML = prioritized.map(mod => {
    const done = state.completedModules.includes(mod.id);
    const weak = SUBJECTS[mod.weakSubject];
    const strong = SUBJECTS[mod.strongSubject];
    return `
      <div class="glass rounded-2xl p-5 card-hover cursor-pointer border ${done ? 'border-emerald-200 bg-emerald-50/50' : 'border-transparent'}"
           onclick="openModule('${mod.id}')">
        <div class="flex items-start justify-between mb-3">
          <div class="flex -space-x-2">
            <div class="w-9 h-9 rounded-lg ${weak.bg} flex items-center justify-center ${weak.text} text-sm border-2 border-white">
              <i class="fas ${weak.icon}"></i>
            </div>
            <div class="w-9 h-9 rounded-lg ${strong.bg} flex items-center justify-center ${strong.text} text-sm border-2 border-white">
              <i class="fas ${strong.icon}"></i>
            </div>
          </div>
          ${done ? '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold"><i class="fas fa-check mr-1"></i>Done</span>' : 
                   `<span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">${mod.xp} XP</span>`}
        </div>
        <h3 class="font-bold mb-1 leading-snug">${mod.title}</h3>
        <p class="text-sm text-slate-500 mb-3 line-clamp-2">${mod.description}</p>
        <div class="flex items-center gap-3 text-xs text-slate-400">
          <span><i class="fas fa-clock mr-1"></i>${mod.duration}</span>
          <span><i class="fas fa-signal mr-1"></i>${mod.difficulty}</span>
        </div>
      </div>
    `;
  }).join('');
  
  // Stats
  document.getElementById('stat-modules').textContent = state.completedModules.length;
  const acc = state.quizTotal > 0 ? Math.round((state.quizCorrect / state.quizTotal) * 100) : 0;
  document.getElementById('stat-accuracy').textContent = acc + '%';
  document.getElementById('stat-topics').textContent = state.completedModules.length;
  document.getElementById('stat-badges').textContent = state.badges.length;
}

// ========== MODULE VIEW ==========
function openModule(modId) {
  const mod = MODULES.find(m => m.id === modId);
  if (!mod) return;
  
  showView('module');
  const weak = SUBJECTS[mod.weakSubject];
  const strong = SUBJECTS[mod.strongSubject];
  
  let sectionsHtml = mod.content.sections.map((sec, i) => `
    <div class="mb-6">
      <h3 class="font-display font-bold text-lg mb-2 flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm">${i+1}</span>
        ${sec.heading}
      </h3>
      <div class="text-slate-700 leading-relaxed whitespace-pre-line pl-9">${sec.body}</div>
    </div>
  `).join('');
  
  const quiz = mod.content.quiz;
  
  document.getElementById('module-content').innerHTML = `
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <span class="px-3 py-1 rounded-full text-xs font-semibold ${weak.bg} ${weak.text}">
        Learning: ${weak.name}
      </span>
      <span class="text-slate-400"><i class="fas fa-arrow-right"></i></span>
      <span class="px-3 py-1 rounded-full text-xs font-semibold ${strong.bg} ${strong.text}">
        via ${strong.name}
      </span>
      <span class="ml-auto text-sm text-slate-500">${mod.duration} · ${mod.xp} XP</span>
    </div>
    
    <h1 class="font-display text-2xl sm:text-3xl font-bold mb-2">${mod.title}</h1>
    <p class="text-slate-600 mb-6">${mod.content.intro}</p>
    
    <div class="border-t border-slate-100 pt-6">
      ${sectionsHtml}
    </div>
    
    <div class="mt-8 p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-cyan-50 border border-violet-100">
      <h3 class="font-display font-bold text-lg mb-3 flex items-center gap-2">
        <i class="fas fa-question-circle text-violet-600"></i> Quick Check
      </h3>
      <p class="font-medium mb-4">${quiz.question}</p>
      <div class="space-y-2 mb-4" id="module-quiz-options">
        ${quiz.options.map((opt, i) => `
          <button onclick="answerModuleQuiz('${mod.id}', ${i})" 
            class="module-opt w-full text-left px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-violet-300 transition font-medium text-sm"
            data-idx="${i}">
            ${opt}
          </button>
        `).join('')}
      </div>
      <div id="quiz-feedback" class="hidden mt-3 p-3 rounded-xl text-sm"></div>
    </div>
    
    <div class="mt-6 flex justify-end">
      <button id="complete-mod-btn" onclick="completeModule('${mod.id}')" 
        class="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition disabled:opacity-50"
        ${state.completedModules.includes(mod.id) ? '' : 'disabled'}>
        ${state.completedModules.includes(mod.id) ? 'Already Completed ✓' : 'Mark as Complete'}
      </button>
    </div>
  `;
  
  // Store current quiz answer state
  window.currentModuleQuiz = { modId, answered: false, correct: false };
}

function answerModuleQuiz(modId, selectedIdx) {
  if (window.currentModuleQuiz.answered) return;
  
  const mod = MODULES.find(m => m.id === modId);
  const quiz = mod.content.quiz;
  const isCorrect = selectedIdx === quiz.correct;
  
  window.currentModuleQuiz.answered = true;
  window.currentModuleQuiz.correct = isCorrect;
  
  // Update UI
  document.querySelectorAll('.module-opt').forEach((btn, i) => {
    btn.disabled = true;
    if (i === quiz.correct) {
      btn.classList.add('correct', 'border-emerald-500', 'bg-emerald-50');
    } else if (i === selectedIdx && !isCorrect) {
      btn.classList.add('wrong', 'border-red-400', 'bg-red-50');
    }
  });
  
  const feedback = document.getElementById('quiz-feedback');
  feedback.classList.remove('hidden');
  if (isCorrect) {
    feedback.className = 'mt-3 p-3 rounded-xl text-sm bg-emerald-50 text-emerald-800 border border-emerald-200';
    feedback.innerHTML = `<i class="fas fa-check-circle mr-1"></i> <strong>Correct!</strong> ${quiz.explanation}`;
    state.quizCorrect++;
  } else {
    feedback.className = 'mt-3 p-3 rounded-xl text-sm bg-amber-50 text-amber-800 border border-amber-200';
    feedback.innerHTML = `<i class="fas fa-lightbulb mr-1"></i> ${quiz.explanation}`;
  }
  state.quizTotal++;
  
  // Enable complete button
  document.getElementById('complete-mod-btn').disabled = false;
  
  saveState();
}

function completeModule(modId) {
  if (state.completedModules.includes(modId)) {
    showToast('Already completed!');
    return;
  }
  
  const mod = MODULES.find(m => m.id === modId);
  state.completedModules.push(modId);
  state.xp += mod.xp;
  
  // Badges
  if (state.completedModules.length === 1 && !state.badges.includes('first-step')) {
    state.badges.push('first-step');
    showToast('🏅 Badge unlocked: First Step!');
  }
  if (!state.badges.includes('cross-thinker')) {
    state.badges.push('cross-thinker');
  }
  if (window.currentModuleQuiz?.correct && !state.badges.includes('quiz-master')) {
    state.badges.push('quiz-master');
    showToast('🏅 Badge unlocked: Quiz Master!');
  }
  
  saveState();
  showToast(`+${mod.xp} XP · Module completed!`);
  
  setTimeout(() => {
    goToDashboard();
  }, 1200);
}

// ========== PROFILE ==========
function renderProfile() {
  document.getElementById('profile-name').value = state.name;
  document.getElementById('profile-class').value = state.class;
  
  const container = document.getElementById('profile-subjects');
  container.innerHTML = Object.values(SUBJECTS).map(sub => `
    <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-violet-300 transition">
      <input type="checkbox" value="${sub.id}" class="w-5 h-5 rounded text-violet-600" 
        ${state.subjects.includes(sub.id) ? 'checked' : ''}>
      <div class="w-9 h-9 rounded-lg ${sub.bg} flex items-center justify-center ${sub.text}">
        <i class="fas ${sub.icon}"></i>
      </div>
      <span class="font-medium">${sub.name}</span>
    </label>
  `).join('');
}

// Override showView for profile
const originalShowView = showView;
showView = function(viewId) {
  originalShowView(viewId);
  if (viewId === 'profile') renderProfile();
  if (viewId === 'dashboard') renderDashboard();
};

function saveProfile() {
  const name = document.getElementById('profile-name').value.trim();
  if (!name) {
    showToast('Name cannot be empty');
    return;
  }
  state.name = name;
  state.class = parseInt(document.getElementById('profile-class').value);
  
  const checks = document.querySelectorAll('#profile-subjects input[type="checkbox"]:checked');
  state.subjects = Array.from(checks).map(c => c.value);
  if (state.subjects.length === 0) {
    showToast('Select at least one subject');
    return;
  }
  
  saveState();
  showToast('Preferences saved!');
  document.getElementById('nav-name').textContent = state.name;
}

function retakeDiagnostic() {
  if (confirm('Retake the diagnostic? Your previous scores will be updated.')) {
    startDiagnostic();
  }
}

function resetAll() {
  if (confirm('This will erase all progress and start fresh. Continue?')) {
    localStorage.removeItem('edusphere_state');
    location.reload();
  }
}

// ========== TOAST ==========
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.remove('opacity-0', 'pointer-events-none');
  toast.classList.add('opacity-100');
  setTimeout(() => {
    toast.classList.add('opacity-0', 'pointer-events-none');
    toast.classList.remove('opacity-100');
  }, 2800);
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  
  if (state.diagnosticDone && state.name) {
    showView('dashboard');
    renderDashboard();
  } else {
    showView('landing');
  }
});
