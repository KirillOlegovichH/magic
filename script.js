const answers = [
  "Да!",
  "Нет",
  "Возможно...",
  "Скорее всего)",
  "Точно нет!",
  "Определенно да!",
  "Сомневаюсь..",
  "Не могу сказать сейчас",
  "Спроси позже",
  "Очень вероятно!",
  "Очень маловероятно(",
  "Шансы есть!",
  "Никаких шансов",
  "Будет непросто",
  "Лучше не рисковать!",
  "Ты знаешь ответ сам...",
  "Судьба благоприятствует",
  "Судьба против!",
  "Абсолютно!",
  "Категорически нет!",
  "Жди неожиданного поворота".
  "Не сегодня",
  "Не искушай судьбу",
  "Да. Но нет",
  "Возможно, но не факт",
  "Не сейчас...",
  "Жди",
  "Бухай!",
];

const canvas = document.getElementById('magic-ball');
const ctx = canvas.getContext('2d');
const answerEl = document.getElementById('answer');
const btn = document.getElementById('predict-btn');

function resizeCanvas() {
  // 90vw, но не больше 400px, и квадрат
  const size = Math.min(window.innerWidth * 0.9, 400);
  canvas.width = size;
  canvas.height = size;
}

function drawBall(glow = false) {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const radius = w * 0.4; // основной радиус шара

  ctx.clearRect(0, 0, w, h);

  // Glow effect
  if (glow) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let r = radius; r <= radius * 1.12; r += w * 0.02) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(80,80,255,0.2)";
      ctx.fill();
    }
    ctx.restore();
  }

  // Main sphere
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#5c5cff";
  ctx.shadowColor = "#aaf";
  ctx.shadowBlur = glow ? w * 0.14 : w * 0.08;
  ctx.fill();
  ctx.restore();

  // Gloss
  ctx.beginPath();
  ctx.arc(cx - radius * 0.33, cy - radius * 0.33, radius * 0.25, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fill();

  // Ball edge
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = w * 0.015;
  ctx.stroke();

  // Decorative stars
  for (let i = 0; i < 7; i++) {
    drawStar(
      cx + Math.cos(i * (2 * Math.PI / 7)) * radius * 0.8,
      cy + Math.sin(i * (2 * Math.PI / 7)) * radius * 0.8,
      6, w * 0.015, w * 0.03,
      "rgba(255,255,255,0.3)"
    );
  }
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function showAnswer(ans) {
  answerEl.textContent = ans;
  answerEl.style.opacity = 1;
}

function hideAnswer() {
  answerEl.style.opacity = 0;
}

function redraw() {
  resizeCanvas();
  drawBall();
}

window.addEventListener('resize', () => {
  redraw();
});

redraw();

btn.addEventListener('click', () => {
  drawBall(true);
  hideAnswer();
  btn.disabled = true;
  setTimeout(() => {
    const randIndex = Math.floor(Math.random() * answers.length);
    showAnswer(answers[randIndex]);
    btn.disabled = false;
    drawBall();
  }, 1200);
});
