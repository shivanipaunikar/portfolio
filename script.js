const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const cartCount = document.querySelector("#cart-count");
const toast = document.querySelector("#toast");
const filterButtons = document.querySelectorAll(".filter-button");
const products = document.querySelectorAll(".product-card");
const newsletterForm = document.querySelector("#newsletter-form");
const formMessage = document.querySelector("#form-message");
const quizButton = document.querySelector("#quiz-button");
const quizResult = document.querySelector("#quiz-result");
const occasionButtons = document.querySelectorAll(".occasion-button");
const occasionBoard = document.querySelector("#occasion-board");
const addLookButton = document.querySelector("#add-look-button");
const sizeForm = document.querySelector("#size-form");
const sizeResult = document.querySelector("#size-result");
const waitlistForm = document.querySelector("#waitlist-form");
const waitlistMessage = document.querySelector("#waitlist-message");
const bundleButton = document.querySelector("#bundle-button");

let bagCount = 0;
let toastTimer;

const wardrobeEdits = {
  minimal: {
    office: "Willow Satin Blouse, tailored black trouser, Market Day Tote, and gold hoops.",
    date: "Rumi Knit Set, ivory court sneaker, soft clutch, and clean stacked rings.",
    vacation: "Relaxed linen shirt, wide-leg denim, canvas tote, and barely-there sandals."
  },
  bold: {
    office: "Everyday Denim Jacket, sculpted tank, charcoal trouser, and a sharp belt.",
    date: "Satin blouse, statement skirt, metallic heel, and a compact shoulder bag.",
    vacation: "Printed co-ord, oversized sunnies, woven tote, and bright sandals."
  },
  soft: {
    office: "Sage knit top, cream trouser, blush cardigan, and pearl studs.",
    date: "Ivory satin blouse, soft midi skirt, mini bag, and kitten heels.",
    vacation: "Pastel tank, flowy skirt, Market Day Tote, and easy slides."
  }
};

const occasionEdits = {
  wedding: {
    title: "Pastel satin blouse + fluid trousers + gold hoops",
    body: "Elegant, easy to dance in, and polished enough for family photos.",
    product: "Wedding Guest Edit"
  },
  office: {
    title: "Crisp blouse + sage knit layer + structured tote",
    body: "Professional without feeling stiff, made for long days and quick dinners after.",
    product: "Office Wear Edit"
  },
  airport: {
    title: "Denim jacket + rib set + canvas tote",
    body: "Soft layers, hands-free packing, and a clean arrival look.",
    product: "Airport Look Edit"
  },
  college: {
    title: "Relaxed tee + wide denim + everyday sneaker",
    body: "Easy to repeat, comfortable for campus, and still styled.",
    product: "College Fits Edit"
  },
  vacation: {
    title: "Linen shirt + breezy skirt + market tote",
    body: "Light, photogenic, and ready for beach walks or brunch.",
    product: "Vacation Edit"
  }
};

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    bagCount += 1;
    if (cartCount) {
      cartCount.textContent = String(bagCount);
    }
    showToast(`${button.dataset.product} added to your bag.`);
  });
});

document.querySelectorAll(".choice-row").forEach((group) => {
  group.addEventListener("click", (event) => {
    const choice = event.target.closest(".choice");

    if (!choice) {
      return;
    }

    group.querySelectorAll(".choice").forEach((button) => button.classList.remove("active"));
    choice.classList.add("active");
  });
});

if (quizButton && quizResult) {
  quizButton.addEventListener("click", () => {
    const mood = document.querySelector('[data-choice-group="mood"] .choice.active')?.dataset.value;
    const occasion = document.querySelector('[data-choice-group="occasion"] .choice.active')?.dataset.value;
    const fit = document.querySelector('[data-choice-group="fit"] .choice.active')?.textContent;
    const edit = wardrobeEdits[mood]?.[occasion];

    if (!edit) {
      return;
    }

    quizResult.innerHTML = `<strong>Your ${fit} Shaay edit</strong><p>${edit} Styling note: keep the color story tight and add one texture contrast.</p>`;
    showToast("Your wardrobe edit is ready.");
  });
}

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

occasionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const edit = occasionEdits[button.dataset.occasion];

    if (!occasionBoard || !edit) {
      return;
    }

    occasionButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    occasionBoard.innerHTML = `
      <div>
        <span>Featured edit</span>
        <h3>${edit.title}</h3>
        <p>${edit.body}</p>
      </div>
      <button class="add-button" type="button" data-product="${edit.product}">Shop This Edit</button>
    `;

    occasionBoard.querySelector(".add-button").addEventListener("click", () => {
      bagCount += 1;
      if (cartCount) {
        cartCount.textContent = String(bagCount);
      }
      showToast(`${edit.product} added to your bag.`);
    });
  });
});

if (addLookButton) {
  addLookButton.addEventListener("click", () => {
    bagCount += 4;
    if (cartCount) {
      cartCount.textContent = String(bagCount);
    }
    showToast("Full Rumi look added to your bag.");
  });
}

if (sizeForm && sizeResult) {
  sizeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = new FormData(sizeForm);
    const usualSize = form.get("usual-size");
    const fitPreference = form.get("fit-preference");
    const height = form.get("height");
    const sizes = ["XS", "S", "M", "L", "XL"];
    let index = sizes.indexOf(usualSize);

    if (fitPreference === "relaxed" && index < sizes.length - 1) {
      index += 1;
    }

    if (fitPreference === "snatched" && index > 0) {
      index -= 1;
    }

    const lengthNote = height === "petite"
      ? "Choose petite-friendly hems or crop the trouser length."
      : height === "tall"
        ? "Look for longer inseams and sleeves."
        : "Standard length should work well.";

    sizeResult.textContent = `Best size: ${sizes[index]}. ${lengthNote}`;
  });
}

if (waitlistForm && waitlistMessage) {
  waitlistForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(waitlistForm).get("waitlist-email");
    waitlistMessage.textContent = `Early access saved for ${email}.`;
    waitlistForm.reset();
  });
}

if (bundleButton) {
  bundleButton.addEventListener("click", () => {
    bagCount += 5;
    if (cartCount) {
      cartCount.textContent = String(bagCount);
    }
    showToast("5 Office Looks capsule added to your bag.");
  });
}

if (newsletterForm && formMessage) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(newsletterForm).get("email");
    formMessage.textContent = `You're on the list, ${email}.`;
    newsletterForm.reset();
  });
}
