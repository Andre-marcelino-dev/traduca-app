import { router } from "expo-router";
import { useRef, useState } from "react";

import { ActivityIndicator, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CardChatbot, enviarMensagemChatbot, primeiroNomeAluno } from "@/services/api";
import assistenteStyles from "@/styles/assistenteStyles";
import { cores } from "@/styles/variaveis";

type MensagemChat = {
  id: string;
  autor: "aluno" | "ia";
  texto: string;
  card?: CardChatbot | null;
  offline?: boolean;
};

// Toque manda a pergunta direto pro assistente (ele já tem os dados reais do
// aluno). "Tirar uma dúvida" só foca o campo, pra escrever algo livre.
const sugestoesIniciais = [
  {
    titulo: "Minhas aulas",
    subtitulo: "Ver próximas aulas",
    icone: require("@/assets/images/imgIcon/aula-azul.png"),
    pergunta: "Quais são minhas próximas aulas?",
  },
  {
    titulo: "Meu progresso",
    subtitulo: "Presenças e desempenho",
    icone: require("@/assets/images/imgIcon/trofeu-azul.png"),
    pergunta: "Qual é o meu progresso?",
  },
  {
    titulo: "Materiais de estudo",
    subtitulo: "PDFs, áudios e exercícios",
    icone: require("@/assets/images/imgIcon/mochila-azul.png"),
    pergunta: "Quais materiais tenho disponíveis?",
  },
  {
    titulo: "Tirar uma dúvida",
    subtitulo: "Gramática, vocabulário, tradução...",
    icone: require("@/assets/images/imgIcon/chat.png"),
    pergunta: null,
  },
] as const;

function CardChatRender({ card }: { card: CardChatbot }) {
  return (
    <View style={assistenteStyles.cardChat}>
      <Text style={assistenteStyles.cardChatTitulo}>{card.title}</Text>

      {card.items.map((item, indice) => (
        <View key={indice} style={assistenteStyles.cardChatItem}>
          {card.type === "schedule" ? (
            <>
              <Text style={assistenteStyles.cardChatItemTexto}>{item.titulo}</Text>
              <Text style={assistenteStyles.cardChatItemSubtexto}>
                {item.data} às {item.hora} · {item.professor}
              </Text>
            </>
          ) : (
            <Text style={assistenteStyles.cardChatItemTexto}>
              {item.label}: {item.value}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

export default function AssistenteScreen() {
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [texto, setTexto] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  async function enviar(mensagemForcada?: string) {
    const mensagem = (mensagemForcada ?? texto).trim();
    if (!mensagem || enviando) return;

    setErro("");
    setSugestoes([]);
    setTexto("");
    setMensagens((atuais) => [...atuais, { id: `aluno-${Date.now()}`, autor: "aluno", texto: mensagem }]);
    setEnviando(true);

    try {
      const resposta = await enviarMensagemChatbot(mensagem);
      setMensagens((atuais) => [
        ...atuais,
        {
          id: `ia-${Date.now()}`,
          autor: "ia",
          texto: resposta.text,
          card: resposta.card,
          offline: resposta.offline,
        },
      ]);
      setSugestoes(resposta.sugestoes);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível falar com o assistente.");
    } finally {
      setEnviando(false);
    }
  }

  function tocarSugestaoInicial(opcao: (typeof sugestoesIniciais)[number]) {
    if (opcao.pergunta) {
      enviar(opcao.pergunta);
    } else {
      inputRef.current?.focus();
    }
  }

  const conversaIniciada = mensagens.length > 0;

  return (
    <SafeAreaView style={assistenteStyles.fundo} edges={["top", "bottom"]}>
      <View style={assistenteStyles.cartao}>
        <View style={assistenteStyles.cabecalho}>
          <View style={assistenteStyles.avatarBox}>
            <Text style={assistenteStyles.avatarTexto}>AI</Text>
            <View style={assistenteStyles.avatarSelo} />
          </View>

          <View style={assistenteStyles.cabecalhoTextos}>
            <Text style={assistenteStyles.cabecalhoTitulo}>TraducaAI</Text>
            <Text style={assistenteStyles.cabecalhoSubtitulo}>
              Assistente virtual do Traduca Idiomas
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              assistenteStyles.btnFechar,
              pressed && assistenteStyles.btnFecharPressed,
            ]}
            onPress={() => router.back()}
          >
            <Image
              source={require("@/assets/images/imgIcon/voltar-azul.png")}
              style={assistenteStyles.iconeFechar}
            />
          </Pressable>
        </View>

        {!conversaIniciada ? (
          <>
            <View style={assistenteStyles.corpo}>
              <Text style={assistenteStyles.saudacaoTitulo}>
                Olá, {primeiroNomeAluno()}! como posso ajudar?
              </Text>
              <Text style={assistenteStyles.saudacaoTexto}>
                Sou a <Text style={assistenteStyles.saudacaoDestaque}>TraducaAI</Text>,
                sua assistente virtual. Como posso ajudar com suas aulas hoje?
              </Text>
            </View>

            <View style={assistenteStyles.lista}>
              {sugestoesIniciais.map((opcao) => (
                <Pressable
                  key={opcao.titulo}
                  style={({ pressed }) => [
                    assistenteStyles.itemCard,
                    pressed && assistenteStyles.itemCardPressed,
                  ]}
                  onPress={() => tocarSugestaoInicial(opcao)}
                >
                  <View style={assistenteStyles.itemIconeBox}>
                    <Image
                      source={opcao.icone}
                      style={assistenteStyles.itemIcone}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={assistenteStyles.itemCorpo}>
                    <Text style={assistenteStyles.itemTitulo}>{opcao.titulo}</Text>
                    <Text style={assistenteStyles.itemSubtitulo}>{opcao.subtitulo}</Text>
                  </View>

                  <Image
                    source={require("@/assets/images/imgIcon/voltar-azul.png")}
                    style={assistenteStyles.itemSeta}
                  />
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <ScrollView
            ref={scrollRef}
            style={assistenteStyles.conversaArea}
            contentContainerStyle={assistenteStyles.conversaConteudo}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {mensagens.map((m) =>
              m.autor === "aluno" ? (
                <View key={m.id} style={assistenteStyles.bolhaAluno}>
                  <Text style={assistenteStyles.bolhaAlunoTexto}>{m.texto}</Text>
                </View>
              ) : (
                <View key={m.id}>
                  <View style={assistenteStyles.bolhaIa}>
                    <Text style={assistenteStyles.bolhaIaTexto}>{m.texto}</Text>
                    {m.offline ? (
                      <Text style={assistenteStyles.bolhaIaOffline}>
                        Sem conexão com a IA no momento — respondendo com o que já sei.
                      </Text>
                    ) : null}
                  </View>
                  {m.card ? <CardChatRender card={m.card} /> : null}
                </View>
              )
            )}

            {enviando && (
              <View style={assistenteStyles.bolhaIa}>
                <ActivityIndicator color={cores.azul} />
              </View>
            )}

            {erro !== "" && <Text style={assistenteStyles.erroTextoChat}>{erro}</Text>}
          </ScrollView>
        )}

        {conversaIniciada && sugestoes.length > 0 && !enviando && (
          <View style={[assistenteStyles.sugestoesLinha, { paddingHorizontal: 18 }]}>
            {sugestoes.map((sugestao) => (
              <Pressable
                key={sugestao}
                style={({ pressed }) => [
                  assistenteStyles.sugestaoChip,
                  pressed && assistenteStyles.sugestaoChipPressed,
                ]}
                onPress={() => enviar(sugestao)}
              >
                <Text style={assistenteStyles.sugestaoChipTexto}>{sugestao}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={assistenteStyles.rodape}>
          <View style={assistenteStyles.campoBusca}>
            <Image
              source={require("@/assets/images/imgIcon/chat.png")}
              style={assistenteStyles.iconeAnexo}
            />
            <TextInput
              ref={inputRef}
              value={texto}
              onChangeText={setTexto}
              placeholder="Escreva sua dúvida"
              placeholderTextColor="#88888899"
              style={assistenteStyles.campoBuscaInput}
              onSubmitEditing={() => enviar()}
              editable={!enviando}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              assistenteStyles.btnEnviar,
              pressed && assistenteStyles.btnEnviarPressed,
              enviando && { opacity: 0.6 },
            ]}
            onPress={() => enviar()}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color={cores.branco} />
            ) : (
              <Image
                source={require("@/assets/images/imgIcon/enviar.png")}
                style={assistenteStyles.iconeEnviar}
              />
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
