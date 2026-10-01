import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "https://traduca.adminfo.dev.br/api/v1";

const CHAVE_TOKEN = "@traduca:token";
const CHAVE_ALUNO = "@traduca:aluno";

export type Aluno = {
  id_aluno: number;
  nome_aluno: string;
  email_aluno: string;
  foto_aluno: string;
};

export async function salvarSessao(token: string, aluno: Aluno) {
  await AsyncStorage.multiSet([
    [CHAVE_TOKEN, token],
    [CHAVE_ALUNO, JSON.stringify(aluno)],
  ]);
}

export async function obterToken() {
  return AsyncStorage.getItem(CHAVE_TOKEN);
}

export async function obterAlunoSalvo(): Promise<Aluno | null> {
  const json = await AsyncStorage.getItem(CHAVE_ALUNO);
  return json ? JSON.parse(json) : null;
}

export async function encerrarSessao() {
  await AsyncStorage.multiRemove([CHAVE_TOKEN, CHAVE_ALUNO]);
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const token = await obterToken();

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  });

  const texto = await resposta.text();
  const json = texto ? JSON.parse(texto) : null;

  if (!resposta.ok) {
    throw new ApiError(resposta.status, json?.message ?? "Não foi possível completar a solicitação.");
  }

  return json as T;
}

export function urlFotoAluno(fotoAluno: string) {
  return `https://traduca.adminfo.dev.br/traducaidiomas/alunos/${fotoAluno}`;
}

export function formatarDuracao(minutos: number | null) {
  if (minutos === null) return "";

  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  if (horas === 0) return `${resto}min`;
  if (resto === 0) return `${horas}h`;
  return `${horas}h${String(resto).padStart(2, "0")}`;
}
