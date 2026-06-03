const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const focusButtons = document.querySelectorAll(".focus-button");
const focusImage = document.querySelector("#focus-image");
const focusKicker = document.querySelector("#focus-kicker");
const focusTitle = document.querySelector("#focus-title");
const focusText = document.querySelector("#focus-text");

const focusPanels = {
  data: {
    image: "assets/data-engineering-visual.png",
    alt: "Data engineering visual with connected analytics charts",
    kicker: "Data Engineering",
    title: "Smarter pipelines and decision-ready data",
    text:
      "Designing ETL, SQL, validation checks, and data flows that help operational teams trust information faster."
  },
  ai: {
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
    alt: "Artificial intelligence visualization on a screen",
    kicker: "AI + LLMs",
    title: "AI tools that turn signals into action",
    text:
      "Exploring LLMs, machine learning, and computer vision systems that make workflows more intelligent and easier to operate."
  },
  frontend: {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    alt: "Laptop showing a modern software interface",
    kicker: "Frontend Systems",
    title: "Interfaces for complex technical systems",
    text:
      "Building responsive, polished portfolio and product interfaces with clear hierarchy, interaction states, and user-centered structure."
  },
  impact: {
    image: "assets/axon-protect-life.png",
    alt: "Axon Protect Life public safety technology",
    kicker: "Public Impact",
    title: "Data systems for mission-driven teams",
    text:
      "Connecting backend architecture, validation frameworks, and public-sector data products to work that affects real people."
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

focusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panel = focusPanels[button.dataset.focus];

    if (!panel || !focusImage || !focusKicker || !focusTitle || !focusText) {
      return;
    }

    focusButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    focusImage.src = panel.image;
    focusImage.alt = panel.alt;
    focusKicker.textContent = panel.kicker;
    focusTitle.textContent = panel.title;
    focusText.textContent = panel.text;
  });
});
