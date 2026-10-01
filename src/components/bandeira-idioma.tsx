import { View } from "react-native";

import BandeiraDesenho from "@/components/bandeira-desenho";
import { cores } from "@/styles/variaveis";

export type IdiomaId = "ingles" | "portugues" | "italiano";

type BandeiraIdiomaProps = {
  idioma: IdiomaId;
  tamanho?: number;
};

// Bandeira redonda do idioma.
export default function BandeiraIdioma({ idioma, tamanho = 44 }: BandeiraIdiomaProps) {
  return (
    <View
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
        backgroundColor: cores.branco,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <BandeiraDesenho idioma={idioma} largura={tamanho} altura={tamanho} />
    </View>
  );
}
