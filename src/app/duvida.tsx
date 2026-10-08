import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import { ActivityIndicator, Alert, Linking, Pressable, Text, TextInput, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import TelaComAbas from "@/components/tela-com-abas";
import { WHATSAPP_PROFESSOR } from "@/constants/contato";
import { buscarDuvidas, Duvida, enviarDuvida, formatarData } from "@/services/api";
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

const statusInfo: Record<Duvida["status"], { texto: string; cor: string }> = {
  pendente: { texto: "Pendente", cor: cores.laranja },
  respondida: { texto: "Respondida", cor: cores.verde },
};

// "2026-10-08T14:00:00-03:00" → "08/10/2026".
function formatarDataHora(iso: string | null): string {
  if (!iso) return "";
  return formatarData(iso.slice(0, 10));
}

export default function DuvidaScreen() {
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useFocusEffect(
    useCallback(() => {
      buscarDuvidas()
        .then((lista) => {
          setDuvidas(lista);
          setErro("");
        })
        .catch((e) => setErro(e instanceof Error ? e.message : "Não foi possível carregar suas dúvidas."))
        .finally(() => setCarregando(false));
    }, [])
  );

  async function enviarMensagem() {
    if (!assunto.trim() || !mensagem.trim()) {
      Alert.alert("Preencha tudo", "Escreva o assunto e a mensagem antes de enviar.");
      return;
    }

    setEnviando(true);
    try {
      const nova = await enviarDuvida(assunto.trim(), mensagem.trim());
      setDuvidas((atuais) => [nova, ...atuais]);
      setAssunto("");
      setMensagem("");
      Alert.alert("Dúvida enviada!", "O professor vai responder em breve.");
    } catch (e) {
      Alert.alert(
        "Não foi possível enviar",
        e instanceof Error ? e.message : "Tente novamente em instantes."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <TelaComAbas titulo="Tire sua dúvida" subtitulo="Peça mais informações ao professor">
      <TextInput
        value={assunto}
        onChangeText={setAssunto}
        placeholder="Assunto..."
        placeholderTextColor={cores.cinzaEscuro}
        maxLength={150}
        style={duvidaStyles.inputAssunto}
      />

      <TextInput
        value={mensagem}
        onChangeText={setMensagem}
        placeholder="Mensagem..."
        placeholderTextColor={cores.cinzaEscuro}
        multiline
        maxLength={2000}
        style={duvidaStyles.inputMensagem}
      />

      <Pressable
        style={({ pressed }) => [
          duvidaStyles.btnEnviar,
          enviando && { opacity: 0.6 },
          pressed && duvidaStyles.btnEnviarPressed,
        ]}
        onPress={enviarMensagem}
        disabled={enviando}
      >
        {enviando ? (
          <ActivityIndicator color={cores.branco} />
        ) : (
          <Text style={duvidaStyles.txtEnviar}>Enviar mensagem</Text>
        )}
      </Pressable>

      <Text style={duvidaStyles.secaoTitulo}>Suas dúvidas</Text>

      {carregando && <ActivityIndicator color={cores.azul} />}

      {!carregando && erro ? <Text style={duvidaStyles.erroTexto}>{erro}</Text> : null}

      {!carregando && !erro && duvidas.length === 0 && (
        <Text style={duvidaStyles.vazioTexto}>Você ainda não enviou nenhuma dúvida.</Text>
      )}

      {!carregando &&
        duvidas.map((duvida) => {
          const status = statusInfo[duvida.status];

          return (
            <View key={duvida.id_duvida} style={duvidaStyles.duvidaCard}>
              <View style={duvidaStyles.duvidaTopo}>
                <Text style={duvidaStyles.duvidaAssunto}>{duvida.assunto}</Text>
                <View style={[duvidaStyles.duvidaStatusBadge, { backgroundColor: `${status.cor}22` }]}>
                  <Text style={[duvidaStyles.duvidaStatusTexto, { color: status.cor }]}>
                    {status.texto}
                  </Text>
                </View>
              </View>

              <Text style={duvidaStyles.duvidaMensagem}>{duvida.mensagem}</Text>
              <Text style={duvidaStyles.duvidaData}>Enviada em {formatarDataHora(duvida.criado_em)}</Text>

              {duvida.resposta_professor ? (
                <View style={duvidaStyles.duvidaRespostaBox}>
                  <Text style={duvidaStyles.duvidaRespostaRotulo}>Resposta do professor</Text>
                  <Text style={duvidaStyles.duvidaRespostaTexto}>{duvida.resposta_professor}</Text>
                </View>
              ) : null}
            </View>
          );
        })}

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
