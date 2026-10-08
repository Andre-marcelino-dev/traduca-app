// Comunicação do app com a API do Traduca (backend Laravel).
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { apagarToken, guardarToken, lerToken } from "@/services/cofre";
import { esquecerCursoEscolhido } from "@/services/curso-escolhido";

export const API_URL = "https://traduca.adminfo.dev.br/api/v1";

// Chave onde os dados do aluno (nome, e-mail, foto) ficam salvos no aparelho.
// O token NÃO fica aqui: no celular ele vai para o cofre (ver cofre.ts).
const CHAVE_SESSAO = "traduca_sessao";

export type Aluno = {
  id_aluno: number;
  nome_aluno: string;
  email_aluno: string;
  foto_aluno: string | null;
};

// Sessão do aluno logado. Fica na memória e também salva no aparelho,
// para não se perder quando a página recarrega ou o app é fechado.
export const sessao: { token: string | null; aluno: Aluno | null } = {
  token: null,
  aluno: null,
};

async function salvarSessao() {
  if (sessao.token) await guardarToken(sessao.token);
  try {
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify({ aluno: sessao.aluno }));
  } catch {}
}

async function limparSessao() {
  sessao.token = null;
  sessao.aluno = null;
  await apagarToken();
  await esquecerCursoEscolhido();
  try {
    await AsyncStorage.removeItem(CHAVE_SESSAO);
  } catch {}
}

// Chamado ao abrir o app: recupera o login salvo e atualiza os dados do aluno.
export async function carregarSessao() {
  let salvo: { token?: string | null; aluno?: Aluno | null } = {};
  try {
    salvo = JSON.parse((await AsyncStorage.getItem(CHAVE_SESSAO)) ?? "{}");
  } catch {}

  sessao.aluno = salvo.aluno ?? null;
  sessao.token = await lerToken();

  // Versão antiga do app guardava o token junto com os dados: muda para o cofre.
  if (!sessao.token && salvo.token) {
    sessao.token = salvo.token;
    await salvarSessao();
  }

  if (!sessao.token) return;

  try {
    const resposta = await fetch(`${API_URL}/aluno/me`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${sessao.token}` },
    });
    if (resposta.status === 401) {
      await limparSessao(); // token vencido: pede login de novo
      return;
    }
    const json = await resposta.json();
    if (json?.success) {
      sessao.aluno = json.data;
      await salvarSessao();
    }
  } catch {
    // sem internet: segue com os dados salvos
  }
}

// Mensagem quando o site recusa o token (401): a do site, se ele explicou o
// motivo (ex.: cadastro inativo); senão, login vencido.
function mensagemSaida(json: { success?: boolean; message?: string } | null): string {
  return json?.success === false && json.message
    ? json.message
    : "Sua sessão expirou. Faça login novamente.";
}

// Sair da conta: apaga o token no servidor e o login salvo no aparelho.
export async function logoutAluno() {
  if (sessao.token) {
    try {
      await fetch(`${API_URL}/aluno/logout`, {
        method: "POST",
        headers: { Accept: "application/json", Authorization: `Bearer ${sessao.token}` },
      });
    } catch {
      // sem internet: apaga só no aparelho (o token vence sozinho em 30 dias)
    }
  }
  await limparSessao();
}

// Busca dados da API usando o token do aluno logado.
async function apiGet<T>(caminho: string): Promise<T> {
  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${sessao.token}` },
    });
  } catch {
    throw new Error("Sem conexão com o servidor. Verifique sua internet.");
  }

  const json = await resposta.json().catch(() => null);

  if (resposta.status === 401) {
    // Login vencido ou apagado: volta para a tela de login.
    await limparSessao();
    router.replace("/");
    throw new Error(mensagemSaida(json));
  }
  if (!resposta.ok || !json?.success) {
    throw new Error(json?.message ?? "Não foi possível carregar os dados.");
  }
  return json.data as T;
}

export type Curso = {
  id_curso: number;
  nome_curso: string;
  id_nivel: number;
  nome_nivel: string;
};

export type ModuloResumo = {
  id_modulo: number;
  ordem_modulo: number;
  nome_modulo: string;
  descricao_modulo: string | null;
  carga_horaria_minutos: number;
  total_aulas: number;
  aulas_concluidas: number;
  total_materiais: number;
  materiais_concluidos: number;
  percentual: number;
  concluido: boolean;
  liberado: boolean;
  em_andamento: boolean;
};

export type CursoModulos = {
  curso: string;
  nivel: string;
  carga_horaria_minutos: number;
  total_modulos: number;
  total_aulas: number;
  aulas_concluidas: number;
  percentual_geral: number;
  modulos: ModuloResumo[];
};

// Cursos com matrícula ativa do aluno.
export function buscarCursos() {
  return apiGet<Curso[]>("/aluno/cursos");
}

// Dados da tela Curso: carga horária, progresso e lista de módulos.
export function buscarModulosCurso(idCurso: number) {
  return apiGet<CursoModulos>(`/aluno/cursos/${idCurso}/modulos`);
}

export type Aula = {
  id_aula: number;
  numero: number;
  titulo: string;
  descricao: string | null;
  data: string | null;
  hora: string | null;
  duracao_minutos: number | null;
  ao_vivo: boolean;
  link_aula: string | null;
  professor: string | null;
  presenca: "presente" | "falta" | "justificado" | null;
  concluida: boolean;
};

export type ModuloDetalhe = {
  curso: string;
  nivel: string;
  modulo: {
    id_modulo: number;
    ordem_modulo: number;
    nome_modulo: string;
    descricao_modulo: string | null;
    carga_horaria_minutos: number;
  };
  progresso: {
    total_aulas: number;
    aulas_concluidas: number;
    total_materiais: number;
    materiais_concluidos: number;
    percentual: number;
    concluido: boolean;
  };
  proximo_modulo: { id_modulo: number; nome_modulo: string; liberado: boolean } | null;
  aulas: Aula[];
};

// Dados da tela Módulo: informações, progresso e lista de aulas.
export function buscarModulo(idModulo: string | number) {
  return apiGet<ModuloDetalhe>(`/aluno/modulos/${idModulo}`);
}

export type Material = {
  id_material: number;
  titulo: string;
  descricao: string | null;
  id_modulo: number;
  nome_modulo: string;
  ordem_modulo: number;
  tem_arquivo: boolean;
  extensao: string | null;
  tamanho_bytes: number | null;
  concluido: boolean;
  url_download: string;
};

// Materiais de apoio do curso (todos os módulos liberados).
export function buscarMateriais(idCurso: number) {
  return apiGet<Material[]>(`/aluno/cursos/${idCurso}/materiais`);
}

// 2400000 → "2,4 MB"; 8000 → "8 KB"; null → "".
export function formatarTamanho(bytes: number | null): string {
  if (bytes === null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

// Envia dados pra API usando o token do aluno logado.
// FormData (envio de arquivo, ex.: foto) vai como formulário; o resto como JSON.
async function apiEnviar<T>(metodo: "POST" | "PUT", caminho: string, corpo: unknown): Promise<T> {
  const ehFormulario = corpo instanceof FormData;
  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: {
        Accept: "application/json",
        ...(ehFormulario ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${sessao.token}`,
      },
      body: ehFormulario ? corpo : JSON.stringify(corpo),
    });
  } catch {
    throw new Error("Sem conexão com o servidor. Verifique sua internet.");
  }

  const json = await resposta.json().catch(() => null);

  if (resposta.status === 401) {
    await limparSessao();
    router.replace("/");
    throw new Error(mensagemSaida(json));
  }
  if (!resposta.ok || !json?.success) {
    throw new Error(json?.message ?? "Não foi possível completar a solicitação.");
  }
  return json as T;
}

function apiPost<T>(caminho: string, corpo: unknown) {
  return apiEnviar<T>("POST", caminho, corpo);
}

function apiPut<T>(caminho: string, corpo: unknown) {
  return apiEnviar<T>("PUT", caminho, corpo);
}

export type Perfil = Aluno & {
  telefone_aluno: string | null;
  data_nasc_aluno: string | null;
  status_aluno: string | null;
  cursos: { id_curso: number; nome_curso: string | null; nome_nivel: string | null }[];
};

// Tela Perfil: dados do aluno + idioma/nível dos cursos.
export function buscarPerfil() {
  return apiGet<Perfil>("/aluno/perfil");
}

// Atualiza nome/e-mail/foto na sessão (Home, Config e Perfil leem daqui).
async function atualizarAlunoNaSessao(aluno: Aluno) {
  sessao.aluno = aluno;
  await salvarSessao();
}

// Troca o e-mail (pede a senha atual). Devolve a mensagem de sucesso.
export async function alterarEmail(email: string, senhaAtual: string): Promise<string> {
  const resposta = await apiPut<{ message: string; data: Aluno }>("/aluno/perfil/email", {
    email_aluno: email,
    senha_atual: senhaAtual,
  });
  await atualizarAlunoNaSessao(resposta.data);
  return resposta.message;
}

// Modal "Alterar senha". Os outros aparelhos do aluno são desconectados.
export async function alterarSenha(
  senhaAtual: string,
  novaSenha: string,
  confirmacao: string
): Promise<string> {
  const resposta = await apiPut<{ message: string }>("/aluno/perfil/senha", {
    senha_atual: senhaAtual,
    nova_senha: novaSenha,
    nova_senha_confirmation: confirmacao,
  });
  return resposta.message;
}

// Envia a foto escolhida (uri do celular, ou o File no navegador).
export async function enviarFoto(foto: {
  uri: string;
  nome: string;
  tipo: string;
  arquivoWeb?: Blob;
}): Promise<string> {
  const formulario = new FormData();
  if (foto.arquivoWeb) {
    formulario.append("foto_aluno", foto.arquivoWeb, foto.nome);
  } else {
    // No celular o React Native aceita { uri, name, type } no lugar do arquivo.
    formulario.append("foto_aluno", { uri: foto.uri, name: foto.nome, type: foto.tipo } as unknown as Blob);
  }
  const resposta = await apiPost<{ message: string; data: Aluno }>("/aluno/perfil/foto", formulario);
  await atualizarAlunoNaSessao(resposta.data);
  return resposta.message;
}

export type AulaAgenda = {
  id_aula: number;
  titulo: string;
  curso: string | null;
  data: string | null;
  hora: string | null;
  duracao_minutos: number | null;
  ao_vivo: boolean;
  link_aula: string | null;
  professor: string | null;
  concluida: boolean;
};

export type Agenda = {
  proxima_aula: AulaAgenda | null;
  aulas: AulaAgenda[];
};

// Dados da tela Agenda: aulas de todos os cursos matriculados, em ordem.
export function buscarAgenda() {
  return apiGet<Agenda>("/aluno/agenda");
}

// Modal "Solicitar reagendamento". Devolve a mensagem de sucesso da API.
export async function solicitarReagendamento(idAula: number, motivo: string): Promise<string> {
  const resposta = await apiPost<{ message: string }>("/aluno/reagendamento/solicitar", {
    aula_id: idAula,
    motivo,
  });
  return resposta.message;
}

export type StatusAtividade = "pendente" | "enviada" | "corrigida";

export type AtividadeResumo = {
  id_atividade: number;
  titulo: string;
  descricao: string | null;
  categoria: { codigo: string; label: string; cor: string } | null;
  finalidade: string | null;
  id_curso: number;
  curso: string | null;
  professor: string | null;
  data_entrega: string | null;
  tem_audio: boolean;
  url_audio: string | null;
  extensao_audio: string | null;
  total_questoes: number;
  status: StatusAtividade;
  concluida: boolean;
  nota: number | null;
};

export type ListaAtividades = {
  total: number;
  concluidas: number;
  pendentes: number;
  atividades: AtividadeResumo[];
};

export type QuestaoAtividade = {
  id_questao: number;
  numero: number;
  enunciado: string;
  tipo: "multipla_escolha" | "texto";
  opcoes: { letra: string; texto: string }[];
  resposta_aluno: string | null;
  correta: boolean | null;
};

export type AtividadeDetalhe = AtividadeResumo & {
  feedback_professor: string | null;
  data_envio: string | null;
  pode_responder: boolean;
  questoes: QuestaoAtividade[];
};

// Tela Atividades: atividades de todos os cursos matriculados + resumo.
export function buscarAtividades() {
  return apiGet<ListaAtividades>("/aluno/atividades");
}

// Abrir uma atividade (questões, resposta do aluno e correção).
export function buscarAtividade(id: string | number) {
  return apiGet<AtividadeDetalhe>(`/aluno/atividades/${id}`);
}

// Envia as respostas ({ id_questao: "B" | "texto" }). Devolve a mensagem de sucesso.
export async function responderAtividade(id: number, respostas: Record<number, string>) {
  const resposta = await apiPost<{ message: string }>(`/aluno/atividades/${id}/responder`, { respostas });
  return resposta.message;
}

export type Duvida = {
  id_duvida: number;
  assunto: string;
  mensagem: string;
  resposta_professor: string | null;
  status: "pendente" | "respondida";
  criado_em: string | null;
  respondido_em: string | null;
};

// Tela Dúvida: lista as dúvidas que o aluno já enviou.
export function buscarDuvidas() {
  return apiGet<Duvida[]>("/aluno/duvidas");
}

// Envia uma nova dúvida ao professor. Devolve a dúvida criada.
export async function enviarDuvida(assunto: string, mensagem: string): Promise<Duvida> {
  const resposta = await apiPost<{ message: string; data: Duvida }>("/aluno/duvidas", {
    assunto_duvida: assunto,
    mensagem_duvida: mensagem,
  });
  return resposta.data;
}

export type Desempenho = {
  curso: string | null;
  nivel: string | null;
  presenca: {
    total_aulas: number;
    presentes: number;
    faltas: number;
    justificadas: number;
    percentual: number;
  };
  materiais: {
    total: number;
    vistos: number;
    percentual: number;
  };
  minutos_estudados: number;
  ultimas_presencas: {
    id_presenca: number;
    data: string | null;
    aula_titulo: string | null;
    status: "presente" | "falta" | "justificado";
    justificativa: { status: "pendente" | "aceita" | "recusada"; resposta_professor: string | null } | null;
  }[];
};

// Tela Desempenho: presença, materiais vistos e minutos estudados do curso.
export function buscarDesempenho(idCurso: number) {
  return apiGet<Desempenho>(`/aluno/cursos/${idCurso}/desempenho`);
}

// Aluno justifica uma falta. Devolve a mensagem de sucesso da API.
export async function justificarFalta(idPresenca: number, motivo: string): Promise<string> {
  const resposta = await apiPost<{ message: string }>(`/aluno/presencas/${idPresenca}/justificar`, {
    motivo_justificativa: motivo,
  });
  return resposta.message;
}

// "2026-07-30" → "30/07/2026".
export function formatarData(data: string | null): string {
  if (!data) return "";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Nome do módulo para a tela: se já foi cadastrado como "Módulo 01: ...", usa como está;
// senão monta "Módulo Fundamentos 01".
export function tituloModulo(nome: string, ordem: number): string {
  if (/^m[oó]dulo\b/i.test(nome.trim())) return nome.trim();
  return `Módulo ${nome} ${String(ordem).padStart(2, "0")}`;
}

// "1 aula" / "2 aulas".
export function textoAulas(quantidade: number): string {
  return quantidade === 1 ? "1 aula" : `${quantidade} aulas`;
}

// Transforma minutos em texto: 150 → "2h30", 120 → "2h", 45 → "45min".
export function formatarDuracao(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m}min`;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

// Endereço da foto do aluno logado (ou null se ele não tiver foto).
export function fotoAlunoUrl(): string | null {
  const foto = sessao.aluno?.foto_aluno;
  return foto ? `https://traduca.adminfo.dev.br/traducaidiomas/alunos/${foto}` : null;
}

// Primeiro nome do aluno logado, para as saudações.
export function primeiroNomeAluno(): string {
  return sessao.aluno?.nome_aluno.trim().split(" ")[0] || "Aluno";
}

export async function loginAluno(email: string, senha: string): Promise<Aluno> {
  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}/aluno/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_aluno: email, senha_aluno: senha }),
    });
  } catch {
    throw new Error("Sem conexão com o servidor. Verifique sua internet.");
  }

  const json = await resposta.json().catch(() => null);

  if (resposta.status === 429) {
    throw new Error("Muitas tentativas. Aguarde um minuto e tente novamente.");
  }
  if (!resposta.ok || !json?.success) {
    throw new Error(json?.message ?? "Email ou senha inválidos.");
  }

  sessao.token = json.data.token;
  sessao.aluno = json.data.aluno;
  await salvarSessao();
  return json.data.aluno;
}
