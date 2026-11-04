// Versão web de pwa-instalar.ts: escuta o aviso do navegador (Chrome/Edge no
// Android e no computador) de que o site pode ser instalado como app, e
// guarda esse aviso pra disparar quando o aluno tocar em "Instalar". No
// Safari (iPhone/Mac) esse aviso nunca chega — lá a instalação continua
// manual, pelo passo a passo do modal-iphone.tsx.
import { useEffect, useState } from "react";

type EventoInstalarPwa = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

// Guardados fora do componente: o Chrome só dispara esse aviso UMA VEZ por
// carregamento de página, então precisamos escutar desde a abertura do app
// (ver iniciarEscutaInstalarPwa, chamada no _layout.tsx) — se esperássemos
// até o aluno abrir a tela de Config pra começar a escutar, e o aviso
// chegasse antes disso em outra tela, ele se perderia pra sempre.
let eventoCapturado: EventoInstalarPwa | null = null;
let escutaIniciada = false;
const ouvintes = new Set<() => void>();

function notificarOuvintes() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

export function iniciarEscutaInstalarPwa() {
  if (escutaIniciada || typeof window === "undefined") return;
  escutaIniciada = true;

  window.addEventListener("beforeinstallprompt", (evento) => {
    evento.preventDefault();
    eventoCapturado = evento as EventoInstalarPwa;
    notificarOuvintes();
  });

  window.addEventListener("appinstalled", () => {
    eventoCapturado = null;
    notificarOuvintes();
  });
}

// Quando o navegador ainda não disparou o aviso de instalação (ex.: Chrome só
// libera depois que a pessoa navega um pouco pelo site), usamos isso pra
// decidir qual passo a passo manual mostrar — nunca o do Safari num Android.
function detectarPlataforma(): "ios" | "android" | "outro" {
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "outro";
}

export function usePromptInstalarPwa() {
  const [, forcarAtualizacao] = useState(0);

  useEffect(() => {
    const ouvinte = () => forcarAtualizacao((n) => n + 1);
    ouvintes.add(ouvinte);
    return () => {
      ouvintes.delete(ouvinte);
    };
  }, []);

  async function instalar(): Promise<boolean> {
    if (!eventoCapturado) return false;

    await eventoCapturado.prompt();
    const escolha = await eventoCapturado.userChoice;
    eventoCapturado = null;
    notificarOuvintes();
    return escolha.outcome === "accepted";
  }

  return {
    disponivel: eventoCapturado !== null,
    instalar,
    plataforma: detectarPlataforma(),
  };
}
