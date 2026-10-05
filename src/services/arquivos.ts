// Baixar e abrir arquivos protegidos no celular (Android/iOS).
// A versão do navegador fica em arquivos.web.ts.
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { AtividadeResumo, Material, sessao } from "@/services/api";

// "Apostila de inglês" + "pdf" → "Apostila_de_ingl_s.pdf".
function montarNome(titulo: string, reserva: string, extensao: string | null) {
  const nome = titulo.replace(/[^\w\-]+/g, "_") || reserva;
  return extensao ? `${nome}.${extensao}` : nome;
}

export function nomeArquivo(material: Material) {
  return montarNome(material.titulo, `material_${material.id_material}`, material.extensao);
}

// Baixa o arquivo com o token e abre a janela "Abrir com..." para o aluno
// escolher o app (leitor de PDF, player de áudio etc.).
async function abrirArquivoProtegido(url: string, nome: string, titulo: string) {
  let arquivo: File;
  try {
    arquivo = await File.downloadFileAsync(url, new File(Paths.cache, nome), {
      headers: { Accept: "*/*", Authorization: `Bearer ${sessao.token}` },
      idempotent: true,
    });
  } catch {
    throw new Error("Não foi possível baixar o arquivo. Verifique sua internet.");
  }

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(arquivo.uri, { dialogTitle: titulo });
  }
}

// No celular, "ver" e "baixar" fazem o mesmo.
export function abrirMaterial(material: Material, _modo: "ver" | "baixar") {
  return abrirArquivoProtegido(material.url_download, nomeArquivo(material), material.titulo);
}

export function ouvirAudioAtividade(atividade: AtividadeResumo) {
  if (!atividade.url_audio) throw new Error("Esta atividade não tem áudio.");
  const nome = montarNome(atividade.titulo, `atividade_${atividade.id_atividade}`, atividade.extensao_audio);
  return abrirArquivoProtegido(atividade.url_audio, nome, atividade.titulo);
}
