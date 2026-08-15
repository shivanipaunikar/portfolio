const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const tabs = document.querySelectorAll(".builder-tab");
const previewFile = document.querySelector("#preview-file");
const previewKicker = document.querySelector("#preview-kicker");
const previewTitle = document.querySelector("#preview-title");
const previewText = document.querySelector("#preview-text");
const previewCode = document.querySelector("#preview-code");

const builds = {
  data: {
    file: "pipeline.ts",
    kicker: "Data Engineering",
    title: "Trusted pipelines for serious teams.",
    text:
      "SQL, Snowflake, ETL, validation checks, and analytics layers designed for dependable operational decisions.",
    code: `pipeline.deploy({
  sources: ["operational_data", "case_signals"],
  checks: ["freshness", "schema", "accuracy"],
  output: "trusted_decision_layer"
});`
  },
  ai: {
    file: "ai-lab.ts",
    kicker: "AI + LLM Workflows",
    title: "AI that supports useful work.",
    text:
      "Practical machine learning, LLM workflows, and computer vision ideas connected to real user and data problems.",
    code: `aiWorkflow.compose({
  mode: "human_reviewed",
  tasks: ["summarize", "detect", "explain"],
  guardrails: ["traceable", "secure", "useful"]
});`
  },
  research: {
    file: "research.ts",
    kicker: "Research + IP",
    title: "Academic and IP signals in one place.",
    text:
      "Google Scholar, patent work, Canada registration, UK IPO recognition, and publication identifiers without document downloads.",
    code: `research.signals({
  patent: "202541055731",
  copyright: "Canada 1236755",
  isbn: ["978-93-7183-278-6", "978-93-89476-76-7"]
});`
  },
  impact: {
    file: "impact.ts",
    kicker: "Public Impact",
    title: "Work that shows up outside the codebase.",
    text:
      "Press coverage, AI teaching, community involvement, and public-safety data work connected to real teams.",
    code: `impact.publish({
  press: ["Times of India", "Dainik Bhaskar"],
  community: "Global AI Tempe",
  mission: "data people can trust"
});`
  }
};

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const build = builds[tab.dataset.build];

    if (!build || !previewFile || !previewKicker || !previewTitle || !previewText || !previewCode) {
      return;
    }

    tabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    previewFile.textContent = build.file;
    previewKicker.textContent = build.kicker;
    previewTitle.textContent = build.title;
    previewText.textContent = build.text;
    previewCode.textContent = build.code;
  });
});
