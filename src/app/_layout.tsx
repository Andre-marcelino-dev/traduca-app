
import {Stack} from "expo-router";
import { useEffect, useState } from "react";

import { carregarSessao } from "@/services/api";
import { iniciarEscutaInstalarPwa } from "@/services/pwa-instalar";
import { registrarServiceWorker } from "@/services/registrar-sw";

export default function RootLayout(){
  const [pronto, setPronto] = useState(false);

  // Recupera o login salvo antes de mostrar as telas.
  useEffect(() => {
    carregarSessao().finally(() => setPronto(true));
  }, []);

  // Libera a instalação em um toque no Android/Chrome. Precisa começar aqui,
  // assim que o app abre — se esperasse até a tela de Config, o aviso do
  // Chrome podia chegar antes (em outra tela) e se perder pra sempre.
  useEffect(() => {
    registrarServiceWorker();
    iniciarEscutaInstalarPwa();
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
