import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

const desempenhoStyles = StyleSheet.create({
  secaoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.preto,
    marginBottom: 12,
  },

  // Seletor de idioma (pills)
  idiomasLinha: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },

  idiomaPill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: cores.azul,
  },

  idiomaPillSelecionado: {
    backgroundColor: cores.azul,
  },

  idiomaPillTexto: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.azul,
  },

  idiomaPillTextoSelecionado: {
    color: cores.branco,
  },

  // Card de progresso geral
  cardProgressoGeral: {
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },

  progressoGeralTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  progressoGeralLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: cores.preto,
  },

  progressoGeralPorcentagem: {
    fontSize: 15,
    fontWeight: "bold",
    color: cores.azul,
  },

  barraTrilha: {
    height: 8,
    borderRadius: 4,
    backgroundColor: cores.cinza,
    overflow: "hidden",
    marginBottom: 12,
  },

  barraPreenchimento: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: cores.verde,
  },

  progressoGeralRodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progressoGeralTexto: {
    fontSize: 12,
    color: cores.cinzaEscuro,
  },

  // Estatísticas
  statsLinha: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
  },

  statIconeBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  statIcone: {
    width: 18,
    height: 18,
  },

  statNumero: {
    fontSize: 17,
    fontWeight: "bold",
    color: cores.preto,
  },

  statLegenda: {
    fontSize: 11,
    color: cores.cinzaEscuro,
    textAlign: "center",
    marginTop: 2,
  },

  // Abas Frequência / Desempenho
  abasLinha: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: cores.azul,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },

  abaItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 42,
  },

  abaItemSelecionada: {
    backgroundColor: cores.azul,
  },

  abaItemTexto: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.azul,
  },

  abaItemTextoSelecionada: {
    color: cores.branco,
  },

  // Card grande de frequência / desempenho
  cardResumo: {
    backgroundColor: cores.azul,
    borderRadius: 20,
    padding: 20,
  },

  cardResumoTopo: {
    flexDirection: "row",
    alignItems: "center",
  },

  anelWrapper: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },

  anelFundoBranco: {
    position: "absolute",
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: cores.branco,
  },

  resumoAnelNumero: {
    fontSize: 20,
    fontWeight: "bold",
    color: cores.azul,
  },

  resumoAnelLegenda: {
    fontSize: 11,
    fontWeight: "bold",
    color: cores.azul,
  },

  resumoLegendaColuna: {
    flex: 1,
    marginLeft: 20,
    gap: 12,
  },

  resumoLegendaItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  resumoLegendaBolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  resumoLegendaTexto: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.branco,
  },

  resumoDivisor: {
    height: 1,
    backgroundColor: cores.branco,
    opacity: 0.25,
    marginVertical: 16,
  },

  // Habilidades (aba Desempenho)
  habilidadesLinha: {
    flexDirection: "row",
  },

  habilidadeItem: {
    flex: 1,
    alignItems: "center",
  },

  habilidadeItemDivisor: {
    borderRightWidth: 1,
    borderRightColor: `${cores.branco}30`,
  },

  habilidadeIcone: {
    width: 20,
    height: 20,
    marginBottom: 6,
  },

  habilidadeLabel: {
    fontSize: 11,
    color: cores.branco,
    opacity: 0.85,
    marginBottom: 4,
  },

  habilidadeNota: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.branco,
  },

  mediaGeralLinha: {
    alignItems: "center",
  },

  mediaGeralEsquerda: {
    flexDirection: "row",
    alignItems: "center",
  },

  mediaGeralEstrela: {
    fontSize: 14,
    color: cores.laranja,
    marginRight: 6,
  },

  mediaGeralLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.branco,
  },

  mediaGeralNota: {
    fontSize: 13,
    color: `${cores.branco}80`,
    marginTop: 4,
  },

  parabensBox: {
    backgroundColor: `${cores.branco}15`,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 16,
  },

  parabensTexto: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.verde,
    textAlign: "center",
  },

  resumoSequenciaTitulo: {
    fontSize: 12,
    fontWeight: "bold",
    color: cores.branco,
    textAlign: "center",
  },

  resumoSequenciaTexto: {
    fontSize: 10,
    color: cores.branco,
    opacity: 0.85,
    textAlign: "center",
  },

  // Lista de últimas presenças (aba Frequência)
  ultimaPresencaItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: `${cores.branco}20`,
  },

  ultimaPresencaTextos: {
    flex: 1,
    marginRight: 8,
  },

  ultimaPresencaTitulo: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.branco,
  },

  ultimaPresencaData: {
    fontSize: 11,
    color: cores.branco,
    opacity: 0.8,
    marginTop: 2,
  },

  btnJustificar: {
    borderWidth: 1,
    borderColor: cores.branco,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  txtBtnJustificar: {
    fontSize: 11,
    fontWeight: "bold",
    color: cores.branco,
  },

  justificativaStatusTexto: {
    fontSize: 10,
    fontWeight: "bold",
    color: cores.branco,
    opacity: 0.85,
    maxWidth: 90,
    textAlign: "right",
  },
});

export default desempenhoStyles;
