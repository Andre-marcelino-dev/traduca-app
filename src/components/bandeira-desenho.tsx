import { Image } from "react-native";
import Svg, { Circle, G, Path, Polygon, Rect } from "react-native-svg";

import type { IdiomaId } from "@/components/bandeira-idioma";

type BandeiraDesenhoProps = {
  idioma: IdiomaId;
  largura: number;
  altura: number;
};

// Bandeiras desenhadas (em vez de emoji, que o Windows mostra como "US"/"BR").
// Preenchem a área toda; quem chama recorta em círculo ou retângulo.
export default function BandeiraDesenho({ idioma, largura, altura }: BandeiraDesenhoProps) {
  if (idioma === "italiano") {
    return (
      <Image
        source={require("@/assets/images/imgIcon/bandeira-talia.png")}
        style={{ width: largura, height: altura }}
        resizeMode="cover"
      />
    );
  }

  if (idioma === "portugues") {
    return (
      <Svg width={largura} height={altura} viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice">
        <Rect width="100" height="70" fill="#009C3B" />
        <Polygon points="8,35 50,6 92,35 50,64" fill="#FFDF00" />
        <Circle cx="50" cy="35" r="17" fill="#002776" />
        <Path d="M33.5 31 Q50 25 66.8 38" stroke="#FFFFFF" strokeWidth="3" fill="none" />
      </Svg>
    );
  }

  // Estados Unidos: 13 listras + cantão azul com estrelas simplificadas.
  const listra = 100 / 13;
  return (
    <Svg width={largura} height={altura} viewBox="0 0 190 100" preserveAspectRatio="xMidYMid slice">
      <Rect width="190" height="100" fill="#FFFFFF" />
      {Array.from({ length: 7 }, (_, i) => (
        <Rect key={i} y={i * 2 * listra} width="190" height={listra} fill="#B22234" />
      ))}
      <Rect width="76" height={listra * 7} fill="#3C3B6E" />
      <G fill="#FFFFFF">
        {Array.from({ length: 5 }, (_, linha) =>
          Array.from({ length: 6 }, (_, coluna) => (
            <Circle key={`${linha}-${coluna}`} cx={7 + coluna * 12.4} cy={6 + linha * 10.5} r="2.3" />
          ))
        )}
      </G>
    </Svg>
  );
}
