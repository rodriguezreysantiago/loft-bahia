// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Netlify: sitio estático servido en la RAÍZ (sin sub-path), URL limpia.
  // Si el subdominio elegido difiere, actualizar acá y en site.ts/robots.txt.
  site: 'https://loft-bahia.netlify.app',
  image: {
    // Imágenes responsive: cada <Image width=...> genera un srcset acotado
    // (no se sirve la foto full-res de 6000px). responsiveStyles=false deja
    // que el aspecto lo controle nuestro CSS (object-fit / aspect-ratio).
    layout: 'constrained',
    responsiveStyles: false,
  },
  // Sitemap solo de las páginas públicas reales (excluye los generadores /pieces/).
  integrations: [sitemap({ filter: (page) => !page.includes('/pieces/') && !page.includes('/descargas') })],
});
