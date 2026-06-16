// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages (project site): se sirve en usuario.github.io/loft-bahia/.
  // `base` prefija assets/links; sin esto se rompe todo bajo el sub-path.
  // Si más adelante hay dominio propio, cambiar `site` y borrar `base`.
  site: 'https://rodriguezreysantiago.github.io',
  base: '/loft-bahia',
  image: {
    // Imágenes responsive: cada <Image width=...> genera un srcset acotado
    // (no se sirve la foto full-res de 6000px). responsiveStyles=false deja
    // que el aspecto lo controle nuestro CSS (object-fit / aspect-ratio).
    layout: 'constrained',
    responsiveStyles: false,
  },
  // Sitemap solo de las páginas públicas reales (excluye los generadores /pieces/).
  integrations: [sitemap({ filter: (page) => !page.includes('/pieces/') })],
});
