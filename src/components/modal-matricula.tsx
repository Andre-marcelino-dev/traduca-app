import { Linking, Modal, Pressable, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { linkWhatsapp, WHATSAPP_PROFESSOR } from "@/constants/contato";
import modalMatriculaStyle from "@/styles/modalMatriculaStyle";
import { cores } from "@/styles/variaveis";

type ModalMatriculaProps = {
  visible: boolean;
  idiomaLabel: string;
  onClose: () => void;
};

function IconeAlerta() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={cores.azul} strokeWidth={1.5} />
      <Path d="M12 8V13" stroke={cores.azul} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx={12} cy={16} r={1} fill={cores.azul} />
    </Svg>
  );
}

export default function ModalMatricula({ visible, idiomaLabel, onClose }: ModalMatriculaProps) {
  function falarNoWhatsapp() {
    const texto = `Olá! Gostaria de mais informações sobre o curso de ${idiomaLabel}.`;
    Linking.openURL(linkWhatsapp(WHATSAPP_PROFESSOR, texto));
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalMatriculaStyle.sobrepor}>
        <View style={modalMatriculaStyle.conteudo}>
          <View style={modalMatriculaStyle.iconeBox}>
            <IconeAlerta />
          </View>

          <Text style={modalMatriculaStyle.titulo}>Você ainda não está matriculado(a)</Text>
          <Text style={modalMatriculaStyle.subtitulo}>
            Fale com o professor para saber mais sobre o curso de {idiomaLabel} ou para se
            matricular.
          </Text>

          <Pressable
            style={({ pressed }) => [
              modalMatriculaStyle.btnWhatsapp,
              pressed && modalMatriculaStyle.btnWhatsappPressed,
            ]}
            onPress={falarNoWhatsapp}
          >
            <Text style={modalMatriculaStyle.txtWhatsapp}>Falar no WhatsApp</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              modalMatriculaStyle.btnFechar,
              pressed && modalMatriculaStyle.btnFecharPressed,
            ]}
            onPress={onClose}
          >
            <Text style={modalMatriculaStyle.txtFechar}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
