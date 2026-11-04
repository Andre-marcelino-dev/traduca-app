// Service worker mínimo: o Chrome só dispara o aviso de instalação em um
// toque (beforeinstallprompt) se existir um service worker registrado com um
// handler de "fetch" — mesmo que ele não faça nada especial. Sem isso, o
// navegador sempre cai no passo a passo manual do menu.
self.addEventListener("fetch", function () {
  // Deixa o navegador buscar normalmente; só precisa existir esse handler.
});
