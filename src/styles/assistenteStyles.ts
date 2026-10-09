import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

const assistenteStyles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: cores.preto,
    padding: 18,
  },

  cartao: {
    flex: 1,
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
    backgroundColor: cores.branco,
    borderRadius: 26,
    overflow: "hidden",
  },

  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.azul,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  avatarBox: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: cores.branco,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarTexto: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.azul,
  },

  avatarSelo: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: cores.verde,
    borderWidth: 2,
    borderColor: cores.azul,
  },

  cabecalhoTextos: {
    flex: 1,
  },

  cabecalhoTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    color: cores.branco,
  },

  cabecalhoSubtitulo: {
    fontSize: 11,
    color: `${cores.branco}CC`,
    marginTop: 2,
  },

  btnFechar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: `${cores.branco}80`,
    alignItems: "center",
    justifyContent: "center",
  },

  btnFecharPressed: {
    opacity: 0.7,
  },

  iconeFechar: {
    width: 11,
    height: 11,
    tintColor: cores.branco,
    transform: [{ rotate: "-90deg" }],
  },

  corpo: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },

  saudacaoTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: cores.preto,
    textAlign: "center",
    marginBottom: 8,
  },

  saudacaoTexto: {
    fontSize: 13,
    color: cores.cinzaEscuro,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
  },

  saudacaoDestaque: {
    color: cores.vermelho,
    fontWeight: "bold",
  },

  lista: {
    paddingHorizontal: 18,
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },

  itemCardPressed: {
    backgroundColor: `${cores.azul}0D`,
    borderColor: cores.azul,
  },

  itemIconeBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: `${cores.azul}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  itemIcone: {
    width: 19,
    height: 19,
  },

  itemCorpo: {
    flex: 1,
  },

  itemTitulo: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.preto,
  },

  itemSubtitulo: {
    fontSize: 11,
    color: cores.cinzaEscuro,
    marginTop: 2,
  },

  itemSeta: {
    width: 12,
    height: 12,
    tintColor: cores.azul,
    transform: [{ rotate: "180deg" }],
  },

  rodape: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 18,
    gap: 10,
  },

  campoBusca: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderRadius: 23,
    backgroundColor: `${cores.azul}0D`,
    borderWidth: 1,
    borderColor: cores.cinza,
    paddingHorizontal: 14,
  },

  iconeAnexo: {
    width: 16,
    height: 16,
    tintColor: cores.cinzaEscuro,
    marginRight: 8,
  },

  campoBuscaInput: {
    flex: 1,
    fontSize: 13,
    color: cores.preto,
  },

  btnEnviar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: cores.azul,
    alignItems: "center",
    justifyContent: "center",
  },

  btnEnviarPressed: {
    opacity: 0.85,
  },

  iconeEnviar: {
    width: 18,
    height: 18,
    tintColor: cores.branco,
  },

  // Conversa
  conversaArea: {
    flex: 1,
  },

  conversaConteudo: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
  },

  bolhaAluno: {
    alignSelf: "flex-end",
    backgroundColor: cores.azul,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    maxWidth: "82%",
  },

  bolhaAlunoTexto: {
    fontSize: 13,
    color: cores.branco,
    lineHeight: 18,
  },

  bolhaIa: {
    alignSelf: "flex-start",
    backgroundColor: `${cores.azul}0D`,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    maxWidth: "85%",
  },

  bolhaIaTexto: {
    fontSize: 13,
    color: cores.preto,
    lineHeight: 18,
  },

  bolhaIaOffline: {
    fontSize: 10,
    color: cores.laranja,
    fontWeight: "bold",
    marginTop: 6,
  },

  sugestoesLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },

  sugestaoChip: {
    borderWidth: 1,
    borderColor: cores.azul,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  sugestaoChipPressed: {
    backgroundColor: `${cores.azul}15`,
  },

  sugestaoChipTexto: {
    fontSize: 12,
    fontWeight: "bold",
    color: cores.azul,
  },

  cardChat: {
    borderWidth: 1,
    borderColor: cores.azul,
    borderRadius: 12,
    padding: 10,
    marginTop: 6,
    alignSelf: "flex-start",
    maxWidth: "85%",
  },

  cardChatTitulo: {
    fontSize: 12,
    fontWeight: "bold",
    color: cores.azul,
    marginBottom: 6,
  },

  cardChatItem: {
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: cores.cinza,
  },

  cardChatItemTexto: {
    fontSize: 12,
    fontWeight: "bold",
    color: cores.preto,
  },

  cardChatItemSubtexto: {
    fontSize: 11,
    color: cores.cinzaEscuro,
    marginTop: 1,
  },

  erroTextoChat: {
    fontSize: 12,
    color: cores.vermelho,
    textAlign: "center",
    marginVertical: 8,
  },
});

export default assistenteStyles;
