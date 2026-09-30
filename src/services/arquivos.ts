// Baixar e abrir materiais no celular (Android/iOS).
// A versão do navegador fica em arquivos.web.ts.
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { Material, sessao } from "@/services/api";

export function nomeArquivo(material: Material) {
  const nome = material.titulo.replace(/[^\w\-]+/g, "_") || `material_${material.id_material}`;
  return material.extensao ? `${nome}.${material.extensao}` : nome;
}

// No celular, "ver" e "baixar" fazem o mesmo: baixam o arquivo com o token
// e abrem a janela "Abrir com..." para o aluno escolher o app (leitor de PDF, player etc.).
export async function abrirMaterial(material: Material, _modo: "ver" | "baixar") {
  let arquivo: File;
  try {
    arquivo = await File.downloadFileAsync(
      material.url_download,
      new File(Paths.cache, nomeArquivo(material)),
      {
        headers: { Accept: "*/*", Authorization: `Bearer ${sessao.token}` },
        idempotent: true,
      }
    );
  } catch {
    throw new Error("Não foi possível baixar o material. Verifique sua internet.");
  }

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(arquivo.uri, { dialogTitle: material.titulo });
  }
}
