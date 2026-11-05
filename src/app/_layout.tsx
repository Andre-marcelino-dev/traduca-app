
import {Stack} from "expo-router";
import { useEffect, useState } from "react";

import { carregarSessao, sessao } from "@/services/api";
import { ativarNotificacoesPush } from "@/services/notificacoes-push";
import { notificacoesEstaoAtivas } from "@/services/preferencia-notificacoes";
import { iniciarEscutaInstalarPwa } from "@/services/pwa-instalar";
import { registrarServiceWorker } from "@/services/registrar-sw";

export default function RootLayout(){
  const [pronto, setPronto] = useState(false);

  // Recupera o login salvo antes de mostrar as telas.
  useEffect(() => {
    carregarSessao().finally(() => setPronto(true));
  }, []);

  // Se o aluno está logado e deixou "Ativar notificações" ligado, registra
  // o aparelho de novo (o token pode ter mudado desde a última vez).
  useEffect(() => {
    if (!pronto || !sessao.token) return;

    notificacoesEstaoAtivas().then((ativas) => {
      if (ativas) ativarNotificacoesPush();
    });
  }, [pronto]);

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
