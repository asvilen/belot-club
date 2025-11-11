// lobby.js
const suits = ['♠','♥','♦','♣'];
const ranks = ['7','8','9','J','Q','K','10','A'];
const deck = [];
for (const s of suits) for (const r of ranks) deck.push(r + s);

const container = document.querySelector('.card-container');
const h1 = document.querySelector('h1');
const btn = document.querySelector('.btn');
const tabs = document.querySelector('.tabs');
const footer = document.querySelector('.footer');

function getUIRects() {
  return [
    h1.getBoundingClientRect(),
    btn.getBoundingClientRect(),
    tabs.getBoundingClientRect(),
    footer.getBoundingClientRect()
  ];
}

function getViewport() {
  return { w: window.innerWidth, h: window.innerHeight };
}

function isInUI(x, y, rects, cardW = 80, cardH = 110) {
  const buffer = 20;
  for (const r of rects) {
    if (
      x + cardW + buffer > r.left &&
      x - buffer < r.right &&
      y + cardH + buffer > r.top &&
      y - buffer < r.bottom
    ) return true;
  }
  return false;
}

function createCard(delay) {
  const card = document.createElement('div');
  card.className = 'card';
  const symbol = deck[Math.floor(Math.random() * deck.length)];
  card.textContent = symbol;
  if (symbol.includes('♥') || symbol.includes('♦')) card.classList.add('red');

  const vp = getViewport();
  const cardW = 80;
  const cardH = 110;
  const uiRects = getUIRects();

  let left, targetY, attempts = 0;
  do {
    left = Math.random() * (vp.w - cardW);
    targetY = Math.random() * (vp.h * 0.55) + vp.h * 0.15;
    attempts++;
  } while (isInUI(left, targetY, uiRects, cardW, cardH) && attempts < 50);

  const rot = Math.random() * 60 - 30;

  card.style.left = `${left}px`;
  card.style.top = `-150px`;
  container.appendChild(card);

  setTimeout(() => {
    card.style.transition = 'top 1.3s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1.3s ease-out, opacity 0.7s';
    card.style.top = `${targetY}px`;
    card.style.transform = `rotate(${rot}deg)`;
    card.style.opacity = '1';
  }, delay);

  // Drag & Drop
  let dragging = false;
  let offsetX, offsetY;
  const currentRot = rot + 'deg';

  card.addEventListener('pointerdown', e => {
    dragging = true;
    card.classList.add('dragging');
    const rect = card.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    e.preventDefault();
  });

  document.addEventListener('pointermove', e => {
    if (!dragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
    card.style.transition = 'none';
    card.style.transform = `rotate(${currentRot})`;
  });

  document.addEventListener('pointerup', () => {
    if (dragging) {
      dragging = false;
      card.classList.remove('dragging');
    }
  });
}

// 11 cards
for (let i = 0; i < 11; i++) createCard(i * 50);

// Tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Button pulse
btn.addEventListener('click', () => {
  btn.style.transform = 'scale(1.05)';
  setTimeout(() => btn.style.transform = '', 200);
});

window.addEventListener('resize', () => location.reload());