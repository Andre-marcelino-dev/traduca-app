import { router } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SinoNotificacoes from "@/components/sino-notificacoes";
import TabBarInferior from "@/components/tab-bar-inferior";
import telaPadraoStyles from "@/styles/telaPadraoStyles";

type TelaComAbasProps = {
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
};

export default function TelaComAbas({ titulo, subtitulo, children }: TelaComAbasProps) {
  return (
    <SafeAreaView style={telaPadraoStyles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={telaPadraoStyles.conteudo}>
        <View style={telaPadraoStyles.cabecalho}>
          <Pressable style={telaPadraoStyles.btnVoltar} onPress={() => router.back()}>
            <Image
              source={require("@/assets/images/imgIcon/voltar-azul.png")}
              style={telaPadraoStyles.iconeVoltar}
            />
          </Pressable>

          <View style={telaPadraoStyles.tituloCabecalhoColuna}>
            <Text style={telaPadraoStyles.tituloCabecalho}>{titulo}</Text>
            {subtitulo ? (
              <Text style={telaPadraoStyles.subtituloCabecalho}>{subtitulo}</Text>
            ) : null}
          </View>

          <SinoNotificacoes
            estiloBotao={telaPadraoStyles.btnNotificacao}
            estiloIcone={telaPadraoStyles.iconeNotificacao}
          />
        </View>

        {children}
      </ScrollView>

      <TabBarInferior />
    </SafeAreaView>
  );
}
