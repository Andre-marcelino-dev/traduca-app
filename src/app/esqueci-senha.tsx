import { router } from "expo-router";
import { useState } from "react";

import { View, Text, Image, TextInput, Pressable, ActivityIndicator } from "react-native";

import globalStyle from "@/styles/globalStyles";
import esqueciSenhaStyle from "@/styles/esqueciSenhaStyle";
import EnviarLinkModal from "@/components/linkSenhaModal";
import { esqueciSenha } from "@/services/api";

export default function EsqueciSenhaScreen() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [modalLinkSenha, setModalLinkSenha] = useState(false);

  async function enviar() {
    if (!email.trim()) {
      setErro("Informe seu e-mail.");
      return;
    }
    setErro("");
    setEnviando(true);
    try {
      await esqueciSenha(email.trim());
      setModalLinkSenha(true);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível enviar o código.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={globalStyle.container}>
      <Image
        source={require('@/assets/images/imgIcon/logo-traducaapp.png')}
        style={globalStyle.logoMaior}
       resizeMode="contain"
    />

    <View style={esqueciSenhaStyle.conteudo}>

      <Text style={esqueciSenhaStyle.titulo}>Esqueci a senha</Text>
      <Text>Informe seu e-mail para receber o código de redefinição de senha</Text>

                    {/* Formulario de login */}
              <View style={esqueciSenhaStyle.form}>
                <View style={esqueciSenhaStyle.input}>
                  <Image
                    source={require("@/assets/images/imgIcon/email-azul.png")}
                    style={esqueciSenhaStyle.icone}
                  />

                  <TextInput
                    placeholder="E-mail"
                    placeholderTextColor="#888888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={esqueciSenhaStyle.TextInput}
                    value={email}
                    onChangeText={setEmail}
                    editable={!enviando}
                  />
                </View>

              {erro ? <Text style={esqueciSenhaStyle.erroTexto}>{erro}</Text> : null}

              <Pressable
                  style={({ pressed }) => [
                    esqueciSenhaStyle.btnEnviarLink,
                    pressed && esqueciSenhaStyle.btnEnviarLinkPressed,
                    enviando && esqueciSenhaStyle.btnDesabilitado,
                  ]}
                  onPress={enviar}
                  disabled={enviando}
                >
                  {enviando ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={esqueciSenhaStyle.txtEnviarLink}>Enviar código</Text>
                  )}
                </Pressable>

                  <Pressable
                      style={({ pressed }) => [
                          esqueciSenhaStyle.btnVoltarLogin,
                          pressed && esqueciSenhaStyle.btnVoltarLoginPressed,
                      ]}
                       onPress={() => router.navigate("/")}
                  >
                      <Text style={esqueciSenhaStyle.txtVoltarLogin}>Voltar ao login</Text>
                  </Pressable>

              </View>
            </View>

          <EnviarLinkModal
              visible={modalLinkSenha}
              onClose={() => {
                  setModalLinkSenha(false);
                  router.navigate({ pathname: "/redefinir-senha", params: { email: email.trim() } });
              }}
          />
</View>

  );
}
