import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from "react-native";

import BandeiraIdioma, { idiomaDoCurso } from "@/components/bandeira-idioma";
import EstadoVazio from "@/components/estado-vazio";
import FotoPerfilModal from "@/components/foto-perfil-modal";
import TelaComAbas from "@/components/tela-com-abas";
import { alterarEmail, buscarPerfil, fotoAlunoUrl, Perfil } from "@/services/api";
import perfilStyles from "@/styles/perfilStyles";
import { cores } from "@/styles/variaveis";

const textoSituacao: Record<string, string> = {
  "EM CURSO": "Aluno(a) em curso",
  CONCLUIDO: "Curso concluído",
};

export default function PerfilScreen() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [modalFotoVisivel, setModalFotoVisivel] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [erroSalvar, setErroSalvar] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregar = useCallback(async () => {
    try {
      const dados = await buscarPerfil();
      setPerfil(dados);
      setEmail(dados.email_aluno);
      setErro("");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível carregar o perfil.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const emailMudou = !!perfil && email.trim().toLowerCase() !== perfil.email_aluno.toLowerCase();

  async function salvar() {
    setErroSalvar("");
    setSucesso("");

    if (!emailMudou) {
      setErroSalvar("Nenhuma alteração para salvar.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErroSalvar("Digite um e-mail válido.");
      return;
    }
    if (!senhaAtual) {
      setErroSalvar("Para trocar o e-mail, informe sua senha atual.");
      return;
    }

    setSalvando(true);
    try {
      const mensagem = await alterarEmail(email.trim(), senhaAtual);
      setSenhaAtual("");
      await carregar();
      setSucesso(`${mensagem} Use o novo e-mail no próximo login.`);
    } catch (e) {
      setErroSalvar(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  const foto = fotoAlunoUrl();

  return (
    <TelaComAbas titulo="Perfil">
      {carregando && <ActivityIndicator size="large" color={cores.azul} />}

      {!carregando && erro ? (
        <EstadoVazio icone={require("@/assets/images/imgIcon/usuario.png")} texto={erro} />
      ) : null}

      {!carregando && !erro && perfil && (
      <>
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

        <Text style={perfilStyles.nome}>{perfil.nome_aluno}</Text>

        {perfil.status_aluno && textoSituacao[perfil.status_aluno] ? (
          <View style={perfilStyles.statusBadge}>
            <Text style={perfilStyles.statusBadgeTexto}>{textoSituacao[perfil.status_aluno]}</Text>
          </View>
        ) : null}
      </View>

      <View style={perfilStyles.secao}>
        <Text style={perfilStyles.secaoTitulo}>Informações pessoais</Text>

        <View style={perfilStyles.campo}>
          <Text style={perfilStyles.rotulo}>Nome completo</Text>
          <View style={[perfilStyles.inputComIcone, perfilStyles.inputSomenteLeitura]}>
            <Image
              source={require("@/assets/images/imgIcon/usuario.png")}
              style={perfilStyles.campoIcone}
            />
            <Text style={perfilStyles.campoTextInput}>{perfil.nome_aluno}</Text>
          </View>
        </View>

        <View style={perfilStyles.campo}>
          <Text style={perfilStyles.rotulo}>Telefone</Text>
          <View style={[perfilStyles.inputComIcone, perfilStyles.inputSomenteLeitura]}>
            <Image
              source={require("@/assets/images/imgIcon/telefone.png")}
              style={perfilStyles.campoIcone}
            />
            <Text style={perfilStyles.campoTextInput}>{perfil.telefone_aluno || "Não informado"}</Text>
          </View>
          <Text style={perfilStyles.ajuda}>Para alterar nome ou telefone, fale com a escola.</Text>
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
              value={email}
              onChangeText={(texto) => {
                setEmail(texto);
                setErroSalvar("");
                setSucesso("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888888"
            />
          </View>
        </View>

        {/* Só aparece quando o e-mail foi alterado: trocar o e-mail (login) pede a senha */}
        {emailMudou && (
          <View style={perfilStyles.campo}>
            <Text style={perfilStyles.rotulo}>Senha atual (para confirmar o novo e-mail)</Text>
            <View style={perfilStyles.inputComIcone}>
              <Image
                source={require("@/assets/images/imgIcon/senha-azul.png")}
                style={perfilStyles.campoIcone}
              />
              <TextInput
                style={perfilStyles.campoTextInput}
                value={senhaAtual}
                onChangeText={setSenhaAtual}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#888888"
              />
            </View>
          </View>
        )}
      </View>

      <View style={perfilStyles.secao}>
        <Text style={perfilStyles.secaoTitulo}>Informações do curso</Text>

        {perfil.cursos.length === 0 && (
          <Text style={perfilStyles.ajuda}>Nenhuma matrícula ativa no momento.</Text>
        )}

        {perfil.cursos.map((curso) => {
          const idioma = idiomaDoCurso(curso.nome_curso);
          return (
            <View key={curso.id_curso} style={{ flexDirection: "row", gap: 10 }}>
              <View style={[perfilStyles.campo, { flex: 1 }]}>
                <Text style={perfilStyles.rotulo}>Idioma</Text>
                <View style={perfilStyles.inputComIcone}>
                  {idioma && (
                    <View style={{ marginRight: 10 }}>
                      <BandeiraIdioma idioma={idioma} tamanho={22} />
                    </View>
                  )}
                  <Text style={perfilStyles.campoValorTexto}>{curso.nome_curso}</Text>
                </View>
              </View>

              <View style={[perfilStyles.campo, { flex: 1 }]}>
                <Text style={perfilStyles.rotulo}>Nível</Text>
                <View style={perfilStyles.inputComIcone}>
                  <Image
                    source={require("@/assets/images/imgIcon/trofeu-azul.png")}
                    style={perfilStyles.campoIcone}
                  />
                  <Text style={perfilStyles.campoValorTexto}>{curso.nome_nivel ?? "—"}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {erroSalvar ? <Text style={perfilStyles.txtErro}>{erroSalvar}</Text> : null}
      {sucesso ? <Text style={perfilStyles.txtSucesso}>{sucesso}</Text> : null}

      <Pressable
        style={({ pressed }) => [
          perfilStyles.btnSalvar,
          pressed && perfilStyles.btnSalvarPressed,
        ]}
        onPress={salvar}
        disabled={salvando}
      >
        {salvando ? (
          <ActivityIndicator color={cores.branco} />
        ) : (
          <Text style={perfilStyles.txtSalvar}>Salvar alterações</Text>
        )}
      </Pressable>
      </>
      )}

      <FotoPerfilModal
        visible={modalFotoVisivel}
        onClose={() => setModalFotoVisivel(false)}
        onFotoAtualizada={carregar}
      />
    </TelaComAbas>
  );
}
