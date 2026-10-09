import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

const aulasStyles = StyleSheet.create({
  // Card da aula atual
  cardAulaAtual: {
    backgroundColor: cores.azul,
    borderRadius: 20,
    padding: 16,
    overflow: "hidden",
  },

  cardAulaAtualTopo: {
    flexDirection: "row",
    alignItems: "center",
  },

  idiomaAtual: {
    fontSize: 20,
    fontWeight: "bold",
    color: cores.branco,
  },

  nivelBadge: {
    alignSelf: "flex-start",
    backgroundColor: cores.azulClaro,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 4,
  },

  nivelBadgeTexto: {
    fontSize: 12,
    color: cores.branco,
  },

  moduloAtualTexto: {
    fontSize: 12,
    color: cores.branco,
    opacity: 0.85,
    marginTop: 6,
  },

  btnAvancarCard: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: cores.azulClaro,
    alignItems: "center",
    justifyContent: "center",
  },

  iconeAvancarCard: {
    width: 14,
    height: 14,
    tintColor: cores.branco,
    transform: [{ rotate: "180deg" }],
  },

  infoPillsLinha: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },

  infoPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.azulClaro,
    borderRadius: 12,
    padding: 8,
  },

  infoPillIcone: {
    width: 20,
    height: 20,
    tintColor: cores.branco,
    marginRight: 8,
  },

  infoPillTexto: {
    fontSize: 11,
    color: cores.branco,
    flexShrink: 1,
  },

  btnEntrarAula: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.branco,
    borderWidth: 2,
    borderColor: cores.vermelho,
    borderRadius: 12,
    height: 46,
    marginTop: 16,
  },

  iconeEntrarAula: {
    width: 14,
    height: 14,
    tintColor: cores.vermelho,
    marginRight: 8,
  },

  txtEntrarAula: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.vermelho,
  },

  paginacao: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 12,
    gap: 6,
  },

  ponto: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: cores.cinza,
  },

  pontoAtivo: {
    backgroundColor: cores.azul,
    width: 16,
  },

  // Seções com título + link
  secaoTitulo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
  },

  secaoTituloTexto: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.preto,
  },

  secaoLink: {
    fontSize: 13,
    color: cores.vermelho,
  },

  // Card de progresso
  cardProgresso: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.azul,
    borderRadius: 20,
    padding: 16,
  },

  progressoTextoCentral: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.branco,
  },

  progressoColuna: {
    flex: 1,
    marginLeft: 16,
  },

  progressoTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    color: cores.branco,
    marginBottom: 10,
  },

  progressoStatsLinha: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressoStatNumero: {
    fontSize: 16,
    fontWeight: "bold",
  },

  progressoStatLegenda: {
    fontSize: 11,
    color: cores.branco,
  },

  progressoDivisor: {
    width: 1,
    height: 28,
    backgroundColor: cores.branco,
    opacity: 0.4,
    marginHorizontal: 14,
  },

  // Próxima aula (item de lista)
  cardProximaAula: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 16,
    padding: 12,
  },

  proximaAulaTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    color: cores.preto,
  },

  proximaAulaSubtitulo: {
    fontSize: 12,
    color: cores.cinzaEscuro,
    marginTop: 2,
  },

  iconeAvancarLista: {
    width: 16,
    height: 16,
    tintColor: cores.azul,
    transform: [{ rotate: "180deg" }],
  },

  // Seletor de idioma
  idiomasLinha: {
    flexDirection: "row",
    gap: 12,
  },

  cardIdioma: {
    flex: 1,
    borderWidth: 2,
    borderColor: cores.cinza,
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 12,
  },

  cardIdiomaSelecionado: {
    borderColor: cores.vermelho,
  },

  cardIdiomaBandeira: {
    width: 48,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    overflow: "hidden",
  },

  cardIdiomaBandeiraEmoji: {
    fontSize: 26,
  },

  cardIdiomaTexto: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.preto,
  },
});

export default aulasStyles;
