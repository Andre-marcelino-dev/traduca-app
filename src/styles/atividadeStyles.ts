import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

// Tela de uma atividade (abrir, ouvir o áudio e responder).
const atividadeStyles = StyleSheet.create({
  cardTopo: {
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },

  seloLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },

  selo: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },

  seloTexto: {
    fontSize: 11,
    fontWeight: "bold",
  },

  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: cores.preto,
  },

  descricao: {
    fontSize: 13,
    color: cores.cinzaEscuro,
    marginTop: 6,
    lineHeight: 19,
  },

  linhaInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  linhaInfoIcone: {
    width: 12,
    height: 12,
    tintColor: cores.cinzaEscuro,
    marginRight: 6,
  },

  linhaInfoTexto: {
    fontSize: 12,
    color: cores.cinzaEscuro,
  },

  btnAudio: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: cores.roxo,
    backgroundColor: `${cores.roxo}15`,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 12,
  },

  btnAudioIcone: {
    width: 14,
    height: 14,
    tintColor: cores.roxo,
    marginRight: 8,
  },

  btnAudioTexto: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.roxo,
  },

  cardCorrecao: {
    borderWidth: 1,
    borderColor: cores.verde,
    backgroundColor: `${cores.verde}15`,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },

  correcaoRotulo: {
    fontSize: 11,
    fontWeight: "bold",
    color: cores.verde,
    textTransform: "uppercase",
  },

  correcaoNota: {
    fontSize: 32,
    fontWeight: "bold",
    color: cores.verde,
  },

  correcaoFeedback: {
    fontSize: 13,
    color: cores.preto,
    marginTop: 4,
    lineHeight: 19,
  },

  avisoEnviada: {
    fontSize: 12,
    color: cores.azul,
    backgroundColor: `${cores.azul}12`,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    textAlign: "center",
  },

  secaoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.preto,
    marginBottom: 12,
  },

  cardQuestao: {
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  questaoNumero: {
    fontSize: 11,
    fontWeight: "bold",
    color: cores.azul,
    marginBottom: 4,
  },

  questaoEnunciado: {
    fontSize: 14,
    color: cores.preto,
    marginBottom: 10,
    lineHeight: 20,
  },

  opcao: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },

  opcaoSelecionada: {
    borderColor: cores.azul,
    backgroundColor: `${cores.azul}12`,
  },

  opcaoLetra: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: cores.cinzaEscuro,
    textAlign: "center",
    lineHeight: 24,
    fontSize: 12,
    fontWeight: "bold",
    color: cores.cinzaEscuro,
    marginRight: 10,
  },

  opcaoLetraSelecionada: {
    borderColor: cores.azul,
    backgroundColor: cores.azul,
    color: cores.branco,
  },

  opcaoTexto: {
    flex: 1,
    fontSize: 13,
    color: cores.preto,
  },

  campoTexto: {
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 12,
    padding: 10,
    minHeight: 90,
    fontSize: 13,
    textAlignVertical: "top",
  },

  resultado: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },

  txtErro: {
    fontSize: 13,
    color: cores.vermelho,
    textAlign: "center",
    marginBottom: 12,
  },

  txtSucesso: {
    fontSize: 13,
    color: cores.verde,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },

  btnEnviar: {
    backgroundColor: cores.azul,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 24,
  },

  btnEnviarDesabilitado: {
    opacity: 0.6,
  },

  txtBtnEnviar: {
    fontSize: 15,
    fontWeight: "bold",
    color: cores.branco,
  },
});

export default atividadeStyles;
