import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

const materiaisStyles = StyleSheet.create({
  seletorModulo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  seletorModuloTexto: {
    fontSize: 15,
    fontWeight: "bold",
    color: cores.azul,
    marginRight: 6,
  },

  seletorModuloIcone: {
    width: 12,
    height: 12,
    tintColor: cores.azul,
    transform: [{ rotate: "-90deg" }],
  },

  filtrosLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },

  filtroPill: {
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  filtroPillSelecionado: {
    backgroundColor: cores.azul,
    borderColor: cores.azul,
  },

  filtroPillTexto: {
    fontSize: 12,
    color: cores.cinzaEscuro,
  },

  filtroPillTextoSelecionado: {
    color: cores.branco,
    fontWeight: "bold",
  },

  btnBusca: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: cores.cinza,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },

  iconeBusca: {
    width: 16,
    height: 16,
  },

  secaoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.preto,
    marginBottom: 12,
  },

  materialCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.azul,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },

  materialIconeBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${cores.azul}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  materialIcone: {
    width: 22,
    height: 22,
  },

  materialCorpo: {
    flex: 1,
  },

  materialTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.preto,
  },

  materialSubtitulo: {
    fontSize: 12,
    color: cores.cinzaEscuro,
    marginTop: 2,
  },

  materialTamanho: {
    fontSize: 11,
    color: cores.azul,
    marginTop: 4,
  },

  materialAcoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginLeft: 8,
  },

  materialAcaoIcone: {
    width: 18,
    height: 18,
  },

  placeholder: {
    borderWidth: 1,
    borderColor: cores.cinza,
    borderStyle: "dashed",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  placeholderTexto: {
    fontSize: 12,
    color: cores.cinzaEscuro,
    textAlign: "center",
  },

  opcoesModulo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: -6,
    marginBottom: 16,
  },

  campoBusca: {
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    marginTop: -8,
    marginBottom: 16,
  },

  materialConcluido: {
    color: cores.verde,
    fontWeight: "bold",
  },

  txtErro: {
    fontSize: 13,
    color: cores.vermelho,
    textAlign: "center",
    marginBottom: 12,
  },
});

export default materiaisStyles;
