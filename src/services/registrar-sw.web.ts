// Versão web de registrar-sw.ts: registra o service worker mínimo
// (public/sw.js) que o Chrome exige pra liberar o botão de instalação em um
// toque (ver pwa-instalar.web.ts).
export function registrarServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  navigator.serviceWorker.register("/sw.js").catch(() => {
    // Sem service worker, o app continua funcionando normalmente — só não
    // oferece o botão de instalação em um toque, caindo no passo a passo manual.
  });
}
