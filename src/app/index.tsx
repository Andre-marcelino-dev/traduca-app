import { router } from "expo-router";
import { useState } from "react";

import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { ApiError, apiFetch, Aluno, salvarSessao } from "@/services/api";
import globalStyle from "@/styles/globalStyles";
import loginStyles from "@/styles/loginStyles";

type LoginResposta = {
  success: boolean;
  data: {
    token: string;
    aluno: Aluno;
  };
};

export default function LoginScreen() {
  const [verSenha, setVerSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function fazerLogin() {
    setErro("");

    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await apiFetch<LoginResposta>("/aluno/login", {
        method: "POST",
        body: JSON.stringify({
          email_aluno: email.trim(),
          senha_aluno: senha,
          device_name: "traduca-app",
        }),
      });

      await salvarSessao(resposta.data.token, resposta.data.aluno);

      router.replace("/home");
    } catch (e) {
      if (e instanceof ApiError) {
        // 401 -> "Email ou senha inválidos." | 422 -> erro de validação | 429 -> muitas tentativas
        setErro(e.message);
      } else {
        setErro("Sem conexão com o servidor. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={globalStyle.container}>
      <Image
        source={require("@/assets/images/imgIcon/logo-traducaapp.png")}
        style={globalStyle.logoMaior}
        resizeMode="contain"
      />

      <View style={loginStyles.conteudo}>
        <Text style={loginStyles.titulo}>Bem-vindo(a)!</Text>
        <Text>Faça seu login para continuar</Text>

        {/* Formulario de login */}
        <View style={loginStyles.form}>
          <View style={loginStyles.input}>
            <Image
              source={require("@/assets/images/imgIcon/email-azul.png")}
              style={loginStyles.icone}
            />

            <TextInput
              placeholder="E-mail"
              placeholderTextColor="#888888"
              keyboardType="email-address"
              autoCapitalize="none"
              style={loginStyles.TextInput}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={loginStyles.input}>
            <Image
              source={require("@/assets/images/imgIcon/senha-azul.png")}
              style={loginStyles.icone}
            />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#888888"
              style={loginStyles.TextInput}
              secureTextEntry={!verSenha}
              value={senha}
              onChangeText={setSenha}
            />

            <Pressable
              style={loginStyles.btnMostrarSenha}
              onPress={() => setVerSenha((current) => !current)}
            >
              <Image
                source={
                  verSenha
                    ? require("@/assets/images/imgIcon/esconder.png")
                    : require("@/assets/images/imgIcon/visualizar-azul.png")
                }
                style={loginStyles.mostrarSenha}
              />
            </Pressable>
          </View>

          <Pressable
            style={loginStyles.btnEsqueciSenha}
            onPress={() => router.navigate("/esqueci-senha")}
          >
            <Text style={loginStyles.txtEsqueciSenha}>Esqueci minha senha</Text>
          </Pressable>

          {erro !== "" && (
            <Text style={{ color: "#D32F2F", textAlign: "center", marginBottom: 8 }}>
              {erro}
            </Text>
          )}

          <Pressable
            style={({ pressed }) => [
              loginStyles.btnEntrar,
              pressed && loginStyles.btnEntrarPressed,
              carregando && { opacity: 0.6 },
            ]}
            onPress={fazerLogin}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={loginStyles.txtEntrar}>Entrar</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
