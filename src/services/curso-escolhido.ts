// Idioma (curso) que o aluno escolheu ver. Vale para Aulas, Atividades, Curso e
// Materiais e fica salvo no aparelho: quem faz Inglês e Italiano escolhe uma vez.
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE = "traduca_curso_escolhido";

let escolhido: number | null = null;
let carregado = false;

export async function lerCursoEscolhido(): Promise<number | null> {
  if (!carregado) {
    try {
      const salvo = await AsyncStorage.getItem(CHAVE);
      escolhido = salvo ? Number(salvo) : null;
    } catch {}
    carregado = true;
  }
  return escolhido;
}

export async function escolherCurso(idCurso: number): Promise<void> {
  escolhido = idCurso;
  carregado = true;
  try {
    await AsyncStorage.setItem(CHAVE, String(idCurso));
  } catch {}
}

// Ao sair da conta (outro aluno pode entrar no mesmo aparelho).
export async function esquecerCursoEscolhido(): Promise<void> {
  escolhido = null;
  carregado = true;
  try {
    await AsyncStorage.removeItem(CHAVE);
  } catch {}
}

// O curso escolhido, se o aluno ainda estiver matriculado nele; senão o primeiro.
export function cursoDaLista<T extends { id_curso: number }>(
  cursos: T[],
  idCurso: number | null
): T | undefined {
  return cursos.find((c) => c.id_curso === idCurso) ?? cursos[0];
}
