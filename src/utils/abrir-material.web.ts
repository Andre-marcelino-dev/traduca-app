import { obterToken } from "@/services/api";

export async function abrirMaterial(url: string, _nomeArquivo: string) {
  const token = await obterToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const resposta = await fetch(url, { headers });

  if (!resposta.ok) {
    throw new Error("Não foi possível abrir o material.");
  }

  const blob = await resposta.blob();
  const urlObjeto = URL.createObjectURL(blob);
  window.open(urlObjeto, "_blank");
}
