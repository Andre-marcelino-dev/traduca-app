// Lembra se o aluno deixou "Ativar notificações" ligado ou desligado (em
// Config), pra não pedir permissão de novo toda vez que abre o app.
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE = "traduca_notificacoes_ativas";

// Sem valor salvo ainda = assume ligado (comportamento padrão da tela).
export async function notificacoesEstaoAtivas(): Promise<boolean> {
  try {
    const valor = await AsyncStorage.getItem(CHAVE);
    return valor !== "false";
  } catch {
    return true;
  }
}

export async function salvarPreferenciaNotificacoes(ativas: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(CHAVE, ativas ? "true" : "false");
  } catch {}
}
