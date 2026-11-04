import { Image, Modal, Pressable, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import modalIphoneStyle from "@/styles/modalIphoneStyle";
import { cores } from "@/styles/variaveis";

type ModalAndroidProps = {
  visible: boolean;
  onClose: () => void;
};

function IconeMenu() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={5} r={1.8} fill={cores.azul} />
      <Circle cx={12} cy={12} r={1.8} fill={cores.azul} />
      <Circle cx={12} cy={19} r={1.8} fill={cores.azul} />
    </Svg>
  );
}

function IconeInstalar() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4V15M12 15L8 11M12 15L16 11"
        stroke={cores.azul}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 17V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V17"
        stroke={cores.azul}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const passos = [
  { texto: "Toque nos três pontinhos (⋮) no canto do Chrome", icone: <IconeMenu /> },
  { texto: 'Toque em "Instalar aplicativo" (ou "Adicionar à tela inicial")', icone: <IconeInstalar /> },
  { texto: 'Toque em "Instalar" para confirmar', icone: <IconeInstalar /> },
];

export default function ModalAndroid({ visible, onClose }: ModalAndroidProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalIphoneStyle.sobrepor}>
        <View style={modalIphoneStyle.conteudo}>
          <Image
            source={require("@/assets/images/imgIcon/logo-traducaapp.png")}
            style={modalIphoneStyle.logo}
            resizeMode="contain"
          />

          <Text style={modalIphoneStyle.titulo}>Como instalar no Android</Text>
          <Text style={modalIphoneStyle.subtitulo}>
            Para adicionar o app à tela inicial do seu celular, siga os passos abaixo
          </Text>

          {passos.map((passo, indice) => (
            <View key={passo.texto} style={modalIphoneStyle.passo}>
              <View style={modalIphoneStyle.passoIconeBox}>{passo.icone}</View>
              <Text style={modalIphoneStyle.passoTexto}>
                {indice + 1}. {passo.texto}
              </Text>
            </View>
          ))}

          <Text style={modalIphoneStyle.textoPronto}>
            Se a opção não aparecer no menu, navegue um pouco pelo app e tente de novo.
          </Text>

          <Pressable
            style={({ pressed }) => [
              modalIphoneStyle.btnEntendi,
              pressed && modalIphoneStyle.btnEntendiPressed,
            ]}
            onPress={onClose}
          >
            <Text style={modalIphoneStyle.txtEntendi}>Entendi</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              modalIphoneStyle.btnFechar,
              pressed && modalIphoneStyle.btnFecharPressed,
            ]}
            onPress={onClose}
          >
            <Text style={modalIphoneStyle.txtFechar}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
