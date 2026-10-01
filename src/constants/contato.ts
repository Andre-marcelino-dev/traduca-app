export const WHATSAPP_PROFESSOR = "5511999612140";

export function linkWhatsapp(numero: string, texto?: string) {
  const query = texto ? `?text=${encodeURIComponent(texto)}` : "";
  return `https://wa.me/${numero}${query}`;
}
