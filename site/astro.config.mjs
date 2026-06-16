// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO: cambiar por el dominio real al desplegar (canonical / OG / sitemap).
  site: 'https://loft-bahia.example',
  image: {
    // Imágenes responsive: cada <Image width=...> genera un srcset acotado
    // (no se sirve la foto full-res de 6000px). responsiveStyles=false deja
    // que el aspecto lo controle nuestro CSS (object-fit / aspect-ratio).
    layout: 'constrained',
    responsiveStyles: false,
  },
});
