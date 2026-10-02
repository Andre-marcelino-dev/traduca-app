import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

const modalReagendamentoStyle = StyleSheet.create({
  sobrepor: {
    flex: 1,
    backgroundColor: cores.preto80,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  conteudo: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: cores.branco,
    borderWidth: 2,
    borderColor: cores.azul,
    borderRadius: 20,
    padding: 18,
  },

  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  cabecalhoIconeBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: cores.azul,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  cabecalhoIcone: {
    width: 20,
    height: 20,
    tintColor: cores.branco,
  },

  cabecalhoTextos: {
    flex: 1,
  },

  cabecalhoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.preto,
  },

  cabecalhoSubtitulo: {
    fontSize: 11,
    color: cores.cinzaEscuro,
    marginTop: 2,
  },

  btnFechar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  btnFecharPressed: {
    opacity: 0.6,
  },

  campo: {
    marginBottom: 16,
  },

  campoLabelLinha: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  campoLabelIcone: {
    width: 14,
    height: 14,
    tintColor: cores.azul,
    marginRight: 6,
  },

  campoLabelTexto: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.preto,
  },

  seletorAula: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 46,
    borderWidth: 2,
    borderColor: cores.azul,
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  seletorAulaTexto: {
    fontSize: 13,
    color: cores.preto,
    flex: 1,
  },

  seletorAulaPlaceholder: {
    color: cores.cinzaEscuro,
  },

  seletorAulaIcone: {
    width: 12,
    height: 12,
    tintColor: cores.azul,
    transform: [{ rotate: "-90deg" }],
  },

  motivoInput: {
    minHeight: 90,
    borderWidth: 2,
    borderColor: cores.azul,
    borderRadius: 12,
    padding: 14,
    fontSize: 13,
    color: cores.preto,
    textAlignVertical: "top",
  },

  contadorLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  contadorTexto: {
    fontSize: 11,
    color: cores.cinzaEscuro,
  },

  contadorTextoAlerta: {
    color: cores.vermelho,
  },

  erroTexto: {
    fontSize: 12,
    color: cores.vermelho,
    textAlign: "center",
    marginBottom: 12,
  },

  botoesLinha: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },

  btnCancelar: {
    flex: 1,
    height: 48,
    borderWidth: 2,
    borderColor: cores.azul,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  btnCancelarPressed: {
    opacity: 0.7,
  },

  txtCancelar: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.azul,
  },

  btnEnviar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    backgroundColor: cores.azul,
    borderRadius: 12,
  },

  btnEnviarDesabilitado: {
    opacity: 0.5,
  },

  btnEnviarPressed: {
    opacity: 0.8,
  },

  iconeEnviar: {
    width: 15,
    height: 15,
    tintColor: cores.branco,
    marginRight: 8,
  },

  txtEnviar: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.branco,
  },

  // Seletor de aula (lista dentro de modal secundário)
  seletorSobrepor: {
    flex: 1,
    backgroundColor: cores.preto80,
    justifyContent: "center",
    padding: 24,
  },

  seletorPainel: {
    maxHeight: "70%",
    backgroundColor: cores.branco,
    borderWidth: 2,
    borderColor: cores.azul,
    borderRadius: 16,
    paddingVertical: 8,
  },

  seletorOpcao: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.cinza,
  },

  seletorOpcaoTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.preto,
  },

  seletorOpcaoInfo: {
    fontSize: 12,
    color: cores.cinzaEscuro,
    marginTop: 2,
  },

  seletorVazioTexto: {
    fontSize: 13,
    color: cores.cinzaEscuro,
    textAlign: "center",
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
});

export default modalReagendamentoStyle;
