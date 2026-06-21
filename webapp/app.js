// Prava Bormi — Yo'l belgilari testi WebApp
const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

let QUESTIONS = [];
let lang = "uz_latin";
let idx = 0;
let score = 0;
let answered = false;
let startTime = 0;
let timerInterval = null;

const $ = (id) => document.getElementById(id);

// --- Savollarni yuklash ---
fetch("questions.json")
  .then(r => r.json())
  .then(data => {
    QUESTIONS = data.questions;
    $("q-count").textContent = QUESTIONS.length;
    $("score-max").textContent = QUESTIONS.length;
  })
  .catch(() => {
    $("subtitle") && ($("subtitle").textContent = "Savollarni yuklashda xatolik.");
  });

// --- Til tanlash ---
document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    lang = btn.dataset.lang;
  });
});

// --- Ekran almashtirish ---
function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $("screen-" + name).classList.add("active");
}

// --- Test boshlash ---
$("btn-start").addEventListener("click", () => {
  idx = 0; score = 0;
  startTime = Date.now();
  startTimer();
  showScreen("quiz");
  renderQuestion();
});

// --- Timer ---
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const s = Math.floor((Date.now() - startTime) / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    $("timer").textContent = `${mm}:${ss}`;
  }, 500);
}

// --- Savolni chizish ---
function renderQuestion() {
  answered = false;
  const q = QUESTIONS[idx];

  $("progress-text").textContent = `${idx + 1} / ${QUESTIONS.length}`;
  $("progress-fill").style.width = `${(idx / QUESTIONS.length) * 100}%`;

  $("sign-img").src = q.image;
  $("sign-img").onerror = () => { $("sign-img").style.opacity = .3; };
  $("question-text").textContent = q.q[lang];

  const optBox = $("options");
  optBox.innerHTML = "";
  q.options[lang].forEach((text, i) => {
    const b = document.createElement("button");
    b.className = "option";
    b.textContent = text;
    b.addEventListener("click", () => choose(i, b));
    optBox.appendChild(b);
  });

  $("feedback").hidden = true;
}

// --- Javob tanlash ---
function choose(chosen, btnEl) {
  if (answered) return;
  answered = true;
  const q = QUESTIONS[idx];
  const correct = q.correct;

  document.querySelectorAll(".option").forEach((el, i) => {
    el.classList.add("disabled");
    if (i === correct) el.classList.add("correct");
    if (i === chosen && chosen !== correct) el.classList.add("wrong");
  });

  if (chosen === correct) {
    score++;
    $("feedback-result").textContent = "✅ To'g'ri!";
  } else {
    $("feedback-result").textContent = "❌ Noto'g'ri";
  }
  $("feedback-explain").textContent = q.explanation[lang];
  $("feedback").hidden = false;
  $("progress-fill").style.width = `${((idx + 1) / QUESTIONS.length) * 100}%`;
}

// --- Keyingi savol ---
$("btn-next").addEventListener("click", () => {
  idx++;
  if (idx < QUESTIONS.length) {
    renderQuestion();
  } else {
    finish();
  }
});

// --- Natija ---
function finish() {
  clearInterval(timerInterval);
  const total = QUESTIONS.length;
  const pct = Math.round((score / total) * 100);

  $("score-num").textContent = score;
  $("score-max").textContent = total;

  let emoji, title, detail;
  if (pct >= 90)      { emoji = "🏆"; title = "A'lo natija!"; detail = "Imtihonga tayyorsiz. Shu zaylda davom eting."; }
  else if (pct >= 70) { emoji = "👍"; title = "Yaxshi!"; detail = "Yana bir oz mashq qilsangiz, natija mukammal bo'ladi."; }
  else                { emoji = "📚"; title = "Mashq kerak"; detail = "Belgilarni qaytadan ko'rib chiqing va testni takrorlang."; }

  $("result-emoji").textContent = emoji;
  $("result-title").textContent = title;
  $("result-detail").textContent = detail;
  showScreen("result");
}

// --- Qaytadan ---
$("btn-retry").addEventListener("click", () => {
  idx = 0; score = 0;
  startTime = Date.now();
  startTimer();
  showScreen("quiz");
  renderQuestion();
});

// --- Natijani botga yuborish ---
$("btn-send").addEventListener("click", () => {
  const payload = JSON.stringify({
    type: "quiz_result",
    category: "road_signs",
    score: score,
    total: QUESTIONS.length,
    seconds: Math.floor((Date.now() - startTime) / 1000)
  });
  if (tg) {
    tg.sendData(payload);
    tg.close();
  } else {
    alert("Bu funksiya faqat Telegram ichida ishlaydi.\n\n" + payload);
  }
});
