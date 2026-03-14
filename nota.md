Aquí tienes el archivo **README.md** (Markdown) estructurado de forma profesional. Este documento es el estándar en la industria para explicar cómo funciona un proyecto y es ideal para que lo incluyas en tu repositorio de GitHub.

---

# 🍍 Piña Growshop | Web App & Admin System

Bienvenido a la documentación técnica de la réplica funcional de **Piña Growshop**. Este proyecto es una Single Page Application (SPA) diseñada para gestionar un catálogo de productos de forma dinámica sin necesidad de modificar el código fuente constantemente.

---

## 📑 ÍNDICE

1. [¿Qué es esta web?](https://www.google.com/search?q=%23qu%C3%A9-es-esta-web)
2. [¿Para qué sirve el sitio?](https://www.google.com/search?q=%23para-qu%C3%A9-sirve-el-sitio)
3. [Cómo funciona el sistema de productos](https://www.google.com/search?q=%23c%C3%B3mo-funciona-el-sistema-de-productos)
4. [Cómo funciona el carrito](https://www.google.com/search?q=%23c%C3%B3mo-funciona-el-carrito)
5. [Cómo agregar nuevos productos](https://www.google.com/search?q=%23c%C3%B3mo-agregar-nuevos-productos)
6. [Cómo actualizar productos existentes](https://www.google.com/search?q=%23c%C3%B3mo-actualizar-productos-existentes)
7. [Cómo modificar textos de la web](https://www.google.com/search?q=%23c%C3%B3mo-modificar-textos-de-la-web)
8. [Cómo cambiar imágenes](https://www.google.com/search?q=%23c%C3%B3mo-cambiar-im%C3%A1genes)
9. [Qué contiene cada carpeta](https://www.google.com/search?q=%23qu%C3%A9-contiene-cada-carpeta)
10. [Explicación de archivos importantes](https://www.google.com/search?q=%23explicaci%C3%B3n-de-archivos-importantes)
11. [Archivos que NO deben modificarse](https://www.google.com/search?q=%23archivos-que-no-deben-modificarse)
12. [Cómo mantener la web con el tiempo](https://www.google.com/search?q=%23c%C3%B3mo-mantener-la-web-con-el-tiempo)

---

## ¿Qué es esta web?

Es un **prototipo funcional de E-commerce** especializado en el nicho de Grow Shops. Utiliza tecnologías de Front-end (HTML5, CSS3 y JavaScript Vanila) para simular una tienda real con un panel de administración integrado que no requiere de un servidor externo (Backend) para pruebas locales o de portafolio.

## ¿Para qué sirve el sitio?

Sirve como plataforma de exhibición y gestión de inventario. Permite a un administrador gestionar qué productos se ven en la tienda, actualizar precios y modificar la información de contacto de manera visual, facilitando la escalabilidad del sitio sin tocar archivos `.html`.

## Cómo funciona el sistema de productos

El sistema se basa en un objeto de datos llamado `db` (Database).

* **Lectura:** El archivo `app.js` lee la lista de productos y genera automáticamente las "tarjetas" en la grilla.
* **Almacenamiento:** Utiliza el **LocalStorage** del navegador. Esto significa que si cierras la página o la recargas, los productos que creaste seguirán ahí.

## Cómo funciona el carrito

Cada producto tiene un botón de "Agregar". Al pulsarlo:

1. Se identifica el ID del producto.
2. Se suma a un arreglo temporal de compra.
3. El contador en la barra de navegación se actualiza en tiempo real.

## Cómo agregar nuevos productos

1. Haz clic en el icono de **⚙️ Admin**.
2. En la sección "Gestionar Productos", completa el nombre, el precio y el icono (o URL de imagen).
3. Presiona **"Añadir Producto"**.
4. El producto aparecerá instantáneamente en la sección de "Productos".

## Cómo actualizar productos existentes

Para actualizar, el sistema actual permite la **eliminación y re-creación**:

* Busca el producto en la lista del panel Admin.
* Haz clic en **"Eliminar"**.
* Vuelve a agregarlo con los datos corregidos (Precio/Nombre).

## Cómo modificar textos de la web

Dentro del Panel Admin, encontrarás campos de texto para el **Título** y **Subtítulo** del Hero. Al cambiar el texto y dar clic en "Guardar", la web actualiza el encabezado principal sin necesidad de editar el archivo `index.html`.

## Cómo cambiar imágenes

El sistema acepta dos formatos:

* **Emojis:** (Ej: 🌿, 📦) Para pruebas rápidas.
* **URLs externas:** Puedes pegar el link de una imagen subida a internet (Ej: `https://sitio.com/foto.jpg`) en el campo de imagen del panel Admin.

## Qué contiene cada carpeta

* `/`: Raíz del proyecto con los archivos principales.
* `/assets`: (Opcional) Aquí se guardan los logos, iconos y fotos locales.
* `/css`: Contiene las hojas de estilo.
* `/js`: Contiene la lógica del carrito y el administrador.

## Explicación de archivos importantes

* `index.html`: La cáscara de la web. Contiene las secciones (Inicio, Productos, Nosotros, Contacto).
* `style.css`: Define la identidad visual (colores negros y verdes, tipografía Poppins).
* `app.js`: El "cerebro". Maneja el guardado de datos y el cambio de secciones.

## Archivos que NO deben modificarse

* **`app.js` (Lógica de Render):** Si modificas las funciones de renderizado sin conocimiento de JS, el panel de Admin dejará de mostrar los productos.
* **Clases de CSS:** No cambies los nombres de las clases en el HTML (ej: `product-grid`) ya que el JS las busca por ese nombre exacto.

## Cómo mantener la web con el tiempo

1. **Limpieza de caché:** Si la web se comporta extraño, puedes limpiar el LocalStorage desde la consola del navegador.
2. **Backup de datos:** Si tienes muchos productos, copia el texto que aparece en el `localStorage` de la consola para no perderlo.
3. **Actualización de Fotos:** Asegúrate de que los links de las imágenes externas sigan vigentes para evitar errores de carga.

---

> **Nota:** Este proyecto es para fines de portafolio. Para una tienda real con pagos masivos, se recomienda migrar a una base de datos real (Firebase o MongoDB).