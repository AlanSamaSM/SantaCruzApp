export type Locale = "es" | "en";

export const translations = {
  es: {
    // Bottom nav
    "nav.access": "Acceso",
    "nav.explore": "Explorar",
    "nav.guest": "Huésped",
    "nav.info": "Info",

    // Home page
    "home.subtitle": "La Paz, Baja California Sur",
    "home.parking": "Acceso al Estacionamiento",
    "home.showQR": "Muestra este código QR a la cámara de la reja para ingresar",
    "home.accessActive": "Acceso activo",
    "home.locked": "Acceso bloqueado",
    "home.lockedHint": "Ingresa tu código de reserva para desbloquear",
    "home.unlockAccess": "Activa tu acceso con el código de tu reserva",
    "home.enterCode": "Ingresar código",
    "home.installTip": "Instala esta app en tu pantalla de inicio para acceso rápido, incluso sin conexión a internet.",
    "home.hello": "Hola, {name}",
    "home.welcome": "Bienvenido",

    // Quick actions
    "actions.explore": "Explorar La Paz",
    "actions.whatsapp": "WhatsApp",
    "actions.services": "Servicios",
    "actions.info": "Info Hotel",

    // Guest login
    "guest.title": "Acceso de Huésped",
    "guest.subtitle": "Ingresa el código de acceso que recibiste de Santa Cruz Suites.",
    "guest.codeLabel": "Código de acceso",
    "guest.codePlaceholder": "SCX-XXXXXX",
    "guest.codeHint": "Ej: SCX-AB3K7N",
    "guest.verify": "Verificar código",
    "guest.codeFooter": "Recibirás tu código al confirmar tu reserva en Santa Cruz Suites.",
    "guest.found": "¡Reserva encontrada!",
    "guest.confirmHint": "Confirma tus datos para activar tu acceso",
    "guest.name": "Huésped",
    "guest.email": "Email",
    "guest.suite": "Suite",
    "guest.checkin": "Check-in",
    "guest.checkout": "Check-out",
    "guest.activate": "Activar mi acceso",
    "guest.otherCode": "Usar otro código",
    "guest.errorConnection": "Error de conexión. Intenta de nuevo.",
    "guest.errorAccount": "No se pudo crear tu cuenta. Contacta a recepción.",
    "guest.errorSession": "No se pudo iniciar sesión. Contacta a recepción.",
    "guest.errorLink": "No se pudo vincular la reserva.",

    // Profile
    "profile.title": "Mi Perfil",
    "profile.logout": "Salir",
    "profile.personal": "Datos personales",
    "profile.fullName": "Nombre completo",
    "profile.namePlaceholder": "Tu nombre",
    "profile.emailLabel": "Correo electrónico",
    "profile.phone": "Teléfono",
    "profile.phonePlaceholder": "+52 612 123 4567",
    "profile.suiteType": "Tipo de suite",
    "profile.selectSuite": "Seleccionar...",
    "profile.save": "Guardar cambios",
    "profile.saved": "Guardado",
    "profile.arcoTitle": "Tus derechos ARCO",
    "profile.arcoDesc": "Bajo la LFPDPPP tienes derecho a Acceder, Rectificar, Cancelar y Oponerte al uso de tus datos personales.",
    "profile.exportData": "Descargar mis datos",
    "profile.exportDesc": "Exporta tu información en formato JSON",
    "profile.deleteData": "Eliminar mis datos",
    "profile.deleteDesc": "Borra toda tu información permanentemente",
    "profile.deleteConfirm": "¿Estás seguro?",
    "profile.deleteWarn": "Esta acción eliminará permanentemente tu perfil, historial de servicios y datos personales. No se puede deshacer.",
    "profile.cancel": "Cancelar",
    "profile.deleteAll": "Sí, eliminar todo",
    "profile.privacy": "Aviso de privacidad",

    // Services
    "services.title": "Servicios",
    "services.subtitle": "Servicios adicionales exclusivos de Santa Cruz Suites",
    "services.myRequests": "Mis solicitudes",
    "services.dateLabel": "Fecha deseada (opcional)",
    "services.commentLabel": "Comentarios (opcional)",
    "services.commentPlaceholder": "Ej: Necesito el transporte a las 8am",
    "services.submit": "Solicitar servicio",
    "services.sent": "¡Solicitud enviada!",
    "services.sentHint": "Te confirmaremos pronto.",
    "services.pending": "Pendiente",
    "services.confirmed": "Confirmado",
    "services.completed": "Completado",
    "services.cancelled": "Cancelado",

    // Info
    "info.suiteTypes": "Tipos de Suite",
    "info.contact": "Contacto",
    "info.address": "Dirección",
    "info.whatsapp": "WhatsApp",
    "info.email": "Email",
    "info.about": "Acerca de",
    "info.aboutText": "Santa Cruz Suites es un complejo de {units} unidades ubicado en el corazón de La Paz, sobre la calle Mariano Abasolo. Contamos con más de 300 reseñas positivas y estándares de limpieza verificados. Nuestras suites incluyen configuraciones Studio A, Studio B, Penthouse y Loft, con amenidades como jacuzzi en azotea con vista a la bahía.",
    "info.legal": "Legal",
    "info.privacyTitle": "Aviso de Privacidad",
    "info.privacySubtitle": "LFPDPPP — Protección de datos personales",
    "info.callFront": "Contactar recepción",
    "info.sendEmail": "Enviar correo",

    // Consent
    "consent.title": "Tu privacidad es importante",
    "consent.text": "Santa Cruz Suites utiliza almacenamiento local para mejorar tu experiencia. Con tu consentimiento, habilitaremos funciones como el modo offline y la geolocalización en el mapa.",
    "consent.privacyLink": "Aviso de Privacidad",
    "consent.essential": "Solo esenciales",
    "consent.acceptAll": "Aceptar todo",

    // WhatsApp
    "whatsapp.message": "Hola, soy huésped de Santa Cruz Suites",

    // Common
    "common.loading": "Cargando...",
    "common.close": "Cerrar",
  },

  en: {
    // Bottom nav
    "nav.access": "Access",
    "nav.explore": "Explore",
    "nav.guest": "Guest",
    "nav.info": "Info",

    // Home page
    "home.subtitle": "La Paz, Baja California Sur",
    "home.parking": "Parking Access",
    "home.showQR": "Show this QR code to the gate camera to enter",
    "home.accessActive": "Access active",
    "home.locked": "Access locked",
    "home.lockedHint": "Enter your booking code to unlock",
    "home.unlockAccess": "Activate access with your booking code",
    "home.enterCode": "Enter code",
    "home.installTip": "Install this app on your home screen for quick access, even without internet.",
    "home.hello": "Hello, {name}",
    "home.welcome": "Welcome",

    // Quick actions
    "actions.explore": "Explore La Paz",
    "actions.whatsapp": "WhatsApp",
    "actions.services": "Services",
    "actions.info": "Hotel Info",

    // Guest login
    "guest.title": "Guest Access",
    "guest.subtitle": "Enter the access code you received from Santa Cruz Suites.",
    "guest.codeLabel": "Access code",
    "guest.codePlaceholder": "SCX-XXXXXX",
    "guest.codeHint": "Ex: SCX-AB3K7N",
    "guest.verify": "Verify code",
    "guest.codeFooter": "You'll receive your code when confirming your booking at Santa Cruz Suites.",
    "guest.found": "Booking found!",
    "guest.confirmHint": "Confirm your details to activate access",
    "guest.name": "Guest",
    "guest.email": "Email",
    "guest.suite": "Suite",
    "guest.checkin": "Check-in",
    "guest.checkout": "Check-out",
    "guest.activate": "Activate my access",
    "guest.otherCode": "Use another code",
    "guest.errorConnection": "Connection error. Please try again.",
    "guest.errorAccount": "Couldn't create your account. Contact the front desk.",
    "guest.errorSession": "Couldn't sign in. Contact the front desk.",
    "guest.errorLink": "Couldn't link the booking.",

    // Profile
    "profile.title": "My Profile",
    "profile.logout": "Sign out",
    "profile.personal": "Personal information",
    "profile.fullName": "Full name",
    "profile.namePlaceholder": "Your name",
    "profile.emailLabel": "Email",
    "profile.phone": "Phone",
    "profile.phonePlaceholder": "+52 612 123 4567",
    "profile.suiteType": "Suite type",
    "profile.selectSuite": "Select...",
    "profile.save": "Save changes",
    "profile.saved": "Saved",
    "profile.arcoTitle": "Your data rights",
    "profile.arcoDesc": "Under Mexican data protection law (LFPDPPP), you have the right to Access, Rectify, Cancel, and Oppose the use of your personal data.",
    "profile.exportData": "Download my data",
    "profile.exportDesc": "Export your information as JSON",
    "profile.deleteData": "Delete my data",
    "profile.deleteDesc": "Permanently erase all your information",
    "profile.deleteConfirm": "Are you sure?",
    "profile.deleteWarn": "This will permanently delete your profile, service history, and personal data. This cannot be undone.",
    "profile.cancel": "Cancel",
    "profile.deleteAll": "Yes, delete everything",
    "profile.privacy": "Privacy policy",

    // Services
    "services.title": "Services",
    "services.subtitle": "Additional services exclusive to Santa Cruz Suites",
    "services.myRequests": "My requests",
    "services.dateLabel": "Preferred date (optional)",
    "services.commentLabel": "Comments (optional)",
    "services.commentPlaceholder": "Ex: I need the transfer at 8am",
    "services.submit": "Request service",
    "services.sent": "Request sent!",
    "services.sentHint": "We'll confirm shortly.",
    "services.pending": "Pending",
    "services.confirmed": "Confirmed",
    "services.completed": "Completed",
    "services.cancelled": "Cancelled",

    // Info
    "info.suiteTypes": "Suite Types",
    "info.contact": "Contact",
    "info.address": "Address",
    "info.whatsapp": "WhatsApp",
    "info.email": "Email",
    "info.about": "About",
    "info.aboutText": "Santa Cruz Suites is a complex of {units} units located in the heart of La Paz on Mariano Abasolo street. With over 300 positive reviews and verified cleanliness standards, our suites include Studio A, Studio B, Penthouse, and Loft configurations with amenities like a rooftop jacuzzi with bay views.",
    "info.legal": "Legal",
    "info.privacyTitle": "Privacy Policy",
    "info.privacySubtitle": "LFPDPPP — Personal data protection",
    "info.callFront": "Contact front desk",
    "info.sendEmail": "Send email",

    // Consent
    "consent.title": "Your privacy matters",
    "consent.text": "Santa Cruz Suites uses local storage to improve your experience. With your consent, we'll enable features like offline mode and map geolocation.",
    "consent.privacyLink": "Privacy Policy",
    "consent.essential": "Essential only",
    "consent.acceptAll": "Accept all",

    // WhatsApp
    "whatsapp.message": "Hi, I'm a guest at Santa Cruz Suites",

    // Common
    "common.loading": "Loading...",
    "common.close": "Close",
  },
} as const;

export type TranslationKey = keyof typeof translations.es;

export function getTranslation(locale: Locale, key: TranslationKey, params?: Record<string, string | number>): string {
  let text: string = translations[locale][key] ?? translations.es[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export function detectLocale(): Locale {
  if (typeof window === "undefined") return "es";
  const stored = localStorage.getItem("scx-lang");
  if (stored === "en" || stored === "es") return stored;
  const nav = navigator.language.slice(0, 2);
  return nav === "en" ? "en" : "es";
}
