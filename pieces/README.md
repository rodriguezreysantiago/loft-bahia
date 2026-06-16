# Piezas para redes — generadas

Archivos listos para subir / imprimir:

- `historias/historia-{1..5}.png` — Historias 1080×1920 (IG / WhatsApp)
- `carrusel/slide-{1..6}.png` — Carrusel 1080×1080 (feed IG)
- `posts/post-{1..4}.png` — Posts sueltos 1080×1080
- `flyer/flyer-a4.pdf` — Flyer A4 imprimible (con QR al sitio)
- `qr/qr.png` + `qr/qr.svg` — QR a https://loft-bahia.netlify.app (también va embebido en el flyer)

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
   $u = "http://localhost:4321/pieces"
   node scripts/capturar-piezas.mjs "$u/historias" 5 1080 1920 pieces/historias historia
   node scripts/capturar-piezas.mjs "$u/carrusel"  6 1080 1080 pieces/carrusel slide
   node scripts/capturar-piezas.mjs "$u/posts"     4 1080 1080 pieces/posts    post
   node scripts/capturar-pdf.mjs    "$u/flyer"     pieces/flyer/flyer-a4.pdf
   ```

`capturar-piezas.mjs` recorta cada cuadro de la hoja apilada; `capturar-pdf.mjs` imprime a PDF A4.

## QR

El flyer genera el QR en el build a partir de `site.ts` (`site.url`), así que **se actualiza solo** si cambia la URL. Para regenerar el QR suelto (PNG + SVG) y verificar el decode:

```
cd site && node scripts/qr.mjs            # usa https://loft-bahia.netlify.app
cd site && node scripts/qr.mjs <url> <outDir>   # otra URL / destino
```

## Página de descargas

Las piezas se pueden bajar desde el celular en **https://loft-bahia.netlify.app/descargas**
(página de uso interno, no linkeada ni indexada). Sirve cada pieza + un ZIP con todo.

Después de regenerar piezas, sincronizá la web y rearmá el ZIP:

```
& .\scripts\build-descargas.ps1   # copia pieces/ -> site/public/descargas + arma el ZIP
```

## Textos para publicar

Captions, versión corta y hashtags listos para copiar en [`copy-redes.md`](copy-redes.md).
