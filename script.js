const API_URL = "https://fakestoreapi.com/products";
let allProducts = [];
let cartCount = 0;
let darkMode = false;

window.onload = () => {
  fetchProducts();
  document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);
};

function fetchProducts() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      populateCategories(data);
      displayProducts(data);
    });
}

function searchProducts() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  if (!query) return alert("Search cannot be empty.");
  const filtered = allProducts.filter(p => p.title.toLowerCase().includes(query));
  displayProducts(filtered);
}

function populateCategories(products) {
  const categories = new Set(products.map(p => p.category));
  const select = document.getElementById("categoryFilter");
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function applyFilters() {
  const cat = document.getElementById("categoryFilter").value;
  const sort = document.getElementById("sortFilter").value;
  let filtered = [...allProducts];

  if (cat !== "all") {
    filtered = filtered.filter(p => p.category === cat);
  }

  switch (sort) {
    case "priceLowHigh":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "priceHighLow":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "ratingHighLow":
      filtered.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
  }

  displayProducts(filtered);
}

function displayProducts(products) {
  const list = document.getElementById("productList");
  list.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" onclick="showModal(${product.id})" />
      <div class="product-info">
        <div class="product-name">${product.title}</div>
        <div class="product-price">$${product.price}</div>
        <div class="product-rating">⭐ ${product.rating.rate}</div>
      </div>
    `;
    list.appendChild(card);
  });
}

function showModal(id) {
  const product = allProducts.find(p => p.id === id);
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalTitle").textContent = product.title;
  document.getElementById("modalDescription").textContent = product.description;
  document.getElementById("modalPrice").textContent = `$${product.price}`;
  document.getElementById("productModal").style.display = "block";
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

function addToCart() {
  cartCount++;
  document.getElementById("cartCount").textContent = `🛒 ${cartCount}`;
  closeModal();
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark");
}
