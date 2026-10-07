import { useState } from "react";

import { ActivityIndicator, Image, Modal, Pressable, Text, TextInput, View } from "react-native";

import { alterarSenha } from "@/services/api";
import alterarSenhaStyle from "@/styles/alterarSenhaStyle";

type AlterarSenhaModalProps = {
  visible: boolean;
  onClose: () => void;
};

type CampoSenhaProps = {
  rotulo: string;
  valor: string;
  aoMudar: (texto: string) => void;
};

function CampoSenha({ rotulo, valor, aoMudar }: CampoSenhaProps) {
  const [verSenha, setVerSenha] = useState(false);

  return (
    <View style={alterarSenhaStyle.campo}>
      <Text style={alterarSenhaStyle.rotulo}>{rotulo}</Text>

      <View style={alterarSenhaStyle.input}>
        <TextInput
          style={alterarSenhaStyle.textInput}
          secureTextEntry={!verSenha}
          placeholderTextColor="#888888"
          autoCapitalize="none"
          value={valor}
          onChangeText={aoMudar}
        />

        <Pressable onPress={() => setVerSenha((atual) => !atual)}>
          <Image
            source={
              verSenha
                ? require("@/assets/images/imgIcon/esconder.png")
                : require("@/assets/images/imgIcon/visualizar-azul.png")
            }
            style={alterarSenhaStyle.iconeMostrarSenha}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function AlterarSenhaModal({ visible, onClose }: AlterarSenhaModalProps) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Fecha e limpa tudo (senha não fica guardada na tela).
  function fechar() {
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmacao("");
    setErro("");
    setSucesso("");
    onClose();
  }

  async function salvar() {
    setErro("");
    setSucesso("");

    if (!senhaAtual || !novaSenha || !confirmacao) {
      setErro("Preencha os três campos.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmacao) {
      setErro("A confirmação não confere com a nova senha.");
      return;
    }
    if (novaSenha === senhaAtual) {
      setErro("A nova senha precisa ser diferente da atual.");
      return;
    }

    setSalvando(true);
    try {
      const mensagem = await alterarSenha(senhaAtual, novaSenha, confirmacao);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmacao("");
      setSucesso(mensagem);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível alterar a senha.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={fechar}>
      <View style={alterarSenhaStyle.sobrepor}>
        <View style={alterarSenhaStyle.conteudo}>
          <Pressable style={alterarSenhaStyle.btnFechar} onPress={fechar}>
            <Image
              source={require("@/assets/images/imgIcon/voltar-azul.png")}
              style={alterarSenhaStyle.iconeFechar}
            />
          </Pressable>

          <Text style={alterarSenhaStyle.titulo}>Atualize sua senha</Text>

          <CampoSenha rotulo="Senha atual" valor={senhaAtual} aoMudar={setSenhaAtual} />
          <CampoSenha rotulo="Nova senha" valor={novaSenha} aoMudar={setNovaSenha} />
          <CampoSenha rotulo="Confirmar senha" valor={confirmacao} aoMudar={setConfirmacao} />

          {erro ? <Text style={alterarSenhaStyle.txtErro}>{erro}</Text> : null}
          {sucesso ? (
            <Text style={alterarSenhaStyle.txtSucesso}>
              {sucesso} Seus outros aparelhos foram desconectados.
            </Text>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              alterarSenhaStyle.btnSalvar,
              pressed && alterarSenhaStyle.btnSalvarPressed,
            ]}
            onPress={sucesso ? fechar : salvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={alterarSenhaStyle.txtSalvar}>{sucesso ? "Fechar" : "Salvar alterações"}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
