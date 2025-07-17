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
  "Жди неожиданного поворота",
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
  const size = Math.min(window.innerWidth * 1.5, 600);
  canvas.width = size;
  canvas.height = size;
}

let flickerPhase = 0;
let flickerActive = true;

function drawBall(triangleText = '', triangleAlpha = 0, glow = false, flicker = 1) {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const radius = w * 0.3;

  ctx.clearRect(0, 0, w, h);

  // Мультяшный градиент
  const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
  grad.addColorStop(0, '#6a5acd');
  grad.addColorStop(0.5, '#23235b');
  grad.addColorStop(1, '#101025');

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.fillStyle = grad;
  ctx.shadowColor = '#b39ddb';
  ctx.shadowBlur = glow ? w * (0.12 + 0.08 * (flicker == 1 ? 0.13 : flicker)) : 0;
  ctx.globalAlpha = 1;
  ctx.fill();
  ctx.restore();

  // Глянцевый блик
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx - radius * 0.3, cy - radius * 0.35, radius * 0.22, radius * 0.12, Math.PI / 6, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fill();
  ctx.restore();

  // Белая окантовка
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = w * 0.01;
  ctx.stroke();
  ctx.restore();

  // Треугольник
  const triSize = radius;
  ctx.save();
  ctx.globalAlpha = triangleAlpha;
  ctx.beginPath();
  ctx.moveTo(cx, cy - triSize * 0.36);
  ctx.lineTo(cx - triSize * 0.36, cy + triSize * 0.36);
  ctx.lineTo(cx + triSize * 0.36, cy + triSize * 0.36);
  ctx.closePath();
  ctx.fillStyle = '#222';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = w * 0.03;
  ctx.fill();

  // Текст ответа
  if (triangleText) {
    ctx.font = `bold ${w * 0.07}px Arial`;
    ctx.fillStyle = '#00eaff';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 4;
    ctx.fillText(triangleText, cx, cy + triSize * 0.13, triSize);
  }
  ctx.restore();

  // Декоративные звезды
  for (let i = 0; i < 7; i++) {
    drawStar(
      cx + Math.cos(i * (2 * Math.PI / 7)) * radius * 0.8,
      cy + Math.sin(i * (2 * Math.PI / 7)) * radius * 0.8,
      6, w * 0.015, w * 0.03,
      'rgba(255,255,255,0.3)'
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

function flickerLoop() {
  if (!flickerActive) {
    flickerPhase = 0
    flicker = 0
    resizeCanvas()
    return
  } else {
    flickerPhase += 0.08;
    flicker = 0.1 * Math.sin(flickerPhase * 2) + 0.15 * Math.sin(flickerPhase * 1)
  }

  if (flickerPhase > 30) {
    flickerPhase = 0.01;
  }
  drawBall('', 0, true, flicker);
  requestAnimationFrame(flickerLoop);
}

function showAnswer(ans) {
  answerEl.textContent = '';
  let alpha = 0;
  flickerActive = false;
  function animateTriangle() {
    alpha += 0.01;
    drawBall(ans, Math.min(alpha, 1), true, 1);
    if (alpha < 1) requestAnimationFrame(animateTriangle);
    else flickerActive = true;
  }
  animateTriangle();
  setTimeout(() => {
    flickerActive = true;
    flickerLoop();
  }, 10000);
}

function hideAnswer() {
  answerEl.textContent = '';
  flickerActive = true;
  flickerLoop();
}

function redraw() {
  resizeCanvas();
  flickerActive = true;
  flickerLoop();
} 

window.addEventListener('resize', () => {
  redraw();
});

redraw();

btn.addEventListener('click', () => {
  canvas.classList.add('shake');
  setTimeout(() => {
    canvas.classList.remove('shake');
  }, 2000);
  hideAnswer();
  btn.disabled = true;
  setTimeout(() => {
    const randIndex = Math.floor(Math.random() * answers.length);
    showAnswer(answers[randIndex]);
    btn.disabled = false;
  }, 500);
});
