const world = document.querySelector("#world");
const scenes = [...document.querySelectorAll(".scene")];
const sceneLinks = [...document.querySelectorAll(".scene-link")];
const mapPanel = document.querySelector("#world-map");
const mapToggle = document.querySelector(".map-toggle");
const mapClose = document.querySelector(".map-close");
const mapBackdrop = document.querySelector(".map-backdrop");
const themeToggle = document.querySelector(".theme-toggle");
const soundToggle = document.querySelector(".sound-toggle");
const ambientAudio = document.querySelector("#ambient-audio");
const sceneIndex = document.querySelector("#scene-index");
const sceneName = document.querySelector("#scene-name");
const coordinates = document.querySelector("#coordinates");
const localTime = document.querySelector("#local-time");
const localDate = document.querySelector("#local-date");
const searchForm = document.querySelector("#portfolio-search");
const searchInput = document.querySelector("#search-input");
const searchSubmit = searchForm.querySelector('button[type="submit"]');
const searchResults = document.querySelector("#search-results");
const floatCanvas = document.querySelector("#float-canvas");
const homeScene = document.querySelector("#home");
const heroObject = document.querySelector(".hero-object");

const sceneOrder = ["home", "systems", "research", "impact", "credentials", "personal"];
const scenePositions = Object.fromEntries(
  scenes.map((scene) => [scene.id, { col: Number(scene.dataset.col), row: Number(scene.dataset.row) }])
);

const portfolioItems = [
  {
    tag: "Current role",
    title: "Data Solutions Engineer II at Axon",
    text: "Data solutions for mission-driven public-safety technology and trusted workflows.",
    scene: "systems",
    keywords: "axon current role public safety data solutions engineer"
  },
  {
    tag: "Past experience",
    title: "Data Engineer at Tucson Police Department",
    text: "Former TPD data engineer supporting analytics and backend workflows.",
    scene: "systems",
    keywords: "tpd tucson police past experience data engineer"
  },
  {
    tag: "Patent",
    title: "Indian Patent Application 202541055731",
    text: "Digital image forgery detection using machine learning and AI techniques.",
    scene: "research",
    keywords: "patent india image forgery machine learning ai computer vision"
  },
  {
    tag: "Research",
    title: "Google Scholar and publications",
    text: "Research profile, citations, ebook ISBNs, and publication visibility.",
    scene: "research",
    keywords: "google scholar research publication citations books isbn ebook"
  },
  {
    tag: "International IP",
    title: "Canada and UK intellectual-property signals",
    text: "Canadian Copyright Registration 1236755 and UK IPO recognition.",
    scene: "research",
    keywords: "canada copyright uk ipo international intellectual property"
  },
  {
    tag: "Press",
    title: "Times of India and Dainik Bhaskar",
    text: "Media coverage connecting data innovation with public impact.",
    scene: "impact",
    keywords: "press times of india dainik bhaskar media news"
  },
  {
    tag: "Credentials",
    title: "Certifications and competition judging",
    text: "AWS, Agile, Jira, DevOps, Analytics, hackathons, and Technovation.",
    scene: "credentials",
    keywords: "certifications aws agile jira devops analytics judging hackathon technovation"
  },
  {
    tag: "Community",
    title: "CEE and Global AI Community Tempe",
    text: "AI education, webinars, chapter leadership, and ecosystem work.",
    scene: "impact",
    keywords: "cee global ai tempe community webinar teaching leadership"
  },
  {
    tag: "Personal",
    title: "Meet Shaay",
    text: "Mountain air, reset energy, and a loyal companion outside work.",
    scene: "personal",
    keywords: "shaay dog personal outside work companion"
  }
];

let activeScene = "home";
let soundEnabled = false;
let audioContext;
let touchStart = null;

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;"
  })[character]);
}

function playNavigationTone() {
  if (!soundEnabled) return;

  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) return;

  audioContext ||= new AudioEngine();
  if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(620, audioContext.currentTime + 0.08);
  gain.gain.setValueAtTime(0.045, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
}

function startAmbientMusic() {
  if (!ambientAudio) return Promise.reject(new Error("Audio unavailable"));

  ambientAudio.volume = 0.3;
  return ambientAudio.play();
}

function stopAmbientMusic() {
  ambientAudio?.pause();
}

function createFloatingField() {
  if (!floatCanvas || !homeScene) return;

  const context = floatCanvas.getContext("2d");
  const labels = [
    { text: "HELLO", x: 0.13, y: 0.72, color: "#ffd84f", size: 19 },
    { text: "AI", x: 0.76, y: 0.18, color: "#ff6dad", size: 16 },
    { text: "SQL", x: 0.39, y: 0.2, color: "#b9f779", size: 14 },
    { text: "</>", x: 0.86, y: 0.72, color: "#ffffff", size: 17 },
    { text: "DATA", x: 0.91, y: 0.36, color: "#9eb9ff", size: 13 },
    { text: "BUILD", x: 0.31, y: 0.84, color: "#ffffff", size: 13 },
    { text: "✨", x: 0.58, y: 0.13, color: "#ffd84f", size: 22 },
    { text: "💡", x: 0.67, y: 0.78, color: "#ffd84f", size: 21 },
    { text: "⚡", x: 0.2, y: 0.35, color: "#ff6dad", size: 20 },
    { text: "{ }", x: 0.47, y: 0.69, color: "#b9f779", size: 16 },
    { text: "☁️", x: 0.83, y: 0.55, color: "#ffffff", size: 20 },
    { text: ":)", x: 0.08, y: 0.48, color: "#9eb9ff", size: 17 }
  ];
  const pointer = { x: -1000, y: -1000, active: false, energy: 1 };
  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame;

  function roundedRect(x, y, rectWidth, rectHeight, radius) {
    const safeRadius = Math.min(radius, rectWidth / 2, rectHeight / 2);
    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.arcTo(x + rectWidth, y, x + rectWidth, y + rectHeight, safeRadius);
    context.arcTo(x + rectWidth, y + rectHeight, x, y + rectHeight, safeRadius);
    context.arcTo(x, y + rectHeight, x, y, safeRadius);
    context.arcTo(x, y, x + rectWidth, y, safeRadius);
    context.closePath();
  }

  function resize() {
    const rect = homeScene.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    floatCanvas.width = Math.round(width * ratio);
    floatCanvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = labels.map((label, index) => ({
      ...label,
      anchorX: label.x * width,
      anchorY: label.y * height,
      x: label.x * width,
      y: label.y * height,
      vx: 0,
      vy: 0,
      phase: index * 0.78,
      rotation: (index % 2 ? 1 : -1) * 0.045
    }));
  }

  function positionPointer(event, burst = false) {
    const rect = homeScene.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
    pointer.energy = burst ? 2.7 : Math.max(pointer.energy, 1);

    const driftX = ((pointer.x / Math.max(width, 1)) - 0.5) * 18;
    const driftY = ((pointer.y / Math.max(height, 1)) - 0.5) * 12;
    heroObject?.style.setProperty("--drift-x", `${driftX.toFixed(1)}px`);
    heroObject?.style.setProperty("--drift-y", `${driftY.toFixed(1)}px`);
  }

  homeScene.addEventListener("pointermove", (event) => positionPointer(event));
  homeScene.addEventListener("pointerdown", (event) => positionPointer(event, true));
  homeScene.addEventListener("pointerleave", () => {
    pointer.active = false;
    heroObject?.style.setProperty("--drift-x", "0px");
    heroObject?.style.setProperty("--drift-y", "0px");
  });

  function draw(time) {
    context.clearRect(0, 0, width, height);
    const mobileScale = width < 600 ? 0.82 : 1;
    const radius = width < 600 ? 105 : 145;

    particles.forEach((particle, index) => {
      const targetX = particle.anchorX + Math.sin(time * 0.00055 + particle.phase) * (9 + index % 3 * 3);
      const targetY = particle.anchorY + Math.cos(time * 0.00042 + particle.phase) * (8 + index % 4 * 2);
      particle.vx += (targetX - particle.x) * 0.009;
      particle.vy += (targetY - particle.y) * 0.009;

      if (pointer.active) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        if (distance < radius) {
          const force = (1 - distance / radius) * 2.15 * pointer.energy;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
          particle.rotation += (dx / radius) * 0.002;
        }
      }

      particle.vx *= 0.925;
      particle.vy *= 0.925;
      particle.x += particle.vx;
      particle.y += particle.vy;

      const fontSize = particle.size * mobileScale;
      context.font = `700 ${fontSize}px "Geist Mono", monospace`;
      const textWidth = context.measureText(particle.text).width;
      const bubbleWidth = textWidth + 30 * mobileScale;
      const bubbleHeight = fontSize + 22 * mobileScale;

      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation + Math.sin(time * 0.0003 + particle.phase) * 0.025);
      context.shadowColor = "rgba(49, 91, 214, 0.18)";
      context.shadowBlur = 18;
      context.shadowOffsetY = 8;
      roundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, bubbleHeight / 2);
      context.fillStyle = `${particle.color}d9`;
      context.fill();
      context.shadowColor = "transparent";
      context.lineWidth = 1.25;
      context.strokeStyle = "rgba(17, 21, 26, 0.58)";
      context.stroke();
      context.fillStyle = "#11151a";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(particle.text, 0, 1);
      context.restore();
    });

    pointer.energy += (1 - pointer.energy) * 0.04;
    animationFrame = window.requestAnimationFrame(draw);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(homeScene);
  resize();
  animationFrame = window.requestAnimationFrame(draw);

  window.addEventListener("pagehide", () => {
    resizeObserver.disconnect();
    window.cancelAnimationFrame(animationFrame);
  }, { once: true });
}

function closeMap() {
  mapPanel.classList.remove("open");
  mapBackdrop.classList.remove("open");
  mapPanel.setAttribute("aria-hidden", "true");
  mapToggle.setAttribute("aria-expanded", "false");
}

function openMap() {
  mapPanel.classList.add("open");
  mapBackdrop.classList.add("open");
  mapPanel.setAttribute("aria-hidden", "false");
  mapToggle.setAttribute("aria-expanded", "true");
  mapClose.focus();
}

function goToScene(sceneId, options = {}) {
  const position = scenePositions[sceneId];
  if (!position || !world) return;

  const changed = activeScene !== sceneId;
  activeScene = sceneId;
  world.style.transform = `translate3d(-${position.col * 100}vw, -${position.row * 50}%, 0)`;

  sceneLinks.forEach((link) => {
    const isActive = link.dataset.scene === sceneId;
    link.classList.toggle("active", isActive);
    if (link.closest(".desktop-nav")) {
      link.setAttribute("aria-current", isActive ? "page" : "false");
    }
  });

  const index = sceneOrder.indexOf(sceneId);
  sceneIndex.textContent = `AREA ${String(index).padStart(2, "0")}`;
  sceneName.textContent = sceneId.toUpperCase();
  document.title = sceneId === "home"
    ? "Shivani Paunikar | Data Engineering Portfolio"
    : `${sceneId[0].toUpperCase() + sceneId.slice(1)} | Shivani Paunikar`;

  if (!options.fromHistory) {
    history.pushState({ scene: sceneId }, "", `#${sceneId}`);
  }

  closeMap();
  if (changed) playNavigationTone();
}

function renderSearch(query = "") {
  const normalized = query.trim().toLowerCase();
  const terms = normalized.split(/\s+/).filter(Boolean);
  const matches = normalized
    ? portfolioItems.filter((item) => {
        const haystack = `${item.tag} ${item.title} ${item.text} ${item.keywords}`.toLowerCase();
        return terms.every((term) => haystack.includes(term));
      })
    : [];

  const result = matches[0];
  if (!result) {
    searchResults.innerHTML = normalized
      ? `<span>No exact match</span><strong>Try a broader word.</strong><p>Examples: Axon, AI, patent, press, or Shaay.</p>`
      : `<span>Start anywhere</span><strong>Search by topic or organization.</strong><p>The best matching area will open for you.</p>`;
    searchResults.removeAttribute("data-result-scene");
    return;
  }

  searchResults.dataset.resultScene = result.scene;
  searchResults.innerHTML = `<span>${escapeHtml(result.tag)} / ${escapeHtml(result.scene)}</span><strong>${escapeHtml(result.title)}</strong><p>${escapeHtml(result.text)} Press Enter to open this area.</p>`;
}

function updateClock() {
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(now);
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    weekday: "short",
    month: "short",
    day: "2-digit"
  }).format(now).toUpperCase();
  localTime.textContent = `PHX ${time}`;
  localDate.textContent = date;
}

sceneLinks.forEach((link) => {
  link.addEventListener("click", () => goToScene(link.dataset.scene));
});

mapToggle.addEventListener("click", () => {
  if (mapPanel.classList.contains("open")) closeMap();
  else openMap();
});
mapClose.addEventListener("click", closeMap);
mapBackdrop.addEventListener("click", closeMap);

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.textContent = isDark ? "Theme[D]" : "Theme[A]";
  document.querySelector('meta[name="theme-color"]').setAttribute("content", isDark ? "#11151b" : "#dcecff");
});

soundToggle.addEventListener("click", async () => {
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.textContent = soundEnabled ? "Sound[+]" : "Sound[-]";
  soundToggle.setAttribute("aria-label", soundEnabled ? "Turn ambient music off" : "Turn ambient music on");

  if (soundEnabled) {
    try {
      await startAmbientMusic();
    } catch {
      soundEnabled = false;
      soundToggle.textContent = "Sound[-]";
      soundToggle.setAttribute("aria-pressed", "false");
      soundToggle.setAttribute("aria-label", "Ambient music unavailable");
    }
  } else {
    stopAmbientMusic();
  }
});

searchInput.addEventListener("input", () => renderSearch(searchInput.value));
function activateSearch() {
  renderSearch(searchInput.value);
  if (searchResults.dataset.resultScene) goToScene(searchResults.dataset.resultScene);
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  activateSearch();
});

searchSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  activateSearch();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    activateSearch();
  }
});

document.addEventListener("pointermove", (event) => {
  const x = String(Math.round(event.clientX)).padStart(4, "0");
  const y = String(Math.round(event.clientY)).padStart(4, "0");
  coordinates.textContent = `${x} X ${y} Y`;
});

document.addEventListener("visibilitychange", () => {
  if (soundEnabled && document.visibilityState === "visible") {
    ambientAudio?.play().catch(() => {});
    if (audioContext?.state !== "running") audioContext?.resume().catch(() => {});
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMap();
    return;
  }

  if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

  const current = scenePositions[activeScene];
  const target = Object.entries(scenePositions).find(([, position]) => {
    if (event.key === "ArrowRight") return position.row === current.row && position.col === current.col + 1;
    if (event.key === "ArrowLeft") return position.row === current.row && position.col === current.col - 1;
    if (event.key === "ArrowDown") return position.col === current.col && position.row === current.row + 1;
    if (event.key === "ArrowUp") return position.col === current.col && position.row === current.row - 1;
    return false;
  });

  if (target) {
    event.preventDefault();
    goToScene(target[0]);
  }
});

document.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch") touchStart = { x: event.clientX, y: event.clientY };
});

document.addEventListener("pointerup", (event) => {
  if (!touchStart || event.pointerType !== "touch" || mapPanel.classList.contains("open")) return;
  const deltaX = event.clientX - touchStart.x;
  const deltaY = event.clientY - touchStart.y;
  touchStart = null;
  if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 65) return;

  const current = scenePositions[activeScene];
  const horizontal = Math.abs(deltaX) > Math.abs(deltaY);
  const wanted = {
    col: current.col + (horizontal ? (deltaX < 0 ? 1 : -1) : 0),
    row: current.row + (!horizontal ? (deltaY < 0 ? 1 : -1) : 0)
  };
  const target = Object.entries(scenePositions).find(([, position]) => position.col === wanted.col && position.row === wanted.row);
  if (target) goToScene(target[0]);
});

window.addEventListener("popstate", () => {
  const sceneFromHash = location.hash.slice(1);
  goToScene(scenePositions[sceneFromHash] ? sceneFromHash : "home", { fromHistory: true });
});

const initialScene = location.hash.slice(1);
goToScene(scenePositions[initialScene] ? initialScene : "home", { fromHistory: true });
renderSearch();
createFloatingField();
updateClock();
setInterval(updateClock, 30000);
