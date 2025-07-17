const answers = [
  "Да!",
  "Нет.",
  "Возможно.",
  "Скорее всего.",
  "Точно нет.",
  "Определенно да!",
  "Сомневаюсь.",
  "Не могу сказать сейчас.",
  "Спроси позже.",
  "Очень вероятно.",
  "Очень маловероятно.",
  "Шансы есть!",
  "Никаких шансов.",
  "Будет непросто.",
  "Лучше не рисковать.",
  "Ты знаешь ответ сам.",
  "Судьба благоприятствует.",
  "Судьба против.",
  "Абсолютно!",
  "Категорически нет."
];

const canvas = document.getElementById('magic-ball');
const ctx = canvas.getContext('2d');
const answerEl = document.getElementById('answer');
const btn = document.getElementById('predict-btn');

function drawBall(glow = false) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Glow effect
  if (glow) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let r = 120; r <= 135; r += 5) {
      ctx.beginPath();
      ctx.arc(150, 150, r, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(80,80,255,0.2)";
      ctx.fill();
    }
    ctx.restore();
  }

  // Main sphere
  ctx.beginPath();
  ctx.arc(150, 150, 120, 0, 2 * Math.PI);
  ctx.fillStyle = "#5c5cff";
  ctx.shadowColor = "#aaf";
  ctx.shadowBlur = glow ? 50 : 30;
  ctx.fill();

  // Gloss
  ctx.beginPath();
  ctx.arc(110, 110, 30, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fill();

  // Ball edge
  ctx.beginPath();
  ctx.arc(150, 150, 120, 0, 2 * Math.PI);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Decorative stars
  for (let i = 0; i < 7; i++) {
    drawStar(
      150 + Math.cos(i * (2 * Math.PI / 7)) * 95,
      150 + Math.sin(i * (2 * Math.PI / 7)) * 95,
      6, 4, 8,
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

drawBall();

btn.addEventListener('click', () => {
  drawBall(true);
  answerEl.style.opacity = 0;
  btn.disabled = true;
  setTimeout(() => {
    const randIndex = Math.floor(Math.random() * answers.length);
    answerEl.textContent = answers[randIndex];
    answerEl.style.opacity = 1;
    btn.disabled = false;
    drawBall();
  }, 1200);
});