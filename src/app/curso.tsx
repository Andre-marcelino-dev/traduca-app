import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

import BarraProgresso from "@/components/barra-progresso";
import EstadoVazio from "@/components/estado-vazio";
import TelaComAbas from "@/components/tela-com-abas";
import {
  buscarCursos,
  buscarModulosCurso,
  CursoModulos,
  formatarDuracao,
  ModuloResumo,
  textoAulas,
  tituloModulo,
} from "@/services/api";
import cursoStyles from "@/styles/cursoStyles";
import { cores } from "@/styles/variaveis";

type StatusModulo = "concluido" | "atual" | "bloqueado";

const estiloPorStatus: Record<StatusModulo, object> = {
  concluido: cursoStyles.moduloCardConcluido,
  atual: cursoStyles.moduloCardAtual,
  bloqueado: cursoStyles.moduloCardBloqueado,
};

function statusDoModulo(modulo: ModuloResumo): StatusModulo {
  if (modulo.concluido) return "concluido";
  if (!modulo.liberado) return "bloqueado";
  return "atual";
}

export default function CursoScreen() {
  const [dados, setDados] = useState<CursoModulos | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Busca os dados toda vez que a tela aparece (inclusive ao voltar para ela),
  // para mostrar módulos novos e o progresso sempre atualizados.
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        try {
          const cursos = await buscarCursos();
          if (cursos.length === 0) {
            setDados(null);
            setErro("Você ainda não está matriculado em nenhum curso.");
            return;
          }
          // Mostra o primeiro curso ativo do aluno.
          setDados(await buscarModulosCurso(cursos[0].id_curso));
          setErro("");
        } catch (e) {
          setErro(e instanceof Error ? e.message : "Não foi possível carregar o curso.");
        } finally {
          setCarregando(false);
        }
      }
      carregar();
    }, [])
  );

  const modulos = (dados?.modulos ?? []).map((modulo) => ({
    id: modulo.id_modulo,
    titulo: tituloModulo(modulo.nome_modulo, modulo.ordem_modulo),
    aulas: modulo.total_aulas,
    duracao: formatarDuracao(modulo.carga_horaria_minutos),
    status: statusDoModulo(modulo),
  }));

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

      {carregando && <ActivityIndicator size="large" color={cores.azul} />}

      {!carregando && erro ? (
        <EstadoVazio
          icone={require("@/assets/images/imgIcon/curso-azul.png")}
          texto={erro}
        />
      ) : null}

      {dados && (
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
          {textoAulas(dados.total_aulas)} · {dados.total_modulos === 1 ? "1 módulo" : `${dados.total_modulos} módulos`}
        </Text>

        <BarraProgresso porcentagem={dados.percentual_geral} cor={cores.azul} />
      </View>

      <Text style={cursoStyles.secaoTitulo}>Conteúdo do curso</Text>

      {modulos.map((modulo) => (
        <Pressable
          key={modulo.id}
          style={[cursoStyles.moduloCard, estiloPorStatus[modulo.status]]}
          disabled={modulo.status === "bloqueado"}
          onPress={() =>
            router.navigate({ pathname: "/curso-modulo", params: { id: modulo.id } })
          }
        >
          <View style={cursoStyles.moduloTopo}>
            <Text
              style={[
                cursoStyles.moduloTitulo,
                modulo.status === "bloqueado" && cursoStyles.moduloTituloBloqueado,
              ]}
            >
              {modulo.titulo}
            </Text>

            {modulo.status === "atual" && (
              <Text style={cursoStyles.moduloTag}>Você está aqui</Text>
            )}
          </View>

          <Text style={cursoStyles.moduloInfo}>
            {textoAulas(modulo.aulas)} · {modulo.duracao}
          </Text>

          {modulo.status === "concluido" && (
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

          {modulo.status === "atual" && (
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

          {modulo.status === "bloqueado" && (
            <Text style={cursoStyles.moduloBloqueadoTexto}>
              Conclua o módulo anterior para avançar
            </Text>
          )}
        </Pressable>
      ))}
      </>
      )}
    </TelaComAbas>
  );
}
