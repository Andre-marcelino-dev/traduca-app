import { useEffect, useRef, useState } from "react";

import { ActivityIndicator, Image, Platform, Pressable, Text, View } from "react-native";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
} from "expo-audio";

import { enviarRespostaAudio } from "@/services/api";
import { ouvirRespostaAudio } from "@/services/arquivos";
import atividadeStyles from "@/styles/atividadeStyles";
import gravadorAudioStyles from "@/styles/gravadorAudioStyles";
import { cores } from "@/styles/variaveis";

type GravadorAudioProps = {
  idAtividade: number;
  idQuestao: number;
  numero: number;
  urlRespostaAudio: string | null;
  podeEditar: boolean;
  onEnviado: () => void;
};

// 65 → "1:05".
function relogio(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function GravadorAudio({
  idAtividade,
  idQuestao,
  numero,
  urlRespostaAudio,
  podeEditar,
  onEnviado,
}: GravadorAudioProps) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useAudioPlayer(null);
  const statusPlayer = useAudioPlayerStatus(player);

  const [regravando, setRegravando] = useState(false);
  const [preparando, setPreparando] = useState(false);
  const [gravando, setGravando] = useState(false);
  const [uriLocal, setUriLocal] = useState<string | null>(null);
  const [segundos, setSegundos] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [ouvindoPropria, setOuvindoPropria] = useState(false);
  const [erro, setErro] = useState("");
  const cronometro = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (cronometro.current) clearInterval(cronometro.current);
    },
    []
  );

  async function iniciarGravacao() {
    setErro("");
    setPreparando(true);
    try {
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      if (!granted) {
        setErro("Autorize o uso do microfone para gravar sua resposta.");
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setGravando(true);
      setSegundos(0);
      cronometro.current = setInterval(() => setSegundos((s) => s + 1), 1000);
    } catch (e) {
      setErro(
        e instanceof Error && e.message
          ? `Não foi possível acessar o microfone (${e.message}).`
          : "Não foi possível acessar o microfone."
      );
    } finally {
      setPreparando(false);
    }
  }

  async function pararGravacao() {
    if (cronometro.current) {
      clearInterval(cronometro.current);
      cronometro.current = null;
    }
    setGravando(false);
    try {
      await recorder.stop();
      if (recorder.uri) {
        setUriLocal(recorder.uri);
        player.replace(recorder.uri);
      }
    } catch (e) {
      setErro(
        e instanceof Error && e.message
          ? `Não foi possível terminar a gravação (${e.message}).`
          : "Não foi possível terminar a gravação. Tente de novo."
      );
    }
  }

  function descartar() {
    player.pause();
    setUriLocal(null);
    setSegundos(0);
    setGravando(false);
    setRegravando(false);
  }

  async function enviar() {
    if (!uriLocal) return;
    setErro("");
    setEnviando(true);
    try {
      if (Platform.OS === "web") {
        const resposta = await fetch(uriLocal);
        const blob = await resposta.blob();
        await enviarRespostaAudio(idAtividade, idQuestao, {
          uri: uriLocal,
          nome: "resposta.webm",
          tipo: "audio/webm",
          arquivoWeb: blob,
        });
      } else {
        await enviarRespostaAudio(idAtividade, idQuestao, {
          uri: uriLocal,
          nome: "resposta.m4a",
          tipo: "audio/m4a",
        });
      }
      setUriLocal(null);
      setRegravando(false);
      onEnviado();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível enviar a gravação.");
    } finally {
      setEnviando(false);
    }
  }

  async function ouvirEnviada() {
    if (!urlRespostaAudio) return;
    setErro("");
    setOuvindoPropria(true);
    try {
      await ouvirRespostaAudio(urlRespostaAudio, numero);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível abrir sua gravação.");
    } finally {
      setOuvindoPropria(false);
    }
  }

  // Já tem resposta enviada, e o aluno não pediu para regravar.
  if (urlRespostaAudio && !regravando) {
    return (
      <View>
        <Pressable style={atividadeStyles.btnAudio} onPress={ouvirEnviada} disabled={ouvindoPropria}>
          {ouvindoPropria ? (
            <ActivityIndicator color={cores.roxo} />
          ) : (
            <>
              <Image source={require("@/assets/images/imgIcon/play.png")} style={atividadeStyles.btnAudioIcone} />
              <Text style={atividadeStyles.btnAudioTexto}>Ouvir sua gravação</Text>
            </>
          )}
        </Pressable>

        {podeEditar && (
          <Pressable style={gravadorAudioStyles.linkRegravar} onPress={() => setRegravando(true)}>
            <Text style={gravadorAudioStyles.txtLinkRegravar}>Gravar de novo</Text>
          </Pressable>
        )}

        {erro ? <Text style={atividadeStyles.txtErro}>{erro}</Text> : null}
      </View>
    );
  }

  if (!podeEditar) {
    return <Text style={atividadeStyles.linhaInfoTexto}>Você ainda não gravou uma resposta.</Text>;
  }

  // Gravou e está revendo antes de enviar.
  if (uriLocal) {
    return (
      <View>
        <Pressable
          style={atividadeStyles.btnAudio}
          onPress={() => (statusPlayer.playing ? player.pause() : player.play())}
        >
          <Image source={require("@/assets/images/imgIcon/play.png")} style={atividadeStyles.btnAudioIcone} />
          <Text style={atividadeStyles.btnAudioTexto}>
            {statusPlayer.playing ? "Pausar" : "Ouvir antes de enviar"}
          </Text>
        </Pressable>

        {erro ? <Text style={atividadeStyles.txtErro}>{erro}</Text> : null}

        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <Pressable
            style={[gravadorAudioStyles.btnSecundario, { flex: 1 }]}
            onPress={descartar}
            disabled={enviando}
          >
            <Text style={gravadorAudioStyles.txtSecundario}>Gravar de novo</Text>
          </Pressable>
          <Pressable
            style={[gravadorAudioStyles.btnPrimario, { flex: 1 }]}
            onPress={enviar}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color={cores.branco} />
            ) : (
              <Text style={gravadorAudioStyles.txtPrimario}>Enviar gravação</Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  // Gravando agora.
  if (gravando) {
    return (
      <View style={{ alignItems: "center" }}>
        <Pressable style={gravadorAudioStyles.btnGravando} onPress={pararGravacao}>
          <View style={gravadorAudioStyles.quadradoParar} />
        </Pressable>
        <Text style={gravadorAudioStyles.tempoGravando}>{relogio(segundos)} · toque para parar</Text>
      </View>
    );
  }

  // Estado inicial: ainda não gravou nada.
  return (
    <View>
      <Pressable
        style={gravadorAudioStyles.btnMicrofone}
        onPress={iniciarGravacao}
        disabled={preparando}
      >
        {preparando ? (
          <ActivityIndicator color={cores.vermelho} />
        ) : (
          <>
            <Image
              source={require("@/assets/images/imgIcon/microfone-atividade.png")}
              style={gravadorAudioStyles.iconeMicrofone}
            />
            <Text style={gravadorAudioStyles.txtMicrofone}>Toque para gravar sua resposta</Text>
          </>
        )}
      </Pressable>
      {erro ? <Text style={atividadeStyles.txtErro}>{erro}</Text> : null}
    </View>
  );
}
