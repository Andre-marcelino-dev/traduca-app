import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

const cursoModuloStyles = StyleSheet.create({
  // Card do módulo
  cardModulo: {
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  moduloEtiqueta: {
    fontSize: 10,
    fontWeight: "bold",
    color: cores.azul,
    letterSpacing: 0.5,
  },

  moduloTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: cores.preto,
    marginTop: 4,
  },

  moduloDescricao: {
    fontSize: 12,
    color: cores.cinzaEscuro,
    marginTop: 4,
  },

  moduloInfoLinha: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },

  moduloInfo: {
    fontSize: 11,
    color: cores.cinzaEscuro,
  },

  // Progresso do módulo
  progressoTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  progressoLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: cores.cinzaEscuro,
    letterSpacing: 0.5,
  },

  progressoPorcentagem: {
    fontSize: 12,
    fontWeight: "bold",
    color: cores.verde,
  },

  progressoTrilha: {
    height: 8,
    borderRadius: 4,
    backgroundColor: cores.cinza,
    overflow: "hidden",
  },

  progressoPreenchimento: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: cores.verde,
  },

  progressoResumo: {
    fontSize: 11,
    color: cores.cinzaEscuro,
    marginTop: 6,
    marginBottom: 20,
  },

  secaoTitulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: cores.preto,
    marginBottom: 12,
  },

  // Card de aula
  cardAula: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: cores.cinza,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  cardAulaConcluida: {
    borderColor: cores.verde,
  },

  aulaEtiqueta: {
    fontSize: 9,
    fontWeight: "bold",
    color: cores.cinzaEscuro,
    letterSpacing: 0.5,
  },

  aulaTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    color: cores.preto,
    marginTop: 2,
  },

  aulaInfo: {
    fontSize: 11,
    color: cores.cinzaEscuro,
    marginTop: 2,
  },

  aulaStatus: {
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 8,
  },

  // Aviso de próximo módulo
  btnProximoModulo: {
    alignSelf: "center",
    borderWidth: 2,
    borderColor: cores.azul,
    borderStyle: "dashed",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
  },

  btnProximoModuloTexto: {
    fontSize: 11,
    color: cores.azul,
    textAlign: "center",
  },
});

export default cursoModuloStyles;
