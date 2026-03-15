// 2, 4 & 6. Base de datos con subcategorías y productos exigidos y sus imágenes
let db = JSON.parse(localStorage.getItem('pinaGrowLightDB')) || {
    productos: [
        { id: 1, nombre: "Bong", precio: 19000, img: "https://images.pexels.com/photos/8140273/pexels-photo-8140273.jpeg?_gl=1*1x5wsn2*_ga*MTYyNzY3Njk4OC4xNzczNTQ0MTk5*_ga_8JE65Q40S6*czE3NzM1NDQxOTgkbzEkZzEkdDE3NzM1NDU3MDMkajU0JGwwJGgw", cat: "Smoke", subcat: "Pipas", desc: "Equipa tu sesión con la mejor calidad. Este Bong ha sido seleccionado por expertos cultivadores para garantizar durabilidad, eficiencia y un diseño impecable. Perfecto para quienes buscan llevar su experiencia al siguiente nivel con total estilo." },
        { id: 2, nombre: "Papel", precio: 20000, img: "https://drive.google.com/file/d/103O5NtDV3GdSZ0V0HDU-8T38MuWUAfN-/view?usp=sharing", cat: "Smoke", subcat: "Papelillos", desc: "Combustión lenta y natural sin aditivos químicos. Diseñados para disfrutar el sabor real de tu hierba con total suavidad." },
        { id: 3, nombre: "Filtros", precio: 12390, img: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?q=80&w=400", cat: "Smoke", subcat: "Filtros", desc: "Filtros de alta retención para una experiencia suave. Protegen tus pulmones sin alterar el flujo ni el sabor." },
        { id: 4, nombre: "Luces", precio: 15550, img: "https://images.unsplash.com/photo-1563461660947-507ef49e9c47?q=80&w=400", cat: "Cultivo", subcat: "Luces LED", desc: "Iluminación Full Spectrum de alta eficiencia energética para potenciar la fotosíntesis y maximizar tus cosechas indoor." },
        { id: 5, nombre: "Pipa", precio: 20000, img: "https://images.unsplash.com/photo-1603588265004-94025b6422ce?q=80&w=400", cat: "Smoke", subcat: "Pipas", desc: "Diseño ergonómico y portátil para cualquier ocasión. Cristal borosilicato resistente al calor para un humo limpio." },
        { id: 6, nombre: "Moledor", precio: 30000, img: "https://images.unsplash.com/photo-1589218482020-ad1642a4208c?q=80&w=400", cat: "Smoke", subcat: "Pipas", desc: "Triturado perfecto y uniforme gracias a sus dientes de diamante afilados. Aluminio aeroespacial para durabilidad extrema." },
        { id: 7, nombre: "Vaper", precio: 100200, img: "https://images.unsplash.com/photo-1536881734914-725d25950d44?q=80&w=400", cat: "Tabaquería", subcat: "Encendedores", desc: "Control de temperatura preciso para grandes nubes de vapor. Tecnología de convección que calienta la hierba sin quemarla." }
    ],
    carrito: []
};

/* ---- +18 Gate ---- */
const gate = document.getElementById('gate');
const body = document.body;

// Revisar sesión guardada
if (sessionStorage.getItem('pg_age_ok') === '1') {
    gate.classList.add('gate-hidden');
} else {
    body.style.overflow = 'hidden';
}

document.getElementById('gate-yes').addEventListener('click', () => {
    gate.classList.add('gate-hidden');
    body.style.overflow = '';
    sessionStorage.setItem('pg_age_ok', '1');
    // Al ingresar, aseguramos que la vista sea idéntica al 'Inicio' del menú
    if (typeof showSection === 'function') showSection('inicio');
    window.location.hash = '#inicio';
});

document.getElementById('gate-no').addEventListener('click', () => {
    window.location.href = 'https://www.google.com';
});

// --- SUBCATEGORÍAS DINÁMICAS ---

// --- SUBCATEGORÍAS DINÁMICAS ---
const subcategorias = {
    "Todos": ["Todos"],
    "Smoke": ["Todos", "Pipas", "Papelillos", "Filtros"],
    "Cultivo": ["Todos", "Macetas", "Fertilizantes", "Luces LED"],
    "Tabaquería": ["Todos", "Tabacos", "Cigarreras", "Encendedores"],
    "Aromas": ["Todos", "Inciensos", "Aromatizantes", "Difusores"]
};

function updateSubcats() {
    const cat = document.getElementById('filter-cat').value;
    const subcatSelect = document.getElementById('filter-subcat');
    subcatSelect.innerHTML = subcategorias[cat].map(s => `<option value="${s}">${s}</option>`).join('');
}

// Inicializar subcategorías
updateSubcats();

// --- SISTEMA AVANZADO DE FILTROS Y ORDEN ---
function applyFilters() {
    let res = [...db.productos];
    const cat = document.getElementById('filter-cat').value;
    const subcat = document.getElementById('filter-subcat').value;
    const sortP = document.getElementById('sort-price').value;
    const sortA = document.getElementById('sort-alpha').value;

    if(cat !== 'Todos') res = res.filter(p => p.cat === cat);
    if(subcat !== 'Todos') res = res.filter(p => p.subcat === subcat);

    if(sortP === 'asc') res.sort((a,b) => a.precio - b.precio);
    if(sortP === 'desc') res.sort((a,b) => b.precio - a.precio);

    if(sortA === 'az') res.sort((a,b) => a.nombre.localeCompare(b.nombre));
    if(sortA === 'za') res.sort((a,b) => b.nombre.localeCompare(a.nombre));

    renderProducts(res);
}

function liveSearch() {
    const term = document.getElementById('global-search').value.toLowerCase();
    const filtered = db.productos.filter(p => p.nombre.toLowerCase().includes(term));
    renderProducts(filtered);
    if (term !== "") showSection('productos');
}

// --- RENDERIZADO DE TIENDA ---
function renderProducts(data = db.productos) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = data.map(p => `
        <div class="product-card">
            <img src="${getProductImages(p)[0]}" alt="${p.nombre}" class="img">
            <div class="product-info">
                <div>
                    <p class="prod-subcat">${p.subcat}</p>
                    <h3 class="prod-name fredoka-title text-dark">${p.nombre}</h3>
                    <p class="text-muted" style="font-size:0.85rem; margin-bottom:15px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${p.desc || ''}</p>
                </div>
                <div>
                    <div class="prod-price">$${p.precio.toLocaleString('es-CL')}</div>
                    <button class="btn-outline full-width" onclick="openModal(${p.id})">Ver Producto</button>
                    <button class="btn-green-glow full-width" onclick="addToCart(${p.id}, 1)">Añadir</button>
                </div>
            </div>
        </div>
    `).join('');
    updateAdminList();
    localStorage.setItem('pinaGrowLightDB', JSON.stringify(db));
}

// --- MODAL DE PRODUCTO (3) ---
let currentModalItem = null;
let modalQty = 1;

function openModal(id) {
    currentModalItem = db.productos.find(p => p.id === id);
    modalQty = 1;

    const modalImg = document.getElementById('modal-img');
    const thumbs = document.getElementById('modal-thumbs');

    function renderThumbs(images) {
        thumbs.innerHTML = images.map((src, idx) => `
            <img src="${src}" class="${idx === 0 ? 'active' : ''}" draggable="true" data-index="${idx}" />
        `).join('');

        thumbs.querySelectorAll('img').forEach((imgEl, idx) => {
            imgEl.addEventListener('click', () => {
                modalImg.src = imgEl.src;
                thumbs.querySelectorAll('img').forEach(i => i.classList.remove('active'));
                imgEl.classList.add('active');
            });

            imgEl.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', String(idx));
                e.dataTransfer.effectAllowed = 'move';
            });

            imgEl.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            imgEl.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                const toIndex = idx;
                if (isNaN(fromIndex) || fromIndex === toIndex) return;

                const imagesArr = getProductImages(currentModalItem);
                const [moved] = imagesArr.splice(fromIndex, 1);
                imagesArr.splice(toIndex, 0, moved);

                currentModalItem.imagenes = imagesArr;
                currentModalItem.img = imagesArr[0];

                renderThumbs(imagesArr);
                modalImg.src = currentModalItem.img;
            });
        });
    }

    const images = getProductImages(currentModalItem);
    modalImg.src = images[0];
    modalImg.alt = currentModalItem.nombre;
    renderThumbs(images);

    document.getElementById('modal-cat').innerText = currentModalItem.cat + " / " + currentModalItem.subcat;
    document.getElementById('modal-name').innerText = currentModalItem.nombre;
    document.getElementById('modal-desc').innerText = currentModalItem.desc || '';
    document.getElementById('modal-price').innerText = `$${currentModalItem.precio.toLocaleString('es-CL')}`;
    document.getElementById('modal-qty').innerText = modalQty;
    
    document.getElementById('btn-modal-add').onclick = () => {
        addToCart(currentModalItem.id, modalQty);
        closeModal();
    };

    document.getElementById('product-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function changeQty(val) {
    modalQty += val;
    if (modalQty < 1) modalQty = 1;
    document.getElementById('modal-qty').innerText = modalQty;
}

// --- CARRITO ---
function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('open'); }

function addToCart(id, qty = 1) {
    const prod = db.productos.find(p => p.id === id);
    for(let i=0; i<qty; i++) { db.carrito.push(prod); }
    updateCartUI();
    showToast(`🍍 ${qty}x ${prod.nombre} añadido`);
}

function updateCartUI() {
    const cont = document.getElementById('cart-items');
    let subtotal = 0;
    cont.innerHTML = db.carrito.map((item, index) => {
        subtotal += item.precio;
        return `
        <div class="cart-item">
            <div>
                <strong class="text-dark" style="display:block; font-size:0.95rem;">${item.nombre}</strong>
                <span class="text-lime-dark font-bold">$${item.precio.toLocaleString('es-CL')}</span>
            </div>
            <button onclick="removeFromCart(${index})" class="btn-close-naked" style="font-size:1.2rem;">✕</button>
        </div>`;
    }).join('');

    document.getElementById('cart-count').innerText = db.carrito.length;
    document.getElementById('cart-total').innerText = `$${subtotal.toLocaleString('es-CL')}`;
}

function removeFromCart(index) {
    db.carrito.splice(index, 1);
    updateCartUI();
}

function checkout() {
    if (db.carrito.length === 0) return alert("Tu carro está vacío.");
    let msg = `¡Hola Piña GrowShop! 🍍 Quiero pedir lo siguiente:\n\n`;
    db.carrito.forEach(p => msg += `- ${p.nombre}\n`);
    msg += `\nTotal a pagar: ${document.getElementById('cart-total').innerText}\n\n¿Tienen stock disponible?`;
    window.open(`https://wa.me/56945802810?text=${encodeURIComponent(msg)}`, '_blank');
}

// --- UTILIDADES ---
function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');

    // Inicio usa dos secciones (hero + reseñas) para que coincida con la vista inicial después del gate.
    if (id === 'inicio') {
        document.getElementById('inicio').style.display = 'block';
        const reviews = document.getElementById('inicio-reviews');
        if (reviews) reviews.style.display = 'block';
    } else {
        document.getElementById(id).style.display = 'block';
    }

    // Cerrar menú móvil al navegar
    const nav = document.getElementById('main-nav-links');
    if (nav) nav.classList.remove('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    document.getElementById('main-nav-links').classList.toggle('active');
}

function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- ADMIN ---
let editingProductId = null;
let adminFilesData = [];

function readFilesAsDataURLs(files) {
    const reads = Array.from(files)
        .slice(0, 8)
        .map(file => new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
        }));
    return Promise.all(reads).then(results => results.filter(Boolean));
}

function handleAdminFilesChange(event) {
    const files = event.target.files;
    if (!files || files.length === 0) {
        adminFilesData = [];
        return;
    }
    if (files.length > 8) {
        showToast('⚠️ Solo se procesarán las primeras 8 imágenes.');
    }
    readFilesAsDataURLs(files).then(dataUrls => {
        adminFilesData = dataUrls.slice(0, 8);
        showToast(`✅ ${adminFilesData.length} imagen(es) lista(s)`);
    });
}

function checkAdminPassword() {
    if (prompt("Clave:") === "Pineapple420") {
        resetAdminForm();
        const panel = document.getElementById('admin-panel');
        panel.style.display = 'flex';
        panel.classList.add('open');
    }
}
function toggleAdmin() {
    const panel = document.getElementById('admin-panel');
    panel.classList.remove('open');
    panel.style.display = 'none';
}

function getProductImages(p) {
    if (Array.isArray(p.imagenes) && p.imagenes.length) return p.imagenes.slice(0, 8);
    if (typeof p.img === 'string' && p.img.trim()) return [p.img];
    return ["https://images.unsplash.com/photo-1556928045-16f7f50be0f3?q=80&w=400"];
}

function resetAdminForm() {
    editingProductId = null;
    adminFilesData = [];
    document.getElementById('p-nombre').value = '';
    document.getElementById('p-precio').value = '';
    document.getElementById('p-cat').value = 'Smoke';
    document.getElementById('p-subcat').value = '';
    document.getElementById('p-desc').value = '';
    document.getElementById('p-imgs').value = '';
    document.getElementById('p-files').value = '';
    document.getElementById('admin-save-btn').innerText = 'AÑADIR PRODUCTO';
}

function loadProductToForm(id) {
    const prod = db.productos.find(p => p.id === id);
    if (!prod) return;

    editingProductId = id;
    adminFilesData = [];
    document.getElementById('p-nombre').value = prod.nombre || '';
    document.getElementById('p-precio').value = prod.precio || '';
    document.getElementById('p-cat').value = prod.cat || 'Smoke';
    document.getElementById('p-subcat').value = prod.subcat || '';
    document.getElementById('p-desc').value = prod.desc || '';
    document.getElementById('p-imgs').value = getProductImages(prod).join(', ');
    document.getElementById('p-files').value = '';
    document.getElementById('admin-save-btn').innerText = 'GUARDAR CAMBIOS';
}

function addProduct() {
    const nom = document.getElementById('p-nombre').value.trim();
    const pre = document.getElementById('p-precio').value;
    const cat = document.getElementById('p-cat').value;
    const subcat = document.getElementById('p-subcat').value.trim() || 'General';
    const desc = document.getElementById('p-desc').value.trim() || 'Nuevo producto añadido a Piña GrowShop.';
    const urlImgs = document.getElementById('p-imgs').value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    const totalImages = urlImgs.length + adminFilesData.length;
    if (totalImages > 8) {
        showToast('⚠️ Máximo 8 imágenes por producto. Se guardarán las primeras 8.');
    }

    const imgs = [...urlImgs, ...adminFilesData].slice(0, 8);

    if (!nom || !pre) {
        showToast('⚠️ Completa nombre y precio.');
        return;
    }

    const mainImg = imgs[0] || "https://images.unsplash.com/photo-1556928045-16f7f50be0f3?q=80&w=400";

    if (editingProductId) {
        const prod = db.productos.find(p => p.id === editingProductId);
        if (!prod) return;

        prod.nombre = nom;
        prod.precio = parseInt(pre);
        prod.cat = cat;
        prod.subcat = subcat;
        prod.desc = desc;
        prod.imagenes = imgs.length ? imgs : [mainImg];
        prod.img = mainImg;

        showToast('✅ Producto actualizado');
    } else {
        db.productos.push({
            id: Date.now(),
            nombre: nom,
            precio: parseInt(pre),
            cat: cat,
            subcat: subcat,
            desc: desc,
            imagenes: imgs.length ? imgs : [mainImg],
            img: mainImg
        });
        showToast('✅ Producto agregado');
    }

    resetAdminForm();
    applyFilters();
}

function updateAdminList() {
    document.getElementById('admin-list').innerHTML = db.productos.map(p => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee; margin-top:5px;">
            <span class="text-dark" style="flex:1;">${p.nombre}</span>
            <div style="display:flex; gap: 8px;">
                <button onclick="loadProductToForm(${p.id})" style="color:#1a73e8; background:none; border:none; cursor:pointer; font-weight:800;">Editar</button>
                <button onclick="deleteProduct(${p.id})" style="color:#ff3333; background:none; border:none; cursor:pointer; font-weight:800;">Borrar</button>
            </div>
        </div>
    `).join('');
}

function deleteProduct(id) {
    db.productos = db.productos.filter(p => p.id !== id);
    applyFilters();
}

// Inicializar
renderProducts();
updateCartUI();

// --- RESEÑAS: AUTO-LOOP POR HOVER LATERAL ---
function initReviewHoverScroll() {
    const container = document.querySelector('.reviews-slider-container');
    const track = document.getElementById('reviews-track');
    if (!container || !track) return;

    // Duplicar contenido para bucle infinito.
    const originalCards = Array.from(track.children);
    const cloneA = track.cloneNode(true);
    const cloneB = track.cloneNode(true);

    track.append(...cloneA.children);
    track.append(...cloneB.children);

    const baseWidth = track.scrollWidth / 3; // ancho de un bloque (original)

    let velocity = 0;
    let rafId = null;

    function normalizeScroll() {
        if (container.scrollLeft >= baseWidth * 2) {
            container.scrollLeft -= baseWidth;
        } else if (container.scrollLeft <= 0) {
            container.scrollLeft += baseWidth;
        }
    }

    function frame() {
        if (velocity !== 0) {
            container.scrollLeft += velocity;
            normalizeScroll();
        }
        rafId = requestAnimationFrame(frame);
    }

    function onMove(e) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const edge = rect.width * 0.25;

        if (x < edge) {
            velocity = -4; // hacia la izquierda
        } else if (x > rect.width - edge) {
            velocity = 4; // hacia la derecha
        } else {
            velocity = 0;
        }
    }

    function stopMotion() {
        velocity = 0;
    }

    container.addEventListener('mouseenter', () => {
        if (!rafId) frame();
    });
    container.addEventListener('mouseleave', () => stopMotion());
    container.addEventListener('mousemove', onMove);

    // Establecer posición de inicio en el bloque medio
    container.scrollLeft = baseWidth;
}

initReviewHoverScroll();
