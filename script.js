const world = document.querySelector("#world");
const viewport = document.querySelector(".viewport");
const scenes = [...document.querySelectorAll(".scene")];
const sceneLinks = [...document.querySelectorAll(".scene-link")];
const mapPanel = document.querySelector("#world-map");
const mapToggle = document.querySelector(".map-toggle");
const mapClose = document.querySelector(".map-close");
const mapBackdrop = document.querySelector(".map-backdrop");
const themeToggle = document.querySelector(".theme-toggle");
const soundToggle = document.querySelector(".sound-toggle");
const ambientAudio = document.querySelector("#ambient-audio");
const shaayVideo = document.querySelector(".shaay-frame video");
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
const gelLetters = [...document.querySelectorAll(".gel-letter")];
const transitionPortal = document.querySelector("#innovation-transition");
const transitionCanvas = document.querySelector("#transition-canvas");
const transitionKicker = document.querySelector("#transition-kicker");
const transitionLineOne = document.querySelector("#transition-line-one");
const transitionLineTwo = document.querySelector("#transition-line-two");
const travelPins = [...document.querySelectorAll(".travel-pin")];
const travelMap = document.querySelector(".travel-map");
const travelNetworkCanvas = document.querySelector(".travel-network-canvas");
const travelHub = document.querySelector(".travel-hub");
const travelPreview = document.querySelector(".travel-preview");
const travelPhoto = document.querySelector("#travel-photo");
const travelState = document.querySelector("#travel-state");
const travelPhotoNumber = document.querySelector("#travel-photo-number");
const isAndroidDevice = /Android/i.test(navigator.userAgent);

document.body.classList.toggle("android-device", isAndroidDevice);

const sceneOrder = ["home", "systems", "research", "impact", "credentials", "travel", "personal"];
const transitionMessages = {
  home: ["Return / Home", "Back to the", "core"],
  systems: ["Area 01 / Systems", "Innovate with", "purpose"],
  research: ["Area 02 / Research", "Ideas become", "evidence"],
  impact: ["Area 03 / Impact", "Technology for", "people"],
  credentials: ["Area 04 / Credentials", "Proof behind", "the work"],
  travel: ["Area 05 / Travel", "Perspective through", "places"],
  personal: ["Area 06 / Shaay", "Make space", "for joy"]
};
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
  },
  {
    tag: "Travel",
    title: "Travel notes across 17 U.S. states",
    text: "An interactive map of personal photographs from coastlines, cities, deserts, and mountains.",
    scene: "travel",
    keywords: "travel map states photography gallery new york california hawaii arizona"
  }
];

let activeScene = "home";
let soundEnabled = false;
let audioContext;
let touchStart = null;
let nativeTouchStart = null;
let lastSwipeAt = 0;
let wheelDelta = 0;
let wheelLocked = false;
let wheelResetTimer;
let sceneTransitionTimer;
let portalTransitionTimer;
let portalAnimationFrame;
let travelSwapTimer;
const sceneTransitionDuration = 1220;
let cachedPageHeight = 1;
let cachedSceneStops = [];

const pageTransitionClasses = [
  "page-out-next",
  "page-out-previous",
  "page-in-next",
  "page-in-previous"
];

function clearGesturePreview() {
  document.body.classList.remove("is-swiping");
  scenes.forEach((scene) => {
    scene.classList.remove("gesture-preview", "gesture-next", "gesture-previous");
    scene.style.removeProperty("--gesture-shift");
    scene.style.removeProperty("--gesture-rotate");
    scene.style.removeProperty("--gesture-depth");
  });
}

function showGesturePreview(deltaY) {
  const scene = document.getElementById(activeScene);
  if (!scene || !viewport) return;

  const progress = Math.min(Math.abs(deltaY) / Math.max(viewport.clientHeight * 0.32, 1), 1);
  const direction = deltaY < 0 ? -1 : 1;
  scene.classList.add("gesture-preview");
  scene.classList.toggle("gesture-next", direction < 0);
  scene.classList.toggle("gesture-previous", direction > 0);
  scene.style.setProperty("--gesture-shift", `${(deltaY * 0.1).toFixed(1)}px`);
  scene.style.setProperty("--gesture-rotate", `${(direction * progress * 3.5).toFixed(2)}deg`);
  scene.style.setProperty("--gesture-depth", `${(-progress * 72).toFixed(1)}px`);
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;"
  })[character]);
}

function createTransitionField() {
  if (!transitionPortal || !transitionCanvas) return () => {};

  const context = transitionCanvas.getContext("2d");
  const colors = ["#7cecff", "#7ea2ff", "#a978ff", "#ff6db4", "#b8ff63"];
  let width = 0;
  let height = 0;
  let streaks = [];
  let lastTime = 0;
  let lastDrawTime = 0;

  function resetStreak(streak, randomDepth = false) {
    const angle = Math.random() * Math.PI * 2;
    const spread = 0.08 + Math.random() * 0.92;
    streak.x = Math.cos(angle) * spread;
    streak.y = Math.sin(angle) * spread;
    streak.z = randomDepth ? 0.12 + Math.random() * 0.88 : 1;
    streak.previousZ = streak.z + 0.018;
    streak.speed = 0.42 + Math.random() * 0.72;
    streak.color = colors[Math.floor(Math.random() * colors.length)];
  }

  function resize() {
    const rect = transitionPortal.getBoundingClientRect();
    const ratio = isAndroidDevice ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    transitionCanvas.width = Math.round(width * ratio);
    transitionCanvas.height = Math.round(height * ratio);
    transitionCanvas.style.width = `${width}px`;
    transitionCanvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = isAndroidDevice ? 34 : width < 760 ? 78 : 150;
    streaks = Array.from({ length: count }, () => {
      const streak = {};
      resetStreak(streak, true);
      return streak;
    });
  }

  function project(streak, depth) {
    const scale = 1 / Math.max(depth, 0.055);
    return {
      x: width / 2 + streak.x * width * 0.36 * scale,
      y: height / 2 + streak.y * height * 0.42 * scale
    };
  }

  function draw(time) {
    if (!transitionPortal.classList.contains("is-active") && !transitionPortal.classList.contains("is-scroll-active")) {
      context.clearRect(0, 0, width, height);
      portalAnimationFrame = null;
      return;
    }

    if (isAndroidDevice && time - lastDrawTime < 32) {
      portalAnimationFrame = window.requestAnimationFrame(draw);
      return;
    }
    lastDrawTime = time;

    const elapsed = Math.min((time - lastTime) / 1000, 0.04);
    lastTime = time;
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";

    streaks.forEach((streak) => {
      streak.previousZ = streak.z;
      streak.z -= streak.speed * elapsed;
      if (streak.z <= 0.055) resetStreak(streak);

      const head = project(streak, streak.z);
      const tail = project(streak, Math.min(streak.previousZ + 0.075, 1.1));
      const energy = Math.max(0, 1 - streak.z);
      context.beginPath();
      context.moveTo(tail.x, tail.y);
      context.lineTo(head.x, head.y);
      context.strokeStyle = streak.color;
      context.globalAlpha = 0.2 + energy * 0.8;
      context.lineWidth = 0.7 + energy * (width < 760 ? 2.1 : 3.2);
      context.stroke();
    });

    context.globalAlpha = 1;
    context.globalCompositeOperation = "source-over";
    portalAnimationFrame = window.requestAnimationFrame(draw);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(transitionPortal);
  resize();

  window.addEventListener("pagehide", () => {
    resizeObserver.disconnect();
    if (portalAnimationFrame) window.cancelAnimationFrame(portalAnimationFrame);
  }, { once: true });

  return function start() {
    lastTime = performance.now();
    streaks.forEach((streak) => resetStreak(streak, true));
    if (!portalAnimationFrame) portalAnimationFrame = window.requestAnimationFrame(draw);
  };
}

const startTransitionField = createTransitionField();

function playInnovationTransition(sceneId, direction) {
  if (!transitionPortal || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const message = transitionMessages[sceneId] || transitionMessages.systems;
  transitionKicker.textContent = message[0];
  transitionLineOne.textContent = message[1];
  transitionLineTwo.textContent = message[2];
  transitionPortal.classList.remove("is-active", "portal-next", "portal-previous");
  void transitionPortal.offsetWidth;
  transitionPortal.classList.add("is-active", direction === "next" ? "portal-next" : "portal-previous");
  startTransitionField();

  window.clearTimeout(portalTransitionTimer);
  portalTransitionTimer = window.setTimeout(() => {
    transitionPortal.classList.remove("is-active", "portal-next", "portal-previous");
  }, sceneTransitionDuration);
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
  let touchResetTimer;

  function resetGel() {
    gelLetters.forEach((letter) => {
      letter.style.setProperty("--push-x", "0px");
      letter.style.setProperty("--push-y", "0px");
      letter.style.setProperty("--squash-x", "1");
      letter.style.setProperty("--squash-y", "1");
      letter.style.setProperty("--tilt", "0deg");
    });
  }

  function reactGel(event, burst) {
    gelLetters.forEach((letter) => {
      const rect = letter.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = centerX - event.clientX;
      const dy = centerY - event.clientY;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const radius = burst ? 250 : 190;
      const influence = Math.max(0, 1 - distance / radius);
      const force = influence * (burst ? 62 : 34);

      letter.style.setProperty("--push-x", `${((dx / distance) * force).toFixed(1)}px`);
      letter.style.setProperty("--push-y", `${((dy / distance) * force).toFixed(1)}px`);
      letter.style.setProperty("--squash-x", (1 + influence * 0.13).toFixed(3));
      letter.style.setProperty("--squash-y", (1 - influence * 0.12).toFixed(3));
      letter.style.setProperty("--tilt", `${((dx / distance) * influence * 10).toFixed(1)}deg`);
    });
  }

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
    if (event.pointerType === "touch" && !burst) return;

    const rect = homeScene.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
    pointer.energy = burst ? 2.7 : Math.max(pointer.energy, 1);

    const driftX = ((pointer.x / Math.max(width, 1)) - 0.5) * 18;
    const driftY = ((pointer.y / Math.max(height, 1)) - 0.5) * 12;
    heroObject?.style.setProperty("--drift-x", `${driftX.toFixed(1)}px`);
    heroObject?.style.setProperty("--drift-y", `${driftY.toFixed(1)}px`);
    reactGel(event, burst);
  }

  homeScene.addEventListener("pointermove", (event) => positionPointer(event));
  homeScene.addEventListener("pointerdown", (event) => {
    positionPointer(event, true);

    if (event.pointerType === "touch") {
      window.clearTimeout(touchResetTimer);
      heroObject?.classList.add("is-reacting");
      touchResetTimer = window.setTimeout(() => {
        pointer.active = false;
        heroObject?.classList.remove("is-reacting");
        heroObject?.style.setProperty("--drift-x", "0px");
        heroObject?.style.setProperty("--drift-y", "0px");
        resetGel();
      }, 260);
    }
  });
  homeScene.addEventListener("pointerleave", () => {
    pointer.active = false;
    heroObject?.style.setProperty("--drift-x", "0px");
    heroObject?.style.setProperty("--drift-y", "0px");
    resetGel();
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

function createTravelNetwork() {
  if (!travelMap || !travelNetworkCanvas || !travelPins.length) return;

  const context = travelNetworkCanvas.getContext("2d");
  const pointer = { x: -1000, y: -1000, active: false };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let points = [];
  let satellites = [];
  let animationFrame;

  function pinPosition(pin) {
    return {
      x: parseFloat(pin.style.getPropertyValue("--x")) * width / 100,
      y: parseFloat(pin.style.getPropertyValue("--y")) * height / 100,
      phase: travelPins.indexOf(pin) * 0.83
    };
  }

  function resize() {
    const rect = travelMap.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    travelNetworkCanvas.width = Math.round(width * ratio);
    travelNetworkCanvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    points = travelPins.map(pinPosition);
    satellites = Array.from({ length: width < 600 ? 54 : 92 }, (_, index) => {
      const anchor = points[index % points.length];
      const angle = index * 2.399;
      const radius = 12 + ((index * 17) % 54);
      return {
        anchor,
        x: anchor.x + Math.cos(angle) * radius,
        y: anchor.y + Math.sin(angle) * radius * 0.64,
        radius: 0.8 + (index % 4) * 0.42,
        phase: index * 0.61,
        colorIndex: index % 4
      };
    });
  }

  function draw(time = 0) {
    context.clearRect(0, 0, width, height);
    const dark = document.body.classList.contains("dark");
    const lineColor = dark ? "rgba(202, 215, 255, 0.18)" : "rgba(35, 59, 110, 0.2)";
    const hubColor = dark ? "rgba(114, 145, 255, 0.34)" : "rgba(53, 91, 214, 0.3)";
    const satelliteColors = dark
      ? ["rgba(255, 89, 169, .6)", "rgba(255, 216, 79, .62)", "rgba(124, 164, 255, .62)", "rgba(255, 255, 255, .42)"]
      : ["rgba(238, 54, 143, .5)", "rgba(198, 151, 15, .5)", "rgba(49, 91, 214, .48)", "rgba(44, 54, 76, .34)"];
    const motionScale = width < 600 ? 0.72 : 1;
    const hubDrift = {
      x: Math.sin(time * 0.00042) * 5 * motionScale,
      y: Math.cos(time * 0.00036) * 4 * motionScale
    };
    const hub = { x: width * 0.52 + hubDrift.x, y: height * 0.45 + hubDrift.y };
    const floatingPoints = points.map((point, index) => {
      const driftX = Math.sin(time * (0.00034 + index % 3 * 0.000025) + point.phase) * (4 + index % 4) * motionScale;
      const driftY = Math.cos(time * (0.00029 + index % 2 * 0.000035) + point.phase) * (3 + index % 3) * motionScale;
      travelPins[index].style.setProperty("--float-x", `${driftX.toFixed(2)}px`);
      travelPins[index].style.setProperty("--float-y", `${driftY.toFixed(2)}px`);
      return { ...point, x: point.x + driftX, y: point.y + driftY };
    });
    travelHub?.style.setProperty("--hub-drift-x", `${hubDrift.x.toFixed(2)}px`);
    travelHub?.style.setProperty("--hub-drift-y", `${hubDrift.y.toFixed(2)}px`);

    context.lineWidth = 1;
    floatingPoints.forEach((point, index) => {
      context.beginPath();
      context.moveTo(hub.x, hub.y);
      context.quadraticCurveTo(
        (hub.x + point.x) / 2 + Math.sin(index * 1.7) * 18,
        (hub.y + point.y) / 2 + Math.cos(index * 1.3) * 14,
        point.x,
        point.y
      );
      context.strokeStyle = index % 5 === 0 ? hubColor : lineColor;
      context.stroke();

      const neighbor = floatingPoints[(index + 1) % floatingPoints.length];
      if (Math.hypot(point.x - neighbor.x, point.y - neighbor.y) < width * 0.28) {
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(neighbor.x, neighbor.y);
        context.strokeStyle = lineColor;
        context.stroke();
      }
    });

    satellites.forEach((dot) => {
      let x = dot.x + Math.sin(time * 0.00045 + dot.phase) * 4;
      let y = dot.y + Math.cos(time * 0.00038 + dot.phase) * 3;
      if (pointer.active) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        if (distance < 76) {
          const force = (1 - distance / 76) * 28;
          x += dx / distance * force;
          y += dy / distance * force;
        }
      }
      context.beginPath();
      context.arc(x, y, dot.radius, 0, Math.PI * 2);
      context.fillStyle = satelliteColors[dot.colorIndex];
      context.fill();
    });

    if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
  }

  function updatePointer(event) {
    const rect = travelMap.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  }

  travelMap.addEventListener("pointermove", updatePointer);
  travelMap.addEventListener("pointerdown", updatePointer);
  travelMap.addEventListener("pointerleave", () => { pointer.active = false; });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(travelMap);
  resize();
  draw();

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

function selectTravelPin(pin) {
  if (!pin || !travelPhoto || !travelState || !travelPhotoNumber) return;

  const state = pin.dataset.state;
  const image = pin.dataset.image;
  const index = travelPins.indexOf(pin);
  const alreadySelected = pin.classList.contains("active");

  travelPins.forEach((item) => {
    const isActive = item === pin;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  travelState.textContent = state;
  travelPhotoNumber.textContent = `Frame ${String(index + 1).padStart(2, "0")}`;
  if (alreadySelected || travelPhoto.getAttribute("src") === image) return;

  window.clearTimeout(travelSwapTimer);
  travelPreview?.classList.add("is-changing");
  const nextImage = new Image();
  nextImage.src = image;
  nextImage.onload = () => {
    travelSwapTimer = window.setTimeout(() => {
      travelPhoto.src = image;
      travelPhoto.alt = `Shivani's travel photo from ${state}`;
      travelPreview?.classList.remove("is-changing");
    }, 90);
  };
  nextImage.onerror = () => travelPreview?.classList.remove("is-changing");
}

function goToScene(sceneId, options = {}) {
  const position = scenePositions[sceneId];
  if (!position || !world) return;

  const changed = activeScene !== sceneId;

  activeScene = sceneId;
  if (!options.fromScroll) {
    const targetScene = document.getElementById(sceneId);
    viewport.scrollTo({
      top: targetScene?.offsetTop || 0,
      behavior: options.skipTransition || options.fromHistory ? "auto" : "smooth"
    });
  }

  if (shaayVideo) {
    if (sceneId === "personal") {
      shaayVideo.muted = true;
      shaayVideo.play().catch(() => {});
    } else {
      shaayVideo.pause();
      shaayVideo.currentTime = 0;
    }
  }

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

  if (!options.fromScroll && !options.fromHistory) {
    history.pushState({ scene: sceneId }, "", `#${sceneId}`);
  }

  closeMap();
  if (changed) playNavigationTone();
}

function refreshSceneMetrics() {
  cachedPageHeight = Math.max(viewport?.clientHeight || 1, 1);
  cachedSceneStops = scenes.map((scene) => scene.offsetTop);
}

function updateScrollDrivenTransition() {
  if (!viewport || !transitionPortal) return;

  if (cachedSceneStops.length !== scenes.length) refreshSceneMetrics();
  const pageHeight = cachedPageHeight;
  const scrollTop = viewport.scrollTop;
  const sceneStops = cachedSceneStops;
  const maxScroll = Math.max(viewport.scrollHeight - pageHeight, 1);
  const globalProgress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
  document.documentElement.style.setProperty("--scroll-rotation", `${(globalProgress * 1080).toFixed(1)}deg`);

  let currentIndex = 0;
  const readingLine = scrollTop + pageHeight * 0.46;
  sceneStops.forEach((stop, index) => {
    if (readingLine >= stop) currentIndex = index;
  });
  const nearestScene = sceneOrder[currentIndex];
  if (nearestScene && nearestScene !== activeScene) {
    goToScene(nearestScene, { fromScroll: true });
  }

  scenes.forEach((scene, index) => {
    if (isAndroidDevice && Math.abs(index - currentIndex) > 1) return;
    const relativePosition = Math.max(-1, Math.min(1, (scrollTop - sceneStops[index]) / pageHeight));
    const distance = Math.abs(relativePosition);
    scene.style.setProperty("--shell-y", `${(-relativePosition * 34).toFixed(1)}px`);
    scene.style.setProperty("--shell-scale", (1 - distance * 0.025).toFixed(4));
    scene.style.setProperty("--shell-opacity", (1 - distance * 0.18).toFixed(3));
    scene.style.setProperty("--heading-y", `${(-relativePosition * 44).toFixed(1)}px`);
    scene.style.setProperty("--visual-y", `${(relativePosition * 68).toFixed(1)}px`);
    scene.style.setProperty("--content-y", `${(-relativePosition * 22).toFixed(1)}px`);
  });
  let lowerIndex = 0;
  sceneStops.forEach((stop, index) => {
    if (scrollTop >= stop) lowerIndex = index;
  });
  lowerIndex = Math.min(lowerIndex, sceneOrder.length - 2);
  const sectionStart = sceneStops[lowerIndex];
  const nextStart = sceneStops[lowerIndex + 1];
  const transitionStart = Math.max(sectionStart, nextStart - pageHeight);
  const transitionDistance = Math.max(nextStart - transitionStart, 1);
  const progress = Math.min(Math.max((scrollTop - transitionStart) / transitionDistance, 0), 1);
  const destination = lowerIndex < sceneOrder.length - 1 ? sceneOrder[lowerIndex + 1] : null;
  const isBetweenScenes = Boolean(destination) && progress > 0.025 && progress < 0.975;

  if (!isBetweenScenes || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    transitionPortal.classList.remove("is-scroll-active", "portal-next", "portal-previous");
    transitionPortal.style.removeProperty("--scroll-visibility");
    transitionPortal.style.removeProperty("--scroll-shift");
    transitionPortal.style.removeProperty("--scroll-scale");
    return;
  }

  const message = transitionMessages[destination];
  const visibility = Math.pow(Math.sin(progress * Math.PI), 1.35);
  transitionKicker.textContent = message[0];
  transitionLineOne.textContent = message[1];
  transitionLineTwo.textContent = message[2];
  transitionPortal.style.setProperty("--scroll-visibility", visibility.toFixed(3));
  transitionPortal.style.setProperty("--scroll-shift", `${((0.5 - progress) * 34).toFixed(2)}%`);
  transitionPortal.style.setProperty("--scroll-scale", (0.985 + visibility * 0.015).toFixed(4));
  transitionPortal.style.setProperty("--copy-y", `${((0.5 - progress) * 54).toFixed(1)}px`);
  transitionPortal.style.setProperty("--core-turn", `${(progress * 96).toFixed(1)}deg`);
  transitionPortal.classList.add("is-scroll-active", "portal-next");
  startTransitionField();
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
  link.addEventListener("click", () => goToScene(link.dataset.scene, {
    skipTransition: Boolean(link.closest(".world-map"))
  }));
});

travelPins.forEach((pin) => {
  pin.setAttribute("aria-pressed", String(pin.dataset.state === "Arizona"));
  pin.classList.toggle("active", pin.dataset.state === "Arizona");
  pin.addEventListener("pointerenter", () => selectTravelPin(pin));
  pin.addEventListener("focus", () => selectTravelPin(pin));
  pin.addEventListener("click", () => selectTravelPin(pin));
});

mapToggle.addEventListener("click", () => {
  if (mapPanel.classList.contains("open")) closeMap();
  else openMap();
});
mapClose.addEventListener("click", closeMap);
mapBackdrop.addEventListener("click", closeMap);

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.textContent = isDark ? "Theme[D]" : "Theme[L]";
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

  const currentIndex = sceneOrder.indexOf(activeScene);
  const direction = event.key === "ArrowDown" || event.key === "PageDown"
    ? 1
    : event.key === "ArrowUp" || event.key === "PageUp"
      ? -1
      : 0;
  const target = sceneOrder[currentIndex + direction];

  if (direction && target) {
    event.preventDefault();
    goToScene(target, { gestureDirection: direction > 0 ? "next" : "previous" });
  }
});

function nestedSceneCanScroll(target, deltaY) {
  const scene = target?.closest?.(".scene");
  if (!scene || scene.scrollHeight <= scene.clientHeight + 2) return false;
  if (deltaY > 0) return scene.scrollTop < scene.scrollHeight - scene.clientHeight - 3;
  return scene.scrollTop > 3;
}

let scrollUpdateFrame;
viewport.addEventListener("scroll", () => {
  if (scrollUpdateFrame) return;
  scrollUpdateFrame = window.requestAnimationFrame(() => {
    scrollUpdateFrame = null;
    updateScrollDrivenTransition();
  });
}, { passive: true });

viewport.addEventListener("wheel", (event) => {
  if (mapPanel.classList.contains("open")) return;
  if (Math.abs(event.deltaY) < Math.abs(event.deltaX) || nestedSceneCanScroll(event.target, event.deltaY)) return;
  event.preventDefault();
  viewport.scrollTop += event.deltaY * 0.34;
}, { passive: false });

window.addEventListener("popstate", () => {
  const sceneFromHash = location.hash.slice(1);
  goToScene(scenePositions[sceneFromHash] ? sceneFromHash : "home", { fromHistory: true });
});

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
const sceneMetricsObserver = new ResizeObserver(refreshSceneMetrics);
sceneMetricsObserver.observe(viewport);
scenes.forEach((scene) => sceneMetricsObserver.observe(scene));
window.addEventListener("pagehide", () => sceneMetricsObserver.disconnect(), { once: true });
refreshSceneMetrics();
history.replaceState({ scene: "home" }, "", `${location.pathname}${location.search}`);
goToScene("home", { fromHistory: true });
viewport.scrollTop = 0;
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  viewport.scrollTop = 0;
  goToScene("home", { fromHistory: true, fromScroll: true });
  updateScrollDrivenTransition();
});
window.requestAnimationFrame(updateScrollDrivenTransition);
renderSearch();
createFloatingField();
createTravelNetwork();
updateClock();
setInterval(updateClock, 30000);
