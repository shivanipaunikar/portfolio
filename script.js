const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const capabilityButtons = document.querySelectorAll(".capability");
const panelFile = document.querySelector("#panel-file");
const panelKicker = document.querySelector("#panel-kicker");
const panelTitle = document.querySelector("#panel-title");
const panelText = document.querySelector("#panel-text");
const panelCode = document.querySelector("#panel-code");

const panels = {
  data: {
    file: "pipeline.config.ts",
    kicker: "Data Engineering",
    title: "Decision-ready pipelines",
    text: "Designing SQL, ETL, validation checks, and data flows that help teams trust information faster.",
    code: `pipeline.validate({
  source: "operational_data",
  checks: ["freshness", "schema", "accuracy"],
  output: "trusted_decision_layer"
});`
  },
  ai: {
    file: "ai-workflow.ts",
    kicker: "AI + LLM Workflows",
    title: "Practical intelligence inside useful tools",
    text: "Exploring LLMs, machine learning, and computer vision concepts where AI supports workflow quality instead of becoming visual noise.",
    code: `assistantWorkflow.run({
  context: "data_quality_review",
  guardrails: ["traceable", "human_reviewed"],
  result: "actionable_summary"
});`
  },
  frontend: {
    file: "interface.tsx",
    kicker: "Frontend Quality",
    title: "Interfaces that make systems feel clear",
    text: "Building responsive pages with clean hierarchy, accessible controls, and interaction states that feel polished on desktop and mobile.",
    code: `<Section title="Developer Portfolio">
  <SignalGrid density="scannable" />
  <CodePreview language="ts" />
</Section>`
  },
  impact: {
    file: "public-impact.sql",
    kicker: "Public Impact",
    title: "Engineering with operational stakes",
    text: "Connecting backend architecture, validation frameworks, and public-sector data products to work that affects real people.",
    code: `select mission, signal, confidence
from public_safety_metrics
where status = 'decision_ready'
order by updated_at desc;`
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

capabilityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panel = panels[button.dataset.panel];

    if (!panel || !panelFile || !panelKicker || !panelTitle || !panelText || !panelCode) {
      return;
    }

    capabilityButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    panelFile.textContent = panel.file;
    panelKicker.textContent = panel.kicker;
    panelTitle.textContent = panel.title;
    panelText.textContent = panel.text;
    panelCode.textContent = panel.code;
  });
});
