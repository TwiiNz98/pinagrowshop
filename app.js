/* ============================================================
   app.js — Piña GrowShop  |  Firebase Firestore Edition
   Todos los datos viven en:
     Firestore → colección "tienda" → documento "catalogo"
   ============================================================ */

// ──────────────────────────────────────────────────────────────
// 1.  CONSTANTES Y ESTADO GLOBAL
// ──────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "Pineapple2026";   // ← cambia aquí si quieres otra clave

const CATEGORIAS = {
    "Smoke":      ["Pipas", "Bongs", "Papelillos", "Enroladores", "Limpieza"],
    "Cultivo":    ["Sustratos", "Fertilizantes", "Carpas", "Iluminación", "Control de Plagas"],
    "Tabaquería": ["Cigarrillos", "Tabaco", "Pipas de tabaco", "Accesorios"],
    "Aromas":     ["Inciensos", "Aceites esenciales", "Difusores", "Velas"]
};

// Productos iniciales que se cargan si Firestore está vacío
const PRODUCTOS_INICIALES = [
    { id: 1700000001, nombre: "Bong de Vidrio 30cm",   precio: 15990, cat: "Smoke",      subcat: "Bongs",         img: "https://via.placeholder.com/300x300?text=Bong",         desc: "Bong de vidrio borosilicato resistente al calor." },
    { id: 1700000002, nombre: "Papelillos RAW King",   precio: 1990,  cat: "Smoke",      subcat: "Papelillos",    img: "https://via.placeholder.com/300x300?text=RAW",          desc: "Pack de papelillos RAW King Size." },
    { id: 1700000003, nombre: "Sustrato BioTabs 50L",  precio: 12990, cat: "Cultivo",    subcat: "Sustratos",     img: "https://via.placeholder.com/300x300?text=Sustrato",     desc: "Sustrato premium con micorrizas activas." },
    { id: 1700000004, nombre: "Incienso Nag Champa",   precio: 2490,  cat: "Aromas",     subcat: "Inciensos",     img: "https://via.placeholder.com/300x300?text=Incienso",     desc: "Pack x20 varillas de incienso Nag Champa." },
    { id: 1700000005, nombre: "Grinder Metálico 4P",   precio: 8990,  cat: "Smoke",      subcat: "Pipas",         img: "https://via.placeholder.com/300x300?text=Grinder",      desc: "Grinder de aluminio de 4 piezas con recolector." },
    { id: 1700000006, nombre: "Fertilizante BioGrow",  precio: 9990,  cat: "Cultivo",    subcat: "Fertilizantes", img: "https://via.placeholder.com/300x300?text=Fertilizante", desc: "Biobizz BioGrow 500ml, crecimiento orgánico." }
];

let catalogoGlobal  = [];   // copia local del catálogo (se actualiza con onSnapshot)
let cart            = [];   // carrito en memoria
let modalProducto   = null; // producto abierto en el modal
let modalQty        = 1;
let editingId       = null; // si está editando un producto existente
let adminFilesB64   = [];   // imágenes cargadas localmente como base64

// ──────────────────────────────────────────────────────────────
// 2.  INICIALIZACIÓN — espera a que Firebase esté disponible
// ──────────────────────────────────────────────────────────────
function initApp() {
    if (!window.db_cloud || !window.fb_methods) {
        // Firebase aún no cargó; reintentamos en 200 ms
        setTimeout(initApp, 200);
        return;
    }

    const { doc, onSnapshot } = window.fb_methods;
    const catalogoRef = doc(window.db_cloud, "tienda", "catalogo");

    // ── onSnapshot: escucha cambios en tiempo real ──
    onSnapshot(catalogoRef,
        (docSnap) => {
            setFirebaseStatus("✅ Estado : Actualizado.", "green");

            if (docSnap.exists()) {
                const data = docSnap.data();
                catalogoGlobal = Array.isArray(data.productos) ? data.productos : [];
            } else {
                // Documento no existe → sembrar datos iniciales
                console.log("Firestore vacío. Cargando productos iniciales…");
                guardarCatalogo(PRODUCTOS_INICIALES);
                catalogoGlobal = PRODUCTOS_INICIALES;
            }

            renderProducts();
            renderAdminList();
        },
        (error) => {
            console.error("Error Firestore:", error);
            setFirebaseStatus("❌ No fue posible conectarse a Firestone.", "red");
            // Fallback: mostrar igual si hay algo en catalogoGlobal
            renderProducts();
        }
    );
}

// ──────────────────────────────────────────────────────────────
// 3.  PERSISTENCIA EN FIRESTORE
// ──────────────────────────────────────────────────────────────
async function guardarCatalogo(productos) {
    try {
        const { doc, setDoc } = window.fb_methods;
        await setDoc(
            doc(window.db_cloud, "tienda", "catalogo"),
            { productos }
        );
    } catch (err) {
        console.error("Error al guardar en Firestore:", err);
        showToast("⚠️ No se pudo guardar en la nube");
    }
}

// ──────────────────────────────────────────────────────────────
// 4.  RENDER DE PRODUCTOS
// ──────────────────────────────────────────────────────────────
function renderProducts(lista) {
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    const productos = lista !== undefined ? lista : catalogoGlobal;

    if (!productos.length) {
        grid.innerHTML = `<p class="text-muted text-center" style="grid-column:1/-1;padding:40px 0;">
            No hay productos disponibles aún. 🍍
        </p>`;
        return;
    }

    grid.innerHTML = productos.map(p => {
        const imgSrc = Array.isArray(p.imgs) && p.imgs.length ? p.imgs[0]
                     : (p.img || "https://via.placeholder.com/300x300?text=Producto");
        return `
        <div class="product-card glass-light" onclick="openModal(${p.id})">
            <img src="${imgSrc}" class="product-img" alt="${p.nombre}"
                 onerror="this.src='https://via.placeholder.com/300x300?text=Sin+imagen'">
            <span class="cat-badge" style="margin:8px 0 4px;">${p.cat || ""}</span>
            <h3 class="text-dark font-bold" style="margin:4px 0;">${p.nombre}</h3>
            <p class="text-lime-dark fredoka-title" style="font-size:1.2rem;">
                $${Number(p.precio).toLocaleString("es-CL")}
            </p>
            <button class="btn-green-glow" style="width:100%;margin-top:10px;"
                    onclick="event.stopPropagation(); addToCart(${p.id})">
                🛒 Agregar
            </button>
        </div>`;
    }).join("");
}

// ──────────────────────────────────────────────────────────────
// 5.  FILTROS Y BÚSQUEDA
// ──────────────────────────────────────────────────────────────
function applyFilters() {
    let lista = [...catalogoGlobal];

    const cat    = document.getElementById("filter-cat")?.value    || "Todos";
    const subcat = document.getElementById("filter-subcat")?.value || "Todos";
    const precio = document.getElementById("sort-price")?.value    || "none";
    const alpha  = document.getElementById("sort-alpha")?.value    || "none";

    if (cat    !== "Todos") lista = lista.filter(p => p.cat    === cat);
    if (subcat !== "Todos") lista = lista.filter(p => p.subcat === subcat);

    if (precio === "asc")  lista.sort((a,b) => a.precio - b.precio);
    if (precio === "desc") lista.sort((a,b) => b.precio - a.precio);
    if (alpha  === "az")   lista.sort((a,b) => a.nombre.localeCompare(b.nombre));
    if (alpha  === "za")   lista.sort((a,b) => b.nombre.localeCompare(a.nombre));

    renderProducts(lista);
}

function updateSubcats() {
    const cat   = document.getElementById("filter-cat")?.value;
    const sel   = document.getElementById("filter-subcat");
    if (!sel) return;
    const subs  = CATEGORIAS[cat] || [];
    sel.innerHTML = `<option value="Todos">Todos</option>` +
        subs.map(s => `<option value="${s}">${s}</option>`).join("");
}

function liveSearch() {
    const q = document.getElementById("global-search")?.value.toLowerCase().trim() || "";
    if (!q) { renderProducts(); return; }
    const lista = catalogoGlobal.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        (p.desc || "").toLowerCase().includes(q) ||
        (p.cat  || "").toLowerCase().includes(q)
    );
    renderProducts(lista);
    showSection("productos");
}

// ──────────────────────────────────────────────────────────────
// 6.  MODAL DE PRODUCTO
// ──────────────────────────────────────────────────────────────
function openModal(id) {
    const p = catalogoGlobal.find(x => x.id === id);
    if (!p) return;
    modalProducto = p;
    modalQty = 1;

    const imgs = Array.isArray(p.imgs) && p.imgs.length
               ? p.imgs
               : [p.img || "https://via.placeholder.com/300x300?text=Sin+imagen"];

    document.getElementById("modal-img").src   = imgs[0];
    document.getElementById("modal-name").textContent  = p.nombre;
    document.getElementById("modal-desc").textContent  = p.desc || "Sin descripción.";
    document.getElementById("modal-price").textContent = `$${Number(p.precio).toLocaleString("es-CL")}`;
    document.getElementById("modal-cat").textContent   = `${p.cat} › ${p.subcat || ""}`;
    document.getElementById("modal-qty").textContent   = modalQty;

    // Miniaturas
    const thumbsEl = document.getElementById("modal-thumbs");
    thumbsEl.innerHTML = imgs.map((src, i) =>
        `<img src="${src}" class="thumb${i===0?' active':''}"
              onclick="document.getElementById('modal-img').src='${src}'">`
    ).join("");

    document.getElementById("btn-modal-add").onclick = () => {
        addToCartWithQty(p.id, modalQty);
        closeModal();
    };

    document.getElementById("product-modal").classList.add("active");
}

function closeModal() {
    document.getElementById("product-modal").classList.remove("active");
    modalProducto = null;
}

function changeQty(delta) {
    modalQty = Math.max(1, modalQty + delta);
    document.getElementById("modal-qty").textContent = modalQty;
}

// ──────────────────────────────────────────────────────────────
// 7.  CARRITO
// ──────────────────────────────────────────────────────────────
function addToCart(id) {
    addToCartWithQty(id, 1);
}

function addToCartWithQty(id, qty) {
    const p = catalogoGlobal.find(x => x.id === id);
    if (!p) return;
    const item = cart.find(x => x.id === id);
    if (item) item.qty += qty;
    else      cart.push({ ...p, qty });
    updateCart();
    showToast(`✅ ${p.nombre} añadido`);
}

function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    updateCart();
}

function updateCart() {
    const cont  = document.getElementById("cart-items");
    const total = cart.reduce((s, i) => s + i.precio * i.qty, 0);

    cont.innerHTML = cart.length
        ? cart.map(i => `
            <div class="cart-item">
                <div>
                    <p class="text-dark font-bold">${i.nombre}</p>
                    <p class="text-muted" style="font-size:.85rem;">
                        $${Number(i.precio).toLocaleString("es-CL")} × ${i.qty}
                    </p>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <strong class="text-lime-dark">$${(i.precio * i.qty).toLocaleString("es-CL")}</strong>
                    <button onclick="removeFromCart(${i.id})"
                            style="background:none;border:none;cursor:pointer;font-size:1rem;">🗑️</button>
                </div>
            </div>`).join("")
        : `<p class="text-muted text-center" style="padding:30px 0;">Tu carrito está vacío 🛒</p>`;

    document.getElementById("cart-count").textContent = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById("cart-total").textContent = `$${total.toLocaleString("es-CL")}`;
}

function checkout() {
    if (!cart.length) { showToast("Tu carrito está vacío"); return; }
    const lineas = cart.map(i =>
        `• ${i.nombre} x${i.qty} = $${(i.precio * i.qty).toLocaleString("es-CL")}`
    ).join("%0A");
    const total = cart.reduce((s, i) => s + i.precio * i.qty, 0);
    const msg   = `¡Hola Piña GrowShop!%0AQuiero hacer este pedido:%0A${lineas}%0A%0ATOTAL: $${total.toLocaleString("es-CL")}`;
    window.open(`https://wa.me/56945802810?text=${msg}`, "_blank");
}

// ──────────────────────────────────────────────────────────────
// 8.  PANEL DE ADMINISTRACIÓN
// ──────────────────────────────────────────────────────────────
function checkAdminPassword() {
    const clave = prompt("🔐 Ingresa la clave de administrador:");
    if (clave === ADMIN_PASSWORD) toggleAdmin();
    else if (clave !== null)      showToast("❌ Clave incorrecta");
}

function toggleAdmin() {
    const panel = document.getElementById("admin-panel");
    panel.classList.toggle("active");
    if (panel.classList.contains("active")) resetAdminForm();
}

// ── Agregar / Editar producto ──────────────────────────────────
async function addProduct() {
    const nombre = document.getElementById("p-nombre").value.trim();
    const precio = parseInt(document.getElementById("p-precio").value, 10);
    const cat    = document.getElementById("p-cat").value;
    const subcat = document.getElementById("p-subcat").value.trim();
    const desc   = document.getElementById("p-desc").value.trim();
    const imgsRaw= document.getElementById("p-imgs").value.trim();

    if (!nombre || isNaN(precio) || precio <= 0) {
        showToast("⚠️ Completa Nombre y Precio correctamente");
        return;
    }

    // Construir array de imágenes: base64 cargados + URLs escritas
    let imgs = [...adminFilesB64];
    if (imgsRaw) {
        const urls = imgsRaw.split(",").map(u => u.trim()).filter(Boolean);
        imgs = [...imgs, ...urls];
    }
    if (!imgs.length) imgs = ["https://via.placeholder.com/300x300?text=" + encodeURIComponent(nombre)];
    imgs = imgs.slice(0, 8); // máximo 8

    const btn = document.getElementById("admin-save-btn");
    btn.disabled = true;
    btn.textContent = "Guardando…";

    let lista;
    if (editingId !== null) {
        // Modo edición
        lista = catalogoGlobal.map(p =>
            p.id === editingId
                ? { ...p, nombre, precio, cat, subcat, desc, imgs, img: imgs[0] }
                : p
        );
        showToast("✏️ Producto actualizado");
        editingId = null;
    } else {
        // Modo creación
        const newProd = {
            id:     Date.now(),
            nombre, precio, cat, subcat, desc,
            imgs,
            img:    imgs[0]
        };
        lista = [...catalogoGlobal, newProd];
        showToast("✅ Producto añadido");
    }

    await guardarCatalogo(lista);

    btn.disabled = false;
    btn.textContent = "AÑADIR PRODUCTO";
    resetAdminForm();
}

function editProduct(id) {
    const p = catalogoGlobal.find(x => x.id === id);
    if (!p) return;
    editingId = id;

    document.getElementById("p-nombre").value = p.nombre;
    document.getElementById("p-precio").value = p.precio;
    document.getElementById("p-cat").value    = p.cat;
    document.getElementById("p-subcat").value = p.subcat || "";
    document.getElementById("p-desc").value   = p.desc   || "";
    document.getElementById("p-imgs").value   = (Array.isArray(p.imgs) ? p.imgs : [p.img || ""]).join(", ");
    adminFilesB64 = [];

    document.getElementById("admin-save-btn").textContent = "💾 GUARDAR CAMBIOS";
    document.getElementById("admin-panel").scrollTop = 0;
    showToast("📝 Editando: " + p.nombre);
}

async function deleteProduct(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    const lista = catalogoGlobal.filter(p => p.id !== id);
    await guardarCatalogo(lista);
    showToast("🗑️ Producto eliminado");
}

function resetAdminForm() {
    ["p-nombre","p-precio","p-subcat","p-desc","p-imgs"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    const catEl = document.getElementById("p-cat");
    if (catEl) catEl.selectedIndex = 0;
    adminFilesB64 = [];
    editingId = null;
    const btn = document.getElementById("admin-save-btn");
    if (btn) btn.textContent = "AÑADIR PRODUCTO";
}

// ── Render lista de admin ──────────────────────────────────────
function renderAdminList() {
    const lista = document.getElementById("admin-list");
    if (!lista) return;

    if (!catalogoGlobal.length) {
        lista.innerHTML = `<p class="text-muted text-center" style="padding:20px 0;">Sin productos aún.</p>`;
        return;
    }

    lista.innerHTML = `
        <h3 class="fredoka-title text-dark" style="margin:20px 0 10px;">
            Productos en la Web (${catalogoGlobal.length})
        </h3>
        <div style="display:flex;flex-direction:column;gap:10px;">
            ${catalogoGlobal.map(p => {
                const imgSrc = Array.isArray(p.imgs) && p.imgs.length ? p.imgs[0] : (p.img || "");
                return `
                <div class="admin-item glass-translucent" style="display:flex;align-items:center;gap:12px;padding:10px;border-radius:12px;">
                    <img src="${imgSrc}" width="48" height="48"
                         style="border-radius:8px;object-fit:cover;"
                         onerror="this.style.display='none'">
                    <div style="flex:1;min-width:0;">
                        <p class="text-dark font-bold" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.nombre}</p>
                        <p class="text-muted" style="font-size:.8rem;">${p.cat} › ${p.subcat||""} — $${Number(p.precio).toLocaleString("es-CL")}</p>
                    </div>
                    <div style="display:flex;gap:6px;">
                        <button onclick="editProduct(${p.id})"
                                style="background:var(--lime-fluor);border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-weight:800;">
                            ✏️
                        </button>
                        <button onclick="deleteProduct(${p.id})"
                                style="background:#ff5252;color:white;border:none;padding:6px 10px;border-radius:8px;cursor:pointer;font-weight:800;">
                            🗑️
                        </button>
                    </div>
                </div>`;
            }).join("")}
        </div>`;
}

// ── Manejo de archivos locales (File API → base64) ─────────────
function handleAdminFilesChange(event) {
    const files = Array.from(event.target.files).slice(0, 8);
    adminFilesB64 = [];
    let loaded = 0;

    if (!files.length) return;

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            adminFilesB64.push(e.target.result);
            loaded++;
            if (loaded === files.length) showToast(`📷 ${loaded} imagen(es) lista(s)`);
        };
        reader.readAsDataURL(file);
    });
}

// ──────────────────────────────────────────────────────────────
// 9.  NAVEGACIÓN Y UI
// ──────────────────────────────────────────────────────────────
function showSection(id) {
    // Ocultar todas las secciones visibles
    document.querySelectorAll(".page-section").forEach(s => {
        s.style.display = "none";
        s.classList.remove("active");
    });
    // Mostrar la pedida
    const target = document.getElementById(id);
    if (target) {
        target.style.display = "block";
        target.classList.add("active");
    }
    // Ocultar el menú móvil si está abierto
    document.getElementById("main-nav-links")?.classList.remove("open");
}

function toggleCart() {
    document.getElementById("cart-sidebar").classList.toggle("active");
}

function toggleMobileMenu() {
    document.getElementById("main-nav-links")?.classList.toggle("open");
}

function showToast(msg) {
    const t = document.createElement("div");
    t.className  = "toast-msg";
    t.textContent = msg;
    document.getElementById("toast-container").appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

function setFirebaseStatus(msg, color) {
    const el = document.getElementById("firebase-status");
    if (!el) return;
    el.textContent = msg;
    el.style.color = color === "green" ? "var(--green)" : "#ff5252";
}

// ──────────────────────────────────────────────────────────────
// 10.  GATE +18
// ──────────────────────────────────────────────────────────────
function closeGate() {
    document.getElementById("gate").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("gate-yes")?.addEventListener("click", closeGate);
    document.getElementById("gate-no")?.addEventListener("click",  () => {
        window.location.href = "https://www.google.com";
    });

    // Mostrar sección inicio por defecto
    showSection("inicio");
});

// ──────────────────────────────────────────────────────────────
// 11.  ARRANQUE — esperar Firebase
// ──────────────────────────────────────────────────────────────
if (window.db_cloud) {
    initApp();
} else {
    window.addEventListener("firebase-ready", initApp, { once: true });
    // Doble seguridad: si el evento ya disparó antes de que este script cargara
    setTimeout(() => { if (window.db_cloud && !catalogoGlobal.length) initApp(); }, 1000);
}
