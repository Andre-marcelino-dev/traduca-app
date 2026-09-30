// Baixar e abrir materiais no navegador (versão web do arquivos.ts).
import { Material, sessao } from "@/services/api";

export function nomeArquivo(material: Material) {
  const nome = material.titulo.replace(/[^\w\-]+/g, "_") || `material_${material.id_material}`;
  return material.extensao ? `${nome}.${material.extensao}` : nome;
}

// "ver" abre o arquivo numa nova aba; "baixar" salva no computador.
export async function abrirMaterial(material: Material, modo: "ver" | "baixar") {
  // Abre a aba já no clique, para o navegador não bloquear como pop-up.
  const aba = modo === "ver" ? window.open("", "_blank") : null;

  let resposta: Response;
  try {
    resposta = await fetch(material.url_download, {
      headers: { Accept: "*/*", Authorization: `Bearer ${sessao.token}` },
    });
  } catch {
    aba?.close();
    throw new Error("Não foi possível baixar o material. Verifique sua internet.");
  }

  if (!resposta.ok) {
    aba?.close();
    const json = await resposta.json().catch(() => null);
    throw new Error(json?.message ?? "Não foi possível baixar o material.");
  }

  const url = URL.createObjectURL(await resposta.blob());

  if (aba) {
    aba.location.href = url;
  } else {
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo(material);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  // Libera a memória depois de um tempo.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
