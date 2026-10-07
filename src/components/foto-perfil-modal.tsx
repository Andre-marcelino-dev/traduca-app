import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import { ActivityIndicator, Image, Modal, Pressable, Text, View } from "react-native";

import { enviarFoto } from "@/services/api";
import fotoPerfilStyle from "@/styles/fotoPerfilStyle";

type FotoPerfilModalProps = {
  visible: boolean;
  onClose: () => void;
  // Chamado depois que a foto nova foi salva (para a tela mostrar a foto nova).
  onFotoAtualizada?: () => void;
};

// Recorte quadrado e compressão: a foto fica leve (o site aceita até 2 MB).
const OPCOES: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.6,
};

export default function FotoPerfilModal({ visible, onClose, onFotoAtualizada }: FotoPerfilModalProps) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function fechar() {
    setErro("");
    setSucesso("");
    onClose();
  }

  async function escolher(origem: "camera" | "galeria") {
    setErro("");
    setSucesso("");

    try {
      const permissao =
        origem === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) {
        setErro(
          origem === "camera"
            ? "Permita o uso da câmera nas configurações do celular para tirar a foto."
            : "Permita o acesso às fotos nas configurações do celular para escolher a foto."
        );
        return;
      }

      const resultado =
        origem === "camera"
          ? await ImagePicker.launchCameraAsync(OPCOES)
          : await ImagePicker.launchImageLibraryAsync(OPCOES);
      if (resultado.canceled || !resultado.assets[0]) return;

      const foto = resultado.assets[0];
      const tipo = foto.mimeType ?? "image/jpeg";
      const extensao = tipo.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";

      setEnviando(true);
      const mensagem = await enviarFoto({
        uri: foto.uri,
        nome: foto.fileName ?? `perfil.${extensao}`,
        tipo,
        arquivoWeb: foto.file ?? undefined,
      });
      setSucesso(mensagem);
      onFotoAtualizada?.();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível trocar a foto.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={fechar}>
      <View style={fotoPerfilStyle.sobrepor}>
        <View style={fotoPerfilStyle.conteudo}>
          <Pressable style={fotoPerfilStyle.btnFechar} onPress={fechar}>
            <Image
              source={require("@/assets/images/imgIcon/voltar-azul.png")}
              style={fotoPerfilStyle.iconeFechar}
            />
          </Pressable>

          <View style={fotoPerfilStyle.iconeBox}>
            <Image
              source={require("@/assets/images/imgIcon/usuario.png")}
              style={fotoPerfilStyle.icone}
            />
          </View>

          <Text style={fotoPerfilStyle.titulo}>Mude sua foto de perfil</Text>

          {enviando ? (
            <ActivityIndicator size="large" color="#1B2CC1" />
          ) : (
            <>
              <Pressable
                style={[fotoPerfilStyle.btn, fotoPerfilStyle.btnPreenchido]}
                onPress={() => escolher("camera")}
              >
                <Image
                  source={require("@/assets/images/imgIcon/camera.png")}
                  style={fotoPerfilStyle.btnIcone}
                />
                <Text style={fotoPerfilStyle.btnTextoPreenchido}>Tirar foto</Text>
              </Pressable>

              <Pressable
                style={[fotoPerfilStyle.btn, fotoPerfilStyle.btnPreenchido, { marginBottom: 0 }]}
                onPress={() => escolher("galeria")}
              >
                <Image
                  source={require("@/assets/images/imgIcon/foto-usuario.png")}
                  style={fotoPerfilStyle.btnIcone}
                />
                <Text style={fotoPerfilStyle.btnTextoPreenchido}>Escolher na galeria</Text>
              </Pressable>
            </>
          )}

          {erro ? <Text style={fotoPerfilStyle.txtErro}>{erro}</Text> : null}
          {sucesso ? <Text style={fotoPerfilStyle.txtSucesso}>{sucesso}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}
