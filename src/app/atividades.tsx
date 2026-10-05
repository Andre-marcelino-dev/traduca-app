import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

import BarraProgresso from "@/components/barra-progresso";
import CircularProgress from "@/components/circular-progress";
import EstadoVazio from "@/components/estado-vazio";
import TelaComAbas from "@/components/tela-com-abas";
import {
  AtividadeResumo,
  buscarAtividades,
  buscarCursos,
  Curso,
  formatarData,
  StatusAtividade,
} from "@/services/api";
import atividadesStyles from "@/styles/atividadesStyles";
import { cores } from "@/styles/variaveis";

const filtros = ["Pendentes", "Todas", "Concluídas"] as const;
type Filtro = (typeof filtros)[number];

const statusInfo: Record<StatusAtividade, { texto: string; cor: string }> = {
  pendente: { texto: "Pendente", cor: cores.laranja },
  enviada: { texto: "Enviada", cor: cores.azul },
  corrigida: { texto: "Corrigida", cor: cores.verde },
};

// Ícone do card pela categoria cadastrada pelo professor.
const iconePorCategoria: Record<string, number> = {
  AUDIO: require("@/assets/images/imgIcon/fone-atividade.png"),
  FALA: require("@/assets/images/imgIcon/microfone-atividade.png"),
  LEITURA: require("@/assets/images/imgIcon/livro-atividade.png"),
};
const iconePadrao = require("@/assets/images/imgIcon/atividade.png");

// Nota 8.5 → "8,5".
const textoNota = (nota: number) => String(nota).replace(".", ",");

export default function AtividadesScreen() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [atividades, setAtividades] = useState<AtividadeResumo[]>([]);
  const [idCurso, setIdCurso] = useState<number | null>(null);
  const [filtroSelecionado, setFiltroSelecionado] = useState<Filtro>("Todas");
  const [maisRecentesPrimeiro, setMaisRecentesPrimeiro] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Busca os dados toda vez que a tela aparece (ex.: ao voltar depois de responder).
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        try {
          const [listaCursos, dados] = await Promise.all([buscarCursos(), buscarAtividades()]);
          setCursos(listaCursos);
          setAtividades(dados.atividades);
          setErro(listaCursos.length === 0 ? "Você ainda não está matriculado em nenhum curso." : "");
        } catch (e) {
          setErro(e instanceof Error ? e.message : "Não foi possível carregar as atividades.");
        } finally {
          setCarregando(false);
        }
      }
      carregar();
    }, [])
  );

  // Idioma escolhido (ou o primeiro curso do aluno).
  const cursoAtual = cursos.find((c) => c.id_curso === idCurso) ?? cursos[0];
  const doCurso = atividades.filter((a) => a.id_curso === cursoAtual?.id_curso);
  const concluidas = doCurso.filter((a) => a.concluida).length;
  const percentual = doCurso.length > 0 ? Math.round((concluidas / doCurso.length) * 100) : 0;

  const visiveis = doCurso
    .filter((a) =>
      filtroSelecionado === "Pendentes" ? !a.concluida : filtroSelecionado === "Concluídas" ? a.concluida : true
    )
    .sort((a, b) => {
      const ordem = (a.data_entrega ?? "9999").localeCompare(b.data_entrega ?? "9999");
      return maisRecentesPrimeiro ? -ordem : ordem;
    });

  return (
    <TelaComAbas titulo="Atividades" subtitulo="Faça ou revise suas atividades">
      {carregando && <ActivityIndicator size="large" color={cores.azul} />}

      {!carregando && erro ? (
        <EstadoVazio icone={require("@/assets/images/imgIcon/atividades-azul.png")} texto={erro} />
      ) : null}

      {!carregando && !erro && cursoAtual && (
      <>
      <Text style={atividadesStyles.secaoTitulo}>Escolha o idioma</Text>

      <View style={atividadesStyles.idiomasLinha}>
        {cursos.map((curso) => {
          const selecionado = curso.id_curso === cursoAtual.id_curso;

          return (
            <Pressable
              key={curso.id_curso}
              style={[
                atividadesStyles.idiomaPill,
                selecionado && atividadesStyles.idiomaPillSelecionado,
              ]}
              onPress={() => setIdCurso(curso.id_curso)}
            >
              <Text
                style={[
                  atividadesStyles.idiomaPillTexto,
                  selecionado && atividadesStyles.idiomaPillTextoSelecionado,
                ]}
              >
                {curso.nome_curso}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={atividadesStyles.filtrosLinha}>
        {filtros.map((filtro) => {
          const selecionado = filtro === filtroSelecionado;

          return (
            <Pressable
              key={filtro}
              style={[
                atividadesStyles.filtroPill,
                selecionado && atividadesStyles.filtroPillSelecionado,
              ]}
              onPress={() => setFiltroSelecionado(filtro)}
            >
              {filtro === "Concluídas" && (
                <Image
                  source={require("@/assets/images/imgIcon/check.png")}
                  style={[
                    atividadesStyles.filtroPillIcone,
                    selecionado && atividadesStyles.filtroPillIconeSelecionado,
                  ]}
                />
              )}
              <Text
                style={[
                  atividadesStyles.filtroPillTexto,
                  selecionado && atividadesStyles.filtroPillTextoSelecionado,
                ]}
              >
                {filtro}
              </Text>
            </Pressable>
          );
        })}

        {/* Inverte a ordem pela data de entrega */}
        <Pressable
          style={atividadesStyles.btnFiltroIcone}
          onPress={() => setMaisRecentesPrimeiro((atual) => !atual)}
        >
          <Image
            source={require("@/assets/images/imgIcon/filtro-azul.png")}
            style={[
              atividadesStyles.iconeFiltro,
              maisRecentesPrimeiro && { transform: [{ rotate: "180deg" }] },
            ]}
          />
        </Pressable>
      </View>

      <View style={atividadesStyles.cardProgresso}>
        <CircularProgress
          porcentagem={percentual}
          tamanho={72}
          espessura={7}
          corProgresso={cores.azul}
          corTrilha={cores.cinza}
        >
          <Text style={atividadesStyles.progressoNumero}>
            {concluidas}/{doCurso.length}
          </Text>
          <Text style={atividadesStyles.progressoLegendaAnel}>concluídas</Text>
        </CircularProgress>

        <View style={atividadesStyles.progressoColuna}>
          <Text style={atividadesStyles.progressoTitulo}>
            Progresso geral das atividades
          </Text>
          <Text style={atividadesStyles.progressoSubtitulo}>
            {doCurso.length > 0 && concluidas === doCurso.length
              ? "Todas as atividades feitas!"
              : "Continue evoluindo!"}
          </Text>
          <BarraProgresso porcentagem={percentual} cor={cores.verde} />
        </View>
      </View>

      <Text style={atividadesStyles.secaoTitulo}>Suas atividades</Text>

      {visiveis.length === 0 && (
        <EstadoVazio
          icone={require("@/assets/images/imgIcon/atividades-azul.png")}
          texto={
            filtroSelecionado === "Pendentes"
              ? "Nenhuma atividade pendente."
              : filtroSelecionado === "Concluídas"
                ? "Nenhuma atividade concluída ainda."
                : "O professor ainda não publicou atividades para este idioma."
          }
        />
      )}

      {visiveis.map((atividade) => {
        const cor = atividade.categoria?.cor ?? cores.azul;
        const status = statusInfo[atividade.status];
        const subtitulo = atividade.finalidade ?? atividade.categoria?.label ?? atividade.descricao;

        return (
          <View key={atividade.id_atividade} style={atividadesStyles.atividadeCard}>
            <View style={[atividadesStyles.atividadeIconeBox, { backgroundColor: `${cor}22` }]}>
              <Image
                source={iconePorCategoria[atividade.categoria?.codigo ?? ""] ?? iconePadrao}
                style={atividadesStyles.atividadeIcone}
                resizeMode="contain"
              />
            </View>

            <View style={atividadesStyles.atividadeCorpo}>
              <View style={atividadesStyles.atividadeTopo}>
                <View style={{ flex: 1 }}>
                  <Text style={atividadesStyles.atividadeTitulo}>{atividade.titulo}</Text>
                  {subtitulo ? (
                    <Text style={atividadesStyles.atividadeSubtitulo}>{subtitulo}</Text>
                  ) : null}
                </View>

                <View style={[atividadesStyles.statusBadge, { backgroundColor: `${status.cor}22` }]}>
                  <Text style={[atividadesStyles.statusBadgeTexto, { color: status.cor }]}>
                    {status.texto}
                    {atividade.nota !== null ? ` · ${textoNota(atividade.nota)}` : ""}
                  </Text>
                </View>
              </View>

              {atividade.professor ? (
                <View style={atividadesStyles.atividadeLinhaInfo}>
                  <Image
                    source={require("@/assets/images/imgIcon/professor.png")}
                    style={atividadesStyles.atividadeLinhaIcone}
                  />
                  <Text style={atividadesStyles.atividadeLinhaTexto}>
                    Professor {atividade.professor}
                  </Text>
                </View>
              ) : null}

              {atividade.data_entrega ? (
                <View style={atividadesStyles.atividadeLinhaInfo}>
                  <Image
                    source={require("@/assets/images/imgIcon/calendario-azul.png")}
                    style={atividadesStyles.atividadeLinhaIcone}
                  />
                  <Text style={atividadesStyles.atividadeLinhaTexto}>
                    Entrega: {formatarData(atividade.data_entrega)}
                  </Text>
                </View>
              ) : null}

              <View style={atividadesStyles.atividadeRodape}>
                <Pressable
                  style={atividadesStyles.btnAbrir}
                  onPress={() =>
                    router.navigate({ pathname: "/atividade", params: { id: atividade.id_atividade } })
                  }
                >
                  <Text style={atividadesStyles.txtBtnAbrir}>Abrir</Text>
                </Pressable>
              </View>
            </View>
          </View>
        );
      })}
      </>
      )}
    </TelaComAbas>
  );
}
