import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { ActivityIndicator, Image, Linking, Pressable, Text, View } from "react-native";

import BandeiraDesenho from "@/components/bandeira-desenho";
import BandeiraIdioma, { IdiomaId } from "@/components/bandeira-idioma";
import CircularProgress from "@/components/circular-progress";
import EstadoVazio from "@/components/estado-vazio";
import TelaComAbas from "@/components/tela-com-abas";
import {
  Aula,
  buscarCursos,
  buscarModulo,
  buscarModulosCurso,
  Curso,
  CursoModulos,
  ModuloDetalhe,
  primeiroNomeAluno,
} from "@/services/api";
import aulasStyles from "@/styles/aulasStyles";
import { cores } from "@/styles/variaveis";

// "Inglês" → "ingles"; idioma sem bandeira cadastrada → null.
function idiomaDoCurso(nomeCurso: string): IdiomaId | null {
  const nome = nomeCurso.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  if (nome.includes("ingles")) return "ingles";
  if (nome.includes("portugues")) return "portugues";
  if (nome.includes("italiano")) return "italiano";
  return null;
}

// "2026-12-12" + "18:00" → "Hoje, 18:00" / "12/12, 18:00".
function dataDaAula(aula: Aula): string {
  if (!aula.data) return "Data a definir";
  const [ano, mes, dia] = aula.data.split("-");
  const hoje = new Date();
  const ehHoje =
    Number(ano) === hoje.getFullYear() &&
    Number(mes) === hoje.getMonth() + 1 &&
    Number(dia) === hoje.getDate();
  const quando = ehHoje ? "Hoje" : `${dia}/${mes}`;
  return aula.hora ? `${quando}, ${aula.hora}` : quando;
}

const doisDigitos = (n: number) => String(n).padStart(2, "0");

export default function AulasScreen() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  // Curso escolhido pelo aluno (null = o primeiro) e o que está sendo mostrado.
  const [idCurso, setIdCurso] = useState<number | null>(null);
  const [idMostrado, setIdMostrado] = useState<number | null>(null);
  const [curso, setCurso] = useState<CursoModulos | null>(null);
  const [modulo, setModulo] = useState<ModuloDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroLink, setErroLink] = useState("");

  // Busca os dados toda vez que a tela aparece ou o aluno troca de idioma.
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        try {
          const lista = await buscarCursos();
          setCursos(lista);
          if (lista.length === 0) {
            setErro("Você ainda não está matriculado em nenhum curso.");
            return;
          }

          const atual = lista.find((c) => c.id_curso === idCurso) ?? lista[0];
          setIdMostrado(atual.id_curso);

          const dadosCurso = await buscarModulosCurso(atual.id_curso);
          setCurso(dadosCurso);

          // Módulo em que o aluno está (ou o último, se já concluiu tudo).
          const moduloAtual =
            dadosCurso.modulos.find((m) => m.em_andamento) ??
            [...dadosCurso.modulos].reverse().find((m) => m.liberado);
          setModulo(moduloAtual ? await buscarModulo(moduloAtual.id_modulo) : null);
          setErro("");
        } catch (e) {
          setErro(e instanceof Error ? e.message : "Não foi possível carregar as aulas.");
        } finally {
          setCarregando(false);
        }
      }
      carregar();
    }, [idCurso])
  );

  const cursoAtual = cursos.find((c) => c.id_curso === idMostrado);
  const idioma = cursoAtual ? idiomaDoCurso(cursoAtual.nome_curso) : null;
  const pendentes = (modulo?.aulas ?? []).filter((a) => !a.concluida);
  const proxima = pendentes[0] ?? null;
  const professor = proxima?.professor ?? modulo?.aulas.find((a) => a.professor)?.professor;
  const idModulo = modulo?.modulo.id_modulo;
  // Aqui o círculo conta só as aulas (igual aos números ao lado dele).
  // A tela Curso mostra o progresso geral, que também conta os materiais.
  const percentualAulas =
    curso && curso.total_aulas > 0
      ? Math.round((curso.aulas_concluidas / curso.total_aulas) * 100)
      : 0;

  function abrirModulo() {
    if (idModulo) router.navigate({ pathname: "/curso-modulo", params: { id: idModulo } });
  }

  async function entrarNaAula() {
    setErroLink("");
    if (!proxima?.link_aula) {
      setErroLink("O professor ainda não cadastrou o link desta aula.");
      return;
    }
    try {
      await Linking.openURL(proxima.link_aula);
    } catch {
      setErroLink("Não foi possível abrir o link da aula.");
    }
  }

  return (
    <TelaComAbas titulo={`Seja bem-vindo(a) ${primeiroNomeAluno()}!`}>
      {carregando && <ActivityIndicator size="large" color={cores.azul} />}

      {!carregando && erro ? (
        <EstadoVazio icone={require("@/assets/images/imgIcon/aula-azul.png")} texto={erro} />
      ) : null}

      {!carregando && !erro && curso && cursoAtual && (
      <>
      {/* Card da aula atual */}
      <View style={aulasStyles.cardAulaAtual}>
        <View style={aulasStyles.cardAulaAtualTopo}>
          {idioma && (
            <View style={{ marginRight: 12 }}>
              <BandeiraIdioma idioma={idioma} />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={aulasStyles.idiomaAtual}>{cursoAtual.nome_curso}</Text>
            <View style={aulasStyles.nivelBadge}>
              <Text style={aulasStyles.nivelBadgeTexto}>{cursoAtual.nome_nivel}</Text>
            </View>
          </View>

          <Pressable style={aulasStyles.btnAvancarCard} onPress={abrirModulo}>
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
            <Text style={aulasStyles.infoPillTexto}>
              {professor ? `Prof° ${professor}` : "Professor a definir"}
            </Text>
          </View>

          <View style={aulasStyles.infoPill}>
            <Image
              source={require("@/assets/images/imgIcon/relogio-azul.png")}
              style={aulasStyles.infoPillIcone}
            />
            <Text style={aulasStyles.infoPillTexto}>
              {proxima ? `Próxima aula\n${dataDaAula(proxima)}` : "Nenhuma aula\npendente"}
            </Text>
          </View>
        </View>

        {proxima && (
          <Pressable style={aulasStyles.btnEntrarAula} onPress={entrarNaAula}>
            <Image
              source={require("@/assets/images/imgIcon/play.png")}
              style={aulasStyles.iconeEntrarAula}
            />
            <Text style={aulasStyles.txtEntrarAula}>Entrar na aula</Text>
          </Pressable>
        )}

        {erroLink ? (
          <Text style={[aulasStyles.infoPillTexto, { color: cores.branco, textAlign: "center", marginTop: 8 }]}>
            {erroLink}
          </Text>
        ) : null}
      </View>

      {/* Progresso do curso */}
      <View style={aulasStyles.secaoTitulo}>
        <Text style={aulasStyles.secaoTituloTexto}>Progresso do curso</Text>
        <Pressable onPress={() => router.navigate("/curso")}>
          <Text style={aulasStyles.secaoLink}>Ver Detalhes</Text>
        </Pressable>
      </View>

      <View style={aulasStyles.cardProgresso}>
        <CircularProgress
          porcentagem={percentualAulas}
          tamanho={72}
          espessura={7}
          corProgresso={cores.verde}
          corTrilha={cores.azulClaro}
        >
          <Text style={aulasStyles.progressoTextoCentral}>{percentualAulas}%</Text>
        </CircularProgress>

        <View style={aulasStyles.progressoColuna}>
          <Text style={aulasStyles.progressoTitulo}>
            {curso.total_aulas > 0 && percentualAulas === 100
              ? "Todas as aulas concluídas!"
              : "Continue evoluindo!"}
          </Text>

          <View style={aulasStyles.progressoStatsLinha}>
            <View>
              <Text style={[aulasStyles.progressoStatNumero, { color: cores.verde }]}>
                {curso.aulas_concluidas}
              </Text>
              <Text style={aulasStyles.progressoStatLegenda}>aulas concluídas</Text>
            </View>

            <View style={aulasStyles.progressoDivisor} />

            <View>
              <Text style={[aulasStyles.progressoStatNumero, { color: cores.branco }]}>
                {Math.max(curso.total_aulas - curso.aulas_concluidas, 0)}
              </Text>
              <Text style={aulasStyles.progressoStatLegenda}>aulas restantes</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Próximas aulas (do módulo em que o aluno está) */}
      <View style={aulasStyles.secaoTitulo}>
        <Text style={aulasStyles.secaoTituloTexto}>Próximas aulas</Text>
        {idModulo ? (
          <Pressable onPress={abrirModulo}>
            <Text style={aulasStyles.secaoLink}>Ver Todas</Text>
          </Pressable>
        ) : null}
      </View>

      {pendentes.length === 0 && (
        <Text style={aulasStyles.proximaAulaSubtitulo}>
          Nenhuma aula pendente no momento.
        </Text>
      )}

      {pendentes.slice(0, 3).map((aula) => (
        <Pressable key={aula.id_aula} style={aulasStyles.cardProximaAula} onPress={abrirModulo}>
          {idioma && (
            <View style={{ marginRight: 12 }}>
              <BandeiraIdioma idioma={idioma} />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={aulasStyles.proximaAulaTitulo}>
              Aula {doisDigitos(aula.numero)} - {aula.titulo}
            </Text>
            <Text style={aulasStyles.proximaAulaSubtitulo}>
              {aula.duracao_minutos ? `${aula.duracao_minutos} min · ` : ""}
              {dataDaAula(aula)}
            </Text>
          </View>

          <Image
            source={require("@/assets/images/imgIcon/voltar-azul.png")}
            style={aulasStyles.iconeAvancarLista}
          />
        </Pressable>
      ))}

      {/* Selecione o idioma (só aparece se o aluno tiver mais de um curso) */}
      {cursos.length > 1 && (
        <>
          <View style={[aulasStyles.secaoTitulo, { marginBottom: 12 }]}>
            <Text style={aulasStyles.secaoTituloTexto}>Selecione o idioma</Text>
          </View>

          <View style={aulasStyles.idiomasLinha}>
            {cursos.map((c) => {
              const selecionado = c.id_curso === idMostrado;
              const id = idiomaDoCurso(c.nome_curso);

              return (
                <Pressable
                  key={c.id_curso}
                  style={[aulasStyles.cardIdioma, selecionado && aulasStyles.cardIdiomaSelecionado]}
                  onPress={() => setIdCurso(c.id_curso)}
                >
                  <View style={aulasStyles.cardIdiomaBandeira}>
                    {id ? (
                      <BandeiraDesenho idioma={id} largura={48} altura={32} />
                    ) : (
                      <Text style={aulasStyles.cardIdiomaBandeiraEmoji}>
                        {c.nome_curso.charAt(0)}
                      </Text>
                    )}
                  </View>
                  <Text style={aulasStyles.cardIdiomaTexto}>{c.nome_curso}</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}
      </>
      )}
    </TelaComAbas>
  );
}
