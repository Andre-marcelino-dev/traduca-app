import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { ActivityIndicator, Image, Linking, Pressable, Text, View } from "react-native";

import BandeiraIdioma, { IdiomaId } from "@/components/bandeira-idioma";
import EstadoVazio from "@/components/estado-vazio";
import TelaComAbas from "@/components/tela-com-abas";
import { Agenda, AulaAgenda, buscarAgenda } from "@/services/api";
import agendaStyles from "@/styles/agendaStyles";
import { cores } from "@/styles/variaveis";

// "Inglês" → "ingles"; idioma sem bandeira cadastrada → null.
function idiomaDoCurso(nomeCurso: string | null): IdiomaId | null {
  if (!nomeCurso) return null;
  const nome = nomeCurso.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  if (nome.includes("ingles")) return "ingles";
  if (nome.includes("portugues")) return "portugues";
  if (nome.includes("italiano")) return "italiano";
  return null;
}

const diasAbrev = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const diasSemanaCompleto = [
  "domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado",
];
const doisDigitos = (n: number) => String(n).padStart(2, "0");

function dataLocal(dataISO: string): Date {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

// "2026-07-28" + "12:00" → "28/07/2026 às 12:00".
function dataHoraCompleta(aula: AulaAgenda): string {
  if (!aula.data) return "Data a definir";
  const [ano, mes, dia] = aula.data.split("-");
  const base = `${dia}/${mes}/${ano}`;
  return aula.hora ? `${base} às ${aula.hora}` : base;
}

// "2026-07-28" + "12:00" → "Hoje · 12:00" / "Quinta · 14:00" / "28/07 · 12:00".
function dataResumida(aula: AulaAgenda, hoje: Date): string {
  if (!aula.data) return "Data a definir";
  const data = dataLocal(aula.data);
  const diffDias = Math.round((data.getTime() - hoje.getTime()) / 86400000);

  let quando: string;
  if (diffDias === 0) quando = "Hoje";
  else if (diffDias === 1) quando = "Amanhã";
  else if (diffDias > 1 && diffDias < 7) quando = diasSemanaCompleto[data.getDay()].replace(/^./, (c) => c.toUpperCase());
  else quando = `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}`;

  return aula.hora ? `${quando} · ${aula.hora}` : quando;
}

const filtros = ["Hoje", "Semana", "Todas", "Concluídas"] as const;
type Filtro = (typeof filtros)[number];

export default function AgendaScreen() {
  const [dados, setDados] = useState<Agenda | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroLink, setErroLink] = useState("");
  const [filtroSelecionado, setFiltroSelecionado] = useState<Filtro>("Hoje");

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        try {
          setDados(await buscarAgenda());
          setErro("");
        } catch (e) {
          setErro(e instanceof Error ? e.message : "Não foi possível carregar a agenda.");
        } finally {
          setCarregando(false);
        }
      }
      carregar();
    }, [])
  );

  async function entrarNaAula(aula: AulaAgenda) {
    setErroLink("");
    if (!aula.link_aula) {
      setErroLink("O professor ainda não cadastrou o link desta aula.");
      return;
    }
    try {
      await Linking.openURL(aula.link_aula);
    } catch {
      setErroLink("Não foi possível abrir o link da aula.");
    }
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diaDaSemana = hoje.getDay(); // 0 = domingo
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - diaDaSemana);

  const semana = Array.from({ length: 7 }, (_, i) => {
    const data = new Date(inicioSemana);
    data.setDate(inicioSemana.getDate() + i);
    return data;
  });

  const aulas = dados?.aulas ?? [];
  const proxima = dados?.proxima_aula ?? null;

  const aulasFiltradas = aulas.filter((aula) => {
    if (filtroSelecionado === "Todas") return true;
    if (filtroSelecionado === "Concluídas") return aula.concluida;
    if (!aula.data) return false;
    const data = dataLocal(aula.data);
    if (filtroSelecionado === "Hoje") return data.getTime() === hoje.getTime();
    // Semana
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);
    return data.getTime() >= inicioSemana.getTime() && data.getTime() <= fimSemana.getTime();
  });

  const mesesNomes = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];

  return (
    <TelaComAbas titulo="Agenda" subtitulo="Gerencie suas aulas com a agenda">
      {carregando && <ActivityIndicator size="large" color={cores.azul} />}

      {!carregando && erro ? (
        <EstadoVazio icone={require("@/assets/images/imgIcon/calendario-azul.png")} texto={erro} />
      ) : null}

      {!carregando && !erro && (
        <>
          {/* Próxima aula */}
          {proxima ? (
            <View style={agendaStyles.cardDestaque}>
              <View style={agendaStyles.cardDestaqueTopo}>
                <Text style={agendaStyles.cardDestaqueLabel}>Próxima aula</Text>

                {proxima.duracao_minutos ? (
                  <View style={agendaStyles.duracaoBadge}>
                    <Image
                      source={require("@/assets/images/imgIcon/relogio-azul.png")}
                      style={agendaStyles.duracaoBadgeIcone}
                    />
                    <Text style={agendaStyles.duracaoBadgeTexto}>{proxima.duracao_minutos} min</Text>
                  </View>
                ) : null}
              </View>

              <View style={agendaStyles.cardDestaqueCorpo}>
                {idiomaDoCurso(proxima.curso) && (
                  <View style={{ marginRight: 12 }}>
                    <BandeiraIdioma idioma={idiomaDoCurso(proxima.curso)!} />
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <Text style={agendaStyles.cardDestaqueTitulo}>{proxima.titulo}</Text>

                  <View style={agendaStyles.cardDestaqueLinhaInfo}>
                    <Image
                      source={require("@/assets/images/imgIcon/calendario-azul.png")}
                      style={agendaStyles.cardDestaqueLinhaIcone}
                    />
                    <Text style={agendaStyles.cardDestaqueLinhaTexto}>{dataHoraCompleta(proxima)}</Text>
                  </View>

                  <View style={agendaStyles.cardDestaqueLinhaInfo}>
                    <Image
                      source={require("@/assets/images/imgIcon/professor.png")}
                      style={agendaStyles.cardDestaqueLinhaIcone}
                    />
                    <Text style={agendaStyles.cardDestaqueLinhaTexto}>
                      {proxima.professor ? `Prof. ${proxima.professor}` : "Professor a definir"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={agendaStyles.cardDestaqueBotoes}>
                <Pressable style={agendaStyles.btnEntrar} onPress={() => entrarNaAula(proxima)}>
                  <Image
                    source={require("@/assets/images/imgIcon/play.png")}
                    style={agendaStyles.iconeBtnEntrar}
                  />
                  <Text style={agendaStyles.txtBtnEntrar}>Entrar na aula</Text>
                </Pressable>

                <Pressable style={agendaStyles.btnReagendar}>
                  <Image
                    source={require("@/assets/images/imgIcon/calendario-azul.png")}
                    style={agendaStyles.iconeBtnReagendar}
                  />
                  <Text style={agendaStyles.txtBtnReagendar}>Reagendar</Text>
                </Pressable>
              </View>

              {erroLink ? (
                <Text
                  style={[
                    agendaStyles.cardDestaqueLinhaTexto,
                    { textAlign: "center", marginTop: 8 },
                  ]}
                >
                  {erroLink}
                </Text>
              ) : null}
            </View>
          ) : (
            <EstadoVazio
              icone={require("@/assets/images/imgIcon/calendario-azul.png")}
              texto="Nenhuma aula agendada no momento."
            />
          )}

          {/* Calendário */}
          <View style={agendaStyles.secaoTitulo}>
            <View style={agendaStyles.secaoTituloEsquerda}>
              <Image
                source={require("@/assets/images/imgIcon/calendario-azul.png")}
                style={agendaStyles.secaoTituloIcone}
              />
              <Text style={agendaStyles.secaoTituloTexto}>Calendário</Text>
            </View>
          </View>

          <View style={agendaStyles.semanaLinha}>
            {semana.map((data) => {
              const selecionado = data.getTime() === hoje.getTime();

              return (
                <View
                  key={data.toISOString()}
                  style={[agendaStyles.diaItem, selecionado && agendaStyles.diaItemSelecionado]}
                >
                  <Text
                    style={[
                      agendaStyles.diaAbreviacao,
                      selecionado && agendaStyles.diaAbreviacaoSelecionada,
                    ]}
                  >
                    {diasAbrev[data.getDay()]}
                  </Text>
                  <Text
                    style={[
                      agendaStyles.diaNumero,
                      selecionado && agendaStyles.diaNumeroSelecionado,
                    ]}
                  >
                    {doisDigitos(data.getDate())}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Filtros */}
          <View style={agendaStyles.filtrosLinha}>
            {filtros.map((filtro) => {
              const selecionado = filtro === filtroSelecionado;

              return (
                <Pressable
                  key={filtro}
                  style={[agendaStyles.filtroPill, selecionado && agendaStyles.filtroPillSelecionado]}
                  onPress={() => setFiltroSelecionado(filtro)}
                >
                  {filtro === "Hoje" && (
                    <Image
                      source={require("@/assets/images/imgIcon/relogio-azul.png")}
                      style={agendaStyles.filtroPillIcone}
                    />
                  )}
                  <Text
                    style={[
                      agendaStyles.filtroPillTexto,
                      selecionado && agendaStyles.filtroPillTextoSelecionado,
                    ]}
                  >
                    {filtro}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Aulas do dia/período */}
          <View style={[agendaStyles.secaoTitulo, { marginBottom: 8 }]}>
            <Text style={agendaStyles.secaoTituloTexto}>
              {filtroSelecionado === "Hoje" && `Hoje · ${hoje.getDate()} de ${mesesNomes[hoje.getMonth()]}`}
              {filtroSelecionado === "Semana" && "Esta semana"}
              {filtroSelecionado === "Todas" && "Todas as aulas"}
              {filtroSelecionado === "Concluídas" && "Aulas concluídas"}
            </Text>
          </View>

          {aulasFiltradas.length === 0 && (
            <Text style={agendaStyles.aulaCardLinhaTexto}>Nenhuma aula neste período.</Text>
          )}

          {aulasFiltradas.map((aula) => {
            const idioma = idiomaDoCurso(aula.curso);
            const ativa = aula.id_aula === proxima?.id_aula;

            return (
              <View key={aula.id_aula} style={agendaStyles.aulaCard}>
                <View style={agendaStyles.aulaCardTopo}>
                  <View style={{ marginRight: 12 }}>
                    {idioma ? (
                      <BandeiraIdioma idioma={idioma} tamanho={40} />
                    ) : null}
                  </View>

                  <View style={agendaStyles.aulaCardCabecalho}>
                    <View>
                      <Text style={agendaStyles.aulaCardTitulo}>{aula.titulo}</Text>

                      <View style={agendaStyles.aulaCardLinhaInfo}>
                        <Image
                          source={require("@/assets/images/imgIcon/relogio-azul.png")}
                          style={agendaStyles.aulaCardLinhaIcone}
                        />
                        <Text style={agendaStyles.aulaCardLinhaTexto}>{dataResumida(aula, hoje)}</Text>
                      </View>

                      <View style={agendaStyles.aulaCardLinhaInfo}>
                        <Image
                          source={require("@/assets/images/imgIcon/professor.png")}
                          style={agendaStyles.aulaCardLinhaIcone}
                        />
                        <Text style={agendaStyles.aulaCardLinhaTexto}>
                          {aula.professor ?? "Professor a definir"}
                        </Text>
                      </View>
                    </View>

                    {aula.concluida ? (
                      <Text style={[agendaStyles.aulaCardSala, { color: cores.verde }]}>Concluída</Text>
                    ) : null}
                  </View>
                </View>

                {ativa ? (
                  <View style={agendaStyles.aulaCardBotoes}>
                    <Pressable style={agendaStyles.btnEntrarPequeno} onPress={() => entrarNaAula(aula)}>
                      <Text style={agendaStyles.txtBtnEntrarPequeno}>Entrar</Text>
                    </Pressable>
                    <Pressable style={agendaStyles.btnReagendarPequeno}>
                      <Text style={agendaStyles.txtBtnReagendarPequeno}>Reagendar</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            );
          })}
        </>
      )}
    </TelaComAbas>
  );
}
