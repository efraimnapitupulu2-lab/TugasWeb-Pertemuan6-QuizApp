// ============================================================================
// JS Sprint — Interactive Quiz App
// Tugas Rutin 6 — Pemrograman Web
// Fitur: render via createElement/textContent, event delegation, skor otomatis,
// high score (localStorage), navigasi SPA tanpa reload, feedback visual,
// tombol restart, timer per soal, progress bar, kategori random, dark mode.
// ============================================================================

const QUESTION_TIME = 20; // detik per soal
const TOTAL_QUESTIONS = 10;
const HIGH_SCORE_KEY = "jsSprintHighScore";
const THEME_KEY = "jsSprintTheme";

// --------------------------------------------------------------------------
// Bank soal (lebih dari TOTAL_QUESTIONS agar bisa diacak / dipilih random)
// --------------------------------------------------------------------------
const QUESTION_BANK = [
  {
    category: "Dasar JavaScript",
    question: "Apa hasil dari `typeof null` pada JavaScript?",
    options: ["\"null\"", "\"object\"", "\"undefined\"", "\"number\""],
    correctIndex: 1,
  },
  {
    category: "Dasar JavaScript",
    question: "Manakah deklarasi variabel yang nilainya tidak dapat diubah (immutable binding)?",
    options: ["var x = 1;", "let x = 1;", "const x = 1;", "x = 1;"],
    correctIndex: 2,
  },
  {
    category: "Dasar JavaScript",
    question: "Apa output dari `console.log(2 + \"2\")`?",
    options: ["4", "\"22\"", "NaN", "Error"],
    correctIndex: 1,
  },
  {
    category: "Dasar JavaScript",
    question: "Method array mana yang mengembalikan array baru berisi elemen yang lolos suatu kondisi?",
    options: ["map()", "filter()", "forEach()", "reduce()"],
    correctIndex: 1,
  },
  {
    category: "Dasar JavaScript",
    question: "Bagaimana cara menuliskan arrow function tanpa parameter yang mengembalikan angka 5?",
    options: ["function() => 5", "() => 5", "() -> 5", "=> 5"],
    correctIndex: 1,
  },
  {
    category: "DOM & Event",
    question: "Method mana yang digunakan untuk membuat elemen HTML baru secara dinamis?",
    options: ["document.createElement()", "document.newElement()", "document.addElement()", "document.buildElement()"],
    correctIndex: 0,
  },
  {
    category: "DOM & Event",
    question: "Properti mana yang aman digunakan untuk mengubah teks di dalam elemen tanpa risiko XSS?",
    options: ["innerHTML", "outerHTML", "textContent", "innerText.html"],
    correctIndex: 2,
  },
  {
    category: "DOM & Event",
    question: "Teknik menempelkan satu event listener pada elemen induk untuk menangani event dari elemen anak disebut?",
    options: ["Event bubbling", "Event delegation", "Event capturing", "Event propagation"],
    correctIndex: 1,
  },
  {
    category: "DOM & Event",
    question: "Method apa yang menghentikan event agar tidak diteruskan ke elemen induk?",
    options: ["event.preventDefault()", "event.stopPropagation()", "event.stopImmediate()", "event.cancel()"],
    correctIndex: 1,
  },
  {
    category: "DOM & Event",
    question: "Apa fungsi utama `addEventListener` dibandingkan `onclick`?",
    options: [
      "Bisa menambahkan lebih dari satu handler pada elemen yang sama",
      "Berjalan lebih cepat",
      "Hanya bekerja pada tombol",
      "Otomatis mencegah reload halaman",
    ],
    correctIndex: 0,
  },
  {
    category: "Asynchronous JS",
    question: "Apa yang dikembalikan oleh sebuah fungsi `async`?",
    options: ["Callback", "Promise", "Generator", "Observable"],
    correctIndex: 1,
  },
  {
    category: "Asynchronous JS",
    question: "Kata kunci apa yang digunakan untuk menunggu sebuah Promise selesai di dalam fungsi async?",
    options: ["wait", "await", "defer", "pause"],
    correctIndex: 1,
  },
  {
    category: "Asynchronous JS",
    question: "Method Promise mana yang menjalankan beberapa Promise sekaligus dan menunggu semuanya selesai?",
    options: ["Promise.race()", "Promise.any()", "Promise.all()", "Promise.resolve()"],
    correctIndex: 2,
  },
  {
    category: "Asynchronous JS",
    question: "Bagian JavaScript yang bertugas menjalankan callback asynchronous setelah call stack kosong disebut?",
    options: ["Heap", "Event loop", "Compiler", "Garbage collector"],
    correctIndex: 1,
  },
  {
    category: "Asynchronous JS",
    question: "API bawaan browser untuk mengambil data dari server secara asynchronous adalah?",
    options: ["fetch()", "require()", "importData()", "getRequest()"],
    correctIndex: 0,
  },
];

// --------------------------------------------------------------------------
// State aplikasi
// --------------------------------------------------------------------------
const state = {
  questions: [],
  currentIndex: 0,
  score: 0,
  timer: null,
  timeLeft: QUESTION_TIME,
  questionTimes: [],
  locked: false,
};

// --------------------------------------------------------------------------
// Util
// --------------------------------------------------------------------------
const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const pickQuestions = () => shuffle(QUESTION_BANK).slice(0, TOTAL_QUESTIONS);

const getHighScore = () => Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);

const setHighScoreIfNeeded = (score) => {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
    return true;
  }
  return false;
};

// --------------------------------------------------------------------------
// Elemen DOM
// --------------------------------------------------------------------------
const screens = {
  start: document.getElementById("screen-start"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
};

const el = {
  startBtn: document.getElementById("startBtn"),
  restartBtn: document.getElementById("restartBtn"),
  categoryChips: document.getElementById("categoryChips"),
  startHighScore: document.getElementById("startHighScore"),
  progressFill: document.getElementById("progressFill"),
  questionCount: document.getElementById("questionCount"),
  questionCategory: document.getElementById("questionCategory"),
  questionText: document.getElementById("questionText"),
  answers: document.getElementById("answers"),
  liveScore: document.getElementById("liveScore"),
  timerRing: document.getElementById("timerRing"),
  timerCircle: document.getElementById("timerCircle"),
  timerLabel: document.getElementById("timerLabel"),
  resultScore: document.getElementById("resultScore"),
  resultMessage: document.getElementById("resultMessage"),
  resultBadge: document.getElementById("resultBadge"),
  statScore: document.getElementById("statScore"),
  statHighScore: document.getElementById("statHighScore"),
  statTime: document.getElementById("statTime"),
  themeToggle: document.getElementById("themeToggle"),
};

const CIRCLE_CIRCUMFERENCE = 119.4; // 2 * PI * r(19), dibulatkan

// --------------------------------------------------------------------------
// Navigasi SPA (tanpa reload)
// --------------------------------------------------------------------------
function showScreen(name) {
  Object.entries(screens).forEach(([key, node]) => {
    node.hidden = key !== name;
  });
}

// --------------------------------------------------------------------------
// Render kategori pada start screen
// --------------------------------------------------------------------------
function renderCategoryChips() {
  const categories = [...new Set(QUESTION_BANK.map((q) => q.category))];
  el.categoryChips.textContent = "";
  categories.forEach((cat) => {
    const chip = document.createElement("span");
    chip.className = "category-chip";
    chip.textContent = cat;
    el.categoryChips.appendChild(chip);
  });
}

function renderStartHighScore() {
  const hs = getHighScore();
  el.startHighScore.textContent =
    hs > 0 ? `Skor tertinggi kamu saat ini: ${hs}/${TOTAL_QUESTIONS}` : "Belum ada skor tersimpan. Jadilah yang pertama!";
}

// --------------------------------------------------------------------------
// Mulai kuis
// --------------------------------------------------------------------------
function startQuiz() {
  state.questions = pickQuestions();
  state.currentIndex = 0;
  state.score = 0;
  state.questionTimes = [];
  showScreen("quiz");
  renderQuestion();
}

// --------------------------------------------------------------------------
// Render soal saat ini
// --------------------------------------------------------------------------
function renderQuestion() {
  state.locked = false;
  const q = state.questions[state.currentIndex];
  const questionNumber = state.currentIndex + 1;

  el.questionCount.textContent = `Soal ${questionNumber}/${state.questions.length}`;
  el.questionCategory.textContent = q.category;
  el.questionText.textContent = q.question;
  el.liveScore.textContent = String(state.score);

  const progressPercent = (state.currentIndex / state.questions.length) * 100;
  el.progressFill.style.width = `${progressPercent}%`;

  el.answers.textContent = "";
  q.options.forEach((optionText, index) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.type = "button";
    btn.dataset.index = String(index);
    btn.setAttribute("role", "listitem");
    btn.style.animationDelay = `${index * 0.05}s`;
    btn.textContent = optionText;
    el.answers.appendChild(btn);
  });

  startTimer();
}

// --------------------------------------------------------------------------
// Timer per soal (lingkaran countdown)
// --------------------------------------------------------------------------
function startTimer() {
  clearInterval(state.timer);
  state.timeLeft = QUESTION_TIME;
  updateTimerUI();
  el.timerRing.classList.remove("is-urgent");

  state.timer = setInterval(() => {
    state.timeLeft -= 1;
    updateTimerUI();

    if (state.timeLeft <= 5) {
      el.timerRing.classList.add("is-urgent");
    }
    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      handleAnswer(null); // waktu habis dianggap tidak menjawab
    }
  }, 1000);
}

function updateTimerUI() {
  el.timerLabel.textContent = String(Math.max(state.timeLeft, 0));
  const fraction = state.timeLeft / QUESTION_TIME;
  el.timerCircle.style.strokeDashoffset = String(CIRCLE_CIRCUMFERENCE * (1 - fraction));
}

// --------------------------------------------------------------------------
// Event delegation: satu listener untuk semua tombol jawaban
// --------------------------------------------------------------------------
el.answers.addEventListener("click", (event) => {
  const target = event.target.closest(".answer-btn");
  if (!target || state.locked) return;
  handleAnswer(Number(target.dataset.index));
});

function handleAnswer(selectedIndex) {
  if (state.locked) return;
  state.locked = true;
  clearInterval(state.timer);

  const timeUsed = QUESTION_TIME - Math.max(state.timeLeft, 0);
  state.questionTimes.push(timeUsed);

  const q = state.questions[state.currentIndex];
  const buttons = [...el.answers.querySelectorAll(".answer-btn")];

  buttons.forEach((btn) => {
    btn.disabled = true;
    const idx = Number(btn.dataset.index);
    if (idx === q.correctIndex) {
      btn.classList.add("is-correct");
    } else if (idx === selectedIndex) {
      btn.classList.add("is-wrong");
    }
  });

  if (selectedIndex === q.correctIndex) {
    state.score += 1;
    el.liveScore.textContent = String(state.score);
  }

  setTimeout(goToNextQuestion, 900);
}

function goToNextQuestion() {
  const isLastQuestion = state.currentIndex === state.questions.length - 1;
  if (isLastQuestion) {
    el.progressFill.style.width = "100%";
    setTimeout(finishQuiz, 250);
    return;
  }
  state.currentIndex += 1;
  renderQuestion();
}

// --------------------------------------------------------------------------
// Selesai kuis -> tampilkan hasil
// --------------------------------------------------------------------------
function finishQuiz() {
  clearInterval(state.timer);
  const total = state.questions.length;
  const isNewHighScore = setHighScoreIfNeeded(state.score);
  const avgTime =
    state.questionTimes.reduce((sum, t) => sum + t, 0) / (state.questionTimes.length || 1);

  el.resultBadge.textContent = isNewHighScore ? "Skor tertinggi baru!" : "Selesai!";
  el.resultScore.textContent = `${state.score} / ${total}`;
  el.resultMessage.textContent = getResultMessage(state.score, total);
  el.statScore.textContent = String(state.score);
  el.statHighScore.textContent = String(getHighScore());
  el.statTime.textContent = `${avgTime.toFixed(1)}s`;

  showScreen("result");
}

function getResultMessage(score, total) {
  const ratio = score / total;
  if (ratio === 1) return "Sempurna! Pemahaman JavaScript kamu sangat solid.";
  if (ratio >= 0.7) return "Bagus! Tinggal sedikit lagi menuju penguasaan penuh.";
  if (ratio >= 0.4) return "Lumayan, coba pelajari lagi bagian yang masih meleset.";
  return "Jangan menyerah — ulangi materinya lalu coba lagi.";
}

// --------------------------------------------------------------------------
// Restart
// --------------------------------------------------------------------------
el.restartBtn.addEventListener("click", () => {
  showScreen("start");
  renderStartHighScore();
});

el.startBtn.addEventListener("click", startQuiz);

// --------------------------------------------------------------------------
// Dark / light mode toggle (persisted)
// --------------------------------------------------------------------------
function applyTheme(theme) {
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) applyTheme(saved);
}

el.themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentlyDark = current === "dark" || (!current && prefersDark);
  const next = currentlyDark ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

// --------------------------------------------------------------------------
// Inisialisasi
// --------------------------------------------------------------------------
function init() {
  initTheme();
  renderCategoryChips();
  renderStartHighScore();
  showScreen("start");
}

init();
