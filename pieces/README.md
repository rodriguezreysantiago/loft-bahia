# Piezas para redes — generadas

Archivos listos para subir / imprimir:

- `historias/historia-{1..5}.png` — Historias 1080×1920 (IG / WhatsApp)
- `carrusel/slide-{1..6}.png` — Carrusel 1080×1080 (feed IG)
- `posts/post-{1..4}.png` — Posts sueltos 1080×1080
- `flyer/flyer-a4.pdf` — Flyer A4 imprimible

> Son **generadas**. La fuente de cada pieza vive en `site/src/pages/pieces/*.astro`.
> Para cambiar textos/fotos, editá ahí y regenerá.

## Regenerar

1. Levantar el dev server:
   ```
   cd site && npm run dev
   ```
2. Abrir Chrome headless con debugging (en otra terminal):
   ```
   & "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --user-data-dir="$env:TEMP\loftcdp" --remote-debugging-port=9222 about:blank
   ```
3. Capturar (PNG por recorte / PDF por print), desde la raíz del repo:
   ```
   $u = "http://localhost:4321/loft-bahia/pieces"
   node scripts/capturar-piezas.mjs "$u/historias" 5 1080 1920 pieces/historias historia
   node scripts/capturar-piezas.mjs "$u/carrusel"  6 1080 1080 pieces/carrusel slide
   node scripts/capturar-piezas.mjs "$u/posts"     4 1080 1080 pieces/posts    post
   node scripts/capturar-pdf.mjs    "$u/flyer"     pieces/flyer/flyer-a4.pdf
   ```

`capturar-piezas.mjs` recorta cada cuadro de la hoja apilada; `capturar-pdf.mjs` imprime a PDF A4.
