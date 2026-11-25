// مناسبتي scenes — each scene draws one frame: drawScene(ctx, key, name, t)
(function () {
const W = 540, H = 540;
function mulberry(seed) { let a = seed >>> 0; return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function bg(ctx, stops) { const g = ctx.createLinearGradient(0, 0, 0, H); stops.forEach(([p, c]) => g.addColorStop(p, c)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function center(ctx, lines) { ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; lines.forEach(({ text, size, color, y, weight }) => { ctx.font = `${weight || 'bold'} ${size}px Cairo, "Segoe UI", "Noto Kufi Arabic", Tahoma, Arial, sans-serif`; ctx.fillStyle = color; ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 8; ctx.fillText(text, W / 2, y); ctx.shadowBlur = 0; }); }
const stars = (() => { const r = mulberry(42); return Array.from({ length: 70 }, () => ({ x: r() * W, y: r() * H * 0.7, s: 1 + r() * 1.8, p: r() * Math.PI * 2 })); })();
function twinkle(ctx, t, maxY) { stars.forEach((s) => { if (s.y > (maxY || H)) return; ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(t * 1.5 + s.p)); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1; }
function crescent(ctx, cx, cy, R, color, glow) {
  // path-based sliver (no destination-out): outer disc minus offset bite disc as one path
  ctx.save();
  if (glow) { const halo = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 2.4); halo.addColorStop(0, 'rgba(255,205,105,0.28)'); halo.addColorStop(1, 'rgba(255,190,90,0)'); ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 2.4, 0, Math.PI * 2); ctx.fill(); }
  const bx = cx + R * 0.42, by = cy - R * 0.18, rb = R * 0.86;
  const d = Math.hypot(bx - cx, by - cy);
  const theta = Math.atan2(by - cy, bx - cx);
  const alpha = Math.acos(Math.min(1, (R * R + d * d - rb * rb) / (2 * R * d)));
  const a1 = theta + alpha, a2 = theta - alpha;
  const b1 = Math.atan2(cy + R * Math.sin(a2) - by, cx + R * Math.cos(a2) - bx);
  const b2 = Math.atan2(cy + R * Math.sin(a1) - by, cx + R * Math.cos(a1) - bx);
  ctx.fillStyle = color;
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = R * 0.5; }
  ctx.beginPath();
  ctx.arc(cx, cy, R, a1, a2 + Math.PI * 2, false);
  ctx.arc(bx, by, rb, b1, b2, true);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

const bursts = [ { every: 1.4, offset: 0.0, x: 0.28, y: 0.30, color: '#f5c76a' }, { every: 1.4, offset: 0.55, x: 0.72, y: 0.24, color: '#e88ca0' }, { every: 1.4, offset: 0.95, x: 0.50, y: 0.36, color: '#7fd4c1' } ];
function firework(ctx, t, b) { const life = ((t + b.offset) % b.every) / b.every; const cx = b.x * W, cy = b.y * H; const r = mulberry(Math.floor((t + b.offset) / b.every) * 97 + 13); const n = 46; for (let i = 0; i < n; i++) { const ang = (i / n) * Math.PI * 2 + r() * 0.2; const sp = 60 + r() * 90; const d = sp * life * 1.6; ctx.globalAlpha = Math.max(0, 1 - life); ctx.fillStyle = b.color; ctx.beginPath(); ctx.arc(cx + Math.cos(ang) * d, cy + Math.sin(ang) * d + 40 * life * life, 2.4, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; }

function sceneNewYear(ctx, name, t) {
  bg(ctx, [[0, '#0b1026'], [1, '#1d2a52']]);
  twinkle(ctx, t, H * 0.7);
  ctx.fillStyle = '#060a1c'; const r = mulberry(7); let x = 0;
  while (x < W) { const bw = 30 + r() * 55, bh = 40 + r() * 110; ctx.fillRect(x, H - bh, bw, bh); x += bw + 4; }
  bursts.forEach((b) => firework(ctx, t, b));
  center(ctx, [ { text: 'كل سنة وأنت طيب', size: 40, color: '#ffffff', y: 300 }, { text: name, size: 62, color: '#f5c76a', y: 372 }, { text: '٢٠٢٧', size: 34, color: '#cfd8ff', y: 436 } ]);
}

const petals = (() => { const r = mulberry(11); return Array.from({ length: 36 }, () => ({ x: r() * W, y: r() * H, s: 6 + r() * 8, vy: 24 + r() * 30, vx: -14 + r() * 28, rot: r() * Math.PI * 2, vr: -1 + r() * 2 })); })();
function sceneWedding(ctx, name, t) {
  bg(ctx, [[0, '#fdf7ef'], [1, '#f6e3d8']]);
  const pulse = 1 + 0.02 * Math.sin(t * 2);
  ctx.lineWidth = 10; ctx.strokeStyle = '#d4a437';
  ctx.beginPath(); ctx.arc(W / 2 - 42, 150, 58 * pulse, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#c08b2d';
  ctx.beginPath(); ctx.arc(W / 2 + 42, 150, 58 * pulse, 0, Math.PI * 2); ctx.stroke();
  const sx = W / 2 - 42 + 58 * Math.cos(t * 1.4), sy = 150 + 58 * Math.sin(t * 1.4);
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();
  petals.forEach((p) => { const y = (p.y + t * p.vy) % (H + 40) - 20; const xx = (p.x + t * p.vx + 60 * Math.sin(t * 0.7 + p.rot)) % (W + 40); ctx.save(); ctx.translate((xx + W + 40) % (W + 40) - 20, y); ctx.rotate(p.rot + t * p.vr); ctx.fillStyle = 'rgba(214,112,140,0.55)'; ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
  center(ctx, [ { text: 'مبارك عليكم', size: 42, color: '#5b3a29', y: 310 }, { text: name, size: 58, color: '#b3543f', y: 382 }, { text: 'أجمل التهاني وأطيب الأمنيات', size: 26, color: '#8a6a55', y: 442 } ]);
}

const balloons = (() => { const colors = ['#e75480', '#f5a623', '#4a90d9', '#7fd4c1', '#9b59b6', '#ed6a5a', '#f2c14e']; const r = mulberry(23); return colors.map((c, i) => ({ c, x: 50 + i * 73 + r() * 20, y0: r() * H, v: 34 + r() * 22, sway: 12 + r() * 18, p: r() * Math.PI * 2 })); })();
const confetti = (() => { const r = mulberry(31); const colors = ['#e75480', '#f5a623', '#4a90d9', '#7fd4c1', '#9b59b6']; return Array.from({ length: 55 }, () => ({ x: r() * W, y: r() * H, s: 4 + r() * 5, vy: 30 + r() * 40, rot: r() * Math.PI * 2, vr: -2 + r() * 4, c: colors[Math.floor(r() * colors.length)] })); })();
function sceneBirthday(ctx, name, t) {
  bg(ctx, [[0, '#eaf4ff'], [1, '#fde8f1']]);
  confetti.forEach((c) => { const y = (c.y + t * c.vy) % (H + 20) - 10; ctx.save(); ctx.translate(c.x, y); ctx.rotate(c.rot + t * c.vr); ctx.fillStyle = c.c; ctx.globalAlpha = 0.8; ctx.fillRect(-c.s / 2, -c.s / 4, c.s, c.s / 2); ctx.restore(); });
  ctx.globalAlpha = 1;
  balloons.forEach((b) => { const y = H + 60 - ((b.y0 + t * b.v) % (H + 160)); const x = b.x + b.sway * Math.sin(t * 1.1 + b.p); ctx.strokeStyle = 'rgba(60,60,60,0.4)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x, y + 46); ctx.quadraticCurveTo(x + 8 * Math.sin(t + b.p), y + 80, x, y + 110); ctx.stroke(); ctx.fillStyle = b.c; ctx.beginPath(); ctx.ellipse(x, y, 34, 42, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(x - 11, y - 14, 9, 14, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = b.c; ctx.beginPath(); ctx.moveTo(x - 6, y + 40); ctx.lineTo(x + 6, y + 40); ctx.lineTo(x, y + 50); ctx.closePath(); ctx.fill(); });
  center(ctx, [ { text: 'عيد ميلاد سعيد', size: 44, color: '#33354a', y: 260 }, { text: name, size: 62, color: '#e75480', y: 336 }, { text: 'كل سنة وأنت بخير', size: 26, color: '#6b6e85', y: 402 } ]);
}

// ---- shared Islamic art helpers ----
function fanous(ctx, cx, cy, s, t, hue) {
  const sway = Math.sin(t * 1.2 + cx) * 0.06;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(sway);
  const glow = ctx.createRadialGradient(0, s * 0.4, 0, 0, s * 0.4, s * 1.5);
  glow.addColorStop(0, `rgba(255,200,${hue || 90},0.30)`); glow.addColorStop(1, 'rgba(255,200,90,0)');
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, s * 0.4, s * 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#c9963c'; ctx.fillRect(-s * 0.22, 0, s * 0.44, s * 0.1);
  ctx.beginPath(); ctx.moveTo(-s * 0.32, s * 0.1); ctx.lineTo(s * 0.32, s * 0.1); ctx.lineTo(s * 0.24, s * 0.2); ctx.lineTo(-s * 0.24, s * 0.2); ctx.closePath(); ctx.fill();
  const gl = ctx.createLinearGradient(0, s * 0.2, 0, s * 0.85);
  gl.addColorStop(0, '#ffe9ad'); gl.addColorStop(1, '#e8a84c');
  ctx.fillStyle = gl; ctx.beginPath(); ctx.moveTo(-s * 0.24, s * 0.2); ctx.lineTo(s * 0.24, s * 0.2); ctx.lineTo(s * 0.3, s * 0.55); ctx.lineTo(s * 0.18, s * 0.85); ctx.lineTo(-s * 0.18, s * 0.85); ctx.lineTo(-s * 0.3, s * 0.55); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(140,90,20,0.6)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, s * 0.2); ctx.lineTo(0, s * 0.85); ctx.stroke();
  ctx.fillStyle = '#c9963c'; ctx.fillRect(-s * 0.2, s * 0.85, s * 0.4, s * 0.08);
  ctx.beginPath(); ctx.arc(0, s * 1.0, s * 0.06, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function mosqueLine(ctx, baseY, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, baseY, W, H - baseY);
  const r = mulberry(19); let x = -10;
  while (x < W) { const bw = 40 + r() * 70, bh = 30 + r() * 55; ctx.fillRect(x, baseY - bh, bw, bh); x += bw + 6; }
  // dome + minaret
  ctx.beginPath(); ctx.arc(W * 0.24, baseY - 58, 34, Math.PI, 0); ctx.fill();
  ctx.fillRect(W * 0.24 - 34, baseY - 58, 68, 8);
  ctx.fillRect(W * 0.78 - 6, baseY - 130, 12, 132);
  ctx.beginPath(); ctx.moveTo(W * 0.78 - 11, baseY - 130); ctx.lineTo(W * 0.78 + 11, baseY - 130); ctx.lineTo(W * 0.78, baseY - 152); ctx.closePath(); ctx.fill();
}

function sceneRamadan(ctx, name, t) {
  bg(ctx, [[0, '#0a1430'], [0.7, '#14224a'], [1, '#1b2b57']]);
  twinkle(ctx, t, H * 0.6);
  crescent(ctx, W * 0.78, 86, 42, '#f2d488', true);
  ctx.strokeStyle = 'rgba(228,199,131,0.5)'; ctx.lineWidth = 1.5;
  [[0.3, 0], [0.52, 2.1], [0.16, 4.2]].forEach(([fx, ph]) => { ctx.beginPath(); ctx.moveTo(W * fx, 0); ctx.lineTo(W * fx + Math.sin(t * 1.2 + W * fx) * 6, 66 + ph * 3); ctx.stroke(); fanous(ctx, W * fx + Math.sin(t * 1.2 + W * fx) * 6, 66 + ph * 3, 44 + ph * 4, t); });
  mosqueLine(ctx, H - 96, '#070d20');
  center(ctx, [ { text: 'رمضان كريم', size: 52, color: '#f2d488', y: 300 }, { text: name, size: 44, color: '#ffffff', y: 366 }, { text: 'كل سنة وأنت طيب', size: 26, color: '#c7d2f0', y: 424 } ]);
}

function sceneEidFitr(ctx, name, t) {
  bg(ctx, [[0, '#241a3f'], [0.55, '#5b2f56'], [0.85, '#c96f4a'], [1, '#e8a05c']]);
  twinkle(ctx, t, H * 0.35);
  crescent(ctx, W * 0.5, 120, 56, '#ffe9ad', true);
  ctx.save(); ctx.translate(0, 0); fanous(ctx, W * 0.16, 84, 40, t); fanous(ctx, W * 0.85, 76, 48, t + 1); ctx.restore();
  mosqueLine(ctx, H - 90, '#1c1030');
  const spark = mulberry(55);
  for (let i = 0; i < 24; i++) { const px = spark() * W, py = spark() * H * 0.5, ph = spark() * 6.3; ctx.globalAlpha = 0.25 + 0.75 * Math.abs(Math.sin(t * 2 + ph)); ctx.fillStyle = '#ffe9ad'; ctx.beginPath(); ctx.arc(px, py, 1.6, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
  center(ctx, [ { text: 'عيد فطر مبارك', size: 50, color: '#fff3d6', y: 296 }, { text: name, size: 46, color: '#ffe9ad', y: 362 }, { text: 'كل سنة وأنت طيب', size: 26, color: '#f5d9c9', y: 420 } ]);
}

function sceneEidAdha(ctx, name, t) {
  bg(ctx, [[0, '#0d1f2d'], [1, '#1d3a4a']]);
  twinkle(ctx, t, H * 0.5);
  crescent(ctx, W * 0.82, 78, 34, '#f2d488', true);
  // Kaaba
  const kx = W / 2, ky = 190, ks = 74;
  ctx.fillStyle = '#101418'; ctx.fillRect(kx - ks, ky - ks, ks * 2, ks * 2);
  ctx.fillStyle = '#d4af37'; ctx.fillRect(kx - ks, ky - ks * 0.45, ks * 2, 13);
  ctx.fillStyle = 'rgba(212,175,55,0.25)'; ctx.fillRect(kx - ks, ky - ks, ks * 2, 6);
  ctx.fillStyle = '#7a5c14'; ctx.fillRect(kx + ks * 0.32, ky + ks * 0.1, 20, ks * 0.9);
  mosqueLine(ctx, H - 88, '#08131c');
  // sheep
  const shx = W * 0.2 + 6 * Math.sin(t * 2), shy = H - 108;
  ctx.fillStyle = '#f2ede2'; ctx.beginPath(); ctx.ellipse(shx, shy, 26, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(shx + 22, shy - 10, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d9d2c2'; ctx.fillRect(shx - 16, shy + 12, 5, 12); ctx.fillRect(shx + 10, shy + 12, 5, 12);
  center(ctx, [ { text: 'عيد أضحى مبارك', size: 50, color: '#f2d488', y: 356 }, { text: name, size: 46, color: '#ffffff', y: 420 }, { text: 'تقبل الله منا ومنكم', size: 26, color: '#bcd3dd', y: 474 } ]);
}

function sceneHijriNewYear(ctx, name, t) {
  bg(ctx, [[0, '#0a0f24'], [1, '#1a1440']]);
  twinkle(ctx, t, H * 0.75);
  const pulse = 1 + 0.03 * Math.sin(t * 1.4);
  crescent(ctx, W / 2, 150, 62 * pulse, '#f2d488', true);
  const spark = mulberry(77);
  for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2 + t * 0.25; const rr = 96 + 8 * Math.sin(t * 2 + i); ctx.globalAlpha = 0.5; ctx.fillStyle = '#ffe9ad'; ctx.beginPath(); ctx.arc(W / 2 + Math.cos(a) * rr, 150 + Math.sin(a) * rr, 1.8, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
  center(ctx, [ { text: 'عام هجري سعيد', size: 48, color: '#f2d488', y: 312 }, { text: name, size: 46, color: '#ffffff', y: 378 }, { text: '١٤٤٩ هـ', size: 32, color: '#c9c3ef', y: 440 } ]);
}

function sceneMawlid(ctx, name, t) {
  bg(ctx, [[0, '#0e2b1f'], [1, '#123f2c']]);
  twinkle(ctx, t, H * 0.4);
  const ray = ctx.createRadialGradient(W / 2, 150, 10, W / 2, 150, 260);
  ray.addColorStop(0, 'rgba(190,255,214,0.28)'); ray.addColorStop(1, 'rgba(190,255,214,0)');
  ctx.fillStyle = ray; ctx.beginPath(); ctx.arc(W / 2, 150, 260, 0, Math.PI * 2); ctx.fill();
  // green dome + minarets
  ctx.fillStyle = '#e9e2cc';
  ctx.fillRect(W / 2 - 90, 190, 180, 60);
  ctx.fillStyle = '#2e7d4f';
  ctx.beginPath(); ctx.arc(W / 2, 190, 58, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#d4af37'; ctx.fillRect(W / 2 - 2, 108, 4, 26); ctx.beginPath(); ctx.arc(W / 2, 104, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e9e2cc';
  ctx.fillRect(W / 2 - 128, 150, 14, 100); ctx.fillRect(W / 2 + 114, 150, 14, 100);
  ctx.fillStyle = '#2e7d4f';
  ctx.beginPath(); ctx.moveTo(W / 2 - 132, 150); ctx.lineTo(W / 2 - 110, 150); ctx.lineTo(W / 2 - 121, 128); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(W / 2 + 110, 150); ctx.lineTo(W / 2 + 132, 150); ctx.lineTo(W / 2 + 121, 128); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#0b231a'; ctx.fillRect(0, 250, W, H - 250);
  const dots = mulberry(91);
  for (let i = 0; i < 20; i++) { const px = dots() * W, ph = dots() * 6.3, yy = 120 + dots() * 160; ctx.globalAlpha = 0.25 + 0.7 * Math.abs(Math.sin(t * 1.8 + ph)); ctx.fillStyle = '#d9f7e3'; ctx.beginPath(); ctx.arc(px, yy + 6 * Math.sin(t + ph), 1.7, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
  center(ctx, [ { text: 'المولد النبوي الشريف', size: 44, color: '#d9f7e3', y: 340 }, { text: name, size: 46, color: '#f2d488', y: 404 }, { text: 'كل سنة وأنت طيب', size: 26, color: '#a9cdb6', y: 460 } ]);
}

function sceneIsraa(ctx, name, t) {
  bg(ctx, [[0, '#070b1e'], [1, '#141b3d']]);
  twinkle(ctx, t, H * 0.8);
  crescent(ctx, W * 0.2, 84, 34, '#f2d488', true);
  // ascending light spiral
  for (let i = 0; i < 60; i++) { const p = (i / 60 + t * 0.14) % 1; const a = p * Math.PI * 5; const rr = 18 + p * 90; const x = W / 2 + Math.cos(a) * rr * 0.5; const y = H - 120 - p * 320; ctx.globalAlpha = (1 - p) * 0.9; ctx.fillStyle = '#ffe9ad'; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
  mosqueLine(ctx, H - 88, '#050914');
  center(ctx, [ { text: 'ذكرى الإسراء والمعراج', size: 42, color: '#f2d488', y: 316 }, { text: name, size: 44, color: '#ffffff', y: 380 }, { text: 'كل سنة وأنت طيب', size: 26, color: '#b9c2e8', y: 438 } ]);
}

// ---- Christian + general scenes ----
const snow = (() => { const r = mulberry(63); return Array.from({ length: 70 }, () => ({ x: r() * W, y: r() * H, s: 1.5 + r() * 2.5, v: 16 + r() * 26, ph: r() * 6.3 })); })();
function tree(ctx, cx, baseY, s, t) {
  ctx.fillStyle = '#6b4423'; ctx.fillRect(cx - s * 0.09, baseY - s * 0.16, s * 0.18, s * 0.16);
  const greens = ['#1e6b3c', '#237a45', '#2a8a4f'];
  for (let i = 0; i < 3; i++) { const w = s * (1 - i * 0.26), yy = baseY - s * 0.16 - i * s * 0.3; ctx.fillStyle = greens[i]; ctx.beginPath(); ctx.moveTo(cx - w / 2, yy); ctx.lineTo(cx + w / 2, yy); ctx.lineTo(cx, yy - s * 0.42); ctx.closePath(); ctx.fill(); }
  const lights = mulberry(101);
  for (let i = 0; i < 16; i++) { const yy = baseY - s * 0.3 - lights() * s * 0.85; const spread = (baseY - s * 0.16 - yy) * 0.9 + 8; const lx = cx + (lights() - 0.5) * spread; ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i)); ctx.fillStyle = ['#ffd166', '#ef476f', '#7fd4c1'][i % 3]; ctx.beginPath(); ctx.arc(lx, yy, 3.4, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#ffd166'; ctx.save(); ctx.translate(cx, baseY - s * 1.18); ctx.rotate(Math.sin(t * 1.5) * 0.1);
  ctx.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * (Math.PI * 4 / 5); ctx.lineTo(Math.cos(a) * s * 0.14, Math.sin(a) * s * 0.14); } ctx.closePath(); ctx.fill(); ctx.restore();
}
function sceneChristmas(ctx, name, t) {
  bg(ctx, [[0, '#101d38'], [1, '#274068']]);
  snow.forEach((f) => { const y = (f.y + t * f.v) % H; const x = f.x + 10 * Math.sin(t * 0.8 + f.ph); ctx.globalAlpha = 0.75; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, f.s, 0, Math.PI * 2); ctx.fill(); });
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#eaf2fb'; ctx.beginPath(); ctx.ellipse(W / 2, H + 30, W * 0.75, 70, 0, Math.PI, 0); ctx.fill();
  tree(ctx, W / 2, H - 60, 200, t);
  center(ctx, [ { text: 'عيد ميلاد مجيد', size: 48, color: '#ffffff', y: 300 }, { text: name, size: 46, color: '#ffd166', y: 364 }, { text: 'كل سنة وأنت طيب', size: 26, color: '#cdd9ee', y: 420 } ]);
}

function sceneEpiphany(ctx, name, t) {
  bg(ctx, [[0, '#0e2438'], [0.6, '#1b4560'], [1, '#2b6b8a']]);
  const ray = ctx.createRadialGradient(W / 2, 90, 8, W / 2, 90, 240);
  ray.addColorStop(0, 'rgba(255,244,200,0.5)'); ray.addColorStop(1, 'rgba(255,244,200,0)');
  ctx.fillStyle = ray; ctx.beginPath(); ctx.arc(W / 2, 90, 240, 0, Math.PI * 2); ctx.fill();
  // dove
  const dy = 130 + 8 * Math.sin(t * 1.6), flap = Math.sin(t * 6) * 0.5;
  ctx.fillStyle = '#ffffff'; ctx.save(); ctx.translate(W / 2, dy);
  ctx.beginPath(); ctx.ellipse(0, 0, 26, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(24, -10, 9, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(-44, -8 - flap * 10); ctx.lineTo(-42, 8); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(-10, -30 - flap * 16); ctx.lineTo(14, -12); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f2b138'; ctx.beginPath(); ctx.moveTo(32, -10); ctx.lineTo(40, -8); ctx.lineTo(32, -5); ctx.closePath(); ctx.fill();
  ctx.restore();
  // water waves
  for (let r2 = 0; r2 < 3; r2++) { ctx.strokeStyle = `rgba(190,230,250,${0.5 - r2 * 0.13})`; ctx.lineWidth = 3; ctx.beginPath(); for (let x = 0; x <= W; x += 8) { const y = 360 + r2 * 26 + 6 * Math.sin(x / 46 + t * 2 + r2); ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.fillStyle = '#12384f'; ctx.fillRect(0, 430, W, H - 430);
  center(ctx, [ { text: 'عيد غطاس سعيد', size: 48, color: '#eaf7ff', y: 296 }, { text: name, size: 46, color: '#ffe9ad', y: 476 }, ]);
  center(ctx, [ { text: 'كل سنة وأنت طيب', size: 24, color: '#bfe0f0', y: 330 } ]);
}

function sceneEaster(ctx, name, t) {
  bg(ctx, [[0, '#2b1e4f'], [0.5, '#8a4370'], [0.8, '#e08a5c'], [1, '#f5c76a']]);
  const sunY = 232 + 4 * Math.sin(t * 1.2);
  const sg = ctx.createRadialGradient(W / 2, sunY, 6, W / 2, sunY, 130);
  sg.addColorStop(0, 'rgba(255,240,190,0.95)'); sg.addColorStop(1, 'rgba(255,240,190,0)');
  ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(W / 2, sunY, 130, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffedb0'; ctx.beginPath(); ctx.arc(W / 2, sunY, 34, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3f2b18'; ctx.fillRect(0, 330, W, H - 330);
  // painted eggs
  const eggs = [ [0.3, '#ef476f', '#ffd166'], [0.5, '#7fd4c1', '#ffffff'], [0.7, '#9b59b6', '#f2c14e'] ];
  eggs.forEach(([fx, c1, c2], i) => { const ex = W * fx, ey = 356 + 3 * Math.sin(t * 2 + i * 2); ctx.fillStyle = c1; ctx.beginPath(); ctx.ellipse(ex, ey, 20, 26, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = c2; ctx.lineWidth = 4; ctx.beginPath(); for (let x = -18; x <= 18; x += 4) { ctx.lineTo(ex + x, ey + 3 * Math.sin(x / 3)); } ctx.stroke(); });
  // tulips
  for (let i = 0; i < 6; i++) { const fx = 40 + i * 92, fy = 514; ctx.strokeStyle = '#2f7a3f'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy - 34); ctx.stroke(); ctx.fillStyle = ['#ef476f', '#f2c14e', '#e75480'][i % 3]; ctx.beginPath(); ctx.ellipse(fx, fy - 44, 10, 13, 0, 0, Math.PI * 2); ctx.fill(); }
  center(ctx, [ { text: 'عيد قيامة مجيد', size: 48, color: '#fff3d6', y: 78 }, { text: name, size: 44, color: '#ffe9ad', y: 132 }, { text: 'كل سنة وأنت طيب', size: 24, color: '#f5d9c9', y: 418 } ]);
}

function sceneSham(ctx, name, t) {
  bg(ctx, [[0, '#aee3f7'], [1, '#e8f9ee']]);
  // breeze swirls
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 3;
  for (let r2 = 0; r2 < 4; r2++) { ctx.beginPath(); for (let x = -20; x <= W + 20; x += 8) { const y = 70 + r2 * 46 + 10 * Math.sin(x / 60 + t * 2.2 + r2 * 1.4); ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.fillStyle = '#58a05c'; ctx.fillRect(0, 400, W, H - 400);
  // flowers
  const fl = mulberry(121);
  for (let i = 0; i < 14; i++) { const fx = fl() * W, fy = 400 + fl() * 120, c = ['#ef476f', '#f2c14e', '#e75480', '#9b59b6'][i % 4]; const sw = 3 * Math.sin(t * 2 + i); ctx.strokeStyle = '#2f7a3f'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(fx, fy + 26); ctx.lineTo(fx + sw, fy); ctx.stroke(); ctx.fillStyle = c; for (let p = 0; p < 5; p++) { const a = p * Math.PI * 2 / 5; ctx.beginPath(); ctx.ellipse(fx + sw + Math.cos(a) * 8, fy + Math.sin(a) * 8, 6, 4, a, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(fx + sw, fy, 4, 0, Math.PI * 2); ctx.fill(); }
  // colored eggs
  [[0.24, '#ef476f'], [0.5, '#4a90d9'], [0.76, '#f2c14e']].forEach(([fx, c], i) => { const ex = W * fx, ey = 366 + 4 * Math.sin(t * 2 + i); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(ex, ey, 19, 25, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 4; ctx.beginPath(); for (let x = -17; x <= 17; x += 4) { ctx.lineTo(ex + x, ey + 3 * Math.sin(x / 3)); } ctx.stroke(); });
  center(ctx, [ { text: 'شم نسيم سعيد', size: 50, color: '#1d5c33', y: 150 }, { text: name, size: 46, color: '#c2436b', y: 214 }, { text: 'ربيع سعيد عليك', size: 26, color: '#3b6e4b', y: 268 } ]);
}

const hearts = (() => { const r = mulberry(133); return Array.from({ length: 16 }, () => ({ x: r() * W, y: r() * H, s: 8 + r() * 10, v: 20 + r() * 26, ph: r() * 6.3 })); })();
function heart(ctx, x, y, s, color, alpha) { ctx.save(); ctx.translate(x, y); ctx.scale(s / 20, s / 20); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, 6); ctx.bezierCurveTo(-14, -6, -8, -18, 0, -8); ctx.bezierCurveTo(8, -18, 14, -6, 0, 6); ctx.fill(); ctx.restore(); }
function sceneMothersDay(ctx, name, t) {
  bg(ctx, [[0, '#fdeef3'], [1, '#f7d9e3']]);
  hearts.forEach((h) => { const y = H + 20 - ((h.y + t * h.v) % (H + 60)); const x = h.x + 14 * Math.sin(t + h.ph); heart(ctx, x, y, h.s, 'rgba(214,84,124,0.4)', 0.5 + 0.4 * Math.sin(t * 2 + h.ph)); });
  ctx.globalAlpha = 1;
  // bouquet
  const cx = W / 2, by = 220;
  ctx.strokeStyle = '#2f7a3f'; ctx.lineWidth = 5;
  [-46, -18, 12, 42].forEach((dx) => { ctx.beginPath(); ctx.moveTo(cx + dx * 0.4, by + 120); ctx.lineTo(cx + dx, by + 10); ctx.stroke(); });
  const fcols = ['#e75480', '#ef476f', '#f2c14e', '#c2436b'];
  [-46, -18, 12, 42].forEach((dx, i) => { const sway = 4 * Math.sin(t * 1.6 + i); ctx.fillStyle = fcols[i]; for (let p = 0; p < 6; p++) { const a = p * Math.PI / 3; ctx.beginPath(); ctx.ellipse(cx + dx + sway + Math.cos(a) * 13, by + 4 + Math.sin(a) * 13, 10, 7, a, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(cx + dx + sway, by + 4, 7, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillStyle = '#c2436b'; ctx.beginPath(); ctx.moveTo(cx - 34, by + 100); ctx.lineTo(cx + 34, by + 100); ctx.lineTo(cx + 22, by + 150); ctx.lineTo(cx - 22, by + 150); ctx.closePath(); ctx.fill();
  center(ctx, [ { text: 'عيد أم سعيد', size: 50, color: '#b03a5e', y: 428 }, { text: name, size: 44, color: '#7a2947', y: 488 }, { text: 'كل سنة وأنتِ بخير', size: 24, color: '#a05a72', y: 92 } ]);
}

const SCENES = { newyear: sceneNewYear, wedding: sceneWedding, birthday: sceneBirthday, ramadan: sceneRamadan, eid_fitr: sceneEidFitr, eid_adha: sceneEidAdha, hijri_newyear: sceneHijriNewYear, mawlid: sceneMawlid, israa: sceneIsraa, christmas: sceneChristmas, epiphany: sceneEpiphany, easter: sceneEaster, sham: sceneSham, mothersday: sceneMothersDay };
window.MUN = {
  drawScene(ctx, key, name, t) {
    ctx.clearRect(0, 0, W, H);
    const dn = (name || '').trim() || 'اسمك هنا';
    (SCENES[key] || sceneNewYear)(ctx, dn, t);
  },
};
})();
