// Versão do navegador do cofre.ts: o navegador não tem cofre, então o token
// fica no armazenamento do próprio navegador (como antes).
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_TOKEN = "traduca_token";

export async function lerToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

export async function guardarToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(CHAVE_TOKEN, token);
  } catch {}
}

export async function apagarToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CHAVE_TOKEN);
  } catch {}
}
