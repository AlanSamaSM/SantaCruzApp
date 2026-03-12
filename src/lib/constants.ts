/** Valor codificado en el QR que la cámara de la reja del estacionamiento espera leer */
export const QR_ACCESS_VALUE = process.env.NEXT_PUBLIC_QR_VALUE ?? "SANTACRUZ-ACCESS-2730";

/** Coordenadas de Santa Cruz Suites, Mariano Abasolo 2730, La Paz BCS */
export const SANTA_CRUZ_COORDS = {
  lat: 24.152018,
  lng: -110.325681,
} as const;

/** Zoom por defecto del mapa */
export const MAP_DEFAULT_ZOOM = 15;

/** Información de contacto */
export const CONTACT: {
  address: string;
  whatsapp: string;
  email: string;
  instagram: string;
} = {
  address: "Mariano Abasolo 2730, Zona Central, La Paz, B.C.S., México",
  whatsapp: "", // TODO: agregar número de WhatsApp
  email: "", // TODO: agregar email de contacto
  instagram: "", // TODO: agregar perfil de Instagram
};

/** Nombre de la propiedad */
export const PROPERTY_NAME = "Santa Cruz Suites";

/** Tipos de suite disponibles */
export const SUITE_TYPES = ["Studio A", "Studio B", "Penthouse", "Loft"] as const;

/** Total de unidades */
export const TOTAL_UNITS = 24;

/** Local storage keys */
export const STORAGE_KEYS = {
  consent: "scx-consent",
  consentDate: "scx-consent-date",
} as const;
