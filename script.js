const products = [
  {
    "id": "carte-1",
    "name": "Carte decorativă cu floare 1",
    "category": "carti",
    "price": 100,
    "oldPrice": 100,
    "image": "images/carte-cu-floare-1.jpeg",
    "description": "Decorațiune handmade, realizată cu grijă."
  },
  {
    "id": "carte-2",
    "name": "Carte decorativă cu floare 2",
    "category": "carti",
    "price": 100,
    "oldPrice": 100,
    "image": "images/carte-cu-floare-2.jpeg",
    "description": "Decorațiune handmade, realizată cu grijă."
  },
  {
    "id": "carte-3",
    "name": "Carte decorativă cu floare 3",
    "category": "carti",
    "price": 100,
    "oldPrice": 100,
    "image": "images/carte-cu-floare-3.jpeg",
    "description": "Decorațiune handmade, realizată cu grijă."
  },
  {
    "id": "carte-4",
    "name": "Carte decorativă cu floare 4",
    "category": "carti",
    "price": 100,
    "oldPrice": 100,
    "image": "images/carte-cu-floare-4.jpeg",
    "description": "Decorațiune handmade, realizată cu grijă."
  },
  {
    "id": "carte-5",
    "name": "Carte decorativă cu floare 5",
    "category": "carti",
    "price": 100,
    "oldPrice": 100,
    "image": "images/carte-cu-floare-5.jpeg",
    "description": "Decorațiune handmade, realizată cu grijă."
  },
  {
    "id": "carte-6",
    "name": "Carte decorativă cu floare 6",
    "category": "carti",
    "price": 100,
    "oldPrice": 100,
    "image": "images/carte-cu-floare-6.jpeg",
    "description": "Decorațiune handmade, realizată cu grijă."
  },
  {
    "id": "coronita-1",
    "name": "Coroniță de Crăciun 1",
    "category": "coronite",
    "price": 100,
    "oldPrice": 100,
    "image": "images/coronita-craciun-1.jpeg",
    "description": "Decorațiune handmade pentru atmosfera sărbătorilor."
  },
  {
    "id": "coronita-2",
    "name": "Coroniță de Crăciun 2",
    "category": "coronite",
    "price": 100,
    "oldPrice": 100,
    "image": "images/coronita-craciun-2.jpeg",
    "description": "Decorațiune handmade pentru atmosfera sărbătorilor."
  },
  {
    "id": "coronita-3",
    "name": "Coroniță de Crăciun 3",
    "category": "coronite",
    "price": 100,
    "oldPrice": 100,
    "image": "images/coronita-craciun-3.jpeg",
    "description": "Decorațiune handmade pentru atmosfera sărbătorilor."
  },
  {
    "id": "coronita-4",
    "name": "Coroniță de Crăciun 4",
    "category": "coronite",
    "price": 100,
    "oldPrice": 100,
    "image": "images/coronita-craciun-4.jpeg",
    "description": "Decorațiune handmade pentru atmosfera sărbătorilor."
  }
]

const grid = document.getElementById('product-grid');
const searchInput = document.getElementById('search');
const emptyState = document.getElementById('empty-state');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
let activeCategory = 'toate';
let cart = JSON.parse(localStorage.getItem('celestChristmasCart') || '{}');

function formatPrice(value) {
  return value == null || value === '' ? 'Preț la cerere' : `${Number(value).toFixed(2).replace('.', ',')} lei`;
}

function renderProducts() {
  const term = searchInput.value.trim().toLocaleLowerCase('ro');
  const filtered = products.filter(product => {
    const categoryMatch = activeCategory === 'toate' || product.category === activeCategory;
    const textMatch = `${product.name} ${product.description}`.toLocaleLowerCase('ro').includes(term);
    return categoryMatch && textMatch;
  });

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-info">
        <span class="product-category">${product.category === 'coronite' ? 'Coronițe' : 'Cărți decorative'}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="price">${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}${formatPrice(product.price)}</span>
          <button class="add-button" data-add="${product.id}">Adaugă în coș +</button>
        </div>
      </div>
    </article>`).join('');

  emptyState.hidden = filtered.length !== 0;
}

function saveCart() {
  localStorage.setItem('celestChristmasCart', JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart).filter(([id, qty]) => qty > 0);
  const totalCount = entries.reduce((sum, [, qty]) => sum + qty, 0);
  cartCount.textContent = totalCount;

  if (!entries.length) {
    cartItems.innerHTML = '<p class="cart-empty">Coșul tău este momentan gol.</p>';
    return;
  }

  cartItems.innerHTML = entries.map(([id, qty]) => {
    const product = products.find(item => item.id === id);
    if (!product) return '';
    return `<div class="cart-row">
      <img src="${product.image}" alt="">
      <div><h4>${product.name}</h4><small>${formatPrice(product.price)}</small>
        <div class="qty-controls">
          <button data-minus="${id}" aria-label="Scade cantitatea">−</button>
          <span>${qty}</span>
          <button data-plus="${id}" aria-label="Crește cantitatea">+</button>
        </div>
      </div>
      <button class="remove-item" data-remove="${id}" aria-label="Șterge produsul">×</button>
    </div>`;
  }).join('');
}

grid.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const id = button.dataset.add;
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  button.textContent = 'Adăugat ✓';
  setTimeout(() => button.textContent = 'Adaugă în coș +', 1000);
});

cartItems.addEventListener('click', event => {
  const plus = event.target.closest('[data-plus]');
  const minus = event.target.closest('[data-minus]');
  const remove = event.target.closest('[data-remove]');
  if (plus) cart[plus.dataset.plus] = (cart[plus.dataset.plus] || 0) + 1;
  if (minus) {
    const id = minus.dataset.minus;
    cart[id] = (cart[id] || 0) - 1;
    if (cart[id] <= 0) delete cart[id];
  }
  if (remove) delete cart[remove.dataset.remove];
  saveCart();
});

document.querySelectorAll('.filter-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    activeCategory = button.dataset.category;
    renderProducts();
  });
});
searchInput.addEventListener('input', renderProducts);

function toggleCart(open) {
  document.body.classList.toggle('cart-open', open);
  document.getElementById('cart-drawer').setAttribute('aria-hidden', String(!open));
}
document.getElementById('cart-toggle').addEventListener('click', () => toggleCart(true));
document.getElementById('cart-close').addEventListener('click', () => toggleCart(false));
document.getElementById('drawer-backdrop').addEventListener('click', () => toggleCart(false));

document.getElementById('order-button').addEventListener('click', () => {
  const lines = Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, qty]) => {
    const product = products.find(item => item.id === id);
    return product ? `${product.name} x${qty} — ${formatPrice(product.price)}` : '';
  }).filter(Boolean);
  if (!lines.length) {
    alert('Coșul este gol. Adaugă mai întâi un produs.');
    return;
  }
  const message = 'Bună! Aș dori să comand:\\n' + lines.join('\\n') + '\\nTe rog să-mi confirmi disponibilitatea și prețul final.';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(message).then(() => alert('Lista comenzii a fost copiată. O poți trimite într-un mesaj.'));
  } else {
    window.prompt('Copiază lista comenzii:', message);
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
renderProducts();
renderCart();
