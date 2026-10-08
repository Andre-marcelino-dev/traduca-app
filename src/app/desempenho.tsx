import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

import CircularProgress from "@/components/circular-progress";
import EstadoVazio from "@/components/estado-vazio";
import ModalJustificarFalta from "@/components/modal-justificar-falta";
import SeletorCurso from "@/components/seletor-curso";
import TelaComAbas from "@/components/tela-com-abas";
import {
  AtividadeResumo,
  buscarAtividades,
  buscarCursos,
  buscarDesempenho,
  Curso,
  Desempenho,
  formatarData,
  formatarDuracao,
} from "@/services/api";
import { cursoDaLista, escolherCurso, lerCursoEscolhido } from "@/services/curso-escolhido";
import desempenhoStyles from "@/styles/desempenhoStyles";
import { cores } from "@/styles/variaveis";

const abas = ["Frequência", "Desempenho"] as const;
type Aba = (typeof abas)[number];

const iconePorCategoria: Record<string, number> = {
  GRAMATICA: require("@/assets/images/imgIcon/atividade.png"),
  AUDIO: require("@/assets/images/imgIcon/fone-atividade.png"),
  FALA: require("@/assets/images/imgIcon/microfone-atividade.png"),
  LEITURA: require("@/assets/images/imgIcon/livro-atividade.png"),
  ESCRITA: require("@/assets/images/imgIcon/atividade.png"),
  VOCABULARIO: require("@/assets/images/imgIcon/atividade.png"),
};

const statusPresencaInfo: Record<string, { texto: string; cor: string }> = {
  presente: { texto: "Presença", cor: cores.verde },
  falta: { texto: "Falta", cor: cores.vermelho },
  justificado: { texto: "Justificada", cor: cores.laranja },
};

const statusJustificativaTexto: Record<string, string> = {
  pendente: "Justificativa em análise",
  aceita: "Justificativa aceita",
  recusada: "Justificativa recusada",
};

export default function DesempenhoScreen() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [idCurso, setIdCurso] = useState<number | undefined>(undefined);
  const [dados, setDados] = useState<Desempenho | null>(null);
  const [atividadesCurso, setAtividadesCurso] = useState<AtividadeResumo[]>([]);
  const [abaSelecionada, setAbaSelecionada] = useState<Aba>("Frequência");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [faltaParaJustificar, setFaltaParaJustificar] = useState<
    Desempenho["ultimas_presencas"][number] | null
  >(null);

  const carregar = useCallback(async () => {
    try {
      const lista = await buscarCursos();
      setCursos(lista);
      if (lista.length === 0) {
        setDados(null);
        setErro("Você ainda não está matriculado em nenhum curso.");
        return;
      }
      const atual = cursoDaLista(lista, await lerCursoEscolhido())!;
      setIdCurso(atual.id_curso);

      const [desempenho, listaAtividades] = await Promise.all([
        buscarDesempenho(atual.id_curso),
        buscarAtividades(),
      ]);
      setDados(desempenho);
      setAtividadesCurso(listaAtividades.atividades.filter((a) => a.id_curso === atual.id_curso));
      setErro("");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível carregar o desempenho.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function trocarCurso(id: number) {
    if (id === idCurso) return;
    setIdCurso(id);
    setCarregando(true);
    await escolherCurso(id);
    await carregar();
  }

  const exerciciosEnviados = atividadesCurso.filter(
    (a) => a.status === "enviada" || a.status === "corrigida"
  ).length;

  const habilidades = Object.values(
    atividadesCurso.reduce<Record<string, { codigo: string; label: string; soma: number; total: number }>>(
      (acumulado, atividade) => {
        if (atividade.status !== "corrigida" || atividade.nota === null || !atividade.categoria) {
          return acumulado;
        }
        const { codigo, label } = atividade.categoria;
        if (!acumulado[codigo]) acumulado[codigo] = { codigo, label, soma: 0, total: 0 };
        acumulado[codigo].soma += atividade.nota;
        acumulado[codigo].total += 1;
        return acumulado;
      },
      {}
    )
  ).map((h) => ({ ...h, media: h.soma / h.total }));

  const mediaGeral =
    habilidades.length > 0
      ? habilidades.reduce((soma, h) => soma + h.media, 0) / habilidades.length
      : null;

  return (
    <TelaComAbas titulo="Desempenho geral" subtitulo="Analise seu progresso e desempenho">
      <SeletorCurso cursos={cursos} idSelecionado={idCurso} onEscolher={trocarCurso} />

      {carregando && <ActivityIndicator size="large" color={cores.azul} />}

      {!carregando && erro ? (
        <EstadoVazio icone={require("@/assets/images/imgIcon/trofeu-azul.png")} texto={erro} />
      ) : null}

      {!carregando && dados && (
        <>
          <View style={desempenhoStyles.cardProgressoGeral}>
            <View style={desempenhoStyles.progressoGeralTopo}>
              <Text style={desempenhoStyles.progressoGeralLabel}>Presença</Text>
              <Text style={desempenhoStyles.progressoGeralPorcentagem}>
                {dados.presenca.percentual}%
              </Text>
            </View>

            <View style={desempenhoStyles.barraTrilha}>
              <View
                style={[desempenhoStyles.barraPreenchimento, { width: `${dados.presenca.percentual}%` }]}
              />
            </View>

            <Text style={desempenhoStyles.progressoGeralTexto}>
              {dados.presenca.presentes + dados.presenca.justificadas} de {dados.presenca.total_aulas}{" "}
              {dados.presenca.total_aulas === 1 ? "aula com presença" : "aulas com presença"}
            </Text>
          </View>

          <Text style={desempenhoStyles.secaoTitulo}>Estatísticas</Text>

          <View style={desempenhoStyles.statsLinha}>
            <View style={desempenhoStyles.statCard}>
              <View style={[desempenhoStyles.statIconeBox, { backgroundColor: `${cores.azul}15` }]}>
                <Image
                  source={require("@/assets/images/imgIcon/aula-azul.png")}
                  style={desempenhoStyles.statIcone}
                  resizeMode="contain"
                />
              </View>
              <Text style={desempenhoStyles.statNumero}>
                {dados.presenca.presentes + dados.presenca.justificadas}
              </Text>
              <Text style={desempenhoStyles.statLegenda}>aulas realizadas</Text>
            </View>

            <View style={desempenhoStyles.statCard}>
              <View style={[desempenhoStyles.statIconeBox, { backgroundColor: `${cores.laranja}15` }]}>
                <Image
                  source={require("@/assets/images/imgIcon/tarefas-azul.png")}
                  style={desempenhoStyles.statIcone}
                  resizeMode="contain"
                />
              </View>
              <Text style={desempenhoStyles.statNumero}>{exerciciosEnviados}</Text>
              <Text style={desempenhoStyles.statLegenda}>exercícios enviados</Text>
            </View>

            <View style={desempenhoStyles.statCard}>
              <View style={[desempenhoStyles.statIconeBox, { backgroundColor: `${cores.roxo}15` }]}>
                <Image
                  source={require("@/assets/images/imgIcon/relogio-azul.png")}
                  style={desempenhoStyles.statIcone}
                  resizeMode="contain"
                />
              </View>
              <Text style={desempenhoStyles.statNumero}>
                {formatarDuracao(dados.minutos_estudados)}
              </Text>
              <Text style={desempenhoStyles.statLegenda}>estudados</Text>
            </View>
          </View>

          <Text style={desempenhoStyles.secaoTitulo}>Materiais</Text>

          <View style={desempenhoStyles.cardProgressoGeral}>
            <View style={desempenhoStyles.progressoGeralTopo}>
              <Text style={desempenhoStyles.progressoGeralLabel}>Materiais vistos</Text>
              <Text style={desempenhoStyles.progressoGeralPorcentagem}>
                {dados.materiais.percentual}%
              </Text>
            </View>

            <View style={desempenhoStyles.barraTrilha}>
              <View
                style={[desempenhoStyles.barraPreenchimento, { width: `${dados.materiais.percentual}%` }]}
              />
            </View>

            <Text style={desempenhoStyles.progressoGeralTexto}>
              {dados.materiais.vistos} de {dados.materiais.total}{" "}
              {dados.materiais.total === 1 ? "material visto" : "materiais vistos"}
            </Text>
          </View>

          <View style={desempenhoStyles.abasLinha}>
            {abas.map((aba) => {
              const selecionada = aba === abaSelecionada;

              return (
                <Pressable
                  key={aba}
                  style={[
                    desempenhoStyles.abaItem,
                    selecionada && desempenhoStyles.abaItemSelecionada,
                  ]}
                  onPress={() => setAbaSelecionada(aba)}
                >
                  <Text
                    style={[
                      desempenhoStyles.abaItemTexto,
                      selecionada && desempenhoStyles.abaItemTextoSelecionada,
                    ]}
                  >
                    {aba}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {abaSelecionada === "Frequência" ? (
            <View style={desempenhoStyles.cardResumo}>
              <View style={desempenhoStyles.cardResumoTopo}>
                <View style={desempenhoStyles.anelWrapper}>
                  <View style={desempenhoStyles.anelFundoBranco} />

                  <CircularProgress
                    porcentagem={dados.presenca.percentual}
                    tamanho={110}
                    espessura={9}
                    corProgresso={cores.verde}
                    corTrilha={`${cores.branco}40`}
                  >
                    <Text style={desempenhoStyles.resumoAnelNumero}>{dados.presenca.percentual}%</Text>
                    <Text style={desempenhoStyles.resumoAnelLegenda}>Presença</Text>
                  </CircularProgress>
                </View>

                <View style={desempenhoStyles.resumoLegendaColuna}>
                  <View style={desempenhoStyles.resumoLegendaItem}>
                    <View style={[desempenhoStyles.resumoLegendaBolinha, { backgroundColor: cores.verde }]} />
                    <Text style={desempenhoStyles.resumoLegendaTexto}>
                      Presenças ({dados.presenca.presentes})
                    </Text>
                  </View>

                  <View style={desempenhoStyles.resumoLegendaItem}>
                    <View style={[desempenhoStyles.resumoLegendaBolinha, { backgroundColor: cores.laranja }]} />
                    <Text style={desempenhoStyles.resumoLegendaTexto}>
                      Justificadas ({dados.presenca.justificadas})
                    </Text>
                  </View>

                  <View style={desempenhoStyles.resumoLegendaItem}>
                    <View style={[desempenhoStyles.resumoLegendaBolinha, { backgroundColor: cores.vermelho }]} />
                    <Text style={desempenhoStyles.resumoLegendaTexto}>
                      Faltas ({dados.presenca.faltas})
                    </Text>
                  </View>
                </View>
              </View>

              <View style={desempenhoStyles.resumoDivisor} />

              <Text style={desempenhoStyles.resumoSequenciaTitulo}>Últimas presenças</Text>

              {dados.ultimas_presencas.length === 0 && (
                <Text style={[desempenhoStyles.resumoSequenciaTexto, { marginTop: 8 }]}>
                  Nenhum registro de presença ainda.
                </Text>
              )}

              {dados.ultimas_presencas.map((presenca) => {
                const status = statusPresencaInfo[presenca.status];

                return (
                  <View key={presenca.id_presenca} style={desempenhoStyles.ultimaPresencaItem}>
                    <View style={desempenhoStyles.ultimaPresencaTextos}>
                      <Text style={desempenhoStyles.ultimaPresencaTitulo}>
                        {presenca.aula_titulo ?? "Aula"}
                      </Text>
                      <Text style={desempenhoStyles.ultimaPresencaData}>
                        {presenca.data ? formatarData(presenca.data) : ""} ·{" "}
                        <Text style={{ color: status.cor }}>{status.texto}</Text>
                      </Text>
                    </View>

                    {presenca.status === "falta" &&
                      (presenca.justificativa ? (
                        <Text style={desempenhoStyles.justificativaStatusTexto}>
                          {statusJustificativaTexto[presenca.justificativa.status]}
                        </Text>
                      ) : (
                        <Pressable
                          style={desempenhoStyles.btnJustificar}
                          onPress={() => setFaltaParaJustificar(presenca)}
                        >
                          <Text style={desempenhoStyles.txtBtnJustificar}>Justificar</Text>
                        </Pressable>
                      ))}
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={desempenhoStyles.cardResumo}>
              {habilidades.length === 0 ? (
                <Text style={desempenhoStyles.resumoSequenciaTexto}>
                  Assim que suas atividades forem corrigidas, suas notas por categoria aparecem aqui.
                </Text>
              ) : (
                <>
                  <View style={desempenhoStyles.habilidadesLinha}>
                    {habilidades.map((habilidade, indice) => (
                      <View
                        key={habilidade.codigo}
                        style={[
                          desempenhoStyles.habilidadeItem,
                          indice < habilidades.length - 1 && desempenhoStyles.habilidadeItemDivisor,
                        ]}
                      >
                        <Image
                          source={iconePorCategoria[habilidade.codigo] ?? iconePorCategoria.GRAMATICA}
                          style={desempenhoStyles.habilidadeIcone}
                          resizeMode="contain"
                        />
                        <Text style={desempenhoStyles.habilidadeLabel}>{habilidade.label}</Text>
                        <Text style={desempenhoStyles.habilidadeNota}>
                          {habilidade.media.toFixed(1)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={desempenhoStyles.resumoDivisor} />

                  <View style={desempenhoStyles.mediaGeralLinha}>
                    <View style={desempenhoStyles.mediaGeralEsquerda}>
                      <Text style={desempenhoStyles.mediaGeralEstrela}>★</Text>
                      <Text style={desempenhoStyles.mediaGeralLabel}>Média geral</Text>
                    </View>
                    <Text style={desempenhoStyles.mediaGeralNota}>{mediaGeral?.toFixed(1)}</Text>
                  </View>

                  {mediaGeral !== null && mediaGeral >= 9 && (
                    <View style={desempenhoStyles.parabensBox}>
                      <Text style={desempenhoStyles.parabensTexto}>
                        Excelente desempenho, parabéns!
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </>
      )}

      <ModalJustificarFalta
        visible={faltaParaJustificar !== null}
        falta={faltaParaJustificar}
        onClose={() => setFaltaParaJustificar(null)}
        onEnviado={carregar}
      />
    </TelaComAbas>
  );
}
