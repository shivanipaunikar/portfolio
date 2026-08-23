const world = document.querySelector("#world");
const scenes = [...document.querySelectorAll(".scene")];
const sceneLinks = [...document.querySelectorAll(".scene-link")];
const mapPanel = document.querySelector("#world-map");
const mapToggle = document.querySelector(".map-toggle");
const mapClose = document.querySelector(".map-close");
const mapBackdrop = document.querySelector(".map-backdrop");
const themeToggle = document.querySelector(".theme-toggle");
const soundToggle = document.querySelector(".sound-toggle");
const sceneIndex = document.querySelector("#scene-index");
const sceneName = document.querySelector("#scene-name");
const coordinates = document.querySelector("#coordinates");
const localTime = document.querySelector("#local-time");
const localDate = document.querySelector("#local-date");
const searchForm = document.querySelector("#portfolio-search");
const searchInput = document.querySelector("#search-input");
const searchSubmit = searchForm.querySelector('button[type="submit"]');
const searchResults = document.querySelector("#search-results");

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

  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(620, audioContext.currentTime + 0.08);
  gain.gain.setValueAtTime(0.035, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
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
  document.title = `${sceneId === "home" ? "Shivani Paunikar" : sceneId[0].toUpperCase() + sceneId.slice(1)} | Shivani Paunikar`;

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

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "Sound[+]" : "Sound[-]";
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  playNavigationTone();
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
updateClock();
setInterval(updateClock, 30000);
