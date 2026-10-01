import { useState } from "react";

import { Image, Pressable, Text, View } from "react-native";

import BandeiraIdioma, { IdiomaId } from "@/components/bandeira-idioma";
import CircularProgress from "@/components/circular-progress";
import ModalMatricula from "@/components/modal-matricula";
import TelaComAbas from "@/components/tela-com-abas";
import aulasStyles from "@/styles/aulasStyles";
import { cores } from "@/styles/variaveis";

const idiomas = [
  { id: "ingles", label: "Inglês", emoji: "🇺🇸", matriculado: true },
  { id: "portugues", label: "Português", emoji: "🇧🇷", matriculado: false },
  {
    id: "italiano",
    label: "Italiano",
    icone: require("@/assets/images/imgIcon/bandeira-talia.png"),
    matriculado: false,
  },
] as const;

type DadosCurso = {
  nivel: string;
  professor: string;
  proximaAulaData: string;
  aulasConcluidas: number;
  aulasRestantes: number;
  progressoPercentual: number;
  proximaAulaTitulo: string;
  proximaAulaDuracao: string;
};

const dadosCursoPorIdioma: Partial<Record<IdiomaId, DadosCurso>> = {
  ingles: {
    nivel: "Básico II",
    professor: "Prof° Renata Cantero",
    proximaAulaData: "Hoje, 18:30",
    aulasConcluidas: 18,
    aulasRestantes: 22,
    progressoPercentual: 75,
    proximaAulaTitulo: "Aula 19 - Verb To Be",
    proximaAulaDuracao: "15 - 30 min",
  },
};

export default function AulasScreen() {
  const [idiomaSelecionado, setIdiomaSelecionado] = useState<IdiomaId>("ingles");
  const [idiomaModal, setIdiomaModal] = useState<string | null>(null);

  const curso = dadosCursoPorIdioma[idiomaSelecionado];
  const idiomaLabel = idiomas.find((idioma) => idioma.id === idiomaSelecionado)?.label ?? "";

  function selecionarIdioma(idioma: (typeof idiomas)[number]) {
    if (idioma.matriculado) {
      setIdiomaSelecionado(idioma.id);
    } else {
      setIdiomaModal(idioma.label);
    }
  }

  return (
    <TelaComAbas titulo="Seja bem-vindo(a) Aluno(a)!">
      {curso && (
        <>
          {/* Card da aula atual */}
          <View style={aulasStyles.cardAulaAtual}>
            <View style={aulasStyles.cardAulaAtualTopo}>
              <View style={{ marginRight: 12 }}>
                <BandeiraIdioma idioma={idiomaSelecionado} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={aulasStyles.idiomaAtual}>{idiomaLabel}</Text>
                <View style={aulasStyles.nivelBadge}>
                  <Text style={aulasStyles.nivelBadgeTexto}>{curso.nivel}</Text>
                </View>
              </View>

              <Pressable style={aulasStyles.btnAvancarCard}>
                <Image
                  source={require("@/assets/images/imgIcon/voltar-azul.png")}
                  style={[aulasStyles.iconeAvancarCard, { tintColor: cores.branco }]}
                />
              </Pressable>
            </View>

            <View style={aulasStyles.infoPillsLinha}>
              <View style={aulasStyles.infoPill}>
                <Image
                  source={require("@/assets/images/imgIcon/professor.png")}
                  style={aulasStyles.infoPillIcone}
                />
                <Text style={aulasStyles.infoPillTexto}>{curso.professor}</Text>
              </View>

              <View style={aulasStyles.infoPill}>
                <Image
                  source={require("@/assets/images/imgIcon/relogio-azul.png")}
                  style={aulasStyles.infoPillIcone}
                />
                <Text style={aulasStyles.infoPillTexto}>
                  Próxima aula{"\n"}
                  {curso.proximaAulaData}
                </Text>
              </View>
            </View>

            <Pressable style={aulasStyles.btnEntrarAula}>
              <Image
                source={require("@/assets/images/imgIcon/play.png")}
                style={aulasStyles.iconeEntrarAula}
              />
              <Text style={aulasStyles.txtEntrarAula}>Entrar na aula</Text>
            </Pressable>

            <View style={aulasStyles.paginacao}>
              <View style={[aulasStyles.ponto, aulasStyles.pontoAtivo]} />
              <View style={aulasStyles.ponto} />
              <View style={aulasStyles.ponto} />
            </View>
          </View>

          {/* Progresso do curso */}
          <View style={aulasStyles.secaoTitulo}>
            <Text style={aulasStyles.secaoTituloTexto}>Progresso do curso</Text>
            <Pressable>
              <Text style={aulasStyles.secaoLink}>Ver Detalhes</Text>
            </Pressable>
          </View>

          <View style={aulasStyles.cardProgresso}>
            <CircularProgress
              porcentagem={curso.progressoPercentual}
              tamanho={72}
              espessura={7}
              corProgresso={cores.verde}
              corTrilha={cores.azulClaro}
            >
              <Text style={aulasStyles.progressoTextoCentral}>{curso.progressoPercentual}%</Text>
            </CircularProgress>

            <View style={aulasStyles.progressoColuna}>
              <Text style={aulasStyles.progressoTitulo}>Continue evoluindo!</Text>

              <View style={aulasStyles.progressoStatsLinha}>
                <View>
                  <Text style={[aulasStyles.progressoStatNumero, { color: cores.verde }]}>
                    {curso.aulasConcluidas}
                  </Text>
                  <Text style={aulasStyles.progressoStatLegenda}>aulas concluídas</Text>
                </View>

                <View style={aulasStyles.progressoDivisor} />

                <View>
                  <Text style={[aulasStyles.progressoStatNumero, { color: cores.branco }]}>
                    {curso.aulasRestantes}
                  </Text>
                  <Text style={aulasStyles.progressoStatLegenda}>aulas restantes</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Próximas aulas */}
          <View style={aulasStyles.secaoTitulo}>
            <Text style={aulasStyles.secaoTituloTexto}>Próximas aulas</Text>
            <Pressable>
              <Text style={aulasStyles.secaoLink}>Ver Todas</Text>
            </Pressable>
          </View>

          <Pressable style={aulasStyles.cardProximaAula}>
            <View style={{ marginRight: 12 }}>
              <BandeiraIdioma idioma={idiomaSelecionado} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={aulasStyles.proximaAulaTitulo}>{curso.proximaAulaTitulo}</Text>
              <Text style={aulasStyles.proximaAulaSubtitulo}>{curso.proximaAulaDuracao}</Text>
            </View>

            <Image
              source={require("@/assets/images/imgIcon/voltar-azul.png")}
              style={aulasStyles.iconeAvancarLista}
            />
          </Pressable>
        </>
      )}

      {/* Selecione o idioma */}
      <View style={[aulasStyles.secaoTitulo, { marginBottom: 12 }]}>
        <Text style={aulasStyles.secaoTituloTexto}>Selecione o idioma</Text>
      </View>

      <View style={aulasStyles.idiomasLinha}>
        {idiomas.map((idioma) => {
          const selecionado = idioma.id === idiomaSelecionado;

          return (
            <Pressable
              key={idioma.id}
              style={[
                aulasStyles.cardIdioma,
                selecionado && aulasStyles.cardIdiomaSelecionado,
              ]}
              onPress={() => selecionarIdioma(idioma)}
            >
              <View style={aulasStyles.cardIdiomaBandeira}>
                {"icone" in idioma ? (
                  <Image
                    source={idioma.icone}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={aulasStyles.cardIdiomaBandeiraEmoji}>
                    {idioma.emoji}
                  </Text>
                )}
              </View>
              <Text style={aulasStyles.cardIdiomaTexto}>{idioma.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ModalMatricula
        visible={idiomaModal !== null}
        idiomaLabel={idiomaModal ?? ""}
        onClose={() => setIdiomaModal(null)}
      />
    </TelaComAbas>
  );
}
