const gameInfo = {
  snake: { number: "01", title: "Snake", description: "Eat the dots, grow your tail, and keep the run alive." },
  "2048": { number: "02", title: "2048", description: "Slide matching tiles together until you reach the iconic 2048." },
  tetris: { number: "03", title: "Tetris", description: "Fit the falling pieces, clear rows, and chase a clean board." },
  minesweeper: { number: "04", title: "Minesweeper", description: "Read the numbers, mark the danger, and reveal every safe square." },
  pong: { number: "05", title: "Pong", description: "Keep your paddle sharp and send the ball back across the line.", bonus: true },
  brickBreaker: { number: "06", title: "Brick Breaker", description: "Break the wall one bounce at a time.", bonus: true },
  flappyDot: { number: "07", title: "Flappy Dot", description: "Thread the gaps and keep your dot flying.", bonus: true },
  connectFour: { number: "08", title: "Connect Four", description: "Line up four and claim the board.", bonus: true },
  matchPairs: { number: "09", title: "Match Pairs", description: "Find the twins before the clock catches you.", bonus: true },
  whackBlock: { number: "10", title: "Whack-a-Block", description: "Tap the target while it is hot.", bonus: true },
  lightsOut: { number: "11", title: "Lights Out", description: "Clear the grid with a few smart moves.", bonus: true },
  memoryFlip: { number: "12", title: "Memory Flip", description: "Remember the pattern and beat your last run.", bonus: true },
  bubblePop: { number: "13", title: "Bubble Pop", description: "Pop the targets and build a bright score.", bonus: true },
  solitaireMini: { number: "14", title: "Solitaire Mini", description: "Deal yourself a quick little challenge.", bonus: true },
  roadDash: { number: "15", title: "Road Dash", description: "Dodge the traffic and stay on the road.", bonus: true }
};

const shopItems = [
  { id: "snakeLife", type: "upgrade", title: "Snake extra life", description: "Survive one crash", cost: 100, icon: "+" },
  { id: "snakeControl", type: "upgrade", title: "Snake speed control", description: "A calmer starting pace", cost: 120, icon: "S" },
  { id: "snakeBerries", type: "upgrade", title: "Snake berry bonus", description: "+5 points per berry", cost: 180, icon: "B" },
  { id: "undo2048", type: "upgrade", title: "2048 undo token", description: "A second chance", cost: 140, icon: "U" },
  { id: "four2048", type: "upgrade", title: "2048 starter four", description: "Start with a 4 tile", cost: 160, icon: "4" },
  { id: "boost2048", type: "upgrade", title: "2048 score boost", description: "Bigger merge rewards", cost: 220, icon: "2" },
  { id: "ghostTetris", type: "upgrade", title: "Tetris ghost piece", description: "See your landing spot", cost: 150, icon: "G" },
  { id: "softTetris", type: "upgrade", title: "Tetris soft drop", description: "A gentler drop speed", cost: 130, icon: "D" },
  { id: "lineTetris", type: "upgrade", title: "Tetris line bonus", description: "+25% clear points", cost: 240, icon: "L" },
  { id: "safeMine", type: "upgrade", title: "Minesweeper safe reveal", description: "One safe opening", cost: 200, icon: "!" },
  { id: "flagMine", type: "upgrade", title: "Minesweeper flag pack", description: "Extra flag markers", cost: 110, icon: "F" },
  { id: "widePaddle", type: "upgrade", title: "Pong wide paddle", description: "A little more reach", cost: 170, icon: "P" },
  { id: "slowPong", type: "upgrade", title: "Pong slow ball", description: "Buy yourself time", cost: 190, icon: "O" },
  { id: "doublePoints", type: "upgrade", title: "Double points", description: "Earn twice for 60 seconds", cost: 300, icon: "2x" },
  { id: "colorPack", type: "upgrade", title: "Arcade color pack", description: "A fresh accent palette", cost: 260, icon: "C" }
];
const unlockableGames = [
  { id: "pong", title: "Pong", description: "Classic two-paddle rally", cost: 250, icon: ">" },
  { id: "brickBreaker", title: "Brick Breaker", description: "Break the wall", cost: 300, icon: "B" },
  { id: "flappyDot", title: "Flappy Dot", description: "Thread the gaps", cost: 320, icon: "F" },
  { id: "connectFour", title: "Connect Four", description: "Line up four", cost: 350, icon: "4" },
  { id: "matchPairs", title: "Match Pairs", description: "Find the twins", cost: 380, icon: "M" },
  { id: "whackBlock", title: "Whack-a-Block", description: "Tap it fast", cost: 410, icon: "W" },
  { id: "lightsOut", title: "Lights Out", description: "Clear the grid", cost: 440, icon: "L" },
  { id: "memoryFlip", title: "Memory Flip", description: "Remember the cards", cost: 470, icon: "F" },
  { id: "bubblePop", title: "Bubble Pop", description: "Pop the targets", cost: 500, icon: "P" },
  { id: "solitaireMini", title: "Solitaire Mini", description: "Deal a quick hand", cost: 550, icon: "S" },
  { id: "roadDash", title: "Road Dash", description: "Dodge the traffic", cost: 600, icon: "R" }
];

let activeGame = "snake";
const menuButtons = [...document.querySelectorAll(".game-card")];
const panels = [...document.querySelectorAll(".game-panel")];
const titleEl = document.getElementById("gameTitle");
const descriptionEl = document.getElementById("gameDescription");
const numberEl = document.getElementById("gameNumber");
const scoreEl = document.getElementById("scoreValue");
const bestEl = document.getElementById("bestValue");
const levelEl = document.getElementById("levelValue");
const statusEl = document.getElementById("statusValue");
const scoreStripEl = document.querySelector(".score-strip");
const restartButton = document.getElementById("restartButton");
const shopButton = document.getElementById("shopButton");
const shopPanel = document.getElementById("panel-shop");
const bonusHost = document.getElementById("bonusGameHost");

function readBest(key) {
  try { return Number(localStorage.getItem(`pixel-playground-${key}`)) || 0; } catch { return 0; }
}
function saveBest(key, score) {
  try { localStorage.setItem(`pixel-playground-${key}`, String(score)); } catch { /* Scores still work if storage is blocked. */ }
}
function updateStats(score, best, level, status) {
  scoreEl.textContent = score;
  bestEl.textContent = best;
  levelEl.textContent = level;
  statusEl.textContent = status;
}

let walletPoints = readBest("wallet");
let snakeLives = readBest("snake-lives");
let upgradeCounts = {};
shopItems.forEach(item => { upgradeCounts[item.id] = readBest(`upgrade-${item.id}`); });
function isGameUnlocked(gameId) { return readBest(`unlock-${gameId}`) === 1 || (gameId === "pong" && readBest("pong-unlocked") === 1); }
function isUpgradeOwned(item) { return upgradeCounts[item.id] || 0; }
function renderShop() {
  const upgradeContainer = document.getElementById("shopUpgrades");
  const gamesContainer = document.getElementById("shopGames");
  upgradeContainer.innerHTML = shopItems.map(item => `<button class="shop-item" type="button" data-shop="${item.id}"><span class="shop-icon life-icon" aria-hidden="true">${item.icon}</span><span class="shop-copy"><strong>${item.title}</strong><small>${item.description} / ${isUpgradeOwned(item)} owned</small></span><span class="shop-cost"><b>${item.cost}</b><small>buy</small></span></button>`).join("");
  gamesContainer.innerHTML = unlockableGames.map(item => `<button class="shop-item" type="button" data-shop="${item.id}"><span class="shop-icon unlock-icon" aria-hidden="true">${item.icon}</span><span class="shop-copy"><strong>${item.title}</strong><small>${item.description}</small></span><span class="shop-cost"><b>${isGameUnlocked(item.id) ? "OPEN" : item.cost}</b><small>${isGameUnlocked(item.id) ? "play" : "unlock"}</small></span></button>`).join("");
  document.querySelectorAll("[data-shop]").forEach(button => button.addEventListener("click", () => buyShopItem(button.dataset.shop)));
}
function updateShop() {
  document.getElementById("pointsValue").textContent = walletPoints;
  document.querySelectorAll("[data-shop]").forEach(button => {
    const item = shopItems.find(entry => entry.id === button.dataset.shop) || unlockableGames.find(entry => entry.id === button.dataset.shop);
    const owned = shopItems.some(entry => entry.id === button.dataset.shop) ? isUpgradeOwned(item) : isGameUnlocked(item.id);
    button.disabled = (!owned && walletPoints < item.cost) || (item.type === "upgrade" && false);
    if (unlockableGames.some(entry => entry.id === button.dataset.shop) && owned) button.disabled = false;
  });
  renderShop();
  document.querySelectorAll("[data-shop]").forEach(button => {
    const item = shopItems.find(entry => entry.id === button.dataset.shop) || unlockableGames.find(entry => entry.id === button.dataset.shop);
    const owned = shopItems.some(entry => entry.id === button.dataset.shop) ? false : isGameUnlocked(item.id);
    button.disabled = shopItems.some(entry => entry.id === button.dataset.shop) ? walletPoints < item.cost : (!owned && walletPoints < item.cost);
  });
}
function awardPoints(amount) {
  if (!amount || amount < 1) return;
  walletPoints += Math.floor(amount);
  saveBest("wallet", walletPoints);
  updateShop();
}
function setShopMessage(message, type = "") {
  const element = document.getElementById("shopMessage");
  element.textContent = message;
  element.className = `shop-message ${type}`;
}
function syncLockedGames() {
  menuButtons.forEach(button => {
    const gameId = button.dataset.game;
    const unlocked = isGameUnlocked(gameId);
    const lockLabel = button.querySelector(".lock-label");
    if (!lockLabel) return;
    button.disabled = !unlocked;
    button.classList.toggle("locked", !unlocked);
    button.setAttribute("aria-disabled", String(!unlocked));
    lockLabel.textContent = unlocked ? "Unlocked" : "Locked";
  });
}
function buyShopItem(item) {
  const entry = shopItems.find(candidate => candidate.id === item) || unlockableGames.find(candidate => candidate.id === item);
  if (!entry) return;
  if (entry.type !== "upgrade" && isGameUnlocked(item)) { switchGame(item); return; }
  if (walletPoints < entry.cost) { setShopMessage(`You need ${entry.cost - walletPoints} more points.`, "error"); return; }
  walletPoints -= entry.cost; saveBest("wallet", walletPoints);
  if (entry.type === "upgrade") { upgradeCounts[item] += 1; saveBest(`upgrade-${item}`, upgradeCounts[item]); if (item === "snakeLife") { snakeLives += 1; saveBest("snake-lives", snakeLives); } setShopMessage(`${entry.title} added to your upgrades.`, "success"); }
  else { saveBest(`unlock-${item}`, 1); syncLockedGames(); setShopMessage(`${entry.title} unlocked.`, "success"); }
  updateShop();
}

function switchGame(gameId) {
  activeGame = gameId;
  const info = gameInfo[gameId];
  titleEl.textContent = info.title;
  descriptionEl.textContent = info.description;
  numberEl.textContent = info.number;
  restartButton.style.visibility = "visible";
  scoreStripEl.style.display = "grid";
  shopButton.classList.remove("active");
  menuButtons.forEach(button => {
    const selected = button.dataset.game === gameId;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  panels.forEach(panel => panel.classList.toggle("active", panel.dataset.panel === gameId));
  if (gameId === "snake") { drawSnake(); updateSnakeStats(); }
  if (gameId === "2048") { render2048(); update2048Stats(); }
  if (gameId === "tetris") { drawTetris(); updateTetrisStats(); }
  if (gameId === "minesweeper") { renderMinesweeper(); updateMineStats(); }
  if (gameId === "pong") { drawPong(); updatePongStats(); }
  if (info.bonus) { panels.forEach(panel => panel.classList.toggle("active", panel.dataset.panel === "bonus")); initBonusGame(gameId); }
}

menuButtons.forEach(button => button.addEventListener("click", () => switchGame(button.dataset.game)));
function showShop() { activeGame = "shop"; titleEl.textContent = "Arcade shop"; descriptionEl.textContent = "Use your shared points to expand the playground."; numberEl.textContent = "SHOP"; panels.forEach(panel => panel.classList.toggle("active", panel.dataset.panel === "shop")); menuButtons.forEach(button => { button.classList.remove("active"); button.setAttribute("aria-pressed", "false"); }); shopButton.classList.add("active"); restartButton.style.visibility = "hidden"; scoreStripEl.style.display = "none"; updateShop(); }
shopButton.addEventListener("click", showShop);
document.querySelectorAll("[data-start]").forEach(button => button.addEventListener("click", () => {
  const game = button.dataset.start;
  if (game === "snake") startSnake();
  if (game === "2048") reset2048();
  if (game === "tetris") startTetris();
  if (game === "pong") startPong();
}));
document.getElementById("restartButton").addEventListener("click", () => {
  if (activeGame === "snake") resetSnake();
  if (activeGame === "2048") reset2048();
  if (activeGame === "tetris") resetTetris();
  if (activeGame === "minesweeper") resetMinesweeper();
  if (activeGame === "pong") resetPong();
  if (activeGame === "shop") showShop();
});

// Unlockable mini-games. Each title gets its own rules and input model.
let bonusCleanup = () => {};
let bonusKeyHandler = () => {};
let bonusKeyUpHandler = () => {};
let bonusGameId = "";
function bonusShell(title, description, content, help = "") { return `<div class="mini-game"><span class="eyebrow">Unlocked bonus</span><h2>${title}</h2><p>${description}</p>${content}${help ? `<small class="mini-help">${help}</small>` : ""}</div>`; }
function initBonusGame(gameId) {
  bonusCleanup(); bonusKeyHandler = () => {}; bonusKeyUpHandler = () => {}; bonusGameId = gameId;
  const info = gameInfo[gameId];
  if (gameId === "brickBreaker") return initBrickBreaker(info);
  if (gameId === "flappyDot") return initFlappyDot(info);
  if (gameId === "connectFour") return initConnectFour(info);
  if (gameId === "matchPairs") return initMatchPairs(info);
  if (gameId === "whackBlock") return initWhackBlock(info);
  if (gameId === "lightsOut") return initLightsOut(info);
  if (gameId === "memoryFlip") return initMemoryFlip(info);
  if (gameId === "bubblePop") return initBubblePop(info);
  if (gameId === "solitaireMini") return initSolitaire(info);
  if (gameId === "roadDash") return initRoadDash(info);
}
function miniScore(host, score) { const element = host.querySelector("[data-mini-score]"); if (element) element.textContent = score; }

function initBrickBreaker(info) {
  bonusHost.innerHTML = bonusShell(info.title, info.description, `<div class="mini-toolbar"><span>Score <strong data-mini-score>0</strong></span><span>Lives <strong data-mini-lives>3</strong></span></div><canvas id="brickCanvas" width="480" height="300" tabindex="0"></canvas>`, "Move with A/D or the left and right arrow keys.");
  const canvas = document.getElementById("brickCanvas"), ctx = canvas.getContext("2d"), paddle = { x: 210, y: 278, w: 60, h: 8 }, ball = { x: 240, y: 260, vx: 3, vy: -3 }, bricks = [];
  let score = 0, lives = 3, raf = 0, left = false, right = false;
  for (let row = 0; row < 4; row++) for (let col = 0; col < 8; col++) bricks.push({ x: 22 + col * 55, y: 25 + row * 20, w: 48, h: 13, color: ["#ff6b4a", "#ffd166", "#6ed6df", "#c4ea72"][row], alive: true });
  const key = keyName => { if (keyName === "ArrowLeft" || keyName.toLowerCase() === "a") left = true; if (keyName === "ArrowRight" || keyName.toLowerCase() === "d") right = true; };
  bonusKeyUpHandler = keyName => { if (keyName === "ArrowLeft" || keyName.toLowerCase() === "a") left = false; if (keyName === "ArrowRight" || keyName.toLowerCase() === "d") right = false; };
  bonusKeyHandler = key;
  const draw = () => { ctx.fillStyle = "#0f1518"; ctx.fillRect(0, 0, 480, 300); bricks.forEach(brick => { if (brick.alive) { ctx.fillStyle = brick.color; ctx.fillRect(brick.x, brick.y, brick.w, brick.h); } }); ctx.fillStyle = "#c4ea72"; ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h); ctx.fillStyle = "#ffd166"; ctx.beginPath(); ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2); ctx.fill(); };
  const loop = () => { if (left) paddle.x -= 6; if (right) paddle.x += 6; paddle.x = Math.max(0, Math.min(420, paddle.x)); ball.x += ball.vx; ball.y += ball.vy; if (ball.x < 6 || ball.x > 474) ball.vx *= -1; if (ball.y < 6) ball.vy *= -1; if (ball.vy > 0 && ball.y > paddle.y - 8 && ball.x > paddle.x && ball.x < paddle.x + paddle.w) { ball.vy = -Math.abs(ball.vy); ball.vx += (ball.x - paddle.x - paddle.w / 2) * .03; } bricks.forEach(brick => { if (brick.alive && ball.x > brick.x && ball.x < brick.x + brick.w && ball.y > brick.y && ball.y < brick.y + brick.h) { brick.alive = false; ball.vy *= -1; score += 5; miniScore(bonusHost, score); awardPoints(5); } }); if (ball.y > 306) { lives -= 1; bonusHost.querySelector("[data-mini-lives]").textContent = lives; if (lives <= 0) { ball.x = 240; ball.y = 260; lives = 3; bricks.forEach(brick => brick.alive = true); score = 0; miniScore(bonusHost, 0); } else { ball.x = 240; ball.y = 260; } } draw(); raf = requestAnimationFrame(loop); };
  draw(); raf = requestAnimationFrame(loop); bonusCleanup = () => cancelAnimationFrame(raf);
}

function initFlappyDot(info) {
  bonusHost.innerHTML = bonusShell(info.title, info.description, `<div class="mini-toolbar"><span>Score <strong data-mini-score>0</strong></span><span>Click or press Space to flap</span></div><canvas id="flappyCanvas" width="420" height="300" tabindex="0"></canvas>`);
  const canvas = document.getElementById("flappyCanvas"), ctx = canvas.getContext("2d"), bird = { x: 85, y: 150, vy: 0 }, pipes = []; let score = 0, frame = 0, raf = 0, running = true;
  const flap = () => { bird.vy = -5.5; }; canvas.addEventListener("click", flap); bonusKeyHandler = key => { if (key === " " || key === "ArrowUp") flap(); };
  const draw = () => { ctx.fillStyle = "#132027"; ctx.fillRect(0, 0, 420, 300); ctx.fillStyle = "#263f48"; pipes.forEach(pipe => { ctx.fillRect(pipe.x, 0, 34, pipe.gapY - 43); ctx.fillRect(pipe.x, pipe.gapY + 43, 34, 300); }); ctx.fillStyle = "#ffd166"; ctx.beginPath(); ctx.arc(bird.x, bird.y, 10, 0, Math.PI * 2); ctx.fill(); };
  const loop = () => { frame++; bird.vy += .24; bird.y += bird.vy; if (frame % 105 === 0) pipes.push({ x: 420, gapY: 65 + Math.random() * 150, passed: false }); pipes.forEach(pipe => pipe.x -= 2.3); while (pipes.length && pipes[0].x < -40) pipes.shift(); const hit = bird.y < 0 || bird.y > 300 || pipes.some(pipe => bird.x + 9 > pipe.x && bird.x - 9 < pipe.x + 34 && (bird.y < pipe.gapY - 43 || bird.y > pipe.gapY + 43)); if (hit) { bird.y = 150; bird.vy = 0; pipes.length = 0; score = 0; miniScore(bonusHost, 0); } pipes.forEach(pipe => { if (!pipe.passed && pipe.x + 34 < bird.x) { pipe.passed = true; score += 10; miniScore(bonusHost, score); awardPoints(10); } }); draw(); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); bonusCleanup = () => cancelAnimationFrame(raf);
}

function initConnectFour(info) {
  bonusHost.innerHTML = bonusShell(info.title, info.description, `<div class="mini-toolbar"><span>Click a column</span><span>First to four wins</span></div><div id="connectGrid" class="mini-grid connect-grid"></div><small id="connectMessage" class="mini-help">Your turn</small>`);
  const grid = document.getElementById("connectGrid"), message = document.getElementById("connectMessage"), board = Array.from({ length: 42 }, () => "");
  const win = (token) => { const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]]; return board.some((cell, index) => cell === token && dirs.some(([dx, dy]) => { let total = 1, r = Math.floor(index / 7) + dy, c = index % 7 + dx; while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r * 7 + c] === token) { total++; r += dy; c += dx; } return total >= 4; })); };
  const render = () => { grid.innerHTML = ""; for (let index = 0; index < 42; index++) { const button = document.createElement("button"); button.dataset.index = index; button.className = board[index] ? board[index] : ""; button.addEventListener("click", () => drop(Number(button.dataset.index) % 7)); grid.appendChild(button); } };
  const drop = column => { let row = 5; while (row >= 0 && board[row * 7 + column]) row--; if (row < 0) return; board[row * 7 + column] = "red"; if (win("red")) { message.textContent = "You win! New game with the restart button."; awardPoints(30); render(); return; } const open = []; for (let col = 0; col < 7; col++) if (!board[col]) open.push(col); if (!open.length) { message.textContent = "Draw. Start again to play."; render(); return; } const aiCol = open[Math.floor(Math.random() * open.length)]; let aiRow = 5; while (board[aiRow * 7 + aiCol]) aiRow--; board[aiRow * 7 + aiCol] = "yellow"; if (win("yellow")) message.textContent = "The board wins this time."; render(); };
  render(); bonusCleanup = () => {};
}

function initMatchPairs(info) {
  bonusHost.innerHTML = bonusShell(info.title, info.description, `<div class="mini-toolbar"><span>Matches <strong data-mini-score>0</strong>/8</span><span>Click two cards</span></div><div id="pairsGrid" class="mini-grid pairs-grid"></div>`);
  const grid = document.getElementById("pairsGrid"), values = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H"].sort(() => Math.random() - .5); let open = [], matched = [], matches = 0, locked = false;
  const render = () => { grid.innerHTML = ""; values.forEach((value, index) => { const button = document.createElement("button"); const visible = open.includes(index) || matched.includes(index); button.textContent = visible ? value : "?"; button.className = matched.includes(index) ? "matched" : open.includes(index) ? "face-up" : ""; button.addEventListener("click", () => flip(index, button)); grid.appendChild(button); }); };
  const flip = (index, button) => { if (locked || open.includes(index) || matched.includes(index)) return; open.push(index); button.textContent = values[index]; button.classList.add("face-up"); if (open.length < 2) return; locked = true; if (values[open[0]] === values[open[1]]) { matched.push(...open); matches++; awardPoints(10); miniScore(bonusHost, matches); open = []; locked = false; render(); } else setTimeout(() => { open = []; locked = false; render(); }, 650); };
  render(); bonusCleanup = () => {};
}

function initWhackBlock(info) {
  bonusHost.innerHTML = bonusShell(info.title, info.description, `<div class="mini-toolbar"><span>Score <strong data-mini-score>0</strong></span><span>20 seconds</span></div><div id="whackGrid" class="mini-grid lights-grid"></div>`);
  const grid = document.getElementById("whackGrid"), cells = 9; let target = 0, score = 0, time = 20, interval = 0, clock = 0;
  const render = () => { grid.innerHTML = ""; for (let i = 0; i < cells; i++) { const button = document.createElement("button"); button.textContent = i === target ? "*" : ""; button.className = i === target ? "on" : ""; button.addEventListener("click", () => { if (i === target && time > 0) { score += 5; awardPoints(5); miniScore(bonusHost, score); target = Math.floor(Math.random() * cells); render(); } }); grid.appendChild(button); } };
  render(); interval = setInterval(() => { target = Math.floor(Math.random() * cells); render(); }, 700); clock = setInterval(() => { time--; const label = bonusHost.querySelector(".mini-toolbar span:last-child"); if (label) label.textContent = `${time} seconds`; if (time <= 0) { clearInterval(interval); clearInterval(clock); } }, 1000); bonusCleanup = () => { clearInterval(interval); clearInterval(clock); };
}

function initLightsOut(info) {
  bonusHost.innerHTML = bonusShell(info.title, info.description, `<div class="mini-toolbar"><span>Turn every light off</span><span>Click to toggle neighbors</span></div><div id="lightsGrid" class="mini-grid lights-grid"></div>`);
  const grid = document.getElementById("lightsGrid"), state = Array.from({ length: 9 }, () => Math.random() > .45); const render = () => { grid.innerHTML = ""; state.forEach((on, index) => { const button = document.createElement("button"); button.className = on ? "on" : ""; button.addEventListener("click", () => { [index, index - 1, index + 1, index - 3, index + 3].forEach(next => { if (next >= 0 && next < 9 && (next === index || Math.floor(next / 3) === Math.floor(index / 3) || next === index - 3 || next === index + 3)) state[next] = !state[next]; }); render(); if (state.every(value => !value)) awardPoints(30); }); grid.appendChild(button); }); }; render(); bonusCleanup = () => {};
}

function initMemoryFlip(info) {
  bonusHost.innerHTML = bonusShell(info.title, info.description, `<div class="mini-toolbar"><span>Matches <strong data-mini-score>0</strong>/8</span><span>Flip two cards</span></div><div id="memoryGrid" class="mini-grid memory-grid"></div>`);
  const grid = document.getElementById("memoryGrid"), values = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H"].sort(() => Math.random() - .5); let open = [], matched = [], locked = false, matches = 0;
  const render = () => { grid.innerHTML = ""; values.forEach((value, index) => { const button = document.createElement("button"); button.textContent = open.includes(index) || matched.includes(index) ? value : ""; button.className = open.includes(index) ? "revealed" : matched.includes(index) ? "matched" : ""; button.addEventListener("click", () => flip(index)); grid.appendChild(button); }); };
  const flip = index => { if (locked || matched.includes(index) || open.includes(index)) return; open.push(index); render(); if (open.length < 2) return; locked = true; if (values[open[0]] === values[open[1]]) { matched.push(...open); open = []; matches++; awardPoints(10); miniScore(bonusHost, matches); locked = false; render(); } else setTimeout(() => { open = []; locked = false; render(); }, 650); }; render(); bonusCleanup = () => {};
}

function initBubblePop(info) {
  bonusHost.innerHTML = bonusShell(info.title, info.description, `<div class="mini-toolbar"><span>Score <strong data-mini-score>0</strong></span><span>Click bubbles</span></div><canvas id="bubbleCanvas" width="480" height="300"></canvas>`);
  const canvas = document.getElementById("bubbleCanvas"), ctx = canvas.getContext("2d"); let bubbles = [], score = 0, raf = 0; const spawn = () => bubbles.push({ x: 20 + Math.random() * 440, y: 30 + Math.random() * 240, r: 10 + Math.random() * 12, vx: Math.random() * 1.4 - .7, vy: Math.random() * 1.4 - .7, color: ["#ff6b4a", "#ffd166", "#6ed6df", "#c4ea72"][Math.floor(Math.random() * 4)] }); for (let i = 0; i < 8; i++) spawn(); canvas.addEventListener("click", event => { const rect = canvas.getBoundingClientRect(), x = (event.clientX - rect.left) * canvas.width / rect.width, y = (event.clientY - rect.top) * canvas.height / rect.height; const hit = bubbles.findIndex(bubble => Math.hypot(bubble.x - x, bubble.y - y) < bubble.r); if (hit >= 0) { bubbles.splice(hit, 1); spawn(); score += 5; miniScore(bonusHost, score); awardPoints(5); } }); const loop = () => { ctx.fillStyle = "#0f1518"; ctx.fillRect(0, 0, 480, 300); bubbles.forEach(bubble => { bubble.x += bubble.vx; bubble.y += bubble.vy; if (bubble.x < bubble.r || bubble.x > 480 - bubble.r) bubble.vx *= -1; if (bubble.y < bubble.r || bubble.y > 300 - bubble.r) bubble.vy *= -1; ctx.fillStyle = bubble.color; ctx.beginPath(); ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2); ctx.fill(); }); raf = requestAnimationFrame(loop); }; loop(); bonusCleanup = () => cancelAnimationFrame(raf);
}

function initSolitaire(info) {
  bonusHost.innerHTML = bonusShell(info.title, info.description, `<div class="mini-toolbar"><span>Correct <strong data-mini-score>0</strong></span><span>Guess the next card</span></div><div id="solitaireCard" class="solitaire-card">7</div><div class="solitaire-choice"><button type="button" data-guess="higher">Higher</button><button type="button" data-guess="lower">Lower</button></div><small id="solitaireMessage" class="mini-help">Can you read the next card?</small>`);
  const card = document.getElementById("solitaireCard"), message = document.getElementById("solitaireMessage"); let current = 7, score = 0; const next = guess => { const nextCard = 1 + Math.floor(Math.random() * 13); const correct = (guess === "higher" && nextCard > current) || (guess === "lower" && nextCard < current); if (correct) { score += 5; awardPoints(5); miniScore(bonusHost, score); message.textContent = "Correct. Deal again."; } else message.textContent = "Not this time. Deal again."; current = nextCard; card.textContent = current; }; bonusHost.querySelectorAll("[data-guess]").forEach(button => button.addEventListener("click", () => next(button.dataset.guess))); bonusCleanup = () => {};
}

function initRoadDash(info) {
  bonusHost.innerHTML = bonusShell(info.title, info.description, `<div class="mini-toolbar"><span>Dodged <strong data-mini-score>0</strong></span><span>Move with A/D or arrows</span></div><canvas id="roadCanvas" width="420" height="300" tabindex="0"></canvas>`);
  const canvas = document.getElementById("roadCanvas"), ctx = canvas.getContext("2d"), player = { x: 190, y: 250, w: 32, h: 22 }, cars = []; let score = 0, raf = 0, left = false, right = false, frame = 0;
  bonusKeyHandler = key => { if (key === "ArrowLeft" || key.toLowerCase() === "a") left = true; if (key === "ArrowRight" || key.toLowerCase() === "d") right = true; };
  bonusKeyUpHandler = key => { if (key === "ArrowLeft" || key.toLowerCase() === "a") left = false; if (key === "ArrowRight" || key.toLowerCase() === "d") right = false; };
  const draw = () => { ctx.fillStyle = "#273238"; ctx.fillRect(0, 0, 420, 300); ctx.fillStyle = "#ffd166"; for (let y = -20; y < 300; y += 42) ctx.fillRect(207, y, 6, 22); ctx.fillStyle = "#6ed6df"; ctx.fillRect(player.x, player.y, player.w, player.h); cars.forEach(car => { ctx.fillStyle = "#ff6b4a"; ctx.fillRect(car.x, car.y, car.w, car.h); }); };
  const loop = () => { frame++; if (left) player.x -= 5; if (right) player.x += 5; player.x = Math.max(100, Math.min(288, player.x)); if (frame % 65 === 0) cars.push({ x: 100 + Math.floor(Math.random() * 4) * 48, y: -30, w: 32, h: 22 }); cars.forEach(car => car.y += 3.5); for (let i = cars.length - 1; i >= 0; i--) { const car = cars[i]; if (car.y > 320) { cars.splice(i, 1); score += 5; miniScore(bonusHost, score); awardPoints(5); } else if (player.x < car.x + car.w && player.x + player.w > car.x && player.y < car.y + car.h && player.y + player.h > car.y) { cars.length = 0; score = 0; miniScore(bonusHost, 0); } } draw(); raf = requestAnimationFrame(loop); }; loop(); bonusCleanup = () => cancelAnimationFrame(raf);
}

// Snake
const snakeCanvas = document.getElementById("snakeCanvas");
const snakeCtx = snakeCanvas.getContext("2d");
const snakeSize = 21;
let snake = [], snakeFood = { x: 14, y: 10 }, snakeDirection = { x: 1, y: 0 }, snakeNextDirection = { x: 1, y: 0 };
let snakeScore = 0, snakeTimer = null, snakeRunning = false, snakeOver = false;
function updateSnakeStats() { updateStats(snakeScore, readBest("snake"), 1, snakeOver ? "Game over" : snakeRunning ? "Playing" : "Ready"); }
function resetSnake() {
  clearInterval(snakeTimer);
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  snakeFood = { x: 15, y: 10 }; snakeDirection = { x: 1, y: 0 }; snakeNextDirection = { x: 1, y: 0 };
  snakeScore = 0; snakeRunning = false; snakeOver = false;
  document.getElementById("snakeOverlay").classList.remove("hidden"); drawSnake(); updateSnakeStats();
}
function startSnake() {
  if (snakeOver) resetSnake();
  snakeRunning = true; snakeOver = false; document.getElementById("snakeOverlay").classList.add("hidden"); snakeCanvas.focus();
  clearInterval(snakeTimer); snakeTimer = setInterval(stepSnake, 108); updateSnakeStats();
}
function stepSnake() {
  snakeDirection = snakeNextDirection;
  const head = { x: snake[0].x + snakeDirection.x, y: snake[0].y + snakeDirection.y };
  const hitWall = head.x < 0 || head.y < 0 || head.x >= snakeSize || head.y >= snakeSize;
  const hitTail = snake.some((part, index) => index > 0 && part.x === head.x && part.y === head.y);
  if (hitWall || hitTail) { endSnake(); return; }
  snake.unshift(head);
  if (head.x === snakeFood.x && head.y === snakeFood.y) {
    snakeScore += 10;
    awardPoints(10);
    if (snakeScore > readBest("snake")) saveBest("snake", snakeScore);
    placeSnakeFood();
  } else snake.pop();
  drawSnake(); updateSnakeStats();
}
function placeSnakeFood() {
  do { snakeFood = { x: Math.floor(Math.random() * snakeSize), y: Math.floor(Math.random() * snakeSize) }; }
  while (snake.some(part => part.x === snakeFood.x && part.y === snakeFood.y));
}
function endSnake() {
  clearInterval(snakeTimer);
  if (snakeLives > 0) {
    snakeLives -= 1; saveBest("snake-lives", snakeLives); snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    snakeFood = { x: 15, y: 10 }; snakeDirection = { x: 1, y: 0 }; snakeNextDirection = { x: 1, y: 0 }; snakeRunning = true; snakeOver = false;
    setShopMessage("Extra life used. Keep going!", "success"); updateShop(); snakeTimer = setInterval(stepSnake, 108); updateSnakeStats(); return;
  }
  snakeRunning = false; snakeOver = true;
  document.getElementById("snakeOverlay").querySelector(".overlay-kicker").textContent = "RUN ENDED";
  document.getElementById("snakeOverlay").querySelector("strong").textContent = `Score ${snakeScore}`;
  document.getElementById("snakeOverlay").querySelector("span:not(.overlay-kicker)").textContent = "Press New game to take another run.";
  document.getElementById("snakeOverlay").querySelector("button").textContent = "Try again";
  document.getElementById("snakeOverlay").classList.remove("hidden"); updateSnakeStats();
}
function drawSnake() {
  const cell = snakeCanvas.width / snakeSize;
  snakeCtx.fillStyle = "#0f1518"; snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  snakeCtx.strokeStyle = "#1e2a2f"; snakeCtx.lineWidth = 1;
  for (let i = 1; i < snakeSize; i++) { snakeCtx.beginPath(); snakeCtx.moveTo(i * cell, 0); snakeCtx.lineTo(i * cell, snakeCanvas.height); snakeCtx.stroke(); snakeCtx.beginPath(); snakeCtx.moveTo(0, i * cell); snakeCtx.lineTo(snakeCanvas.width, i * cell); snakeCtx.stroke(); }
  snakeCtx.fillStyle = "#ff6b4a"; snakeCtx.beginPath(); snakeCtx.arc((snakeFood.x + .5) * cell, (snakeFood.y + .5) * cell, cell * .25, 0, Math.PI * 2); snakeCtx.fill();
  snake.forEach((part, index) => { snakeCtx.fillStyle = index === 0 ? "#c4ea72" : "#79a83d"; snakeCtx.fillRect(part.x * cell + 2, part.y * cell + 2, cell - 4, cell - 4); });
}

// 2048
let board2048 = [], score2048 = 0, over2048 = false;
function update2048Stats() { updateStats(score2048, readBest("2048"), 1, over2048 ? "Game over" : "Playing"); }
function reset2048() { board2048 = Array.from({ length: 4 }, () => Array(4).fill(0)); score2048 = 0; over2048 = false; addTile2048(); addTile2048(); document.getElementById("game2048Overlay").classList.add("hidden"); render2048(); update2048Stats(); }
function addTile2048() { const empty = []; board2048.forEach((row, r) => row.forEach((value, c) => { if (!value) empty.push([r, c]); })); if (!empty.length) return; const [r, c] = empty[Math.floor(Math.random() * empty.length)]; board2048[r][c] = Math.random() < .9 ? 2 : 4; }
function process2048Line(line) { const values = line.filter(Boolean); const output = []; let gained = 0; for (let i = 0; i < values.length; i++) { if (values[i] === values[i + 1]) { output.push(values[i] * 2); gained += values[i] * 2; i++; } else output.push(values[i]); } while (output.length < 4) output.push(0); return { line: output, gained }; }
function move2048(direction) {
  if (over2048) return;
  const before = JSON.stringify(board2048); let gained = 0;
  if (direction === "left" || direction === "right") {
    board2048 = board2048.map(row => { const line = direction === "right" ? [...row].reverse() : [...row]; const result = process2048Line(line); gained += result.gained; return direction === "right" ? result.line.reverse() : result.line; });
  } else {
    const transposed = board2048[0].map((_, c) => board2048.map(row => row[c]));
    const moved = transposed.map(row => { const line = direction === "down" ? [...row].reverse() : [...row]; const result = process2048Line(line); gained += result.gained; return direction === "down" ? result.line.reverse() : result.line; });
    board2048 = board2048[0].map((_, c) => moved.map(row => row[c]));
  }
  if (JSON.stringify(board2048) !== before) { score2048 += gained; awardPoints(gained); if (score2048 > readBest("2048")) saveBest("2048", score2048); addTile2048(); render2048(); }
  if (!canMove2048()) end2048(); update2048Stats();
}
function canMove2048() { for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { if (!board2048[r][c]) return true; if (c < 3 && board2048[r][c] === board2048[r][c + 1]) return true; if (r < 3 && board2048[r][c] === board2048[r + 1][c]) return true; } return false; }
function end2048() { over2048 = true; document.getElementById("game2048Message").textContent = "No more moves"; document.getElementById("game2048Overlay").classList.remove("hidden"); }
function render2048() { const grid = document.getElementById("game2048Grid"); grid.innerHTML = ""; board2048.flat().forEach(value => { const tile = document.createElement("div"); tile.className = `tile tile-${value}`; tile.textContent = value || ""; tile.setAttribute("role", "gridcell"); tile.setAttribute("aria-label", value ? `Tile ${value}` : "Empty tile"); grid.appendChild(tile); }); }

// Tetris
const tetrisCanvas = document.getElementById("tetrisCanvas"); const tetrisCtx = tetrisCanvas.getContext("2d"); const nextCanvas = document.getElementById("nextCanvas"); const nextCtx = nextCanvas.getContext("2d");
const tetrisPieces = [
  { shape: [[1, 1, 1, 1]], color: "#6ed6df" }, { shape: [[1, 1], [1, 1]], color: "#ffd166" }, { shape: [[0, 1, 0], [1, 1, 1]], color: "#a99bff" }, { shape: [[1, 0, 0], [1, 1, 1]], color: "#ff8b5c" }, { shape: [[0, 0, 1], [1, 1, 1]], color: "#5477ef" }, { shape: [[0, 1, 1], [1, 1, 0]], color: "#c4ea72" }, { shape: [[1, 1, 0], [0, 1, 1]], color: "#ff6b8a" }
];
let tetrisBoard = [], tetrisCurrent = null, tetrisNext = null, tetrisScore = 0, tetrisLines = 0, tetrisLevel = 1, tetrisRunning = false, tetrisOver = false, tetrisPaused = false, tetrisFrame = 0, tetrisLastDrop = 0, tetrisDropInterval = 800;
function updateTetrisStats() { updateStats(tetrisScore, readBest("tetris"), tetrisLevel, tetrisOver ? "Game over" : tetrisPaused ? "Paused" : tetrisRunning ? "Playing" : "Ready"); }
function resetTetris() { tetrisRunning = false; tetrisPaused = false; tetrisOver = false; tetrisScore = 0; tetrisLines = 0; tetrisLevel = 1; tetrisDropInterval = 800; tetrisBoard = Array.from({ length: 20 }, () => Array(10).fill(0)); tetrisNext = randomPiece(); spawnTetrisPiece(); document.getElementById("tetrisOverlay").classList.remove("hidden"); drawTetris(); updateTetrisStats(); }
function randomPiece() { const source = tetrisPieces[Math.floor(Math.random() * tetrisPieces.length)]; return { shape: source.shape.map(row => [...row]), color: source.color }; }
function spawnTetrisPiece() { tetrisCurrent = tetrisNext || randomPiece(); tetrisNext = randomPiece(); tetrisCurrent.x = Math.floor((10 - tetrisCurrent.shape[0].length) / 2); tetrisCurrent.y = 0; drawNextPiece(); if (collidesTetris(tetrisCurrent, 0, 0)) endTetris(); }
function startTetris() { if (tetrisOver) resetTetris(); tetrisRunning = true; tetrisPaused = false; document.getElementById("tetrisOverlay").classList.add("hidden"); tetrisCanvas.focus(); updateTetrisStats(); }
function rotateTetris(shape) { return shape[0].map((_, c) => shape.map(row => row[c]).reverse()); }
function collidesTetris(piece, dx, dy, shape = piece.shape) { return shape.some((row, y) => row.some((cell, x) => { if (!cell) return false; const nx = piece.x + x + dx; const ny = piece.y + y + dy; return nx < 0 || nx >= 10 || ny >= 20 || (ny >= 0 && tetrisBoard[ny][nx]); })); }
function moveTetris(dx, dy) { if (!tetrisCurrent || collidesTetris(tetrisCurrent, dx, dy)) return false; tetrisCurrent.x += dx; tetrisCurrent.y += dy; return true; }
function rotateCurrentTetris() { const rotated = rotateTetris(tetrisCurrent.shape); for (const offset of [0, -1, 1, -2, 2]) if (!collidesTetris(tetrisCurrent, offset, 0, rotated)) { tetrisCurrent.x += offset; tetrisCurrent.shape = rotated; return; } }
function lockTetris() { tetrisCurrent.shape.forEach((row, y) => row.forEach((cell, x) => { if (cell && tetrisCurrent.y + y >= 0) tetrisBoard[tetrisCurrent.y + y][tetrisCurrent.x + x] = tetrisCurrent.color; })); const cleared = clearTetrisLines(); tetrisLines += cleared; const linePoints = cleared === 1 ? 100 * tetrisLevel : cleared === 2 ? 300 * tetrisLevel : cleared === 3 ? 500 * tetrisLevel : cleared === 4 ? 800 * tetrisLevel : 0; tetrisScore += linePoints; awardPoints(linePoints); tetrisLevel = Math.floor(tetrisLines / 10) + 1; tetrisDropInterval = Math.max(110, 800 - (tetrisLevel - 1) * 65); if (tetrisScore > readBest("tetris")) saveBest("tetris", tetrisScore); spawnTetrisPiece(); }
function clearTetrisLines() { let cleared = 0; tetrisBoard = tetrisBoard.filter(row => { if (row.every(Boolean)) { cleared++; return false; } return true; }); while (tetrisBoard.length < 20) tetrisBoard.unshift(Array(10).fill(0)); return cleared; }
function hardDropTetris() { let distance = 0; while (moveTetris(0, 1)) distance++; tetrisScore += distance * 2; awardPoints(distance * 2); lockTetris(); }
function endTetris() { tetrisRunning = false; tetrisOver = true; document.getElementById("tetrisOverlay").querySelector(".overlay-kicker").textContent = "STACK COMPLETE"; document.getElementById("tetrisOverlay").querySelector("strong").textContent = `Score ${tetrisScore}`; document.getElementById("tetrisOverlay").querySelector("span:not(.overlay-kicker)").textContent = "Start a fresh board whenever you are ready."; document.getElementById("tetrisOverlay").querySelector("button").textContent = "Try again"; document.getElementById("tetrisOverlay").classList.remove("hidden"); updateTetrisStats(); }
function drawBlock(ctx, x, y, size, color) { ctx.fillStyle = color; ctx.fillRect(x + 1, y + 1, size - 2, size - 2); ctx.fillStyle = "rgba(255,255,255,.22)"; ctx.fillRect(x + 2, y + 2, size - 5, 3); ctx.fillStyle = "rgba(0,0,0,.16)"; ctx.fillRect(x + 2, y + size - 5, size - 4, 3); }
function drawTetris() { const size = 24; tetrisCtx.fillStyle = "#0f1518"; tetrisCtx.fillRect(0, 0, 240, 480); tetrisCtx.strokeStyle = "#1f2a2f"; for (let x = 1; x < 10; x++) { tetrisCtx.beginPath(); tetrisCtx.moveTo(x * size, 0); tetrisCtx.lineTo(x * size, 480); tetrisCtx.stroke(); } for (let y = 1; y < 20; y++) { tetrisCtx.beginPath(); tetrisCtx.moveTo(0, y * size); tetrisCtx.lineTo(240, y * size); tetrisCtx.stroke(); } tetrisBoard.forEach((row, y) => row.forEach((color, x) => { if (color) drawBlock(tetrisCtx, x * size, y * size, size, color); })); if (tetrisCurrent) tetrisCurrent.shape.forEach((row, y) => row.forEach((cell, x) => { if (cell) drawBlock(tetrisCtx, (tetrisCurrent.x + x) * size, (tetrisCurrent.y + y) * size, size, tetrisCurrent.color); })); }
function drawNextPiece() { nextCtx.fillStyle = "#11181b"; nextCtx.fillRect(0, 0, 120, 120); if (!tetrisNext) return; const size = 23; const offsetX = (120 - tetrisNext.shape[0].length * size) / 2; const offsetY = (120 - tetrisNext.shape.length * size) / 2; tetrisNext.shape.forEach((row, y) => row.forEach((cell, x) => { if (cell) drawBlock(nextCtx, offsetX + x * size, offsetY + y * size, size, tetrisNext.color); })); }
function tetrisLoop(time = 0) { if (activeGame === "tetris" && tetrisRunning && !tetrisPaused) { if (time - tetrisLastDrop > tetrisDropInterval) { if (!moveTetris(0, 1)) lockTetris(); tetrisLastDrop = time; } drawTetris(); updateTetrisStats(); } tetrisFrame = requestAnimationFrame(tetrisLoop); }

// Pong bonus game
const pongCanvas = document.getElementById("pongCanvas"); const pongCtx = pongCanvas.getContext("2d");
let pongPlayerY = 120, pongAiY = 120, pongBall = { x: 240, y: 150, vx: 4, vy: 2 }, pongPlayerScore = 0, pongAiScore = 0, pongRunning = false, pongOver = false, pongUp = false, pongDown = false;
function updatePongStats() { updateStats(pongPlayerScore, readBest("pong"), 1, pongOver ? "Match over" : pongRunning ? "Playing" : "Ready"); }
function resetPong() { pongPlayerY = 120; pongAiY = 120; pongPlayerScore = 0; pongAiScore = 0; pongRunning = false; pongOver = false; resetPongBall(Math.random() < .5 ? 1 : -1); document.getElementById("pongOverlay").classList.remove("hidden"); drawPong(); updatePongStats(); }
function resetPongBall(direction) { pongBall = { x: 240, y: 150, vx: 4 * direction, vy: (Math.random() * 3 - 1.5) || 1 }; }
function startPong() { if (pongOver) resetPong(); pongRunning = true; document.getElementById("pongOverlay").classList.add("hidden"); pongCanvas.focus(); updatePongStats(); }
function stepPong() { const paddleHeight = 60; if (pongUp) pongPlayerY = Math.max(0, pongPlayerY - 6); if (pongDown) pongPlayerY = Math.min(240, pongPlayerY + 6); pongAiY += (pongBall.y - paddleHeight / 2 - pongAiY) * .08; pongAiY = Math.max(0, Math.min(240, pongAiY)); pongBall.x += pongBall.vx; pongBall.y += pongBall.vy; if (pongBall.y <= 8 || pongBall.y >= 292) pongBall.vy *= -1; if (pongBall.vx < 0 && pongBall.x <= 30 && pongBall.y >= pongPlayerY - 5 && pongBall.y <= pongPlayerY + paddleHeight + 5) { pongBall.vx = Math.abs(pongBall.vx) + .2; pongBall.vy += (pongBall.y - (pongPlayerY + paddleHeight / 2)) * .05; } if (pongBall.vx > 0 && pongBall.x >= 450 && pongBall.y >= pongAiY - 5 && pongBall.y <= pongAiY + paddleHeight + 5) { pongBall.vx = -Math.abs(pongBall.vx) - .2; pongBall.vy += (pongBall.y - (pongAiY + paddleHeight / 2)) * .05; } if (pongBall.x < -12) { pongAiScore += 1; resetPongBall(1); } if (pongBall.x > 492) { pongPlayerScore += 1; awardPoints(10); if (pongPlayerScore > readBest("pong")) saveBest("pong", pongPlayerScore); resetPongBall(-1); } if (pongAiScore >= 5 || pongPlayerScore >= 5) endPong(); }
function endPong() { pongRunning = false; pongOver = true; const won = pongPlayerScore > pongAiScore; document.getElementById("pongOverlay").querySelector(".overlay-kicker").textContent = won ? "MATCH WON" : "MATCH OVER"; document.getElementById("pongOverlay").querySelector("strong").textContent = `${pongPlayerScore} - ${pongAiScore}`; document.getElementById("pongOverlay").querySelector("span:not(.overlay-kicker)").textContent = won ? "Great rally. Your points are banked." : "Reset the table and try again."; document.getElementById("pongOverlay").querySelector("button").textContent = "Play again"; document.getElementById("pongOverlay").classList.remove("hidden"); updatePongStats(); }
function drawPong() { pongCtx.fillStyle = "#0f1518"; pongCtx.fillRect(0, 0, 480, 300); pongCtx.strokeStyle = "#26343a"; pongCtx.setLineDash([5, 8]); pongCtx.beginPath(); pongCtx.moveTo(240, 0); pongCtx.lineTo(240, 300); pongCtx.stroke(); pongCtx.setLineDash([]); pongCtx.fillStyle = "#6ed6df"; pongCtx.fillRect(18, pongPlayerY, 8, 60); pongCtx.fillStyle = "#ff6b4a"; pongCtx.fillRect(454, pongAiY, 8, 60); pongCtx.fillStyle = "#ffd166"; pongCtx.beginPath(); pongCtx.arc(pongBall.x, pongBall.y, 7, 0, Math.PI * 2); pongCtx.fill(); pongCtx.fillStyle = "#69777b"; pongCtx.font = "700 12px system-ui"; pongCtx.fillText(`${pongPlayerScore}   ${pongAiScore}`, 222, 24); }
function pongLoop() { if (activeGame === "pong" && pongRunning) { stepPong(); drawPong(); updatePongStats(); } requestAnimationFrame(pongLoop); }

// Minesweeper
const mineRows = 10, mineCols = 10, mineTotal = 15; let mineBoard = [], minesOver = false, minesWon = false;
function resetMinesweeper() { minesOver = false; minesWon = false; mineBoard = Array.from({ length: mineRows * mineCols }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 })); const locations = [...Array(mineBoard.length).keys()]; for (let i = locations.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [locations[i], locations[j]] = [locations[j], locations[i]]; } locations.slice(0, mineTotal).forEach(index => mineBoard[index].mine = true); mineBoard.forEach((cell, index) => { cell.adjacent = neighbors(index).filter(neighbor => mineBoard[neighbor].mine).length; }); document.getElementById("mineMessage").className = "mine-message"; document.getElementById("mineMessage").textContent = "Find every safe square."; renderMinesweeper(); updateMineStats(); }
function neighbors(index) { const row = Math.floor(index / mineCols), col = index % mineCols, result = []; for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) { if (!x && !y) continue; const r = row + y, c = col + x; if (r >= 0 && r < mineRows && c >= 0 && c < mineCols) result.push(r * mineCols + c); } return result; }
function updateMineStats() { const revealed = mineBoard.filter(cell => cell.revealed).length; updateStats(revealed, mineTotal, Math.max(1, Math.floor(revealed / 10) + 1), minesWon ? "Cleared" : minesOver ? "Boom" : "Playing"); }
function revealMine(index) { const cell = mineBoard[index]; if (minesOver || minesWon || cell.revealed || cell.flagged) return; const revealedBefore = mineBoard.filter(square => square.revealed).length; if (cell.mine) { minesOver = true; mineBoard.forEach(other => { if (other.mine) other.revealed = true; }); document.getElementById("mineMessage").className = "mine-message lose"; document.getElementById("mineMessage").textContent = "Boom. Start a new board and try again."; renderMinesweeper(); updateMineStats(); return; } const queue = [index]; while (queue.length) { const current = queue.shift(); const currentCell = mineBoard[current]; if (currentCell.revealed || currentCell.flagged) continue; currentCell.revealed = true; if (!currentCell.adjacent) neighbors(current).forEach(next => { if (!mineBoard[next].mine && !mineBoard[next].revealed) queue.push(next); }); } const revealedNow = mineBoard.filter(square => square.revealed).length; awardPoints(revealedNow - revealedBefore); if (mineBoard.filter(cell => !cell.mine && !cell.revealed).length === 0) { minesWon = true; mineBoard.forEach(cell => { if (cell.mine) cell.flagged = true; }); document.getElementById("mineMessage").className = "mine-message win"; document.getElementById("mineMessage").textContent = "Board cleared. Nice work."; } renderMinesweeper(); updateMineStats(); }
function toggleMineFlag(index) { if (minesOver || minesWon || mineBoard[index].revealed) return; mineBoard[index].flagged = !mineBoard[index].flagged; renderMinesweeper(); updateMineStats(); }
function renderMinesweeper() { const grid = document.getElementById("minesweeperGrid"); grid.innerHTML = ""; mineBoard.forEach((cell, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "mine-cell"; button.setAttribute("role", "gridcell"); button.setAttribute("aria-label", cell.revealed ? (cell.mine ? "Mine" : `${cell.adjacent} adjacent mines`) : "Covered square"); if (cell.revealed) { button.classList.add("revealed"); if (cell.mine) { button.classList.add("mine"); button.textContent = "*"; } else if (cell.adjacent) { button.classList.add(`number-${cell.adjacent}`); button.textContent = cell.adjacent; } } else if (cell.flagged) { button.classList.add("flagged"); button.textContent = "!"; } button.addEventListener("click", () => revealMine(index)); button.addEventListener("contextmenu", event => { event.preventDefault(); toggleMineFlag(index); }); grid.appendChild(button); }); }

document.addEventListener("keydown", event => {
  if (activeGame === "snake") {
    const keys = { ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 } };
    const next = keys[event.key]; if (next) { event.preventDefault(); if (snakeDirection.x + next.x !== 0 || snakeDirection.y + next.y !== 0) snakeNextDirection = next; if (!snakeRunning) startSnake(); }
    if (event.key === "Enter" && snakeOver) resetSnake();
  }
  if (activeGame === "2048") { const moves = { ArrowUp: "up", w: "up", ArrowDown: "down", s: "down", ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right" }; if (moves[event.key]) { event.preventDefault(); move2048(moves[event.key]); } }
  if (activeGame === "tetris" && ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " ", "p", "P"].includes(event.key)) { event.preventDefault(); if (!tetrisRunning && event.key !== "p" && event.key !== "P") startTetris(); if (!tetrisCurrent || tetrisOver) return; if (event.key === "ArrowLeft") moveTetris(-1, 0); if (event.key === "ArrowRight") moveTetris(1, 0); if (event.key === "ArrowDown") { if (!moveTetris(0, 1)) lockTetris(); else { tetrisScore += 1; awardPoints(1); } } if (event.key === "ArrowUp") rotateCurrentTetris(); if (event.key === " ") hardDropTetris(); if (event.key === "p" || event.key === "P") { tetrisPaused = !tetrisPaused; updateTetrisStats(); } drawTetris(); }
  if (activeGame === "pong") { if (["ArrowUp", "w", "ArrowDown", "s"].includes(event.key)) { event.preventDefault(); if (!pongRunning) startPong(); } if (event.key === "ArrowUp" || event.key === "w") pongUp = true; if (event.key === "ArrowDown" || event.key === "s") pongDown = true; }
  if (gameInfo[activeGame]?.bonus && activeGame !== "pong") bonusKeyHandler(event.key);
});
document.addEventListener("keyup", event => { if (event.key === "ArrowUp" || event.key === "w") pongUp = false; if (event.key === "ArrowDown" || event.key === "s") pongDown = false; if (gameInfo[activeGame]?.bonus && activeGame !== "pong") bonusKeyUpHandler(event.key); });

resetSnake(); reset2048(); resetTetris(); resetMinesweeper(); resetPong(); syncLockedGames(); updateShop(); switchGame("snake"); requestAnimationFrame(tetrisLoop); requestAnimationFrame(pongLoop);
