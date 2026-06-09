const products = [
  {
    id: "uru-sky",
    name: "Gorro Celeste Uruguay",
    team: "Seleccion Uruguay",
    price: 1890,
    stock: 7,
    image: "assets/cap-uruguay-sky.jpeg",
    detail: "Malla respirable, parche A.U.F. y look mundialista."
  },
  {
    id: "uru-black",
    name: "Gorro Negro Uruguay",
    team: "Seleccion Uruguay",
    price: 2190,
    stock: 4,
    image: "assets/cap-uruguay-black.jpeg",
    detail: "Cuero negro, textura fuerte y presencia nocturna."
  },
  {
    id: "nacional-red",
    name: "Gorro Rojo",
    team: "Club Nacional",
    price: 1690,
    stock: 5,
    image: "assets/cap-nacional-red.jpeg",
    detail: "Rojo fuerte, bordado azul y blanco, energia de tribuna."
  },
  {
    id: "defensor-black",
    name: "Gorro Negro",
    team: "Defensor Sporting",
    price: 1790,
    stock: 6,
    image: "assets/cap-defensor-black.jpeg",
    detail: "Negra total con escudo contrastado y visera texturada."
  },
  {
    id: "nacional-blue",
    name: "Gorro Azul Marino",
    team: "Club Nacional",
    price: 1590,
    stock: 8,
    image: "assets/cap-nacional-blue.jpeg",
    detail: "Azul profundo, bordado rojo y ajuste snapback."
  },
  {
    id: "nacional-sky",
    name: "Gorro Celeste",
    team: "Club Nacional",
    price: 1590,
    stock: 10,
    image: "assets/cap-sky-blue.jpeg",
    detail: "Celeste claro con bordado blanco, limpia y fresca."
  },
  {
    id: "white-blue",
    name: "Gorro Blanco y Azul",
    team: "Club Nacional",
    price: 1490,
    stock: 9,
    image: "assets/cap-duo-white-blue.jpeg",
    detail: "Blanca con visera azul, bordado rojo y silueta clasica."
  },
  {
    id: "white-patch",
    name: "Gorro Blanco Mesh",
    team: "Edicion Epico",
    price: 1390,
    stock: 12,
    image: "assets/cap-white-patch.jpeg",
    detail: "Modelo trucker blanco con parches laterales."
  }
];

const grid = document.querySelector("#productGrid");
const cartList = document.querySelector("#cartList");
const cartTotal = document.querySelector("#cartTotal");
const cartCount = document.querySelector(".cart-count");
const heroImage = document.querySelector("#heroImage");
const heroName = document.querySelector("#heroName");
const toast = document.querySelector("#toast");
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
        <article class="product-card" data-id="${product.id}">
          <div class="product-media">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            <span class="stock-badge">${product.stock} en stock</span>
          </div>
          <div class="product-body">
            <div class="product-meta">
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
    cartList.innerHTML = `<p class="empty-cart">Agrega una gorra para ver el resumen.</p>`;
    return;
  }

  cartList.innerHTML = items
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <small>${item.qty} x ${money.format(item.price)}</small>
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
    showToast("No queda mas stock disponible para ese modelo.");
    return;
  }

  cart.set(id, { ...product, qty: current ? current.qty + 1 : 1 });
  renderCart();
  showToast(`${product.name} agregada al pedido.`);
}

renderProducts();
renderCart();

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const removeButton = event.target.closest("[data-remove]");
  const card = event.target.closest(".product-card");

  if (addButton) addToCart(addButton.dataset.add);

  if (removeButton) {
    cart.delete(removeButton.dataset.remove);
    renderCart();
    showToast("Modelo quitado del pedido.");
  }

  if (card && !addButton) {
    const product = products.find((item) => item.id === card.dataset.id);
    heroImage.classList.add("swap");
    window.setTimeout(() => {
      heroImage.src = product.image;
      heroImage.alt = product.name;
      heroName.textContent = product.name;
      heroImage.classList.remove("swap");
    }, 220);
  }
});

document.querySelector(".cart-toggle").addEventListener("click", () => {
  document.querySelector("#pago").scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#payButton").addEventListener("click", () => {
  if (!cart.size) {
    showToast("Primero agrega una gorra al pedido.");
    return;
  }
  showToast("Pago completo por Mercado Pago listo para continuar.");
});

document.querySelector("#reserveForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const name = formData.get("name").trim();

  if (!cart.size) {
    showToast("Agrega al menos una gorra antes de confirmar el pedido.");
    return;
  }

  showToast(`Pedido generado para ${name}. Ya queda pronto para pagar.`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".product-card").forEach((card, index) => {
  card.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
  revealObserver.observe(card);
});

let heroIndex = 0;
window.setInterval(() => {
  heroIndex = (heroIndex + 1) % products.length;
  const product = products[heroIndex];
  heroImage.classList.add("swap");
  window.setTimeout(() => {
    heroImage.src = product.image;
    heroImage.alt = product.name;
    heroName.textContent = product.name;
    heroImage.classList.remove("swap");
  }, 220);
}, 4200);
