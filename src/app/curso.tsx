import { router } from "expo-router";
import { useEffect, useState } from "react";

import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

import BarraProgresso from "@/components/barra-progresso";
import TelaComAbas from "@/components/tela-com-abas";
import { apiFetch, ApiError, formatarDuracao } from "@/services/api";
import cursoStyles from "@/styles/cursoStyles";
import { cores } from "@/styles/variaveis";

type StatusModulo = "concluido" | "atual" | "bloqueado";

type CursoAluno = {
  id_curso: number;
  nome_curso: string;
  id_nivel: number;
  nome_nivel: string;
};

type ModuloApi = {
  id_modulo: number;
  ordem_modulo: number;
  nome_modulo: string;
  descricao_modulo: string;
  carga_horaria_minutos: number;
  total_aulas: number;
  aulas_concluidas: number;
  percentual: number;
  concluido: boolean;
  liberado: boolean;
  em_andamento: boolean;
};

type CursoModulosApi = {
  curso: string;
  nivel: string;
  carga_horaria_minutos: number;
  total_modulos: number;
  total_aulas: number;
  aulas_concluidas: number;
  percentual_geral: number;
  modulos: ModuloApi[];
};

const estiloPorStatus: Record<StatusModulo, object> = {
  concluido: cursoStyles.moduloCardConcluido,
  atual: cursoStyles.moduloCardAtual,
  bloqueado: cursoStyles.moduloCardBloqueado,
};

function statusDoModulo(modulo: ModuloApi): StatusModulo {
  if (modulo.concluido) return "concluido";
  if (!modulo.liberado) return "bloqueado";
  return "atual";
}

export default function CursoScreen() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [dados, setDados] = useState<CursoModulosApi | null>(null);

  useEffect(() => {
    carregarCurso();
  }, []);

  async function carregarCurso() {
    setCarregando(true);
    setErro("");

    try {
      const cursosResposta = await apiFetch<{ success: boolean; data: CursoAluno[] }>(
        "/aluno/cursos",
      );

      const curso = cursosResposta.data[0];

      if (!curso) {
        setDados(null);
        return;
      }

      const modulosResposta = await apiFetch<{ success: boolean; data: CursoModulosApi }>(
        `/aluno/cursos/${curso.id_curso}/modulos`,
      );

      setDados(modulosResposta.data);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        router.replace("/");
        return;
      }

      setErro(e instanceof ApiError ? e.message : "Sem conexão com o servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <TelaComAbas titulo="Curso" subtitulo="Visualize a carga horária e conteúdo do curso">
      <View style={cursoStyles.abasLinha}>
        <View style={[cursoStyles.abaItem, cursoStyles.abaItemSelecionada]}>
          <Text style={[cursoStyles.abaItemTexto, cursoStyles.abaItemTextoSelecionada]}>
            Curso
          </Text>
        </View>

        <Pressable style={cursoStyles.abaItem} onPress={() => router.navigate("/materiais")}>
          <Text style={cursoStyles.abaItemTexto}>Materiais</Text>
        </Pressable>
      </View>

      {carregando && (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator color={cores.azul} />
        </View>
      )}

      {!carregando && erro !== "" && (
        <View style={{ paddingVertical: 24, alignItems: "center" }}>
          <Text style={{ color: cores.vermelho, textAlign: "center", marginBottom: 12 }}>
            {erro}
          </Text>
          <Pressable onPress={carregarCurso}>
            <Text style={{ color: cores.azul, fontWeight: "bold" }}>Tentar novamente</Text>
          </Pressable>
        </View>
      )}

      {!carregando && erro === "" && !dados && (
        <View style={{ paddingVertical: 24, alignItems: "center" }}>
          <Text style={{ color: cores.cinzaEscuro, textAlign: "center" }}>
            Você ainda não está matriculado(a) em nenhum curso.
          </Text>
        </View>
      )}

      {!carregando && dados && (
        <>
          <View style={cursoStyles.cardCargaHoraria}>
            <View style={cursoStyles.cardCargaHorariaTopo}>
              <Text style={cursoStyles.cargaHorariaLabel}>Carga Horária:</Text>

              <View style={cursoStyles.cargaHorariaBadge}>
                <Image
                  source={require("@/assets/images/imgIcon/relogio-azul.png")}
                  style={cursoStyles.cargaHorariaBadgeIcone}
                />
                <Text style={cursoStyles.cargaHorariaBadgeTexto}>
                  {formatarDuracao(dados.carga_horaria_minutos)} total
                </Text>
              </View>
            </View>

            <Text style={cursoStyles.cargaHorariaResumo}>
              {dados.total_aulas} aulas · {dados.total_modulos} módulos
            </Text>

            <BarraProgresso porcentagem={dados.percentual_geral} cor={cores.azul} />
          </View>

          <Text style={cursoStyles.secaoTitulo}>Conteúdo do curso</Text>

          {dados.modulos.map((modulo) => {
            const status = statusDoModulo(modulo);

            return (
              <Pressable
                key={modulo.id_modulo}
                style={[cursoStyles.moduloCard, estiloPorStatus[status]]}
                disabled={status === "bloqueado"}
                onPress={() =>
                  router.navigate({
                    pathname: "/curso-modulo",
                    params: { modulo: String(modulo.id_modulo) },
                  })
                }
              >
                <View style={cursoStyles.moduloTopo}>
                  <Text
                    style={[
                      cursoStyles.moduloTitulo,
                      status === "bloqueado" && cursoStyles.moduloTituloBloqueado,
                    ]}
                  >
                    {modulo.nome_modulo}
                  </Text>

                  {status === "atual" && <Text style={cursoStyles.moduloTag}>Você está aqui</Text>}
                </View>

                <Text style={cursoStyles.moduloInfo}>
                  {modulo.total_aulas} aulas · {formatarDuracao(modulo.carga_horaria_minutos)}
                </Text>

                {status === "concluido" && (
                  <View style={cursoStyles.moduloStatusLinha}>
                    <Image
                      source={require("@/assets/images/imgIcon/check.png")}
                      style={cursoStyles.moduloStatusIcone}
                    />
                    <Text style={[cursoStyles.moduloStatusTexto, { color: cores.verde }]}>
                      Concluído
                    </Text>
                  </View>
                )}

                {status === "atual" && (
                  <View style={cursoStyles.moduloStatusLinha}>
                    <Image
                      source={require("@/assets/images/imgIcon/play.png")}
                      style={[cursoStyles.moduloStatusIcone, { tintColor: cores.azul }]}
                    />
                    <Text style={[cursoStyles.moduloStatusTexto, { color: cores.azul }]}>
                      Em andamento
                    </Text>
                  </View>
                )}

                {status === "bloqueado" && (
                  <Text style={cursoStyles.moduloBloqueadoTexto}>
                    Conclua o módulo anterior para avançar
                  </Text>
                )}
              </Pressable>
            );
          })}
        </>
      )}
    </TelaComAbas>
  );
}
