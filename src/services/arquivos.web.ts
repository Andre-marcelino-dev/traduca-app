// Baixar e abrir arquivos protegidos no navegador (versão web do arquivos.ts).
import { AtividadeResumo, Material, sessao } from "@/services/api";

// "Apostila de inglês" + "pdf" → "Apostila_de_ingl_s.pdf".
function montarNome(titulo: string, reserva: string, extensao: string | null) {
  const nome = titulo.replace(/[^\w\-]+/g, "_") || reserva;
  return extensao ? `${nome}.${extensao}` : nome;
}

export function nomeArquivo(material: Material) {
  return montarNome(material.titulo, `material_${material.id_material}`, material.extensao);
}

// Baixa com o token do aluno. "ver" abre numa nova aba; "baixar" salva no computador.
async function abrirArquivoProtegido(url: string, nome: string, modo: "ver" | "baixar") {
  // Abre a aba já no clique, para o navegador não bloquear como pop-up.
  const aba = modo === "ver" ? window.open("", "_blank") : null;

  let resposta: Response;
  try {
    resposta = await fetch(url, {
      headers: { Accept: "*/*", Authorization: `Bearer ${sessao.token}` },
    });
  } catch {
    aba?.close();
    throw new Error("Não foi possível baixar o arquivo. Verifique sua internet.");
  }

  if (!resposta.ok) {
    aba?.close();
    const json = await resposta.json().catch(() => null);
    throw new Error(json?.message ?? "Não foi possível baixar o arquivo.");
  }

  const endereco = URL.createObjectURL(await resposta.blob());

  if (aba) {
    aba.location.href = endereco;
  } else {
    const link = document.createElement("a");
    link.href = endereco;
    link.download = nome;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  // Libera a memória depois de um tempo.
  setTimeout(() => URL.revokeObjectURL(endereco), 60_000);
}

export function abrirMaterial(material: Material, modo: "ver" | "baixar") {
  return abrirArquivoProtegido(material.url_download, nomeArquivo(material), modo);
}

// Áudio da atividade: no navegador abre numa nova aba, que já toca o áudio.
export function ouvirAudioAtividade(atividade: AtividadeResumo) {
  if (!atividade.url_audio) throw new Error("Esta atividade não tem áudio.");
  const nome = montarNome(atividade.titulo, `atividade_${atividade.id_atividade}`, atividade.extensao_audio);
  return abrirArquivoProtegido(atividade.url_audio, nome, "ver");
}
