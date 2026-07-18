# Car Wings — Sitio Web 🍗🏁

Sitio web oficial de **Car Wings** ("El Único Sabor"), restaurante de alitas en Quillacollo, Bolivia. Construido 100% con **HTML, CSS y JavaScript puro** (sin frameworks ni dependencias), listo para publicarse en **GitHub Pages**.

## ✨ Características

- Diseño elegante, oscuro, con acentos de bandera a cuadros y rojo/dorado inspirados en la marca.
- Totalmente **responsive**: optimizado primero para móvil, y adaptado a tablet y escritorio.
- Menú interactivo: el visitante elige cantidades de cada combo y de las salsas extra.
- Panel de pedido ("carrito") que arma automáticamente un mensaje y lo envía por **WhatsApp**.
- Botón flotante de WhatsApp y botones en el header, hero y footer.
- Mapa embebido de Google Maps con la ubicación del local + botón "Cómo llegar".
- Menú de navegación adaptado a móvil (hamburguesa), animaciones suaves al hacer scroll, y respeta `prefers-reduced-motion`.
- Accesibilidad: contraste AA, foco visible, áreas táctiles ≥44px, `aria-label`s, `skip link`.

## 📁 Estructura del proyecto

```
car-wings/
├── index.html          # Estructura de la página (una sola página, con anclas)
├── css/
│   └── style.css        # Sistema de diseño completo (tokens, componentes, responsive)
├── js/
│   └── main.js           # Menú dinámico, carrito, WhatsApp, navegación, animaciones
├── assets/
│   └── favicon.svg      # Ícono del sitio (SVG original, sin derechos de terceros)
└── README.md
```

## 🔧 Antes de publicar: datos que DEBES revisar

Abre `js/main.js` y edita el bloque `CONFIG` al inicio del archivo:

```js
const CONFIG = {
  whatsappNumber: '59170000000', // ⚠️ Reemplaza por el número real de Car Wings
  businessName: 'Car Wings',
  address: 'Av. Cochabamba 0855, Quillacollo, Bolivia',
};
```

- **`whatsappNumber`**: debe llevar el código de país sin el símbolo `+` ni espacios (ejemplo Bolivia: `591` + número de 8 dígitos). Ese número aún no aparecía en las capturas que compartiste, así que quedó con un valor de ejemplo — cámbialo antes de publicar o los botones de pedido no funcionarán.
- En `index.html`, revisa el enlace de **Facebook** en el pie de página (`href="https://www.facebook.com/"`) y reemplázalo por la URL real de la página de Facebook de Car Wings.
- Los precios, horarios, dirección y sabores ya están cargados según la información que compartiste (imagen del menú y ficha del negocio).

## 🚀 Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `car-wings-web`).
2. Sube estos archivos a la raíz del repositorio:
   ```bash
   git init
   git add .
   git commit -m "Sitio web de Car Wings"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/car-wings-web.git
   git push -u origin main
   ```
3. En GitHub, entra a **Settings → Pages**.
4. En "Build and deployment", selecciona **Source: Deploy from a branch**.
5. Elige la rama **main** y la carpeta **/ (root)**. Guarda.
6. Espera uno o dos minutos: tu sitio quedará publicado en
   `https://TU_USUARIO.github.io/car-wings-web/`

No necesitas ningún proceso de build: es HTML/CSS/JS estático, funciona directo.

## 🖥️ Probar en tu computadora antes de subirlo

Solo abre `index.html` en tu navegador, o si quieres simular un servidor local:

```bash
# Con Python instalado
python3 -m http.server 8000
# luego visita http://localhost:8000
```

## 🎨 Sistema de diseño

- **Tipografía:** `Bebas Neue` (títulos, estilo racing/impacto) + `Barlow` (texto, alta legibilidad).
- **Colores:** negro elegante de fondo, rojo racing como color primario, dorado como acento premium, verde WhatsApp reservado solo para los botones de pedido.
- **Componentes:** tarjetas de menú con contador de cantidad, franja de sabores, tarjeta de horarios, panel de pedido deslizante, mapa embebido.

## ♿ Accesibilidad y rendimiento

- Navegación por teclado y `focus-visible` en todos los elementos interactivos.
- Botones e íconos táctiles de mínimo 44×44px.
- Sin imágenes pesadas: los gráficos (bandera a cuadros, alitas, iconos) son SVG/CSS, por lo que la carga es instantánea.
- Animaciones de 150–300ms; se desactivan automáticamente si el usuario tiene activado "reducir movimiento".

---

Hecho con 🏁 para Car Wings — *El Único Sabor*.
