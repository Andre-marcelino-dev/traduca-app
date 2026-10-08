import { useEffect, useState } from "react";

import { Alert, Image, Modal, Pressable, Text, TextInput, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Desempenho, formatarData, justificarFalta } from "@/services/api";
import modalReagendamentoStyle from "@/styles/modalReagendamentoStyle";
import { cores } from "@/styles/variaveis";

type Falta = Desempenho["ultimas_presencas"][number];

type ModalJustificarFaltaProps = {
  visible: boolean;
  falta: Falta | null;
  onClose: () => void;
  onEnviado: () => void;
};

const MOTIVO_MIN = 10;
const MOTIVO_MAX = 1000;

function IconeFechar() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
      <Path d="M5 5L19 19M19 5L5 19" stroke={cores.azul} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

export default function ModalJustificarFalta({
  visible,
  falta,
  onClose,
  onEnviado,
}: ModalJustificarFaltaProps) {
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (visible) {
      setMotivo("");
      setErro("");
    }
  }, [visible, falta]);

  const motivoValido = motivo.trim().length >= MOTIVO_MIN;

  async function enviar() {
    setErro("");

    if (!falta) return;
    if (!motivoValido) {
      setErro(`O motivo deve ter ao menos ${MOTIVO_MIN} caracteres.`);
      return;
    }

    setEnviando(true);
    try {
      const mensagem = await justificarFalta(falta.id_presenca, motivo.trim());
      Alert.alert("Justificativa enviada", mensagem);
      onEnviado();
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível enviar a justificativa.");
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
              <Text style={modalReagendamentoStyle.cabecalhoTitulo}>Justificar falta</Text>
              <Text style={modalReagendamentoStyle.cabecalhoSubtitulo}>
                {falta?.aula_titulo ?? "Aula"}
                {falta?.data ? ` · ${formatarData(falta.data)}` : ""}
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
                source={require("@/assets/images/imgIcon/chat.png")}
                style={modalReagendamentoStyle.campoLabelIcone}
              />
              <Text style={modalReagendamentoStyle.campoLabelTexto}>Motivo da falta</Text>
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
                {enviando ? "Enviando..." : "Enviar justificativa"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
