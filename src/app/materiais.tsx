import { router } from "expo-router";
import { useEffect, useState } from "react";

import { ActivityIndicator, Alert, Image, Modal, Pressable, Text, View } from "react-native";

import TelaComAbas from "@/components/tela-com-abas";
import { apiFetch, ApiError } from "@/services/api";
import cursoStyles from "@/styles/cursoStyles";
import materiaisStyles from "@/styles/materiaisStyles";
import { cores } from "@/styles/variaveis";
import { abrirMaterial } from "@/utils/abrir-material";

const filtros = ["Todas", "PDF", "Áudios", "Vídeos"] as const;
type Filtro = (typeof filtros)[number];

type CursoAluno = {
  id_curso: number;
  nome_curso: string;
};

type ModuloResumo = {
  id_modulo: number;
  ordem_modulo: number;
  nome_modulo: string;
  em_andamento: boolean;
};

type MaterialApi = {
  id_material: number;
  titulo: string;
  descricao: string;
  id_modulo: number;
  nome_modulo: string;
  ordem_modulo: number;
  tem_arquivo: boolean;
  extensao: string | null;
  concluido: boolean;
  url_download: string;
};

type TipoMaterial = "pdf" | "audio" | "video" | "outro";

function tipoDoMaterial(extensao: string | null): TipoMaterial {
  const ext = extensao?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["mp3", "wav", "m4a", "aac", "ogg"].includes(ext)) return "audio";
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return "video";
  return "outro";
}

const iconePorTipo: Record<TipoMaterial, number> = {
  pdf: require("@/assets/images/imgIcon/arquivo.png"),
  audio: require("@/assets/images/imgIcon/audio.png"),
  video: require("@/assets/images/imgIcon/videoaula.png"),
  outro: require("@/assets/images/imgIcon/arquivo.png"),
};

const filtroPorTipo: Record<TipoMaterial, Filtro> = {
  pdf: "PDF",
  audio: "Áudios",
  video: "Vídeos",
  outro: "Todas",
};

export default function MateriaisScreen() {
  const [filtroSelecionado, setFiltroSelecionado] = useState<Filtro>("Todas");
  const [seletorAberto, setSeletorAberto] = useState(false);

  const [carregandoModulos, setCarregandoModulos] = useState(true);
  const [erroModulos, setErroModulos] = useState("");
  const [idCurso, setIdCurso] = useState<number | null>(null);
  const [modulos, setModulos] = useState<ModuloResumo[]>([]);
  const [moduloSelecionado, setModuloSelecionado] = useState<ModuloResumo | null>(null);

  const [carregandoMateriais, setCarregandoMateriais] = useState(false);
  const [erroMateriais, setErroMateriais] = useState("");
  const [materiais, setMateriais] = useState<MaterialApi[]>([]);

  useEffect(() => {
    carregarModulos();
  }, []);

  useEffect(() => {
    if (idCurso && moduloSelecionado) {
      carregarMateriais(idCurso, moduloSelecionado.id_modulo);
    }
  }, [idCurso, moduloSelecionado]);

  async function carregarModulos() {
    setCarregandoModulos(true);
    setErroModulos("");

    try {
      const cursosResposta = await apiFetch<{ success: boolean; data: CursoAluno[] }>(
        "/aluno/cursos",
      );

      const curso = cursosResposta.data[0];

      if (!curso) {
        setIdCurso(null);
        setModulos([]);
        return;
      }

      const modulosResposta = await apiFetch<{
        success: boolean;
        data: { modulos: ModuloResumo[] };
      }>(`/aluno/cursos/${curso.id_curso}/modulos`);

      const listaModulos = modulosResposta.data.modulos;

      setIdCurso(curso.id_curso);
      setModulos(listaModulos);
      setModuloSelecionado(
        listaModulos.find((modulo) => modulo.em_andamento) ?? listaModulos[0] ?? null,
      );
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        router.replace("/");
        return;
      }

      setErroModulos(
        e instanceof ApiError ? e.message : "Sem conexão com o servidor. Tente novamente.",
      );
    } finally {
      setCarregandoModulos(false);
    }
  }

  async function carregarMateriais(idCursoAtual: number, idModulo: number) {
    setCarregandoMateriais(true);
    setErroMateriais("");

    try {
      const resposta = await apiFetch<{ success: boolean; data: MaterialApi[] }>(
        `/aluno/cursos/${idCursoAtual}/materiais?modulo=${idModulo}`,
      );

      setMateriais(resposta.data);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        router.replace("/");
        return;
      }

      setErroMateriais(
        e instanceof ApiError ? e.message : "Sem conexão com o servidor. Tente novamente.",
      );
    } finally {
      setCarregandoMateriais(false);
    }
  }

  async function abrir(material: MaterialApi) {
    try {
      const nomeArquivo = material.extensao
        ? `${material.titulo}.${material.extensao}`
        : material.titulo;

      await abrirMaterial(material.url_download, nomeArquivo);
    } catch (e) {
      console.error("Não foi possível abrir o material:", e);
      Alert.alert("Não foi possível abrir o material", "Tente novamente em instantes.");
    }
  }

  const materiaisFiltrados = materiais.filter((material) => {
    if (filtroSelecionado === "Todas") return true;
    return filtroPorTipo[tipoDoMaterial(material.extensao)] === filtroSelecionado;
  });

  return (
    <TelaComAbas titulo="Materiais" subtitulo="Utilize os materiais de apoio">
      <View style={cursoStyles.abasLinha}>
        <Pressable style={cursoStyles.abaItem} onPress={() => router.navigate("/curso")}>
          <Text style={cursoStyles.abaItemTexto}>Curso</Text>
        </Pressable>

        <View style={[cursoStyles.abaItem, cursoStyles.abaItemSelecionada]}>
          <Text style={[cursoStyles.abaItemTexto, cursoStyles.abaItemTextoSelecionada]}>
            Materiais
          </Text>
        </View>
      </View>

      {carregandoModulos && (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator color={cores.azul} />
        </View>
      )}

      {!carregandoModulos && erroModulos !== "" && (
        <View style={{ paddingVertical: 24, alignItems: "center" }}>
          <Text style={{ color: cores.vermelho, textAlign: "center", marginBottom: 12 }}>
            {erroModulos}
          </Text>
          <Pressable onPress={carregarModulos}>
            <Text style={{ color: cores.azul, fontWeight: "bold" }}>Tentar novamente</Text>
          </Pressable>
        </View>
      )}

      {!carregandoModulos && erroModulos === "" && !moduloSelecionado && (
        <View style={{ paddingVertical: 24, alignItems: "center" }}>
          <Text style={{ color: cores.cinzaEscuro, textAlign: "center" }}>
            Você ainda não está matriculado(a) em nenhum curso.
          </Text>
        </View>
      )}

      {moduloSelecionado && (
        <>
          <Pressable style={materiaisStyles.seletorModulo} onPress={() => setSeletorAberto(true)}>
            <Text style={materiaisStyles.seletorModuloTexto}>{moduloSelecionado.nome_modulo}</Text>
            <Image
              source={require("@/assets/images/imgIcon/voltar-azul.png")}
              style={materiaisStyles.seletorModuloIcone}
            />
          </Pressable>

          <View style={materiaisStyles.filtrosLinha}>
            {filtros.map((filtro) => {
              const selecionado = filtro === filtroSelecionado;

              return (
                <Pressable
                  key={filtro}
                  style={[
                    materiaisStyles.filtroPill,
                    selecionado && materiaisStyles.filtroPillSelecionado,
                  ]}
                  onPress={() => setFiltroSelecionado(filtro)}
                >
                  <Text
                    style={[
                      materiaisStyles.filtroPillTexto,
                      selecionado && materiaisStyles.filtroPillTextoSelecionado,
                    ]}
                  >
                    {filtro}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={materiaisStyles.secaoTitulo}>Materiais de Apoio</Text>

          {carregandoMateriais && (
            <View style={{ paddingVertical: 24, alignItems: "center" }}>
              <ActivityIndicator color={cores.azul} />
            </View>
          )}

          {!carregandoMateriais && erroMateriais !== "" && (
            <Text style={{ color: cores.vermelho, marginBottom: 12 }}>{erroMateriais}</Text>
          )}

          {!carregandoMateriais &&
            materiaisFiltrados.map((material) => {
              const tipo = tipoDoMaterial(material.extensao);

              return (
                <View key={material.id_material} style={materiaisStyles.materialCard}>
                  <View style={materiaisStyles.materialIconeBox}>
                    <Image
                      source={iconePorTipo[tipo]}
                      style={materiaisStyles.materialIcone}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={materiaisStyles.materialCorpo}>
                    <Text style={materiaisStyles.materialTitulo}>{material.titulo}</Text>
                    {material.descricao !== "" && (
                      <Text style={materiaisStyles.materialSubtitulo}>{material.descricao}</Text>
                    )}
                    {material.extensao && (
                      <Text style={materiaisStyles.materialTamanho}>
                        {material.extensao.toUpperCase()}
                      </Text>
                    )}
                  </View>

                  <View style={materiaisStyles.materialAcoes}>
                    <Pressable onPress={() => abrir(material)}>
                      <Image
                        source={
                          tipo === "pdf"
                            ? require("@/assets/images/imgIcon/visualizar-azul.png")
                            : require("@/assets/images/imgIcon/play.png")
                        }
                        style={materiaisStyles.materialAcaoIcone}
                      />
                    </Pressable>
                    <Pressable onPress={() => abrir(material)}>
                      <Image
                        source={require("@/assets/images/imgIcon/download-azul.png")}
                        style={materiaisStyles.materialAcaoIcone}
                      />
                    </Pressable>
                  </View>
                </View>
              );
            })}

          <View style={materiaisStyles.placeholder}>
            <Text style={materiaisStyles.placeholderTexto}>
              Espere o professor disponibilizar mais materiais
            </Text>
          </View>
        </>
      )}

      <Modal
        visible={seletorAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setSeletorAberto(false)}
      >
        <Pressable
          style={materiaisStyles.seletorSobrepor}
          onPress={() => setSeletorAberto(false)}
        >
          <View style={materiaisStyles.seletorPainel}>
            {modulos.map((modulo) => (
              <Pressable
                key={modulo.id_modulo}
                style={materiaisStyles.seletorOpcao}
                onPress={() => {
                  setModuloSelecionado(modulo);
                  setSeletorAberto(false);
                }}
              >
                <Text
                  style={[
                    materiaisStyles.seletorOpcaoTexto,
                    modulo.id_modulo === moduloSelecionado?.id_modulo &&
                      materiaisStyles.seletorOpcaoTextoSelecionada,
                  ]}
                >
                  {modulo.nome_modulo}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </TelaComAbas>
  );
}
