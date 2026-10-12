import { router } from "expo-router";
import { useEffect, useState } from "react";

import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import {
  buscarNotificacoes,
  marcarNotificacaoLida,
  marcarTodasNotificacoesLidas,
  Notificacao,
} from "@/services/api";
import centralNotificacoesStyle from "@/styles/centralNotificacoesStyle";
import { cores } from "@/styles/variaveis";

type CentralNotificacoesModalProps = {
  visible: boolean;
  onClose: () => void;
  // Avisa quem abriu (o sino) quantos avisos continuam não lidos.
  onNaoLidas?: (quantidade: number) => void;
};

function IconeFechar() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 5L19 19M19 5L5 19"
        stroke={cores.branco}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Telas do app que um aviso pode abrir.
const TELAS_DO_APP = [
  "agenda", "assistente", "atividade", "atividades", "aulas", "config", "curso",
  "curso-modulo", "desempenho", "duvida", "home", "materiais", "perfil",
];

// Nome usado pelo site antigo -> tela do app (avisos criados antes do sino do app).
const NOMES_DO_SITE: Record<string, string> = {
  reagendamento: "agenda",
  reagendamentos: "agenda",
  duvidas: "duvida",
  progresso: "desempenho",
  dashboard: "home",
  dash: "home",
};

// Transforma o link do aviso numa tela do app que existe, ou null (aí o
// aviso só é marcado como lido). Avisos antigos têm links do site, como
// "https://traduca.adminfo.dev.br/aluno/reagendamentos" ou "/aluno/atividades/12".
export function rotaDoAviso(link: string | null): string | null {
  if (!link) return null;

  // Tira o domínio e o "/aluno/" do site; separa a "?query".
  let caminho = link.trim().replace(/^https?:\/\/[^/]+/i, "");
  const [semQuery, query = ""] = caminho.split("?");
  const partes = semQuery.split("/").filter(Boolean);
  if (partes[0] === "aluno") partes.shift();
  if (partes.length === 0) return null;

  const nome = NOMES_DO_SITE[partes[0]] ?? partes[0];

  // Site: /aluno/atividades/12 -> app: /atividade?id=12
  if (nome === "atividades" && /^\d+$/.test(partes[1] ?? "")) {
    return `/atividade?id=${partes[1]}`;
  }
  if (!TELAS_DO_APP.includes(nome)) return null;

  caminho = `/${nome}`;
  return query ? `${caminho}?${query}` : caminho;
}

// Ícone pela tela que o aviso abre.
function iconeDoAviso(link: string | null) {
  if (link?.startsWith("/agenda")) return require("@/assets/images/imgIcon/calendario-azul.png");
  if (link?.startsWith("/atividade")) return require("@/assets/images/imgIcon/atividades-azul.png");
  if (link?.startsWith("/materiais")) return require("@/assets/images/imgIcon/mochila-azul.png");
  if (link?.startsWith("/duvida")) return require("@/assets/images/imgIcon/chat.png");
  return require("@/assets/images/imgIcon/sino-azul.png");
}

// "Nova atividade: Conversa no aeroporto" → título "Nova atividade", texto "Conversa no aeroporto".
function separarMensagem(mensagem: string): { titulo: string; texto: string } {
  const posicao = mensagem.indexOf(": ");
  if (posicao > 0 && posicao < 45) {
    return { titulo: mensagem.slice(0, posicao), texto: mensagem.slice(posicao + 2) };
  }
  return { titulo: mensagem, texto: "" };
}

// "2026-10-10 14:30" → "Hoje, 14:30" / "Ontem, 09:15" / "08/10, 18:00".
function horarioDoAviso(data: string | null): string {
  if (!data) return "";
  const [dia, hora] = data.split(" ");
  const [ano, mes, d] = dia.split("-").map(Number);
  const aviso = new Date(ano, mes - 1, d);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diasAtras = Math.round((hoje.getTime() - aviso.getTime()) / 86400000);
  const quando =
    diasAtras === 0 ? "Hoje" : diasAtras === 1 ? "Ontem" : `${String(d).padStart(2, "0")}/${String(mes).padStart(2, "0")}`;
  return hora ? `${quando}, ${hora.slice(0, 5)}` : quando;
}

export default function CentralNotificacoesModal({
  visible,
  onClose,
  onNaoLidas,
}: CentralNotificacoesModalProps) {
  const [avisos, setAvisos] = useState<Notificacao[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Busca os avisos toda vez que a central abre.
  useEffect(() => {
    if (!visible) return;
    setCarregando(true);
    setErro("");
    buscarNotificacoes()
      .then((dados) => {
        setAvisos(dados.notificacoes);
        onNaoLidas?.(dados.nao_lidas);
      })
      .catch((e) => setErro(e instanceof Error ? e.message : "Não foi possível carregar os avisos."))
      .finally(() => setCarregando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const naoLidas = avisos.filter((a) => !a.lida).length;

  // Toca no aviso: marca como lido e abre a tela dele.
  async function abrir(aviso: Notificacao) {
    if (!aviso.lida) {
      setAvisos((lista) => lista.map((a) => (a.id === aviso.id ? { ...a, lida: true } : a)));
      onNaoLidas?.(Math.max(naoLidas - 1, 0));
      marcarNotificacaoLida(aviso.id).catch(() => {});
    }
    // Só abre se for uma tela que existe no app (senão daria "Unmatched Route").
    const rota = rotaDoAviso(aviso.link);
    if (rota) {
      onClose();
      router.navigate(rota as never);
    }
  }

  async function marcarTodas() {
    setAvisos((lista) => lista.map((a) => ({ ...a, lida: true })));
    onNaoLidas?.(0);
    try {
      await marcarTodasNotificacoesLidas();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível marcar como lidas.");
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={centralNotificacoesStyle.sobrepor}>
        <View style={centralNotificacoesStyle.conteudo}>
          <Pressable
            style={({ pressed }) => [
              centralNotificacoesStyle.btnFechar,
              pressed && centralNotificacoesStyle.btnFecharPressed,
            ]}
            onPress={onClose}
          >
            <IconeFechar />
          </Pressable>

          <Text style={centralNotificacoesStyle.titulo}>Central de notificações</Text>

          {carregando && <ActivityIndicator color={cores.azul} style={{ marginVertical: 24 }} />}

          {!carregando && erro ? <Text style={centralNotificacoesStyle.vazio}>{erro}</Text> : null}

          {!carregando && !erro && avisos.length === 0 && (
            <Text style={centralNotificacoesStyle.vazio}>
              Nenhuma notificação por enquanto.{"\n"}Avisaremos quando tiver aula, atividade ou material novo.
            </Text>
          )}

          {!carregando && avisos.length > 0 && (
            <ScrollView style={centralNotificacoesStyle.lista}>
              {avisos.map((aviso) => {
                const { titulo, texto } = separarMensagem(aviso.mensagem);
                return (
                  <Pressable
                    key={aviso.id}
                    style={[centralNotificacoesStyle.item, aviso.lida && centralNotificacoesStyle.itemLido]}
                    onPress={() => abrir(aviso)}
                  >
                    {!aviso.lida && <View style={centralNotificacoesStyle.pontoNaoLido} />}

                    <View style={centralNotificacoesStyle.itemIconeBox}>
                      <Image
                        source={iconeDoAviso(rotaDoAviso(aviso.link))}
                        style={centralNotificacoesStyle.itemIcone}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={centralNotificacoesStyle.itemCorpo}>
                      <Text style={centralNotificacoesStyle.itemTitulo}>{titulo}</Text>

                      <View style={centralNotificacoesStyle.itemRodape}>
                        <Text style={centralNotificacoesStyle.itemDescricao}>{texto}</Text>
                        <Text style={centralNotificacoesStyle.itemHorario}>
                          {horarioDoAviso(aviso.data)}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <Pressable
            style={({ pressed }) => [
              centralNotificacoesStyle.btnMarcarLida,
              pressed && centralNotificacoesStyle.btnMarcarLidaPressed,
              naoLidas === 0 && centralNotificacoesStyle.btnDesabilitado,
            ]}
            onPress={marcarTodas}
            disabled={naoLidas === 0}
          >
            <Text style={centralNotificacoesStyle.txtMarcarLida}>Marcar todas como lidas</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
