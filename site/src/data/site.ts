/**
 * Fuente única de datos del aviso y contacto.
 * Tomado de contenido.md — cambiar acá actualiza toda la landing.
 */

export const site = {
  name: 'Loft Bahía',
  title: 'Loft Bahía · Monoambiente en alquiler — Bahía Blanca',
  description:
    'Monoambiente tipo loft con entrepiso, amoblado y a pasos de la UTN. Ideal para estudiantes en Bahía Blanca (a 10 cuadras de la UNS).',
  // URL pública (Netlify). Si el subdominio difiere, cambiar acá y en
  // astro.config (site) y public/robots.txt.
  url: 'https://loftbahia.netlify.app',
} as const;

export const contact = {
  phoneDisplay: '291 526-7900',
  whatsappNumber: '5492915267900',
  tel: '+5492915267900',
} as const;

/** Link a WhatsApp, con texto pre-cargado opcional. */
export function waLink(text?: string): string {
  const base = `https://wa.me/${contact.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Link para llamar. */
export const telLink = `tel:${contact.tel}`;

/** Mensajes pre-cargados reutilizables. */
export const waMessages = {
  info: '¡Hola! Vi el aviso del monoambiente loft y quiero más info',
  visita: '¡Hola! Quiero coordinar una visita al monoambiente',
} as const;
