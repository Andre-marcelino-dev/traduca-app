import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { obterToken } from "@/services/api";

export async function abrirMaterial(url: string, nomeArquivo: string) {
  const token = await obterToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const tarefa = File.createDownloadTask(url, new File(Paths.cache, nomeArquivo), { headers });
  const arquivo = await tarefa.downloadAsync();

  if (arquivo && (await Sharing.isAvailableAsync())) {
    await Sharing.shareAsync(arquivo.uri);
  }
}
