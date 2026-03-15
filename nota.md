# 🍍 Piña GrowShop — Guía Técnica Completa (Firebase Edition)

> **Versión:** Firebase Firestore  
> **Stack:** HTML5 · CSS3 · JavaScript Vanilla · Firebase v10 (Modular SDK)  
> **Base de datos:** Cloud Firestore (Google Firebase)

---

## 📑 ÍNDICE

1. [Arquitectura del proyecto](#1-arquitectura-del-proyecto)
2. [Cómo funciona Firebase en este proyecto](#2-cómo-funciona-firebase-en-este-proyecto)
3. [Variables y tokens que puedes cambiar sin riesgo](#3-variables-y-tokens-que-puedes-cambiar-sin-riesgo)
4. [Textos editables del sitio](#4-textos-editables-del-sitio)
5. [Colores y diseño](#5-colores-y-diseño)
6. [Sistema de categorías y subcategorías](#6-sistema-de-categorías-y-subcategorías)
7. [Cómo agregar productos iniciales (seed data)](#7-cómo-agregar-productos-iniciales-seed-data)
8. [Cómo cambiar la clave de administrador](#8-cómo-cambiar-la-clave-de-administrador)
9. [Cómo cambiar el número de WhatsApp](#9-cómo-cambiar-el-número-de-whatsapp)
10. [Cómo cambiar la ubicación del mapa](#10-cómo-cambiar-la-ubicación-del-mapa)
11. [Cómo funciona el carrito y el checkout](#11-cómo-funciona-el-carrito-y-el-checkout)
12. [Imágenes: formatos aceptados](#12-imágenes-formatos-aceptados)
13. [Funciones clave de app.js y qué reemplaza a qué](#13-funciones-clave-de-appjs-y-qué-reemplaza-a-qué)
14. [Clases CSS importantes: no las cambies de nombre](#14-clases-css-importantes-no-las-cambies-de-nombre)
15. [Configuración de Firebase: qué es cada credencial](#15-configuración-de-firebase-qué-es-cada-credencial)
16. [Reglas de seguridad sugeridas en Firestore](#16-reglas-de-seguridad-sugeridas-en-firestore)
17. [Qué NO debes modificar](#17-qué-no-debes-modificar)
18. [Preguntas frecuentes (FAQ)](#18-preguntas-frecuentes-faq)

---

## 1. Arquitectura del proyecto

```
/
├── index.html   → Estructura HTML + inicialización de Firebase (script type="module")
├── app.js       → Toda la lógica: Firestore CRUD, carrito, filtros, admin, UI
├── style.css    → Sistema visual completo: colores, componentes, responsive
└── nota.md      → Esta guía
```

**Flujo de datos:**
```
Navegador → Firebase SDK v10 → Cloud Firestore
                                     ↓
                              onSnapshot (tiempo real)
                                     ↓
                           catalogoGlobal (array en RAM)
                                     ↓
                             renderProducts()
```

---

## 2. Cómo funciona Firebase en este proyecto

### Dónde viven los datos

Todos los productos se guardan en **un solo documento** de Firestore:

```
Colección: tienda
  └── Documento: catalogo
        └── Campo: productos  (array de objetos)
```

Cada objeto del array tiene esta forma:

```json
{
  "id":     1700000001,
  "nombre": "Bong de Vidrio 30cm",
  "precio": 15990,
  "cat":    "Smoke",
  "subcat": "Bongs",
  "desc":   "Descripción del producto.",
  "img":    "https://url-principal.com/foto.jpg",
  "imgs":   ["https://url1.jpg", "https://url2.jpg"]
}
```

### Sincronización en tiempo real

La función `onSnapshot` en `app.js` escucha cambios en Firestore al instante:

```javascript
onSnapshot(catalogoRef, (docSnap) => {
    // Este bloque se ejecuta CADA VEZ que alguien modifica el catálogo
    catalogoGlobal = docSnap.data().productos;
    renderProducts();   // la pantalla se actualiza sola
    renderAdminList();  // la lista del admin también
});
```

Esto significa que si abres la web en dos navegadores diferentes y agregas un producto desde uno, **el otro se actualiza sin recargar**.

---

## 3. Variables y tokens que puedes cambiar sin riesgo

### En `app.js` — Línea 1 a 30

| Variable           | Valor por defecto | Qué controla                        |
|--------------------|-------------------|--------------------------------------|
| `ADMIN_PASSWORD`   | `"pina2026"`      | Clave del panel de administración    |
| `CATEGORIAS`       | Objeto con 4 cats | Categorías y subcategorías del filtro|
| `PRODUCTOS_INICIALES` | Array de 6 productos | Los que se cargan si Firestore está vacío |

### En `index.html` — `firebaseConfig`

| Clave              | Qué es                                      |
|--------------------|---------------------------------------------|
| `apiKey`           | Clave pública de tu proyecto Firebase       |
| `authDomain`       | Dominio de autenticación                    |
| `projectId`        | ID del proyecto (visible en Firebase Console)|
| `storageBucket`    | Bucket de Storage (para archivos grandes)   |
| `messagingSenderId`| ID del servicio de mensajería               |
| `appId`            | ID único de la aplicación web               |
| `measurementId`    | ID de Google Analytics (opcional, puedes borrarlo si no lo usas)|

---

## 4. Textos editables del sitio

### Título y subtítulo principal (Hero)

Están en `index.html`, sección `#inicio`:

```html
<h1 id="txt-hero-titulo">
    Lleva tu cultivo al <br><span class="text-lime-dark">siguiente nivel</span>
</h1>
<p id="txt-hero-sub">
    Venta de Parafernalia, Productos de Cultivo y Tabaquería.
</p>
```

**Para cambiarlos:** edita el texto directamente entre las etiquetas.

### Ticker (banner superior animado)

```html
<div class="ticker-item">
    🍍 ¡OFERTAS EXCLUSIVAS! — ENVÍOS A TODO CHILE — SAN MARCOS 1801, PADRE HURTADO — ASESORÍA EXPERTA 🍍
</div>
```

Cambia el texto por el tuyo. El segundo `ticker-item` es una copia para que la animación sea continua — cámbialo también.

### Footer: dirección, redes sociales

Busca en `index.html` la sección `<footer>` y edita las etiquetas `<li>` y `<a>`.

---

## 5. Colores y diseño

Todos los colores están centralizados en `style.css` como variables CSS en `:root`:

```css
:root {
    --lime-fluor:    #aee600;  /* verde lima fluorescente (botones principales) */
    --lime-dark:     #82b300;  /* verde lima oscuro (precios, acentos) */
    --green:         #4caf50;  /* verde esmeralda (bordes activos) */
    --green-emerald: #4caf50;  /* alias del verde esmeralda */
    --yellow:        #fdd835;  /* amarillo (blobs decorativos) */
    --text-dark:     #1a231a;  /* texto principal (casi negro verdoso) */
    --text-muted:    #667a66;  /* texto secundario (gris verdoso) */
    --bg-main:       #f9fbf9;  /* fondo general (blanco con tono verde) */
    --bg-card:       #ffffff;  /* fondo de tarjetas */
}
```

**Para cambiar el color principal de botones:** cambia `--lime-fluor`.  
**Para cambiar el color de precios:** cambia `--lime-dark`.  
**Para modo oscuro:** cambia `--bg-main` y `--bg-card` a colores oscuros.

---

## 6. Sistema de categorías y subcategorías

En `app.js`, el objeto `CATEGORIAS` define qué aparece en los filtros y en el panel admin:

```javascript
const CATEGORIAS = {
    "Smoke":      ["Pipas", "Bongs", "Papelillos", "Enroladores", "Limpieza"],
    "Cultivo":    ["Sustratos", "Fertilizantes", "Carpas", "Iluminación", "Control de Plagas"],
    "Tabaquería": ["Cigarrillos", "Tabaco", "Pipas de tabaco", "Accesorios"],
    "Aromas":     ["Inciensos", "Aceites esenciales", "Difusores", "Velas"]
};
```

**Para agregar una nueva categoría:** añade una clave nueva al objeto.  
**Para agregar subcategorías:** añade strings al array de la categoría correspondiente.

También debes sincronizar el `<select id="filter-cat">` y el `<select id="p-cat">` en `index.html` con las mismas claves del objeto `CATEGORIAS`.

---

## 7. Cómo agregar productos iniciales (seed data)

En `app.js`, el array `PRODUCTOS_INICIALES` se carga **una sola vez**, cuando Firestore no tiene ningún documento:

```javascript
const PRODUCTOS_INICIALES = [
    {
        id:     1700000001,        // número único; usa Date.now() para generar uno
        nombre: "Nombre del producto",
        precio: 9990,              // precio en pesos, sin puntos ni símbolos
        cat:    "Smoke",           // debe coincidir con una clave de CATEGORIAS
        subcat: "Bongs",           // debe coincidir con un valor del array de esa cat
        img:    "https://...",     // URL de imagen principal
        imgs:   ["https://..."],   // array de hasta 8 URLs (puede ser igual a img)
        desc:   "Descripción."
    },
    // ... más productos
];
```

**Importante:** si Firestore ya tiene datos, este array **no se ejecuta**. Para resetear, borra el documento `tienda/catalogo` desde la consola de Firebase.

---

## 8. Cómo cambiar la clave de administrador

En `app.js`, línea 7:

```javascript
const ADMIN_PASSWORD = "pina2026";
```

Cambia `"pina2026"` por la clave que quieras. No hay mínimo de caracteres, pero se recomienda al menos 8.

**Nota de seguridad:** esta clave es visible en el código fuente del navegador. Para mayor seguridad en producción, considera usar Firebase Authentication.

---

## 9. Cómo cambiar el número de WhatsApp

Hay **tres lugares** donde aparece el número. Busca `56945802810` y reemplázalo en todos:

1. **Footer** (`index.html`):
   ```html
   <a href="https://api.whatsapp.com/send/?phone=56945802810">
   ```

2. **Botón flotante** (`index.html`):
   ```html
   <a href="https://wa.me/56945802810" class="whatsapp-float">
   ```

3. **Función checkout** (`app.js`):
   ```javascript
   window.open(`https://wa.me/56945802810?text=${msg}`, "_blank");
   ```

El formato del número es **código de país sin + seguido del número**, sin espacios. Para Chile: `56` + número sin el 0 inicial.

---

## 10. Cómo cambiar la ubicación del mapa

En `index.html`, sección `#contacto`:

```html
<iframe src="https://www.google.com/maps?q=San+Marcos+1801+Padre+Hurtado&output=embed">
```

Reemplaza `San+Marcos+1801+Padre+Hurtado` con la dirección que quieras (usa `+` en lugar de espacios).

---

## 11. Cómo funciona el carrito y el checkout

El carrito **no se guarda en Firestore** — vive en la variable `cart` en memoria RAM. Esto es intencional: si el usuario cierra la página, el carrito se vacía (comportamiento estándar de e-commerce sin login).

Al hacer clic en **CONTINUAR**, la función `checkout()` en `app.js` construye un mensaje de WhatsApp con el detalle del pedido y abre WhatsApp en una nueva pestaña.

Para persistir el carrito entre sesiones (sin Firebase), podrías reemplazar `let cart = []` por:

```javascript
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
```

Y al final de `updateCart()`, agregar:

```javascript
localStorage.setItem("cart", JSON.stringify(cart));
```

---

## 12. Imágenes: formatos aceptados

El sistema acepta **hasta 8 imágenes por producto** en dos formatos:

| Formato | Cómo usarlo | Límite |
|---------|-------------|--------|
| **URL externa** | Pega el link directo de la imagen (ej: `https://i.imgur.com/foto.jpg`) | Sin límite de tamaño en Firestore |
| **Archivo local** | Usa el campo `<input type="file">` del panel admin | Se convierte a Base64; máximo recomendado: 1MB por imagen (Firestore tiene límite de 1MB por documento) |

**Recomendación:** usa URLs externas (Imgur, Cloudinary, Firebase Storage) para imágenes grandes. El Base64 infla el tamaño del documento en Firestore.

---

## 13. Funciones clave de app.js y qué reemplaza a qué

| Función nueva (Firebase) | Equivalente anterior (localStorage) | Qué hace |
|--------------------------|--------------------------------------|----------|
| `guardarCatalogo(lista)` | `localStorage.setItem(...)` | Guarda el array completo en Firestore |
| `onSnapshot(ref, cb)`    | `JSON.parse(localStorage.getItem(...))` | Lee datos en tiempo real |
| `initApp()`              | Carga directa al hacer DOMContentLoaded | Espera Firebase y suscribe el listener |
| `deleteProduct(id)`      | `db.productos.filter(...)` + `saveDB()` | Filtra y guarda en Firestore |
| `addProduct()`           | `db.productos.push(...)` + `saveDB()` | Agrega o edita y guarda en Firestore |
| `editProduct(id)`        | No existía | Carga datos al formulario para editar |
| `renderAdminList()`      | `updateAdminTable()` | Pinta la lista de productos en el panel admin |
| `setFirebaseStatus(msg)` | No existía | Muestra el estado de conexión en el panel admin |

---

## 14. Clases CSS importantes: no las cambies de nombre

Estas clases son referenciadas directamente por `app.js` o son cruciales para el layout:

| Clase CSS | Dónde se usa en JS | Qué hace |
|-----------|-------------------|----------|
| `#product-grid` | `renderProducts()` | Contenedor de tarjetas de productos |
| `#cart-items` | `updateCart()` | Lista de ítems del carrito |
| `#cart-count` | `updateCart()` | Contador en el ícono del carrito |
| `#cart-total` | `updateCart()` | Total del carrito |
| `#admin-list` | `renderAdminList()` | Lista de productos en el panel admin |
| `#admin-save-btn` | `addProduct()` | Botón guardar del admin (se deshabilita mientras guarda) |
| `#firebase-status` | `setFirebaseStatus()` | Indicador de conexión |
| `.page-section` | `showSection()` | Todas las secciones navegables |
| `.active` (en `.cart-sidebar`) | `toggleCart()` | Abre/cierra el carrito |
| `.active` (en `.admin-overlay`) | `toggleAdmin()` | Abre/cierra el panel admin |
| `.active` (en `.product-modal-overlay`) | `openModal()` / `closeModal()` | Abre/cierra el modal de producto |

---

## 15. Configuración de Firebase: qué es cada credencial

```javascript
const firebaseConfig = {
    apiKey:            "...",  // Clave de la API web (NO es secreta; Firebase la protege con reglas)
    authDomain:        "...",  // Dominio para OAuth (login con Google, si lo añades después)
    projectId:         "...",  // ID único de tu proyecto en Firebase
    storageBucket:     "...",  // Bucket de Firebase Storage (para subir archivos grandes)
    messagingSenderId: "...",  // ID para Firebase Cloud Messaging (notificaciones push)
    appId:             "...",  // ID de tu app web específica dentro del proyecto
    measurementId:     "..."   // ID de Google Analytics (opcional; bórralo si no lo usas)
};
```

**¿Es seguro exponer estas credenciales?**  
Sí, es el comportamiento esperado con Firebase. La seguridad real se configura en las **Reglas de Firestore** (ver sección 16), no ocultando las credenciales.

---

## 16. Reglas de seguridad sugeridas en Firestore

Ve a **Firebase Console → Firestore → Reglas** y pega:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // El catálogo es público para lectura
    match /tienda/catalogo {
      allow read: if true;

      // Solo escritura si la petición viene con la contraseña en el header
      // (Para una app sin backend, usa esto solo en modo desarrollo)
      allow write: if true;
    }
  }
}
```

**Para producción real**, cuando tengas Firebase Authentication implementado:

```
allow write: if request.auth != null && request.auth.token.admin == true;
```

---

## 17. Qué NO debes modificar

| Archivo / Elemento | Por qué no modificarlo |
|--------------------|------------------------|
| El `<script type="module">` en `index.html` | Es la inicialización de Firebase; si lo rompes, nada funciona |
| El evento `"firebase-ready"` | Es el puente entre el módulo de Firebase y `app.js` |
| Los `id` HTML de las secciones (`inicio`, `productos`, `contacto`, etc.) | `showSection()` los busca por ese nombre exacto |
| La estructura del documento Firestore (`tienda/catalogo`) | `initApp()` apunta exactamente a esa ruta |
| Los nombres de las propiedades del objeto producto (`id`, `nombre`, `precio`, `cat`, `subcat`, `img`, `imgs`, `desc`) | Todo el render y los filtros dependen de esos nombres |

---

## 18. Preguntas frecuentes (FAQ)

**¿Por qué los productos no aparecen al cargar?**  
Espera 1–2 segundos. Firebase necesita tiempo para conectarse. Si el problema persiste, revisa la consola del navegador (F12) para ver errores de Firestore.

**¿Puedo tener más de un administrador?**  
Con el sistema actual, no (es una sola contraseña). Para múltiples admins, implementa Firebase Authentication con roles.

**¿Cómo hago backup de mis productos?**  
Ve a Firebase Console → Firestore → `tienda/catalogo` → copia el JSON del campo `productos`.

**¿Qué pasa si supero el límite gratuito de Firestore?**  
El plan gratuito (Spark) incluye 50.000 lecturas/día y 20.000 escrituras/día. Para una tienda pequeña es más que suficiente.

**¿Cómo agrego imágenes desde mi computador sin que sean Base64?**  
Usa **Firebase Storage**: sube la imagen con `uploadBytes()` y guarda la URL con `getDownloadURL()`. Requiere activar Storage en tu proyecto Firebase.

**¿Puedo renombrar `tienda/catalogo` por otra ruta en Firestore?**  
Sí, cambia esta línea en `app.js` (y en `guardarCatalogo`):
```javascript
doc(window.db_cloud, "tienda", "catalogo")
// por ejemplo:
doc(window.db_cloud, "miTienda", "productos")
```

**¿Cómo agrego una nueva sección (ej: "Blog")?**  
1. Añade un `<section id="blog" class="page-section">` en `index.html`.
2. Añade un `<li>` con `onclick="showSection('blog')"` en el navbar.
3. Listo. `showSection()` lo manejará automáticamente.

---

> **Nota:** Este proyecto es para fines de portafolio y tiendas pequeñas. Para un e-commerce con pagos reales, se recomienda integrar Transbank (Chile), MercadoPago, o Stripe con un backend seguro (Next.js + Firebase Functions).
