const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const searchForm = document.querySelector("#portfolio-search");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
const promptButtons = document.querySelectorAll("[data-query]");
const layerButtons = document.querySelectorAll(".builder-row");
const layerUrl = document.querySelector("#layer-url");
const layerNode = document.querySelector("#layer-node");
const layerKicker = document.querySelector("#layer-kicker");
const layerTitle = document.querySelector("#layer-title");
const layerText = document.querySelector("#layer-text");

const portfolioItems = [
  {
    tag: "Current role",
    title: "Data Solutions Engineer II at Axon",
    text: "Data solutions for public-safety technology, operational reporting, and trusted workflows.",
    keywords: ["axon", "current", "role", "public safety", "data solutions", "engineer"]
  },
  {
    tag: "Past experience",
    title: "Data Engineer at Tucson Police Department",
    text: "Former TPD data engineer supporting analytics and backend workflows for operational clarity.",
    keywords: ["tpd", "tucson", "police", "department", "past", "experience", "data engineer"]
  },
  {
    tag: "Patent",
    title: "Indian Patent Application 202541055731",
    text: "Digital image forgery detection using machine learning and artificial intelligence techniques.",
    keywords: ["patent", "india", "image", "forgery", "machine learning", "ai", "computer vision"]
  },
  {
    tag: "Research",
    title: "Google Scholar and publications",
    text: "Research profile, citations, ebook ISBNs, and publication visibility.",
    keywords: ["google scholar", "research", "publication", "citations", "books", "isbn", "ebook"]
  },
  {
    tag: "International IP",
    title: "Canada and UK signals",
    text: "Canadian Copyright Registration 1236755 and UK Intellectual Property Office recognition.",
    keywords: ["canada", "copyright", "1236755", "uk", "ipo", "international", "ip"]
  },
  {
    tag: "Press",
    title: "Times of India and Dainik Bhaskar",
    text: "Public media coverage for data innovation and community visibility.",
    keywords: ["press", "times of india", "dainik", "bhaskar", "media", "news"]
  },
  {
    tag: "Credentials",
    title: "Certifications and judging",
    text: "AWS, Agile, Jira, DevOps, Analytics, DataCamp, hackathon judging, and Technovation.",
    keywords: ["certifications", "aws", "agile", "jira", "devops", "analytics", "datacamp", "judging", "hackathon", "technovation"]
  },
  {
    tag: "Community",
    title: "CEE and Global AI Community Tempe",
    text: "AI education, webinar signal, chapter activity, and practical community work.",
    keywords: ["cee", "global ai", "tempe", "community", "webinar", "teaching ai"]
  },
  {
    tag: "Personal",
    title: "Meet Shaay",
    text: "Outside work: curious, creative, and very much a dog person.",
    keywords: ["shaay", "dog", "personal", "outside work", "companion"]
  }
];

const layers = {
  data: {
    url: "shivani.dev/data-systems",
    node: "Data",
    kicker: "Data Engineering",
    title: "Reliable pipelines and decision-ready data.",
    text: "SQL, Snowflake, ETL, validation, and analytics layers for dependable operational workflows."
  },
  ai: {
    url: "shivani.dev/ai-lab",
    node: "AI",
    kicker: "AI + LLM Workflows",
    title: "AI workflows with practical purpose.",
    text: "LLM workflows, machine learning concepts, and computer vision research tied to real user needs."
  },
  impact: {
    url: "shivani.dev/public-impact",
    node: "Impact",
    kicker: "Public Impact",
    title: "Public-safety and community impact.",
    text: "Axon, TPD, press coverage, AI education, and community work connected to public-facing outcomes."
  },
  research: {
    url: "shivani.dev/research-ip",
    node: "IP",
    kicker: "Research + IP",
    title: "Academic and intellectual-property signals.",
    text: "Patent work, Google Scholar visibility, Canada registration, UK IPO recognition, and ISBN signals."
  }
};

function renderResults(query = "") {
  if (!searchResults) {
    return;
  }

  const normalized = query.trim().toLowerCase();
  const matches = normalized
    ? portfolioItems.filter((item) =>
        [item.tag, item.title, item.text, ...item.keywords].some((value) =>
          value.toLowerCase().includes(normalized)
        )
      )
    : portfolioItems.slice(0, 3);

  const visibleItems = (matches.length ? matches : portfolioItems).slice(0, 3);
  searchResults.innerHTML = visibleItems
    .map(
      (item) => `<article>
        <span>${item.tag}</span>
        <h2>${item.title}</h2>
        <p>${item.text}</p>
      </article>`
    )
    .join("");
}

if (menuToggle && nav) {
  const closeMenu = () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = nav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (nav.classList.contains("open") && !clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderResults(searchInput.value);
  });

  searchInput.addEventListener("input", () => {
    renderResults(searchInput.value);
  });
}

promptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!searchInput) {
      return;
    }

    searchInput.value = button.dataset.query;
    renderResults(searchInput.value);
  });
});

layerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const layer = layers[button.dataset.layer];

    if (!layer || !layerUrl || !layerNode || !layerKicker || !layerTitle || !layerText) {
      return;
    }

    layerButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    layerUrl.textContent = layer.url;
    layerNode.textContent = layer.node;
    layerKicker.textContent = layer.kicker;
    layerTitle.textContent = layer.title;
    layerText.textContent = layer.text;
  });
});

renderResults();
