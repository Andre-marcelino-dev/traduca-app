import { useState } from "react";

import { Alert, Linking, Pressable, Text, TextInput, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import TelaComAbas from "@/components/tela-com-abas";
import { WHATSAPP_PROFESSOR } from "@/constants/contato";
import duvidaStyles from "@/styles/duvidaStyles";
import { cores } from "@/styles/variaveis";

const WHATSAPP_NUMERO = WHATSAPP_PROFESSOR;
const EMAIL_CONTATO = "rpmcaetano@gmail.com";

function formatarWhatsapp(numero: string) {
  const semDDI = numero.replace(/^55/, "");
  const ddd = semDDI.slice(0, 2);
  const parte1 = semDDI.slice(2, 7);
  const parte2 = semDDI.slice(7);
  return `(${ddd}) ${parte1}-${parte2}`;
}

function IconeLinkedin() {
  return <Text style={{ color: cores.branco, fontSize: 13, fontWeight: "bold" }}>in</Text>;
}

function IconeWhatsapp() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.36 11.36 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1C10.16 21 3 13.84 3 5a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.21 1.11l-2.24 2.11z"
        fill={cores.branco}
      />
    </Svg>
  );
}

function IconeInstagram() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Rect x={2} y={2} width={20} height={20} rx={5} stroke={cores.branco} strokeWidth={2} fill="none" />
      <Circle cx={12} cy={12} r={5} stroke={cores.branco} strokeWidth={2} fill="none" />
      <Circle cx={17.5} cy={6.5} r={1.2} fill={cores.branco} />
    </Svg>
  );
}

export default function DuvidaScreen() {
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");

  function enviarMensagem() {
    const texto = `Assunto: ${assunto}\n\n${mensagem}`;
    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;

    Linking.openURL(url)
      .then(() => {
        setAssunto("");
        setMensagem("");
      })
      .catch((erro) => {
        console.error("Não foi possível abrir o WhatsApp:", erro);
        Alert.alert("Não foi possível abrir o WhatsApp", "Verifique se há um navegador ou o WhatsApp instalado.");
      });
  }

  return (
    <TelaComAbas titulo="Tire sua dúvida" subtitulo="Peça mais informações ao professor">
      <TextInput
        value={assunto}
        onChangeText={setAssunto}
        placeholder="Assunto..."
        placeholderTextColor={cores.cinzaEscuro}
        style={duvidaStyles.inputAssunto}
      />

      <TextInput
        value={mensagem}
        onChangeText={setMensagem}
        placeholder="Mensagem..."
        placeholderTextColor={cores.cinzaEscuro}
        multiline
        style={duvidaStyles.inputMensagem}
      />

      <Pressable
        style={({ pressed }) => [
          duvidaStyles.btnEnviar,
          pressed && duvidaStyles.btnEnviarPressed,
        ]}
        onPress={enviarMensagem}
      >
        <Text style={duvidaStyles.txtEnviar}>Enviar mensagem</Text>
      </Pressable>

      <View style={duvidaStyles.cardContato}>
        <Text style={duvidaStyles.contatoTitulo}>Formas de contato</Text>

        <View style={duvidaStyles.contatoBloco}>
          <Text style={duvidaStyles.contatoRotulo}>WhatsApp</Text>
          <Pressable onPress={() => Linking.openURL(`https://wa.me/${WHATSAPP_NUMERO}`)}>
            <Text style={duvidaStyles.contatoValor}>{formatarWhatsapp(WHATSAPP_NUMERO)}</Text>
          </Pressable>
        </View>

        <View style={duvidaStyles.contatoBloco}>
          <Text style={duvidaStyles.contatoRotulo}>E-mail</Text>
          <Pressable onPress={() => Linking.openURL(`mailto:${EMAIL_CONTATO}`)}>
            <Text style={duvidaStyles.contatoValor}>{EMAIL_CONTATO}</Text>
          </Pressable>
        </View>

        <View>
          <Text style={duvidaStyles.contatoRotulo}>Redes sociais</Text>
          <View style={duvidaStyles.redesSociaisLinha}>
            <Pressable style={duvidaStyles.iconeRedeSocial} onPress={() => Linking.openURL("https://linkedin.com")}>
              <IconeLinkedin />
            </Pressable>

            <Pressable
              style={duvidaStyles.iconeRedeSocial}
              onPress={() => Linking.openURL(`https://wa.me/${WHATSAPP_NUMERO}`)}
            >
              <IconeWhatsapp />
            </Pressable>

            <Pressable style={duvidaStyles.iconeRedeSocial} onPress={() => Linking.openURL("https://instagram.com")}>
              <IconeInstagram />
            </Pressable>
          </View>
        </View>
      </View>
    </TelaComAbas>
  );
}
