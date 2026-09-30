import { router } from "expo-router";
import { useState } from "react";

import { Image, Pressable, Switch, Text, View } from "react-native";

import AlterarSenhaModal from "@/components/alterar-senha-modal";
import ModalIphone from "@/components/modal-iphone";
import TelaComAbas from "@/components/tela-com-abas";
import configStyles from "@/styles/configStyles";
import { fotoAlunoUrl, logoutAluno, primeiroNomeAluno } from "@/services/api";
import { cores } from "@/styles/variaveis";

type ItemConfig = {
  titulo: string;
  subtitulo: string;
  icone: number;
  acao: "seta" | "instalar" | "notificacao";
  onPress?: () => void;
};

const minhaConta: ItemConfig[] = [
  {
    titulo: "Perfil",
    subtitulo: "Dados pessoais, telefone e E-mail",
    icone: require("@/assets/images/imgIcon/usuario.png"),
    acao: "seta",
  },
  {
    titulo: "Alterar senha",
    subtitulo: "Atualize sua senha com segurança",
    icone: require("@/assets/images/imgIcon/senha-azul.png"),
    acao: "seta",
  },
];

const appItens: ItemConfig[] = [
  {
    titulo: "Instalar aplicativo",
    subtitulo: "Adicione o app à sua tela inicial",
    icone: require("@/assets/images/imgIcon/download-azul.png"),
    acao: "instalar",
  },
  {
    titulo: "Personalizar app",
    subtitulo: "Personalize seu aplicativo",
    icone: require("@/assets/images/imgIcon/personalizar-azul.png"),
    acao: "seta",
  },
  {
    titulo: "Ativar notificações",
    subtitulo: "Receba avisos sobre atividades e aulas",
    icone: require("@/assets/images/imgIcon/sino-azul.png"),
    acao: "notificacao",
  },
];

function ItemLista({ item }: { item: ItemConfig }) {
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  return (
    <Pressable style={configStyles.itemCard} onPress={item.onPress}>
      <View style={configStyles.itemIconeBox}>
        <Image source={item.icone} style={configStyles.itemIcone} resizeMode="contain" />
      </View>

      <View style={configStyles.itemCorpo}>
        <Text style={configStyles.itemTitulo}>{item.titulo}</Text>
        <Text style={configStyles.itemSubtitulo}>{item.subtitulo}</Text>
      </View>

      {item.acao === "seta" && (
        <Image
          source={require("@/assets/images/imgIcon/voltar-azul.png")}
          style={configStyles.itemSeta}
        />
      )}

      {item.acao === "instalar" && (
        <Pressable style={configStyles.btnInstalar} onPress={item.onPress}>
          <Text style={configStyles.txtBtnInstalar}>Instalar</Text>
        </Pressable>
      )}

      {item.acao === "notificacao" && (
        <Switch
          value={notificacoesAtivas}
          onValueChange={setNotificacoesAtivas}
          trackColor={{ false: cores.cinza, true: cores.azul }}
          thumbColor={cores.branco}
        />
      )}
    </Pressable>
  );
}

export default function ConfigScreen() {
  const [modalAlterarSenhaVisivel, setModalAlterarSenhaVisivel] = useState(false);
  const [modalIphoneVisivel, setModalIphoneVisivel] = useState(false);
  const foto = fotoAlunoUrl();

  return (
    <TelaComAbas
      titulo="Configurações"
      subtitulo="Gerencie seu perfil, desempenho, entre outros"
    >
      <View style={configStyles.cardBoasVindas}>
        <View style={configStyles.avatar}>
          {foto ? (
            <Image source={{ uri: foto }} style={configStyles.avatarFoto} />
          ) : (
            <Image
              source={require("@/assets/images/imgIcon/usuario.png")}
              style={configStyles.avatarIcone}
            />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={configStyles.boasVindasTitulo}>Olá, {primeiroNomeAluno()}!</Text>
          <Text style={configStyles.boasVindasSubtitulo}>
            Acesse e organize sua experiência no app
          </Text>
        </View>
      </View>

      <View style={configStyles.secao}>
        <Text style={configStyles.secaoTitulo}>Meu Progresso</Text>
        <ItemLista
          item={{
            titulo: "Desempenho",
            subtitulo: "Visualize suas aulas e gerencie suas faltas",
            icone: require("@/assets/images/imgIcon/desempenho-azul.png"),
            acao: "seta",
            onPress: () => router.navigate("/desempenho"),
          }}
        />
      </View>

      <View style={configStyles.secao}>
        <Text style={configStyles.secaoTitulo}>Minha conta</Text>
        {minhaConta.map((item) => {
          const onPress =
            item.titulo === "Alterar senha"
              ? () => setModalAlterarSenhaVisivel(true)
              : item.titulo === "Perfil"
                ? () => router.navigate("/perfil")
                : undefined;

          return <ItemLista key={item.titulo} item={{ ...item, onPress }} />;
        })}
      </View>

      <View style={configStyles.secao}>
        <Text style={configStyles.secaoTitulo}>App</Text>
        {appItens.map((item) => {
          const onPress =
            item.titulo === "Instalar aplicativo"
              ? () => setModalIphoneVisivel(true)
              : item.titulo === "Personalizar app"
                ? () => router.navigate("/personalizar")
                : undefined;

          return <ItemLista key={item.titulo} item={{ ...item, onPress }} />;
        })}
      </View>

      <View style={configStyles.secao}>
        <Text style={configStyles.secaoTitulo}>Contato</Text>
        <ItemLista
          item={{
            titulo: "Tire sua dúvida",
            subtitulo: "Peça mais informações ao professor",
            icone: require("@/assets/images/imgIcon/chat.png"),
            acao: "seta",
            onPress: () => router.navigate("/duvida"),
          }}
        />
      </View>

      <Pressable
        style={configStyles.btnSair}
        onPress={async () => {
          await logoutAluno();
          router.replace("/");
        }}
      >
        <Text style={configStyles.txtBtnSair}>Sair da conta</Text>
      </Pressable>

      <AlterarSenhaModal
        visible={modalAlterarSenhaVisivel}
        onClose={() => setModalAlterarSenhaVisivel(false)}
      />

      <ModalIphone
        visible={modalIphoneVisivel}
        onClose={() => setModalIphoneVisivel(false)}
      />
    </TelaComAbas>
  );
}
