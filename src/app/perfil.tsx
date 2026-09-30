import { router } from "expo-router";
import { useState } from "react";

import { Image, Pressable, Text, TextInput, View } from "react-native";

import BandeiraIdioma from "@/components/bandeira-idioma";
import FotoPerfilModal from "@/components/foto-perfil-modal";
import TelaComAbas from "@/components/tela-com-abas";
import perfilStyles from "@/styles/perfilStyles";
import { fotoAlunoUrl, sessao } from "@/services/api";

export default function PerfilScreen() {
  const [modalFotoVisivel, setModalFotoVisivel] = useState(false);
  const foto = fotoAlunoUrl();
  const nome = sessao.aluno?.nome_aluno ?? "";
  const email = sessao.aluno?.email_aluno ?? "";

  return (
    <TelaComAbas titulo="Perfil">
      <View style={perfilStyles.cardPerfil}>
        <View style={perfilStyles.avatarWrapper}>
          <View style={perfilStyles.avatar}>
            {foto ? (
              <Image source={{ uri: foto }} style={perfilStyles.avatarFoto} />
            ) : (
              <Image
                source={require("@/assets/images/imgIcon/usuario.png")}
                style={perfilStyles.avatarIcone}
              />
            )}
          </View>

          <Pressable
            style={perfilStyles.btnCamera}
            onPress={() => setModalFotoVisivel(true)}
          >
            <Image
              source={require("@/assets/images/imgIcon/camera.png")}
              style={perfilStyles.iconeCamera}
            />
          </Pressable>
        </View>

        <Text style={perfilStyles.nome}>{nome}</Text>

        <View style={perfilStyles.statusBadge}>
          <Text style={perfilStyles.statusBadgeTexto}>Aluno(a) Ativo(a)</Text>
        </View>
      </View>

      <View style={perfilStyles.secao}>
        <Text style={perfilStyles.secaoTitulo}>Informações pessoais</Text>

        <View style={perfilStyles.campo}>
          <Text style={perfilStyles.rotulo}>Nome completo</Text>
          <View style={perfilStyles.inputComIcone}>
            <Image
              source={require("@/assets/images/imgIcon/usuario.png")}
              style={perfilStyles.campoIcone}
            />
            <TextInput
              style={perfilStyles.campoTextInput}
              defaultValue={nome}
              placeholderTextColor="#888888"
            />
          </View>
        </View>

        <View style={perfilStyles.campo}>
          <Text style={perfilStyles.rotulo}>Telefone</Text>
          <View style={perfilStyles.inputComIcone}>
            <Image
              source={require("@/assets/images/imgIcon/telefone.png")}
              style={perfilStyles.campoIcone}
            />
            <TextInput
              style={perfilStyles.campoTextInput}
              defaultValue="(11) 98888-7777"
              keyboardType="phone-pad"
              placeholderTextColor="#888888"
            />
          </View>
        </View>

        <View style={perfilStyles.campo}>
          <Text style={perfilStyles.rotulo}>E-mail</Text>
          <View style={perfilStyles.inputComIcone}>
            <Image
              source={require("@/assets/images/imgIcon/email-azul.png")}
              style={perfilStyles.campoIcone}
            />
            <TextInput
              style={perfilStyles.campoTextInput}
              defaultValue={email}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888888"
            />
          </View>
        </View>
      </View>

      <View style={perfilStyles.secao}>
        <Text style={perfilStyles.secaoTitulo}>Informações do curso</Text>

        <View style={perfilStyles.campo}>
          <Text style={perfilStyles.rotulo}>Idioma</Text>
          <View style={perfilStyles.inputComIcone}>
            <View style={{ marginRight: 10 }}>
              <BandeiraIdioma idioma="ingles" tamanho={22} />
            </View>
            <Text style={perfilStyles.campoValorTexto}>Inglês</Text>
          </View>
        </View>

        <View style={perfilStyles.campo}>
          <Text style={perfilStyles.rotulo}>Nível</Text>
          <View style={perfilStyles.inputComIcone}>
            <Image
              source={require("@/assets/images/imgIcon/trofeu-azul.png")}
              style={perfilStyles.campoIcone}
            />
            <Text style={perfilStyles.campoValorTexto}>Básico II</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          perfilStyles.btnSalvar,
          pressed && perfilStyles.btnSalvarPressed,
        ]}
        onPress={() => router.navigate("/home")}
      >
        <Text style={perfilStyles.txtSalvar}>Salvar alterações</Text>
      </Pressable>

      <FotoPerfilModal
        visible={modalFotoVisivel}
        onClose={() => setModalFotoVisivel(false)}
      />
    </TelaComAbas>
  );
}
