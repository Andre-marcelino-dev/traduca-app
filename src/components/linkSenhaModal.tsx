import { Modal, View, Text, ScrollView, Pressable } from "react-native";

import enviarLinkStyle from "@/styles/enviarLinkStyle";

interface EnviaLinkProps {
  visible: boolean;
  onClose: () => void;
}

export default function EnviarLinkModal({ visible, onClose }: EnviaLinkProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={enviarLinkStyle.sobrepor}>
        <View style={enviarLinkStyle.conteudo}>
          <Text style={enviarLinkStyle.titulo}>Código enviado</Text>

          <ScrollView style={enviarLinkStyle.scroll}>
            <Text style={enviarLinkStyle.texto}>
              Caso este e-mail esteja cadastrado em nosso sistema, você receberá um código de 6
              dígitos por e-mail.
            </Text>
            <Text style={enviarLinkStyle.textoValidade}>O código vale por 30 minutos</Text>
          </ScrollView>

          <Pressable
            style={({ pressed }) => [enviarLinkStyle.btnEntendi, pressed && enviarLinkStyle.btnEntendiPressed]}
            onPress={onClose}
          >
            <Text style={enviarLinkStyle.txtEntendi}>Ok</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
