import { Image, Modal, Pressable, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import modalIphoneStyle from "@/styles/modalIphoneStyle";
import { cores } from "@/styles/variaveis";

type ModalDesktopProps = {
  visible: boolean;
  onClose: () => void;
};

function IconeInstalarBarra() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={4} width={18} height={13} rx={2} stroke={cores.azul} strokeWidth={1.5} />
      <Path d="M8 20H16" stroke={cores.azul} strokeWidth={1.5} strokeLinecap="round" />
      <Path
        d="M12 7V13M12 13L9.5 10.5M12 13L14.5 10.5"
        stroke={cores.azul}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function IconeMenu() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={5} r={1.8} fill={cores.azul} />
      <Circle cx={12} cy={12} r={1.8} fill={cores.azul} />
      <Circle cx={12} cy={19} r={1.8} fill={cores.azul} />
    </Svg>
  );
}

const passos = [
  { texto: 'Clique no ícone de instalar (⊕ ou tela com seta) no final da barra de endereço', icone: <IconeInstalarBarra /> },
  { texto: 'Se não aparecer, clique nos três pontinhos (⋮) do navegador e escolha "Instalar Traduca..."', icone: <IconeMenu /> },
  { texto: 'Clique em "Instalar" para confirmar', icone: <IconeInstalarBarra /> },
];

export default function ModalDesktop({ visible, onClose }: ModalDesktopProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalIphoneStyle.sobrepor}>
        <View style={modalIphoneStyle.conteudo}>
          <Image
            source={require("@/assets/images/imgIcon/logo-traducaapp.png")}
            style={modalIphoneStyle.logo}
            resizeMode="contain"
          />

          <Text style={modalIphoneStyle.titulo}>Como instalar no computador</Text>
          <Text style={modalIphoneStyle.subtitulo}>
            Para adicionar o app como um programa no seu computador, siga os passos abaixo
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
            Para instalar no celular, abra este mesmo link direto no navegador do celular.
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
