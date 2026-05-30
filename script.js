const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const cartCount = document.querySelector("#cart-count");
const toast = document.querySelector("#toast");
const filterButtons = document.querySelectorAll(".filter-button");
const products = document.querySelectorAll(".product-card");
const newsletterForm = document.querySelector("#newsletter-form");
const formMessage = document.querySelector("#form-message");

let bagCount = 0;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    bagCount += 1;
    cartCount.textContent = String(bagCount);
    showToast(`${button.dataset.product} added to your bag.`);
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    products.forEach((product) => {
      const shouldShow = filter === "all" || product.dataset.category === filter;
      product.classList.toggle("hidden", !shouldShow);
    });
  });
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = new FormData(newsletterForm).get("email");
  formMessage.textContent = `You're on the list, ${email}.`;
  newsletterForm.reset();
});
