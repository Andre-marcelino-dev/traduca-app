
import {Stack} from "expo-router";
import { useEffect, useState } from "react";

import { carregarSessao } from "@/services/api";

export default function RootLayout(){
  const [pronto, setPronto] = useState(false);

  // Recupera o login salvo antes de mostrar as telas.
  useEffect(() => {
    carregarSessao().finally(() => setPronto(true));
  }, []);

  if (!pronto) return null;

  return(
    <Stack
    screenOptions={{

      headerShown:false
    }}

    />
  );
}
