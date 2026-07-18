'use strict';

/* ==========================================================================
   CAR WINGS — Configuración del negocio
   Edita SOLO esta sección con los datos reales del restaurante.
   ========================================================================== */
const CONFIG = {
  // ⚠️ IMPORTANTE: reemplaza este número por el WhatsApp real de Car Wings.
  // Formato: código de país + número, SIN espacios, signos ni el símbolo "+".
  // Ejemplo Bolivia: 591 + número de 8 dígitos => "59170000000"
  whatsappNumber: '59170000000',

  businessName: 'Car Wings',
  address: 'Av. Cochabamba 0855, Quillacollo, Bolivia',
};

const MENU_ITEMS = [
  {
    id: 'combo4',
    name: '4 Piezas + Papa',
    desc: '4 alitas + 1 porción de papa',
    price: 20,
    icon: 'wing',
  },
  {
    id: 'combo6',
    name: '6 Piezas + Papa',
    desc: '6 alitas + 1 porción de papa',
    price: 30,
    icon: 'wing',
    popular: true,
  },
  {
    id: 'combo14',
    name: '14 Piezas + Papa',
    desc: '14 alitas + 1 porción de papa',
    price: 70,
    icon: 'wing',
  },
  {
    id: 'combo28',
    name: '28 Piezas + 2 Papas',
    desc: '28 alitas + 2 porciones de papa',
    price: 130,
    icon: 'wing',
  },
];

const EXTRA_ITEMS = [
  { id: 'salsa40', name: 'Salsa extra 40 ml', price: 2 },
  { id: 'salsa100', name: 'Salsa extra 100 ml', price: 5 },
];

const WING_ICON_SVG = `<svg viewBox="0 0 24 24"><path d="M12 3c-2.5 2.5-2.5 4.2-.8 6-1.3.4-2.2 1.7-2.2 3.3A3.1 3.1 0 0 0 12 15.4a3.1 3.1 0 0 0 3-3.1c0-1.6-.9-2.9-2.2-3.3 1.7-1.8 1.7-3.5-.8-6Z" fill="currentColor"/><path d="M6 20c1-2 2-3 6-3s5 1 6 3" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;

/* ==========================================================================
   Estado del carrito (persistido en localStorage)
   ========================================================================== */
const STORAGE_KEY = 'carwings_order_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (e) { /* almacenamiento no disponible, se ignora */ }
}

let cart = loadCart();

/* ==========================================================================
   Helpers
   ========================================================================== */
function formatBs(n) {
  return `${n} Bs.`;
}

function buildWhatsappUrl(message) {
  const digits = CONFIG.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function baseGreeting() {
  return `Hola Car Wings 👋 Quisiera hacer un pedido.`;
}

/* ==========================================================================
   Render del menú
   ========================================================================== */
function renderMenu() {
  const grid = document.getElementById('menuGrid');
  const extrasGrid = document.getElementById('extrasGrid');
  if (!grid || !extrasGrid) return;

  grid.innerHTML = MENU_ITEMS.map((item) => `
    <article class="menu-card ${item.popular ? 'is-popular' : ''}" role="listitem">
      ${item.popular ? '<span class="menu-card-badge">Más pedido</span>' : ''}
      <div class="menu-card-icon" aria-hidden="true">${WING_ICON_SVG}</div>
      <h3>${item.name}</h3>
      <p class="menu-card-desc">${item.desc}</p>
      <p class="menu-card-price">${item.price} <span>Bs.</span></p>
      <div class="qty-control" data-id="${item.id}">
        <button type="button" class="qty-btn" data-action="dec" aria-label="Quitar una unidad de ${item.name}">–</button>
        <span class="qty-value" data-qty="${item.id}">0</span>
        <button type="button" class="qty-btn" data-action="inc" aria-label="Agregar una unidad de ${item.name}">+</button>
      </div>
    </article>
  `).join('');

  extrasGrid.innerHTML = EXTRA_ITEMS.map((item) => `
    <div class="extra-card" role="listitem">
      <div>
        <p class="extra-card-name">${item.name}</p>
        <p class="extra-card-price">${formatBs(item.price)}</p>
      </div>
      <div class="qty-control" data-id="${item.id}">
        <button type="button" class="qty-btn" data-action="dec" aria-label="Quitar una unidad de ${item.name}">–</button>
        <span class="qty-value" data-qty="${item.id}">0</span>
        <button type="button" class="qty-btn" data-action="inc" aria-label="Agregar una unidad de ${item.name}">+</button>
      </div>
    </div>
  `).join('');

  grid.addEventListener('click', onQtyClick);
  extrasGrid.addEventListener('click', onQtyClick);
  syncQtyDisplays();
}

function allItemsById() {
  return [...MENU_ITEMS, ...EXTRA_ITEMS].reduce((acc, i) => {
    acc[i.id] = i;
    return acc;
  }, {});
}

function onQtyClick(e) {
  const btn = e.target.closest('.qty-btn');
  if (!btn) return;
  const wrap = btn.closest('.qty-control');
  const id = wrap.dataset.id;
  const current = cart[id] || 0;

  if (btn.dataset.action === 'inc') {
    cart[id] = Math.min(current + 1, 99);
  } else {
    cart[id] = Math.max(current - 1, 0);
    if (cart[id] === 0) delete cart[id];
  }

  saveCart(cart);
  syncQtyDisplays();
  renderOrderPanel();
  updateCartBadge();
}

function syncQtyDisplays() {
  document.querySelectorAll('[data-qty]').forEach((el) => {
    const id = el.getAttribute('data-qty');
    el.textContent = cart[id] || 0;
  });
}

/* ==========================================================================
   Panel de pedido
   ========================================================================== */
function cartTotal() {
  const items = allItemsById();
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = items[id];
    return item ? sum + item.price * qty : sum;
  }, 0);
}

function cartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function renderOrderPanel() {
  const container = document.getElementById('orderItems');
  const emptyMsg = document.getElementById('orderEmpty');
  const totalEl = document.getElementById('orderTotal');
  if (!container || !totalEl) return;

  const items = allItemsById();
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

  if (entries.length === 0) {
    container.innerHTML = '<p class="order-empty" id="orderEmpty">Aún no agregaste combos. Ve al menú y elige tus favoritos 🍗</p>';
  } else {
    container.innerHTML = entries.map(([id, qty]) => {
      const item = items[id];
      if (!item) return '';
      return `
        <div class="order-item">
          <div>
            <p class="order-item-name">${item.name}</p>
            <p class="order-item-sub">${formatBs(item.price)} c/u</p>
          </div>
          <div class="order-item-right">
            <div class="qty-control" data-id="${id}" style="width:104px;">
              <button type="button" class="qty-btn" data-action="dec" aria-label="Quitar uno">–</button>
              <span class="qty-value" data-qty-panel="${id}">${qty}</span>
              <button type="button" class="qty-btn" data-action="inc" aria-label="Agregar uno">+</button>
            </div>
            <span class="order-item-price">${formatBs(item.price * qty)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  totalEl.textContent = formatBs(cartTotal());
  updateOrderLinks();
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const count = cartCount();
  if (count > 0) {
    badge.hidden = false;
    badge.textContent = String(count);
  } else {
    badge.hidden = true;
  }
}

function buildOrderMessage() {
  const items = allItemsById();
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const flavorSelect = document.getElementById('flavorSelect');
  const flavor = flavorSelect ? flavorSelect.value : '';

  let lines = [baseGreeting(), ''];

  if (entries.length === 0) {
    lines.push('Quisiera más información sobre el menú.');
  } else {
    lines.push('Mi pedido:');
    entries.forEach(([id, qty]) => {
      const item = items[id];
      if (item) lines.push(`• ${qty}x ${item.name} — ${formatBs(item.price * qty)}`);
    });
    lines.push('');
    lines.push(`Sabor: ${flavor}`);
    lines.push(`Total: ${formatBs(cartTotal())}`);
  }

  lines.push('');
  lines.push(`Para: ${CONFIG.address}`);

  return lines.join('\n');
}

function updateOrderLinks() {
  const url = buildWhatsappUrl(buildOrderMessage());
  const sendBtn = document.getElementById('orderSend');
  if (sendBtn) sendBtn.href = url;
}

function setSimpleWhatsappLinks() {
  const url = buildWhatsappUrl(baseGreeting());
  ['navWhatsapp', 'heroWhatsapp', 'footerWhatsapp', 'floatingWhatsapp'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = url;
  });
}

/* ==========================================================================
   Panel deslizante de pedido (abrir / cerrar)
   ========================================================================== */
function initOrderPanel() {
  const panel = document.getElementById('orderPanel');
  const backdrop = document.getElementById('orderBackdrop');
  const openTriggers = [document.getElementById('floatingWhatsapp')];
  const closeBtn = document.getElementById('orderClose');
  const clearBtn = document.getElementById('orderClear');
  const flavorSelect = document.getElementById('flavorSelect');

  function openPanel(e) {
    // Solo abrimos el panel si hay artículos en el carrito; si no, dejamos
    // que el botón lleve directo a WhatsApp con el saludo simple.
    if (cartCount() === 0) return;
    e.preventDefault();
    panel.classList.add('is-open');
    backdrop.classList.add('is-visible');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    panel.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openTriggers.forEach((t) => t && t.addEventListener('click', openPanel));
  closeBtn && closeBtn.addEventListener('click', closePanel);
  backdrop && backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  panel && panel.addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    const wrap = btn.closest('.qty-control');
    const id = wrap.dataset.id;
    const current = cart[id] || 0;
    if (btn.dataset.action === 'inc') {
      cart[id] = Math.min(current + 1, 99);
    } else {
      cart[id] = Math.max(current - 1, 0);
      if (cart[id] === 0) delete cart[id];
    }
    saveCart(cart);
    syncQtyDisplays();
    renderOrderPanel();
    updateCartBadge();
  });

  clearBtn && clearBtn.addEventListener('click', () => {
    cart = {};
    saveCart(cart);
    syncQtyDisplays();
    renderOrderPanel();
    updateCartBadge();
  });

  flavorSelect && flavorSelect.addEventListener('change', updateOrderLinks);
}

/* ==========================================================================
   Navegación móvil
   ========================================================================== */
function initNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  const backdrop = document.getElementById('navBackdrop');
  const closeBtn = document.getElementById('navClose');
  const links = nav ? nav.querySelectorAll('.nav-link') : [];

  function openNav() {
    nav.classList.add('is-open');
    backdrop.classList.add('is-visible');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    nav.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle && toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });
  closeBtn && closeBtn.addEventListener('click', closeNav);
  backdrop && backdrop.addEventListener('click', closeNav);
  links.forEach((l) => l.addEventListener('click', closeNav));

  // Header con fondo sólido al hacer scroll
  const header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Resaltar enlace activo según sección visible
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((l) => {
          l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach((s) => spy.observe(s));
}

/* ==========================================================================
   Animaciones de aparición al hacer scroll
   ========================================================================== */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
    observer.observe(el);
  });
}

/* ==========================================================================
   Año dinámico en el footer
   ========================================================================== */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ==========================================================================
   Init
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  renderOrderPanel();
  updateCartBadge();
  setSimpleWhatsappLinks();
  initOrderPanel();
  initNav();
  initReveal();
  initYear();
});
