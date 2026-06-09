const products = [
  {
    id: "uru-sky",
    name: "Gorro",
    variant: "Celeste con malla",
    price: 1890,
    stock: 7,
    image: "assets/cap-uruguay-sky.jpeg",
    detail: "Malla respirable, parche frontal y terminacion mundialista.",
    labels: ["Nuevo", "Mas vendido"]
  },
  {
    id: "uru-black",
    name: "Gorro",
    variant: "Negro premium",
    price: 2190,
    stock: 4,
    image: "assets/cap-uruguay-black.jpeg",
    detail: "Textura tipo cuero, malla lateral y presencia urbana.",
    labels: ["Nuevo"]
  },
  {
    id: "nacional-red",
    name: "Gorro",
    variant: "Rojo intenso",
    price: 1690,
    stock: 5,
    image: "assets/cap-nacional-red.jpeg",
    detail: "Color fuerte, bordado destacado y ajuste regulable.",
    labels: ["Oferta"]
  },
  {
    id: "defensor-black",
    name: "Gorro",
    variant: "Negro clasico",
    price: 1790,
    stock: 6,
    image: "assets/cap-defensor-black.jpeg",
    detail: "Negro total con visera texturada y escudo frontal.",
    labels: ["Mas vendido"]
  },
  {
    id: "nacional-blue",
    name: "Gorro",
    variant: "Azul marino",
    price: 1590,
    stock: 8,
    image: "assets/cap-nacional-blue.jpeg",
    detail: "Azul profundo, bordado rojo y silueta limpia.",
    labels: ["Nuevo"]
  },
  {
    id: "nacional-sky",
    name: "Gorro",
    variant: "Celeste claro",
    price: 1590,
    stock: 10,
    image: "assets/cap-sky-blue.jpeg",
    detail: "Tono claro, bordado blanco y ajuste comodo.",
    labels: ["Oferta"]
  },
  {
    id: "white-blue",
    name: "Gorro",
    variant: "Blanco y azul",
    price: 1490,
    stock: 9,
    image: "assets/cap-duo-white-blue.jpeg",
    detail: "Base blanca, visera azul y detalle bordado.",
    labels: ["Nuevo"]
  },
  {
    id: "white-patch",
    name: "Gorro",
    variant: "Blanco mesh",
    price: 1390,
    stock: 12,
    image: "assets/cap-white-patch.jpeg",
    detail: "Modelo trucker blanco, liviano y fresco.",
    labels: ["Oferta"]
  }
];

const grid = document.querySelector("#productGrid");
const cartList = document.querySelector("#cartList");
const cartTotal = document.querySelector("#cartTotal");
const cartCount = document.querySelector(".cart-count");
const heroImage = document.querySelector("#heroImage");
const heroName = document.querySelector("#heroName");
const heroVariant = document.querySelector("#heroVariant");
const toast = document.querySelector("#toast");
const header = document.querySelector("#siteHeader");
const backTop = document.querySelector("#backTop");
const cart = new Map();
const money = new Intl.NumberFormat("es-UY", {
  style: "currency",
  currency: "UYU",
  maximumFractionDigits: 0
});

function renderProducts() {
  grid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card reveal" data-id="${product.id}">
          <div class="product-media">
            <div class="product-badges">
              ${product.labels.map((label, index) => `<span class="badge ${index === 0 ? "gold" : ""}">${label}</span>`).join("")}
              <span class="badge">${product.stock} stock</span>
            </div>
            <img src="${product.image}" alt="${product.name} ${product.variant}" loading="lazy" />
          </div>
          <div class="product-body">
            <span class="variant-pill">${product.variant}</span>
            <div class="product-top">
              <div>
                <h3>${product.name}</h3>
                <p>${product.detail}</p>
              </div>
              <span class="price">${money.format(product.price)}</span>
            </div>
            <button class="add-button" type="button" data-add="${product.id}">Comprar</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCart() {
  const items = [...cart.values()];
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const quantity = items.reduce((sum, item) => sum + item.qty, 0);

  cartCount.textContent = quantity;
  cartTotal.textContent = money.format(total);

  if (!items.length) {
    cartList.innerHTML = `<p class="empty-cart">Agrega un gorro para ver tu pedido.</p>`;
    return;
  }

  cartList.innerHTML = items
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <small>${item.variant} - ${item.qty} x ${money.format(item.price)}</small>
          </div>
          <button class="remove-button" type="button" data-remove="${item.id}" aria-label="Quitar ${item.name}">x</button>
        </div>
      `
    )
    .join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  const current = cart.get(id);

  if (current && current.qty >= product.stock) {
    showToast("No queda mas stock de ese gorro.");
    return;
  }

  cart.set(id, { ...product, qty: current ? current.qty + 1 : 1 });
  renderCart();
  showToast(`Gorro agregado al pedido.`);
}

function updateHero(product) {
  heroImage.classList.add("swap");
  window.setTimeout(() => {
    heroImage.src = product.image;
    heroImage.alt = `${product.name} ${product.variant}`;
    heroName.textContent = product.name;
    heroVariant.textContent = product.variant;
    heroImage.classList.remove("swap");
  }, 220);
}

function handleScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 18);
  backTop.classList.toggle("show", y > 520);
  document.documentElement.style.setProperty("--parallax", `${Math.min(y * 0.12, 70)}px`);
}

function initReveal() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 18, 180)}ms`;
    revealObserver.observe(element);
  });
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = Number(entry.target.dataset.count);
        const start = performance.now();
        const duration = 1200;

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          entry.target.textContent = Math.round(target * eased).toLocaleString("es-UY");
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function initGallery() {
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightboxImage");
  const closeButton = document.querySelector("#closeLightbox");

  document.querySelectorAll("[data-gallery]").forEach((button) => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.gallery;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    });
  });

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  }

  closeButton.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

renderProducts();
renderCart();
initReveal();
initCounters();
initGallery();
handleScroll();

window.addEventListener("load", () => {
  window.setTimeout(() => document.querySelector("#loader").classList.add("hide"), 520);
});

window.addEventListener("scroll", handleScroll, { passive: true });

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const removeButton = event.target.closest("[data-remove]");
  const card = event.target.closest(".product-card");

  if (addButton) addToCart(addButton.dataset.add);

  if (removeButton) {
    cart.delete(removeButton.dataset.remove);
    renderCart();
    showToast("Gorro quitado del pedido.");
  }

  if (card && !addButton && !removeButton) {
    const product = products.find((item) => item.id === card.dataset.id);
    updateHero(product);
  }
});

document.querySelector(".cart-button").addEventListener("click", () => {
  document.querySelector("#checkout").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#payButton").addEventListener("click", () => {
  if (!cart.size) {
    showToast("Primero agrega un gorro al pedido.");
    return;
  }
  showToast("Pago completo por Mercado Pago listo para continuar.");
});

document.querySelector("#reserveForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const name = formData.get("name").trim();

  if (!cart.size) {
    showToast("Agrega al menos un gorro antes de confirmar el pedido.");
    return;
  }

  showToast(`Pedido generado para ${name}. Ya queda pronto para pagar.`);
});

document.querySelector("#menuToggle").addEventListener("click", (event) => {
  const isOpen = document.body.classList.toggle("menu-open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    document.querySelector("#menuToggle").setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

let heroIndex = 0;
window.setInterval(() => {
  heroIndex = (heroIndex + 1) % products.length;
  updateHero(products[heroIndex]);
}, 4700);
