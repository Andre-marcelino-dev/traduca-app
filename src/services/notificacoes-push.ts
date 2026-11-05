// Pede permissão, pega o token de notificação push do Expo e salva no
// servidor — assim o aluno recebe avisos (nova aula, atividade corrigida...)
// mesmo com o app fechado. Versão web (sem notificação push) em
// notificacoes-push.web.ts.
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { salvarPushToken } from "@/services/api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Chamado ao logar e quando o aluno liga "Ativar notificações" em Config.
// Devolve false se a permissão foi negada ou algo deu errado (sem internet,
// aparelho sem Google Play, etc.) — nunca trava a tela por causa disso.
export async function ativarNotificacoesPush(): Promise<boolean> {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const permissaoAtual = await Notifications.getPermissionsAsync();
    let status = permissaoAtual.status;
    if (status !== "granted") {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== "granted") return false;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) return false;

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    await salvarPushToken(token);
    return true;
  } catch {
    return false;
  }
}

// Apaga o token salvo no servidor (aluno desligou "Ativar notificações").
export async function desativarNotificacoesPush(): Promise<void> {
  try {
    await salvarPushToken(null);
  } catch {}
}
