// Data soal. Nilai correct adalah indeks jawaban benar, dimulai dari 0.
const quizData = [
  { question: "Apa kepanjangan dari HTML?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Mode Language"], correct: 0, explanation: "HTML adalah bahasa markup untuk menyusun struktur halaman web." },
  { question: "CSS terutama digunakan untuk apa?", options: ["Mengelola database", "Mengatur tampilan halaman", "Menjalankan server", "Menyimpan password"], correct: 1, explanation: "CSS mengatur warna, tata letak, tipografi, dan tampilan halaman." },
  { question: "Method mana yang memilih elemen pertama yang cocok dengan selector CSS?", options: ["document.createElement()", "document.querySelector()", "document.append()", "document.getStorage()"], correct: 1, explanation: "querySelector() mengembalikan elemen pertama yang cocok atau null." },
  { question: "Event apa yang biasanya digunakan untuk menangani klik tombol?", options: ["submit", "keydown", "click", "loadstorage"], correct: 2, explanation: "Event click digunakan untuk merespons interaksi klik pada elemen." },
  { question: "Method apa yang lebih aman untuk menampilkan teks dari input pengguna?", options: ["innerHTML", "textContent", "document.write()", "eval()"], correct: 1, explanation: "textContent menampilkan input sebagai teks, bukan mem-parsingnya sebagai HTML." },
  { question: "Apa fungsi LocalStorage?", options: ["Menyimpan data string di browser agar tetap ada setelah browser ditutup", "Menghapus semua elemen HTML", "Mengirim email otomatis", "Mengganti fungsi CSS"], correct: 0, explanation: "LocalStorage menyimpan pasangan key-value berupa string di browser." },
  { question: "Apa tujuan event delegation?", options: ["Membuat setiap elemen wajib punya listener sendiri", "Menghapus semua event", "Menangani event elemen anak melalui listener pada elemen induk", "Memuat ulang halaman setiap kali diklik"], correct: 2, explanation: "Event delegation memanfaatkan event bubbling untuk menangani banyak elemen lewat listener pada parent." }
];

const questionEl = document.querySelector('#question');
const optionsEl = document.querySelector('#options');
const progressEl = document.querySelector('#progress');
const scoreLiveEl = document.querySelector('#score-live');
const progressBarEl = document.querySelector('#progress-bar');
const feedbackEl = document.querySelector('#feedback');
const nextBtn = document.querySelector('#next-btn');
const quizContentEl = document.querySelector('#quiz-content');
const resultEl = document.querySelector('#result');
const finalScoreEl = document.querySelector('#final-score');
const highScoreEl = document.querySelector('#high-score');
const resultMessageEl = document.querySelector('#result-message');
const restartBtn = document.querySelector('#restart-btn');

let currentQuestion = 0;
let score = 0;
let answered = false;

function getHighScore() {
  const value = Number.parseInt(localStorage.getItem('quizHighScore') || '0', 10);
  return Number.isFinite(value) ? value : 0;
}

function renderQuestion() {
  answered = false;
  const current = quizData[currentQuestion];
  progressEl.textContent = `Soal ${currentQuestion + 1}/${quizData.length}`;
  scoreLiveEl.textContent = `Skor: ${score}`;
  progressBarEl.style.width = `${(currentQuestion / quizData.length) * 100}%`;
  questionEl.textContent = current.question;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  optionsEl.replaceChildren();

  current.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('option-btn');
    button.dataset.index = String(index);
    button.textContent = option;
    optionsEl.append(button);
  });

  nextBtn.classList.add('hidden');
  nextBtn.textContent = currentQuestion === quizData.length - 1 ? 'Lihat hasil →' : 'Soal berikutnya →';
}

// Event delegation: satu listener menangani semua tombol pilihan yang dibuat dinamis.
optionsEl.addEventListener('click', (event) => {
  const button = event.target.closest('.option-btn');
  if (!button || !optionsEl.contains(button) || answered) return;
  answered = true;
  const selectedIndex = Number.parseInt(button.dataset.index, 10);
  const current = quizData[currentQuestion];

  optionsEl.querySelectorAll('.option-btn').forEach((optionButton) => {
    optionButton.disabled = true;
    if (Number.parseInt(optionButton.dataset.index, 10) === current.correct) optionButton.classList.add('correct');
  });

  if (selectedIndex === current.correct) {
    score += 1;
    feedbackEl.textContent = `Benar! ${current.explanation}`;
    feedbackEl.classList.add('good');
  } else {
    button.classList.add('wrong');
    feedbackEl.textContent = `Belum tepat. ${current.explanation}`;
    feedbackEl.classList.add('bad');
  }
  scoreLiveEl.textContent = `Skor: ${score}`;
  nextBtn.classList.remove('hidden');
});

nextBtn.addEventListener('click', () => {
  if (!answered) return;
  currentQuestion += 1;
  if (currentQuestion < quizData.length) renderQuestion();
  else showResult();
});

function showResult() {
  const percentage = Math.round((score / quizData.length) * 100);
  let highScore = getHighScore();
  let isNewRecord = false;
  if (percentage > highScore) {
    highScore = percentage;
    localStorage.setItem('quizHighScore', String(highScore));
    isNewRecord = true;
  }
  finalScoreEl.textContent = `${score}/${quizData.length} (${percentage}%)`;
  highScoreEl.textContent = `${highScore}%${isNewRecord ? ' 🎉 Rekor baru!' : ''}`;
  resultMessageEl.textContent = percentage === 100 ? 'Sempurna! Kamu menjawab semua soal dengan benar.' : percentage >= 70 ? 'Bagus! Terus berlatih agar pemahamanmu semakin kuat.' : 'Tetap semangat. Coba ulangi kuis dan pelajari kembali materi DOM & event handling.';
  progressBarEl.style.width = '100%';
  quizContentEl.classList.add('hidden');
  resultEl.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  answered = false;
  resultEl.classList.add('hidden');
  quizContentEl.classList.remove('hidden');
  renderQuestion();
});

renderQuestion();
