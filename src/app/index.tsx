import { Redirect, router } from "expo-router";
import { useState } from "react";

import { View, Text, Image, TextInput, Pressable, ActivityIndicator } from "react-native";

import globalStyle from "@/styles/globalStyles";
import loginStyles from "@/styles/loginStyles";
import { loginAluno, sessao } from "@/services/api";

export default function LoginScreen() {
  const [verSenha, setVerSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    const emailLimpo = email.trim();

    if (!emailLimpo || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(emailLimpo)) {
      setErro("Digite um e-mail válido.");
      return;
    }

    setErro("");
    setCarregando(true);
    try {
      await loginAluno(emailLimpo, senha);
      router.replace("/home");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível entrar.");
    } finally {
      setCarregando(false);
    }
  }

  // Quem já está logado (login salvo no aparelho) vai direto para a Home.
  if (sessao.token) {
    return <Redirect href="/home" />;
  }

  return (
       <View style={globalStyle.container}>
      <Image
        source={require('@/assets/images/imgIcon/logo-traducaapp.png')}
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
                    onSubmitEditing={entrar}
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
                  <Text style={loginStyles.txtEsqueciSenha}>
                    Esqueci minha senha
                  </Text>
                </Pressable>
 
                {erro ? <Text style={loginStyles.txtErro}>{erro}</Text> : null}

                <Pressable
                  disabled={carregando}
                  style={({ pressed }) => [
                    loginStyles.btnEntrar,
                    pressed && loginStyles.btnEntrarPressed,

                    
                  ]}
                  onPress={entrar}
                >
                  {carregando ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={loginStyles.txtEntrar}>Entrar</Text>
                  )}
                </Pressable>
 
              </View>
            </View>
</View>
    
  );
}


  
 
