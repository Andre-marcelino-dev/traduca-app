// Onde o token (a "chave" do login) fica guardado no CELULAR: no cofre do
// aparelho (Keychain no iPhone, Keystore no Android), criptografado.
// A versão do navegador fica em cofre.web.ts.
import * as SecureStore from "expo-secure-store";

const CHAVE_TOKEN = "traduca_token";

// Só neste aparelho e só com o celular desbloqueado (não vai para backups).
const OPCOES: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export async function lerToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(CHAVE_TOKEN, OPCOES);
  } catch {
    return null;
  }
}

export async function guardarToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(CHAVE_TOKEN, token, OPCOES);
  } catch {}
}

export async function apagarToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(CHAVE_TOKEN, OPCOES);
  } catch {}
}
