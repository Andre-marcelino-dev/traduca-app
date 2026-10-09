import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { View, Text, Image, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";

import globalStyle from "@/styles/globalStyles";
import redefinirSenhaStyle from "@/styles/redefinirSenhaStyle";
import { redefinirSenha } from "@/services/api";

export default function RedefinirSenhaScreen() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();

  const [email, setEmail] = useState(emailParam ?? "");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function salvar() {
    if (!email.trim() || !codigo.trim() || !novaSenha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }
    setErro("");
    setSalvando(true);
    try {
      await redefinirSenha(email.trim(), codigo.trim(), novaSenha, confirmarSenha);
      Alert.alert("Senha redefinida!", "Faça login com a sua nova senha.", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível redefinir a senha.");
    } finally {
      setSalvando(false);
    }
  }

  return (
       <View style={globalStyle.container}>
      <Image
        source={require('@/assets/images/imgIcon/logo-traducaapp.png')}
        style={globalStyle.logoMaior}
       resizeMode="contain"

      />

    <View style={redefinirSenhaStyle.conteudo}>

      <Text style={redefinirSenhaStyle.titulo}>Redefinir senha</Text>
      <Text style={redefinirSenhaStyle.subtitulo}>Crie uma nova senha para entrar na sua conta</Text>

              <View style={redefinirSenhaStyle.form}>

              <View style={redefinirSenhaStyle.input}>
                  <Image
                    source={require("@/assets/images/imgIcon/email-azul.png")}
                    style={redefinirSenhaStyle.icone}
                  />
                  <TextInput
                    placeholder="E-mail"
                    placeholderTextColor="#888888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={redefinirSenhaStyle.TextInput}
                    value={email}
                    onChangeText={setEmail}
                    editable={!salvando}
                  />
                </View>

              <View style={redefinirSenhaStyle.input}>
                  <Image
                    source={require("@/assets/images/imgIcon/senha-azul.png")}
                    style={redefinirSenhaStyle.icone}
                  />
                  <TextInput
                    placeholder="Código recebido por e-mail"
                    placeholderTextColor="#888888"
                    keyboardType="number-pad"
                    maxLength={6}
                    style={redefinirSenhaStyle.TextInput}
                    value={codigo}
                    onChangeText={setCodigo}
                    editable={!salvando}
                  />
                </View>

              <View style={redefinirSenhaStyle.input}>
                  <Image
                    source={require("@/assets/images/imgIcon/senha-azul.png")}
                    style={redefinirSenhaStyle.icone}
                  />
                  <TextInput
                    placeholder="Nova senha"
                    placeholderTextColor="#888888"
                    style={redefinirSenhaStyle.TextInput}
                    secureTextEntry={!verSenha}
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    editable={!salvando}
                  />

                  <Pressable
                    style={redefinirSenhaStyle.btnMostrarSenha}
                    onPress={() => setVerSenha((current) => !current)}
                  >
                    <Image
                      source={
                        verSenha
                        ? require("@/assets/images/imgIcon/esconder.png")
                        : require("@/assets/images/imgIcon/visualizar-azul.png")
                      }
                      style={redefinirSenhaStyle.mostrarSenha}
                    />
                  </Pressable>
                </View>

                <View style={redefinirSenhaStyle.input}>
                  <Image
                    source={require("@/assets/images/imgIcon/senha-azul.png")}
                    style={redefinirSenhaStyle.icone}
                  />
                  <TextInput
                    placeholder="Confirmar senha"
                    placeholderTextColor="#888888"
                    style={redefinirSenhaStyle.TextInput}
                    secureTextEntry={!verSenha}
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    editable={!salvando}
                  />

                  <Pressable
                    style={redefinirSenhaStyle.btnMostrarSenha}
                    onPress={() => setVerSenha((current) => !current)}
                  >
                    <Image
                      source={
                        verSenha
                        ? require("@/assets/images/imgIcon/esconder.png")
                        : require("@/assets/images/imgIcon/visualizar-azul.png")
                      }
                      style={redefinirSenhaStyle.mostrarSenha}
                    />
                  </Pressable>
                </View>

                {erro ? <Text style={redefinirSenhaStyle.erroTexto}>{erro}</Text> : null}

                <Pressable
                  style={({ pressed }) => [
                    redefinirSenhaStyle.btnEntrar,
                    pressed && redefinirSenhaStyle.btnEntrarPressed,
                    salvando && redefinirSenhaStyle.btnDesabilitado,
                  ]}
                  onPress={salvar}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={redefinirSenhaStyle.txtEntrar}>Salvar senha</Text>
                  )}
                </Pressable>

                <Pressable
                  style={redefinirSenhaStyle.btnVoltarLogin}
                  onPress={() => router.navigate("/")}
                >
                  <Text style={redefinirSenhaStyle.txtVoltarLogin}>Voltar ao login</Text>
                </Pressable>

              </View>
            </View>
    </View>
  );
}
