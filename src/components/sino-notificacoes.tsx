import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { Image, ImageStyle, Pressable, StyleProp, Text, View, ViewStyle } from "react-native";

import CentralNotificacoesModal from "@/components/central-notificacoes-modal";
import { buscarNotificacoes, sessao } from "@/services/api";
import centralNotificacoesStyle from "@/styles/centralNotificacoesStyle";

type SinoNotificacoesProps = {
  estiloBotao: StyleProp<ViewStyle>;
  estiloIcone: StyleProp<ImageStyle>;
};

// O sino do topo das telas: número vermelho com os avisos não lidos e,
// ao tocar, a Central de notificações.
export default function SinoNotificacoes({ estiloBotao, estiloIcone }: SinoNotificacoesProps) {
  const [aberta, setAberta] = useState(false);
  const [naoLidas, setNaoLidas] = useState(0);

  // Atualiza o número sempre que a tela aparece.
  useFocusEffect(
    useCallback(() => {
      if (!sessao.token) return;
      let ativo = true;
      buscarNotificacoes()
        .then((dados) => ativo && setNaoLidas(dados.nao_lidas))
        .catch(() => {}); // sem internet: o sino só fica sem número
      return () => {
        ativo = false;
      };
    }, [])
  );

  return (
    <>
      <Pressable style={estiloBotao} onPress={() => setAberta(true)}>
        <Image source={require("@/assets/images/imgIcon/sino-azul.png")} style={estiloIcone} />
        {naoLidas > 0 && (
          <View style={centralNotificacoesStyle.contador}>
            <Text style={centralNotificacoesStyle.contadorTexto}>{naoLidas > 99 ? "99+" : naoLidas}</Text>
          </View>
        )}
      </Pressable>

      <CentralNotificacoesModal
        visible={aberta}
        onClose={() => setAberta(false)}
        onNaoLidas={setNaoLidas}
      />
    </>
  );
}
