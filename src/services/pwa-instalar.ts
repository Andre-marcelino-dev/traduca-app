// Instalação como PWA só existe na versão web (ver pwa-instalar.web.ts).
// No app nativo (Expo Go / build) o "aplicativo" já é o app em si, então
// nunca há um aviso de instalação pra escutar.
export function iniciarEscutaInstalarPwa() {}

export function usePromptInstalarPwa(): {
  disponivel: boolean;
  instalar: () => Promise<boolean>;
  plataforma: "ios" | "android" | "outro";
} {
  return { disponivel: false, instalar: async () => false, plataforma: "ios" };
}
