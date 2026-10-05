import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";

import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from "react-native";

import EstadoVazio from "@/components/estado-vazio";
import TelaComAbas from "@/components/tela-com-abas";
import {
  AtividadeDetalhe,
  buscarAtividade,
  formatarData,
  responderAtividade,
  StatusAtividade,
} from "@/services/api";
import { ouvirAudioAtividade } from "@/services/arquivos";
import atividadeStyles from "@/styles/atividadeStyles";
import { cores } from "@/styles/variaveis";

const statusInfo: Record<StatusAtividade, { texto: string; cor: string }> = {
  pendente: { texto: "Pendente", cor: cores.laranja },
  enviada: { texto: "Enviada", cor: cores.azul },
  corrigida: { texto: "Corrigida", cor: cores.verde },
};

const textoNota = (nota: number) => String(nota).replace(".", ",");

export default function AtividadeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [dados, setDados] = useState<AtividadeDetalhe | null>(null);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [abrindoAudio, setAbrindoAudio] = useState(false);

  const carregar = useCallback(async () => {
    if (!id) {
      setErro("Escolha uma atividade na tela Atividades.");
      setCarregando(false);
      return;
    }
    try {
      const atividade = await buscarAtividade(id);
      setDados(atividade);
      // Começa com o que o aluno já respondeu (para revisar ou reenviar).
      const iniciais: Record<number, string> = {};
      atividade.questoes.forEach((q) => {
        if (q.resposta_aluno) iniciais[q.id_questao] = q.resposta_aluno;
      });
      setRespostas(iniciais);
      setErro("");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível abrir a atividade.");
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function responder(idQuestao: number, valor: string) {
    setSucesso("");
    setErroEnvio("");
    setRespostas((atuais) => ({ ...atuais, [idQuestao]: valor }));
  }

  async function enviar() {
    if (!dados) return;
    setErroEnvio("");
    setSucesso("");

    const faltando = dados.questoes.filter((q) => !respostas[q.id_questao]?.trim());
    if (faltando.length > 0) {
      setErroEnvio(
        `Responda todas as questões antes de enviar (falta${faltando.length > 1 ? "m" : ""}: ${faltando
          .map((q) => q.numero)
          .join(", ")}).`
      );
      return;
    }

    setEnviando(true);
    try {
      const mensagem = await responderAtividade(dados.id_atividade, respostas);
      await carregar();
      setSucesso(mensagem);
    } catch (e) {
      setErroEnvio(e instanceof Error ? e.message : "Não foi possível enviar as respostas.");
    } finally {
      setEnviando(false);
    }
  }

  async function ouvirAudio() {
    if (!dados) return;
    setErroEnvio("");
    setAbrindoAudio(true);
    try {
      await ouvirAudioAtividade(dados);
    } catch (e) {
      setErroEnvio(e instanceof Error ? e.message : "Não foi possível abrir o áudio.");
    } finally {
      setAbrindoAudio(false);
    }
  }

  const status = dados ? statusInfo[dados.status] : null;
  const podeEditar = dados?.pode_responder ?? false;

  return (
    <TelaComAbas titulo="Atividade" subtitulo={dados?.curso ?? "Responda e acompanhe a correção"}>
      {carregando && <ActivityIndicator size="large" color={cores.azul} />}

      {!carregando && erro ? (
        <EstadoVazio icone={require("@/assets/images/imgIcon/atividades-azul.png")} texto={erro} />
      ) : null}

      {!carregando && !erro && dados && status && (
      <>
      {/* Cabeçalho da atividade */}
      <View style={atividadeStyles.cardTopo}>
        <View style={atividadeStyles.seloLinha}>
          {dados.categoria ? (
            <View style={[atividadeStyles.selo, { backgroundColor: `${dados.categoria.cor}22` }]}>
              <Text style={[atividadeStyles.seloTexto, { color: dados.categoria.cor }]}>
                {dados.categoria.label}
              </Text>
            </View>
          ) : null}
          <View style={[atividadeStyles.selo, { backgroundColor: `${status.cor}22` }]}>
            <Text style={[atividadeStyles.seloTexto, { color: status.cor }]}>{status.texto}</Text>
          </View>
        </View>

        <Text style={atividadeStyles.titulo}>{dados.titulo}</Text>
        {dados.finalidade ? (
          <Text style={atividadeStyles.linhaInfoTexto}>{dados.finalidade}</Text>
        ) : null}
        {dados.descricao ? <Text style={atividadeStyles.descricao}>{dados.descricao}</Text> : null}

        {dados.professor ? (
          <View style={atividadeStyles.linhaInfo}>
            <Image
              source={require("@/assets/images/imgIcon/professor.png")}
              style={atividadeStyles.linhaInfoIcone}
            />
            <Text style={atividadeStyles.linhaInfoTexto}>Professor {dados.professor}</Text>
          </View>
        ) : null}

        {dados.data_entrega ? (
          <View style={atividadeStyles.linhaInfo}>
            <Image
              source={require("@/assets/images/imgIcon/calendario-azul.png")}
              style={atividadeStyles.linhaInfoIcone}
            />
            <Text style={atividadeStyles.linhaInfoTexto}>
              Entrega: {formatarData(dados.data_entrega)}
            </Text>
          </View>
        ) : null}

        {dados.tem_audio && (
          <Pressable style={atividadeStyles.btnAudio} onPress={ouvirAudio} disabled={abrindoAudio}>
            {abrindoAudio ? (
              <ActivityIndicator color={cores.roxo} />
            ) : (
              <>
                <Image
                  source={require("@/assets/images/imgIcon/play.png")}
                  style={atividadeStyles.btnAudioIcone}
                />
                <Text style={atividadeStyles.btnAudioTexto}>Ouvir o áudio da atividade</Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {/* Correção do professor */}
      {dados.status === "corrigida" && (
        <View style={atividadeStyles.cardCorrecao}>
          <Text style={atividadeStyles.correcaoRotulo}>Nota</Text>
          <Text style={atividadeStyles.correcaoNota}>
            {dados.nota !== null ? textoNota(dados.nota) : "—"}
          </Text>
          {dados.feedback_professor ? (
            <>
              <Text style={[atividadeStyles.correcaoRotulo, { marginTop: 8 }]}>
                Feedback do professor
              </Text>
              <Text style={atividadeStyles.correcaoFeedback}>{dados.feedback_professor}</Text>
            </>
          ) : null}
        </View>
      )}

      {dados.status === "enviada" && (
        <Text style={atividadeStyles.avisoEnviada}>
          Respostas enviadas{dados.data_envio ? ` em ${formatarData(dados.data_envio.slice(0, 10))}` : ""}.
          Aguarde a correção do professor — até lá você ainda pode alterar e reenviar.
        </Text>
      )}

      {/* Questões */}
      <Text style={atividadeStyles.secaoTitulo}>Questões</Text>

      {dados.questoes.length === 0 && (
        <EstadoVazio
          icone={require("@/assets/images/imgIcon/atividades-azul.png")}
          texto="Esta atividade ainda não tem questões."
        />
      )}

      {dados.questoes.map((questao) => (
        <View key={questao.id_questao} style={atividadeStyles.cardQuestao}>
          <Text style={atividadeStyles.questaoNumero}>QUESTÃO {questao.numero}</Text>
          <Text style={atividadeStyles.questaoEnunciado}>{questao.enunciado}</Text>

          {questao.tipo === "multipla_escolha" ? (
            questao.opcoes.map((opcao) => {
              const selecionada = respostas[questao.id_questao] === opcao.letra;
              return (
                <Pressable
                  key={opcao.letra}
                  style={[atividadeStyles.opcao, selecionada && atividadeStyles.opcaoSelecionada]}
                  disabled={!podeEditar}
                  onPress={() => responder(questao.id_questao, opcao.letra)}
                >
                  <Text
                    style={[
                      atividadeStyles.opcaoLetra,
                      selecionada && atividadeStyles.opcaoLetraSelecionada,
                    ]}
                  >
                    {opcao.letra}
                  </Text>
                  <Text style={atividadeStyles.opcaoTexto}>{opcao.texto}</Text>
                </Pressable>
              );
            })
          ) : (
            <TextInput
              style={atividadeStyles.campoTexto}
              multiline
              editable={podeEditar}
              placeholder="Escreva sua resposta..."
              placeholderTextColor="#888888"
              value={respostas[questao.id_questao] ?? ""}
              onChangeText={(texto) => responder(questao.id_questao, texto)}
            />
          )}

          {/* Igual ao site: depois de enviada, diz se acertou a múltipla escolha */}
          {questao.correta !== null && (
            <Text
              style={[
                atividadeStyles.resultado,
                { color: questao.correta ? cores.verde : cores.vermelho },
              ]}
            >
              {questao.correta ? "✓ Você acertou" : "✗ Resposta incorreta"}
            </Text>
          )}
        </View>
      ))}

      {erroEnvio ? <Text style={atividadeStyles.txtErro}>{erroEnvio}</Text> : null}
      {sucesso ? <Text style={atividadeStyles.txtSucesso}>{sucesso}</Text> : null}

      {podeEditar && dados.questoes.length > 0 && (
        <Pressable
          style={[atividadeStyles.btnEnviar, enviando && atividadeStyles.btnEnviarDesabilitado]}
          onPress={enviar}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color={cores.branco} />
          ) : (
            <Text style={atividadeStyles.txtBtnEnviar}>
              {dados.status === "enviada" ? "Reenviar respostas" : "Enviar respostas"}
            </Text>
          )}
        </Pressable>
      )}
      </>
      )}
    </TelaComAbas>
  );
}
