# Handoff: Loft Bahía — Sitio de alquiler + kit de redes

## Resumen
Paquete de diseño para publicar **un monoambiente tipo loft en alquiler** en Bahía Blanca,
orientado a estudiantes (UTN / UNS). Incluye una **página web (landing)** y un **kit de piezas
para redes sociales** (historias, carrusel, posts y flyer imprimible).

El objetivo del desarrollo es llevar la **landing** a un sitio real, desplegable (por ejemplo en
Vercel / Netlify / GitHub Pages), y dejar el kit de redes como generador de piezas estáticas.

## Sobre los archivos de este bundle
Los `.html` de este paquete son **referencias de diseño hechas en HTML** — prototipos que muestran
el look & feel y el comportamiento buscado, **no** código de producción para copiar tal cual.
La tarea es **recrear estos diseños en el entorno elegido** (recomendado: un framework estático
moderno como **Astro** o **Next.js**, o incluso HTML estático bien organizado si se prefiere algo
simple) usando sus convenciones. La landing ya es bastante "production-ready" en HTML/CSS plano,
así que portarla es directo.

## Fidelidad
**Alta (hi-fi).** Colores, tipografías, espaciados e interacciones son finales. Recrear la UI
pixel-perfect. La paleta y las fuentes están definidas en `kit.css` (tokens) y deben respetarse.

---

## Pantallas / Vistas

### 1. Landing — `Loft Bahía — Landing.html`
Página principal, responsive, una sola columna de secciones.

- **Nav sticky**: marca "Loft Bahía" + links ancla (Galería, El depto, Ubicación, Contacto) +
  botón WhatsApp. Fondo crema con blur, borde inferior 1.5px tinta.
- **Hero**: grid 2 columnas (texto / collage de fotos). Headline grande con subrayado petróleo.
  Botones: WhatsApp (verde) + Llamar. En el collage: foto principal `living-window.jpg`,
  inset `cat-stairs.jpg`, sticker "Tipo loft · Con entrepiso".
- **Facts strip**: barra oscura con 5 datos (monoambiente, 2 niveles, amoblado, UTN, 10 cuadras UNS).
- **Amenities**: chips redondeados (amoblado, cerca UTN, 10 cuadras UNS, lavadero común, cocina
  equipada, baño nuevo, patio con bicis, ideal estudiantes).
- **Galería**: grid 4 columnas con celdas de distintos tamaños (`big`, `tall`, `wide`), figcaptions.
- **Features**: 3 tarjetas (Entrepiso tipo loft / Cocina equipada / Patio común + bicis).
- **Ubicación**: bloque petróleo con lista (UTN a pasos, UNS 10 cuadras, Centro).
- **Cat banner**: foto del gato + texto "Viene con buena compañía".
- **CTA final**: bloque oscuro con damero al 10%, botones WhatsApp + Llamar, teléfono grande.
- **Footer** + **CTA móvil fija** (sólo < 620px): WhatsApp + Llamar.

### 2. Historias — `Loft Bahía — Historias.html`
5 cuadros **1080×1920** navegables (← →). Escalan al viewport. Para producción: o se dejan como
plantillas exportables, o se generan PNG con un script de captura. Frames: Portada, Checklist,
Loft, Ubicación, CTA.

### 3. Carrusel — `Loft Bahía — Carrusel.html`
6 slides **1080×1080** (cover, living, cocina, entrepiso, baño/patio, CTA).

### 4. Posts — `Loft Bahía — Posts.html`
4 piezas **1080×1080** en grilla (portada, amenities, detalle loft, contacto).

### 5. Flyer — `Loft Bahía — Flyer.html`
Hoja **A4 vertical** imprimible (`@page size:A4`), con `window.print()`. Banda hero + amenities +
tira de 3 fotos + pie de contacto.

### 6. Hub — `index.html`
Índice que enlaza todas las piezas.

---

## Interacciones & comportamiento
- **Botones de contacto** (en todas las piezas):
  - WhatsApp → `https://wa.me/5492915267900` (con `?text=` pre-cargado en la landing).
  - Llamar → `tel:+5492915267900`.
- **Nav**: scroll suave a anclas (`#galeria`, `#features`, `#ubicacion`, `#contacto`).
- **Galería**: hover hace `scale(1.05)` en la imagen (transición 0.5s).
- **Tiles / tarjetas**: hover desplaza -3px y aplica sombra dura 7px.
- **Historias / Carrusel**: navegación por teclado (←/→), dots clicables, posición guardada en
  `localStorage` (`lb_story`, `lb_carousel`). Escalado por JS al redimensionar.
- **Responsive**: breakpoints principales en 880px y 620px (CTA móvil fija aparece < 620px).

## Estado
Sitio mayormente estático. Único estado real: índice de slide en Historias/Carrusel
(`localStorage`). No hay fetch ni backend. Si más adelante se quiere un formulario de consulta,
agregar endpoint o servicio tipo Formspree.

## Design tokens (ver `kit.css`)
**Colores**
- Crema fondo `#EFE6D3` · Crema 2 `#E7DBC2` · Papel `#FBF6EC`
- Tinta `#211E18` · Tinta suave `#5A5347`
- Petróleo (primario) `#1F6E7E` · Petróleo oscuro `#175662`
- Terracota (secundario) `#BC5D3C` · Terracota oscuro `#9E4B2E`
- Madera `#B5763C` · WhatsApp `#1FA855` / `#178043`

**Tipografía** (Google Fonts)
- Display / títulos: **Bricolage Grotesque** (700/800, optical sizing)
- Texto: **DM Sans** (400/500/600/700)

**Radios**: chips/botones 999px · tarjetas 14–28px
**Sombra dura**: `6px 6px 0` tinta/petróleo/terracota
**Damero decorativo**: clase `.checker` con vars `--c1 --c2 --sz`

## Assets
Fotos reales del depto en `assets/` (renombradas por rol). Originales en `uploads/` (IMG_*.jpeg).
Lista de roles en `contenido.md`. Si se necesitan optimizadas, convertir a WebP y servir tamaños
responsive (`srcset`). Las fuentes vienen de Google Fonts (link en `kit.css`).

## Copy / contenido
Todos los textos y datos de contacto están en **`contenido.md`** para reutilizar.

## Archivos del diseño
- `index.html` — hub
- `Loft Bahía — Landing.html` — página web
- `Loft Bahía — Historias.html` — stories 9:16
- `Loft Bahía — Carrusel.html` — carrusel 1:1
- `Loft Bahía — Posts.html` — posts 1:1
- `Loft Bahía — Flyer.html` — flyer A4
- `kit.css` — tokens + estilos compartidos
- `assets/` — fotos
- `contenido.md` — textos y datos
