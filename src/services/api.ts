// Comunicação do app com a API do Traduca (backend Laravel).
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const API_URL = "https://traduca.adminfo.dev.br/api/v1";

// Chave onde o login fica salvo no aparelho (vale 30 dias, igual ao token).
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
  try {
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  } catch {}
}

async function limparSessao() {
  sessao.token = null;
  sessao.aluno = null;
  try {
    await AsyncStorage.removeItem(CHAVE_SESSAO);
  } catch {}
}

// Chamado ao abrir o app: recupera o login salvo e atualiza os dados do aluno.
export async function carregarSessao() {
  try {
    const salvo = await AsyncStorage.getItem(CHAVE_SESSAO);
    if (salvo) Object.assign(sessao, JSON.parse(salvo));
  } catch {}

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
    throw new Error("Sua sessão expirou. Faça login novamente.");
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
  concluido: boolean;
  url_download: string;
};

// Materiais de apoio do curso (todos os módulos liberados).
export function buscarMateriais(idCurso: number) {
  return apiGet<Material[]>(`/aluno/cursos/${idCurso}/materiais`);
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
