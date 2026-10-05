import { useEffect, useState } from "react";

import { Alert, Image, Modal, Pressable, Text, TextInput, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { AulaAgenda, solicitarReagendamento } from "@/services/api";
import modalReagendamentoStyle from "@/styles/modalReagendamentoStyle";
import { cores } from "@/styles/variaveis";

type ModalReagendamentoProps = {
  visible: boolean;
  aulas: AulaAgenda[];
  aulaInicial: AulaAgenda | null;
  onClose: () => void;
};

const MOTIVO_MIN = 10;
const MOTIVO_MAX = 500;

function IconeFechar() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
      <Path d="M5 5L19 19M19 5L5 19" stroke={cores.azul} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

// "2026-09-01" + "19:00" → "01/09, 19:00".
function dataResumida(aula: AulaAgenda): string {
  if (!aula.data) return "Data a definir";
  const [, mes, dia] = aula.data.split("-");
  return aula.hora ? `${dia}/${mes}, ${aula.hora}` : `${dia}/${mes}`;
}

export default function ModalReagendamento({
  visible,
  aulas,
  aulaInicial,
  onClose,
}: ModalReagendamentoProps) {
  const [aulaSelecionada, setAulaSelecionada] = useState<AulaAgenda | null>(null);
  const [motivo, setMotivo] = useState("");
  const [seletorAberto, setSeletorAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  // Reseta o formulário toda vez que o modal é reaberto.
  useEffect(() => {
    if (visible) {
      setAulaSelecionada(aulaInicial);
      setMotivo("");
      setErro("");
    }
  }, [visible, aulaInicial]);

  const motivoValido = motivo.trim().length >= MOTIVO_MIN;

  async function enviar() {
    setErro("");

    if (!aulaSelecionada) {
      setErro("Selecione a aula que deseja reagendar.");
      return;
    }
    if (!motivoValido) {
      setErro(`O motivo deve ter ao menos ${MOTIVO_MIN} caracteres.`);
      return;
    }

    setEnviando(true);
    try {
      const mensagem = await solicitarReagendamento(aulaSelecionada.id_aula, motivo.trim());
      Alert.alert("Solicitação enviada", mensagem);
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível enviar a solicitação.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalReagendamentoStyle.sobrepor}>
        <View style={modalReagendamentoStyle.conteudo}>
          <View style={modalReagendamentoStyle.cabecalho}>
            <View style={modalReagendamentoStyle.cabecalhoIconeBox}>
              <Image
                source={require("@/assets/images/imgIcon/calendario-azul.png")}
                style={modalReagendamentoStyle.cabecalhoIcone}
              />
            </View>

            <View style={modalReagendamentoStyle.cabecalhoTextos}>
              <Text style={modalReagendamentoStyle.cabecalhoTitulo}>Solicitar reagendamento</Text>
              <Text style={modalReagendamentoStyle.cabecalhoSubtitulo}>
                Envie sua solicitação ao professor
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                modalReagendamentoStyle.btnFechar,
                pressed && modalReagendamentoStyle.btnFecharPressed,
              ]}
              onPress={onClose}
            >
              <IconeFechar />
            </Pressable>
          </View>

          <View style={modalReagendamentoStyle.campo}>
            <View style={modalReagendamentoStyle.campoLabelLinha}>
              <Image
                source={require("@/assets/images/imgIcon/aula-azul.png")}
                style={modalReagendamentoStyle.campoLabelIcone}
              />
              <Text style={modalReagendamentoStyle.campoLabelTexto}>Aula para reagendar</Text>
            </View>

            <Pressable
              style={modalReagendamentoStyle.seletorAula}
              onPress={() => setSeletorAberto(true)}
            >
              <Text
                style={[
                  modalReagendamentoStyle.seletorAulaTexto,
                  !aulaSelecionada && modalReagendamentoStyle.seletorAulaPlaceholder,
                ]}
                numberOfLines={1}
              >
                {aulaSelecionada
                  ? `${aulaSelecionada.titulo} · ${dataResumida(aulaSelecionada)}`
                  : "Selecione a aula..."}
              </Text>
              <Image
                source={require("@/assets/images/imgIcon/voltar-azul.png")}
                style={modalReagendamentoStyle.seletorAulaIcone}
              />
            </Pressable>
          </View>

          <View style={modalReagendamentoStyle.campo}>
            <View style={modalReagendamentoStyle.campoLabelLinha}>
              <Image
                source={require("@/assets/images/imgIcon/chat.png")}
                style={modalReagendamentoStyle.campoLabelIcone}
              />
              <Text style={modalReagendamentoStyle.campoLabelTexto}>Motivo do reagendamento</Text>
            </View>

            <TextInput
              value={motivo}
              onChangeText={(texto) => setMotivo(texto.slice(0, MOTIVO_MAX))}
              placeholder="Explique o motivo..."
              placeholderTextColor={cores.cinzaEscuro}
              multiline
              style={modalReagendamentoStyle.motivoInput}
            />

            <View style={modalReagendamentoStyle.contadorLinha}>
              <Text
                style={[
                  modalReagendamentoStyle.contadorTexto,
                  motivo.length > 0 &&
                    !motivoValido &&
                    modalReagendamentoStyle.contadorTextoAlerta,
                ]}
              >
                Mínimo {MOTIVO_MIN} caracteres
              </Text>
              <Text style={modalReagendamentoStyle.contadorTexto}>
                {motivo.length}/{MOTIVO_MAX}
              </Text>
            </View>
          </View>

          {erro !== "" && <Text style={modalReagendamentoStyle.erroTexto}>{erro}</Text>}

          <View style={modalReagendamentoStyle.botoesLinha}>
            <Pressable
              style={({ pressed }) => [
                modalReagendamentoStyle.btnCancelar,
                pressed && modalReagendamentoStyle.btnCancelarPressed,
              ]}
              onPress={onClose}
            >
              <Text style={modalReagendamentoStyle.txtCancelar}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                modalReagendamentoStyle.btnEnviar,
                enviando && modalReagendamentoStyle.btnEnviarDesabilitado,
                pressed && modalReagendamentoStyle.btnEnviarPressed,
              ]}
              onPress={enviar}
              disabled={enviando}
            >
              <Image
                source={require("@/assets/images/imgIcon/enviar.png")}
                style={modalReagendamentoStyle.iconeEnviar}
              />
              <Text style={modalReagendamentoStyle.txtEnviar}>
                {enviando ? "Enviando..." : "Enviar solicitação"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Modal
        visible={seletorAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setSeletorAberto(false)}
      >
        <Pressable
          style={modalReagendamentoStyle.seletorSobrepor}
          onPress={() => setSeletorAberto(false)}
        >
          <View style={modalReagendamentoStyle.seletorPainel}>
            {aulas.length === 0 ? (
              <Text style={modalReagendamentoStyle.seletorVazioTexto}>
                Nenhuma aula disponível para reagendar.
              </Text>
            ) : (
              aulas.map((aula) => (
                <Pressable
                  key={aula.id_aula}
                  style={modalReagendamentoStyle.seletorOpcao}
                  onPress={() => {
                    setAulaSelecionada(aula);
                    setSeletorAberto(false);
                  }}
                >
                  <Text style={modalReagendamentoStyle.seletorOpcaoTitulo}>{aula.titulo}</Text>
                  <Text style={modalReagendamentoStyle.seletorOpcaoInfo}>
                    {aula.curso ? `${aula.curso} · ` : ""}
                    {dataResumida(aula)}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        </Pressable>
      </Modal>
    </Modal>
  );
}
