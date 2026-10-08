import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from "react-native";

import EstadoVazio from "@/components/estado-vazio";
import SeletorCurso from "@/components/seletor-curso";
import TelaComAbas from "@/components/tela-com-abas";
import { buscarCursos, buscarMateriais, Curso, formatarTamanho, Material } from "@/services/api";
import { abrirMaterial } from "@/services/arquivos";
import { cursoDaLista, escolherCurso, lerCursoEscolhido } from "@/services/curso-escolhido";
import cursoStyles from "@/styles/cursoStyles";
import materiaisStyles from "@/styles/materiaisStyles";
import { cores } from "@/styles/variaveis";

const filtros = ["Todas", "PDF", "Áudios", "Vídeos"] as const;
type Filtro = (typeof filtros)[number];

const EXT_AUDIO = ["mp3", "wav", "m4a", "ogg", "aac", "wma", "flac"];
const EXT_VIDEO = ["mp4", "mov", "avi", "mkv", "webm", "wmv", "m4v"];

type TipoMaterial = "pdf" | "audio" | "video" | "outro";

function tipoDoMaterial(material: Material): TipoMaterial {
  const ext = (material.extensao ?? "").toLowerCase();
  if (ext === "pdf") return "pdf";
  if (EXT_AUDIO.includes(ext)) return "audio";
  if (EXT_VIDEO.includes(ext)) return "video";
  return "outro";
}

const iconePorTipo: Record<TipoMaterial, number> = {
  pdf: require("@/assets/images/imgIcon/arquivo.png"),
  audio: require("@/assets/images/imgIcon/audio.png"),
  video: require("@/assets/images/imgIcon/videoaula.png"),
  outro: require("@/assets/images/imgIcon/arquivo.png"),
};

const tipoPorFiltro: Record<Filtro, TipoMaterial | null> = {
  Todas: null,
  PDF: "pdf",
  Áudios: "audio",
  Vídeos: "video",
};

const doisDigitos = (n: number) => String(n).padStart(2, "0");

export default function MateriaisScreen() {
  const [filtroSelecionado, setFiltroSelecionado] = useState<Filtro>("Todas");
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroArquivo, setErroArquivo] = useState("");
  const [baixando, setBaixando] = useState<number | null>(null);
  const [moduloSelecionado, setModuloSelecionado] = useState<number | null>(null);
  const [mostrarModulos, setMostrarModulos] = useState(false);
  const [mostrarBusca, setMostrarBusca] = useState(false);
  const [busca, setBusca] = useState("");
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [idCurso, setIdCurso] = useState<number | undefined>(undefined);

  const carregar = useCallback(async () => {
    try {
      const lista = await buscarCursos();
      setCursos(lista);
      if (lista.length === 0) {
        setMateriais([]);
        setErro("Você ainda não está matriculado em nenhum curso.");
        return;
      }
      // Materiais do idioma que o aluno escolheu (mesmo curso da tela Curso).
      const atual = cursoDaLista(lista, await lerCursoEscolhido())!;
      setIdCurso(atual.id_curso);
      setMateriais(await buscarMateriais(atual.id_curso));
      setErro("");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível carregar os materiais.");
    } finally {
      setCarregando(false);
    }
  }, []);

  // Busca os dados toda vez que a tela aparece (inclusive ao voltar para ela),
  // para mostrar materiais novos que o professor cadastrou.
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function trocarCurso(id: number) {
    if (id === idCurso) return;
    setIdCurso(id);
    setModuloSelecionado(null); // os módulos são de outro curso
    setMostrarModulos(false);
    setCarregando(true);
    await escolherCurso(id);
    await carregar();
  }

  // Lista de módulos que têm materiais, em ordem.
  const modulos = materiais
    .filter((m, i, lista) => lista.findIndex((x) => x.id_modulo === m.id_modulo) === i)
    .sort((a, b) => a.ordem_modulo - b.ordem_modulo);

  const moduloAtual = modulos.find((m) => m.id_modulo === moduloSelecionado);

  const termo = busca.trim().toLowerCase();
  const materiaisFiltrados = materiais.filter((material) => {
    const tipo = tipoPorFiltro[filtroSelecionado];
    if (tipo && tipoDoMaterial(material) !== tipo) return false;
    if (moduloSelecionado !== null && material.id_modulo !== moduloSelecionado) return false;
    if (termo && !`${material.titulo} ${material.descricao ?? ""}`.toLowerCase().includes(termo)) {
      return false;
    }
    return true;
  });

  async function acessar(material: Material, modo: "ver" | "baixar") {
    setErroArquivo("");
    setBaixando(material.id_material);
    try {
      await abrirMaterial(material, modo);
      // O servidor marca o material como concluído ao baixar.
      setMateriais((lista) =>
        lista.map((m) => (m.id_material === material.id_material ? { ...m, concluido: true } : m))
      );
    } catch (e) {
      setErroArquivo(e instanceof Error ? e.message : "Não foi possível abrir o material.");
    } finally {
      setBaixando(null);
    }
  }

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

      <SeletorCurso cursos={cursos} idSelecionado={idCurso} onEscolher={trocarCurso} />

      {carregando && <ActivityIndicator size="large" color={cores.azul} />}

      {!carregando && erro ? (
        <EstadoVazio
          icone={require("@/assets/images/imgIcon/mochila-azul.png")}
          texto={erro}
        />
      ) : null}

      {!carregando && !erro && (
      <>
      <Pressable
        style={materiaisStyles.seletorModulo}
        onPress={() => setMostrarModulos((atual) => !atual)}
      >
        <Text style={materiaisStyles.seletorModuloTexto}>
          {moduloAtual
            ? `${doisDigitos(moduloAtual.ordem_modulo)} - Módulo ${moduloAtual.nome_modulo}`
            : "Todos os módulos"}
        </Text>
        <Image
          source={require("@/assets/images/imgIcon/voltar-azul.png")}
          style={materiaisStyles.seletorModuloIcone}
        />
      </Pressable>

      {mostrarModulos && (
        <View style={materiaisStyles.opcoesModulo}>
          {[null, ...modulos].map((modulo) => {
            const id = modulo?.id_modulo ?? null;
            const selecionado = id === moduloSelecionado;

            return (
              <Pressable
                key={id ?? "todos"}
                style={[
                  materiaisStyles.filtroPill,
                  selecionado && materiaisStyles.filtroPillSelecionado,
                ]}
                onPress={() => {
                  setModuloSelecionado(id);
                  setMostrarModulos(false);
                }}
              >
                <Text
                  style={[
                    materiaisStyles.filtroPillTexto,
                    selecionado && materiaisStyles.filtroPillTextoSelecionado,
                  ]}
                >
                  {modulo
                    ? `${doisDigitos(modulo.ordem_modulo)} - ${modulo.nome_modulo}`
                    : "Todos os módulos"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

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

        <Pressable
          style={materiaisStyles.btnBusca}
          onPress={() => {
            setMostrarBusca((atual) => !atual);
            setBusca("");
          }}
        >
          <Image
            source={require("@/assets/images/imgIcon/buscar.png")}
            style={materiaisStyles.iconeBusca}
          />
        </Pressable>
      </View>

      {mostrarBusca && (
        <TextInput
          style={materiaisStyles.campoBusca}
          placeholder="Buscar material..."
          placeholderTextColor="#888888"
          value={busca}
          onChangeText={setBusca}
          autoFocus
        />
      )}

      <Text style={materiaisStyles.secaoTitulo}>Materiais de Apoio</Text>

      {erroArquivo ? <Text style={materiaisStyles.txtErro}>{erroArquivo}</Text> : null}

      {materiaisFiltrados.map((material) => {
        const tipo = tipoDoMaterial(material);

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
              {material.descricao ? (
                <Text style={materiaisStyles.materialSubtitulo}>{material.descricao}</Text>
              ) : null}
              <Text style={materiaisStyles.materialTamanho}>
                {material.extensao ? material.extensao.toUpperCase() : "Sem arquivo"}
                {material.tamanho_bytes !== null ? ` · ${formatarTamanho(material.tamanho_bytes)}` : ""}
                {material.concluido ? (
                  <Text style={materiaisStyles.materialConcluido}> · Concluído</Text>
                ) : null}
              </Text>
            </View>

            {material.tem_arquivo && (
              <View style={materiaisStyles.materialAcoes}>
                {baixando === material.id_material ? (
                  <ActivityIndicator color={cores.azul} />
                ) : (
                  <>
                    <Pressable onPress={() => acessar(material, "ver")}>
                      <Image
                        source={
                          tipo === "audio" || tipo === "video"
                            ? require("@/assets/images/imgIcon/play.png")
                            : require("@/assets/images/imgIcon/visualizar-azul.png")
                        }
                        style={materiaisStyles.materialAcaoIcone}
                      />
                    </Pressable>
                    <Pressable onPress={() => acessar(material, "baixar")}>
                      <Image
                        source={require("@/assets/images/imgIcon/download-azul.png")}
                        style={materiaisStyles.materialAcaoIcone}
                      />
                    </Pressable>
                  </>
                )}
              </View>
            )}
          </View>
        );
      })}

      <View style={materiaisStyles.placeholder}>
        <Text style={materiaisStyles.placeholderTexto}>
          {materiaisFiltrados.length === 0
            ? "Nenhum material encontrado. Espere o professor disponibilizar materiais"
            : "Espere o professor disponibilizar mais materiais"}
        </Text>
      </View>
      </>
      )}
    </TelaComAbas>
  );
}
