# Loft Bahía — sitio (Astro)

Landing de alquiler + generadores de piezas para redes. Sitio estático (Astro), sin backend,
desplegado en **Netlify** → https://loft-bahia.netlify.app (auto-deploy en cada push a `main`).

## Comandos

| Comando            | Acción                                         |
| :----------------- | :--------------------------------------------- |
| `npm install`      | Instala dependencias                           |
| `npm run dev`      | Dev server en `localhost:4321`                 |
| `npm run build`    | Build de producción a `./dist/`                |
| `npm run preview`  | Previsualiza el build local                    |

## Estructura

```
src/
├── data/site.ts          # datos de contacto + textos (fuente única)
├── layouts/Base.astro    # <head> (SEO, OG, fuentes) + slot
├── styles/global.css      # tokens de kit.css + layout de la landing
├── components/            # secciones de la landing + Lightbox
└── pages/
    ├── index.astro        # landing
    ├── descargas.astro    # página interna para bajar las piezas
    └── pieces/            # generadores de las piezas de redes (historias, carrusel, posts, flyer, og)
public/                    # favicon, og.jpg, robots.txt, descargas/ (piezas servidas)
```

## Notas

- **Imágenes**: `astro:assets` (`<Image>`) genera WebP responsive. Las fotos fuente viven en `src/assets/`.
- **Piezas de redes**: las páginas en `src/pages/pieces/` se renderizan a tamaño nativo y se capturan
  a PNG/PDF con los scripts de `../scripts/` (ver [`../pieces/README.md`](../pieces/README.md)).
- **Contacto / URL**: cambiá `src/data/site.ts` (y `astro.config.mjs` `site` + `public/robots.txt`)
  si cambia el dominio. El QR y el OG se regeneran solos desde ahí.
