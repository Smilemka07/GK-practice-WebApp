import { quiz } from './quizData.js';

// STATE
let current = 0;
let score = 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lang = "en";
let timeLeft = 15;
let timer;

// DOM CACHE (performance + clarity)
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const explanationEl = document.getElementById("explanation");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");
const streakEl = document.getElementById("streak");
const qnoEl = document.getElementById("qno");
const totalEl = document.getElementById("total");
const progressBar = document.getElementById("progressBar");
const langBtn = document.getElementById("langBtn");


// INIT
streakEl.innerText = streak;
totalEl.innerText = quiz.length;
langBtn.innerText = "हिं"; // default when lang = "en"

// LANGUAGE TOGGLE
function toggleLang() {
  document.querySelector(".quiz-box").classList.add("fade");

  setTimeout(() => {
    lang = lang === "en" ? "hi" : "en";
    langBtn.innerText = lang === "en" ? "🇮🇳 हिं" : "🌐 EN";
    langBtn.classList.toggle("active");
    loadQuestion();
    document.querySelector(".quiz-box").classList.remove("fade");
  }, 150);
}

// LOAD QUESTION
function loadQuestion() {
  resetTimer();
  explanationEl.innerText = "";
  nextBtn.style.display = "none";

  qnoEl.innerText = current + 1;

  const q = quiz[current];
  questionEl.innerText = q.q[lang];

 optionsEl.innerHTML = "";

q.options.forEach((opt, i) => {
  const btn = document.createElement("button");
  btn.innerText = opt[lang];

  btn.addEventListener("click", () => checkAnswer(i));

  optionsEl.appendChild(btn);
});

  updateProgress();
}

// TIMER
function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerEl.innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      checkAnswer(-1);
    }
  }, 1000);
}

// CHECK ANSWER
function checkAnswer(selected) {
  clearInterval(timer);

  const correct = quiz[current].answer;
  const buttons = document.querySelectorAll("#options button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add("correct");
    if (i === selected && i !== correct) btn.classList.add("wrong");
  });

  const isCorrect = selected === correct;

  if (isCorrect) {
    score++;
    streak++;
  } else {
    streak = 0;
  }

  localStorage.setItem("streak", streak);
  streakEl.innerText = streak;

  const messages = isCorrect
    ? ["Good!", "Nice!", "Keep going!", "Strong answer!"]
    : ["Focus!", "Revise this!", "Careful!", "Try again!"];

  const msg = messages[Math.floor(Math.random() * messages.length)];

  explanationEl.innerText =
    `${msg} → ${quiz[current].explanation[lang]}`;

  setTimeout(() => {
    nextBtn.style.display = "block";
  }, 500);
}

// NEXT BUTTON
nextBtn.onclick = () => {
  current++;

  if (current < quiz.length) {
    loadQuestion();
  } else {
    showResult();
  }
};

// PROGRESS BAR
function updateProgress() {
  const progress = (current / quiz.length) * 100;
  progressBar.style.width = progress + "%";
}

// RESULT SCREEN
function showResult() {
  document.querySelector(".quiz-box").innerHTML = `
    <div class="result">
      <h2>Your Score: ${score}/${quiz.length}</h2>
      <p>🔥 Streak: ${streak}</p>
      <button onclick="location.reload()">Play Again</button>
    </div>
  `;
}

window.toggleLang = toggleLang;

// START
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const quizApp = document.getElementById("quizApp");

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  quizApp.style.display = "block";

  loadQuestion(); // start quiz here
});