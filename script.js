const products = [
  {
    id: 1,
    name: "Robotic Cart Diy Kit",
    price: 1499,
    description: `Includes essential electronic components and DIY kit parts.`,
    image: "products/product1/robotic_cart_diy_kit.jpg",
    detailImage: "products/product1/robotic_cart_diy_kit_detail_image.png"
  },
  {
    id: 2,
    name: "Wifi Home Automation DIY Kit",
    price: 1499,
    description: `Highlights of PCB

1) 4ch Relay driver Circuit ON board

2) Can drive 12 volt as well as 5 Volt Relays,

3) PCB have facility to install Moter Driver IC ,

4) P10 Connecter On board, for large Matrix display

5) PCB have Facility to install RFID on board,

6) Pushbuttons and IR reciever are placed to entertain multiple inputs,

7) Facility to install Buzzer On board to make timer or alarm or alert beeps,

9) PCB is designed to serve Ver 2 and Ver 3 both the NodeMCUs.

10) PCB can be used for IOT projects as well as Local Wifi Home Automations.

`,
    image: "products/product2/wifi_home_automation.jpg",
    detailImage: "products/product2/wifi_home_automation_detail_image.jpg"
  }
];

const productContainer = document.getElementById("products");
const modal = document.getElementById("productModal");
const cartSidebar = document.getElementById("cartSidebar");
const cartIcon = document.getElementById("cartIcon");
const cartCount = document.getElementById("cartCount");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

let cart = [];
let currentProduct = null;

// Render Products
products.forEach(product => {
  const div = document.createElement("div");
  div.classList.add("product");
  div.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>₹${product.price}</p>
    <button class="btn btn-buy">Buy</button>
    <button class="btn btn-details">Details</button>
    <button class="btn btn-cart">Add to Cart</button>
  `;

  div.querySelector(".btn-buy").addEventListener("click", (e) => {
    e.stopPropagation();
    buyProduct(product);
  });

  div.querySelector(".btn-details").addEventListener("click", (e) => {
    e.stopPropagation();
    showDetails(product.id);
  });

  div.querySelector(".btn-cart").addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product);
  });

  productContainer.appendChild(div);
});

function buyProduct(product) {
  const phone = "918989811397";
  const message = `Hello! I'm interested in buying:\n\n📦 ${product.name}\n💰 ₹${product.price}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
}

function showDetails(id) {
  const product = products.find(p => p.id === id);
  currentProduct = product;
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalName").innerText = product.name;
  document.getElementById("modalPrice").innerText = "₹" + product.price;
  document.getElementById("modalDescription").innerText = product.description;
  document.getElementById("modalDetailImage").src = product.detailImage;
  modal.style.display = "flex";
  history.pushState({ modalOpen: true }, "", "#detail");
}

function closeModal() {
  modal.style.display = "none";
  if (history.state && history.state.modalOpen) {
    history.back();
  }
}
document.getElementById("closeModal").onclick = closeModal;
window.onclick = (e) => { if (e.target === modal) closeModal(); };
window.addEventListener("popstate", () => { if (modal.style.display === "flex") modal.style.display = "none"; });

function addToCart(product) {
  const exists = cart.find(item => item.id === product.id);
  if (exists) {
    exists.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}

document.getElementById("addToCartFromModal").addEventListener("click", () => {
  if (currentProduct) addToCart(currentProduct);
});

// Update Cart UI
function updateCartUI() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name}</span>
      <div class="qty-controls">
        <button class="qty-btn decrease">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn increase">+</button>
      </div>
      <span>₹${item.price * item.qty}</span>
    `;
    div.querySelector(".decrease").addEventListener("click", () => changeQty(item.id, -1));
    div.querySelector(".increase").addEventListener("click", () => changeQty(item.id, 1));
    cartItemsContainer.appendChild(div);
  });
  cartTotal.textContent = "Total: ₹" + total;
}

function changeQty(id, delta) {
  cart = cart.map(item => {
    if (item.id === id) {
      return { ...item, qty: item.qty + delta };
    }
    return item;
  }).filter(item => item.qty > 0);
  updateCartUI();
}

// Cart Sidebar toggle
cartIcon.addEventListener("click", () => {
  cartSidebar.classList.add("open");
  history.pushState({ cartOpen: true }, "", "#cart"); // push state when cart opens
});

// Cart Sidebar close button
const closeCartBtn = document.createElement("span");
closeCartBtn.classList.add("close-cart");
closeCartBtn.innerHTML = "&times;";
closeCartBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
  history.back(); // go back in history when user clicks close
});
cartSidebar.prepend(closeCartBtn);

// Optional: Close sidebar if user clicks outside it
window.addEventListener("click", (e) => {
  if (cartSidebar.classList.contains("open") && !cartSidebar.contains(e.target) && e.target !== cartIcon) {
    cartSidebar.classList.remove("open");
    history.back();
  }
});

// Handle device back button for cart
window.addEventListener("popstate", () => {
  if (cartSidebar.classList.contains("open")) {
    cartSidebar.classList.remove("open");
  }
});
