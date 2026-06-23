export default {
  messages: {
    greeting: "¡Hola, {name}!",
    farewell: "¡Adiós, {name}!",
    auth_failed: 'Error de autenticación',
    token_expired: 'Su sesión ha expirado. Por favor, inicie sesión de nuevo.',
    errorNotFound: "El recurso solicitado no fue encontrado.",
    smp_client_init: "El cliente SMP está listo..."
  },
  dateTimeFormat: {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
  },
  numberFormat: {
    currency: { style: 'currency', currency: 'EUR' },
    decimal: { style: 'decimal', minimumFractionDigits: 2 },
  }
};
