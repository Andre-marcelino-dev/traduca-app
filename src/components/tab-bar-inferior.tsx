import { router, usePathname } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import tabBarStyles from "@/styles/tabBarStyles";
import { cores } from "@/styles/variaveis";

const abas = [
  {
    label: "Aulas",
    icone: require("@/assets/images/imgIcon/aula-azul.png"),
    rota: "/aulas",
  },
  {
    label: "Agenda",
    icone: require("@/assets/images/imgIcon/calendario-azul.png"),
    rota: "/agenda",
  },
  {
    label: "Atividades",
    icone: require("@/assets/images/imgIcon/atividades-azul.png"),
    rota: "/atividades",
  },
  {
    label: "Curso",
    icone: require("@/assets/images/imgIcon/curso-azul.png"),
    rota: "/curso",
  },
  {
    label: "Config",
    icone: require("@/assets/images/imgIcon/config-azul.png"),
    rota: "/config",
  },
] as const;

export default function TabBarInferior() {
  const pathname = usePathname();

  return (
    <View style={tabBarStyles.container}>
      {abas.map((aba) => {
        const ativa =
          pathname === aba.rota ||
          pathname.startsWith(`${aba.rota}-`) ||
          // Tela de uma atividade (/atividade) fica dentro da aba Atividades.
          (aba.rota === "/atividades" && pathname === "/atividade");

        return (
          <Pressable
            key={aba.label}
            style={tabBarStyles.item}
            onPress={() => router.navigate(aba.rota as never)}
          >
            <Image
              source={aba.icone}
              style={[
                tabBarStyles.icone,
                { tintColor: ativa ? cores.vermelho : cores.branco },
              ]}
            />
            <Text
              style={[
                tabBarStyles.legenda,
                ativa && tabBarStyles.legendaAtiva,
              ]}
            >
              {aba.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
