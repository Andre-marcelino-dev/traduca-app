import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

// Gravar/ouvir a resposta de uma questão de áudio em Atividades.
const gravadorAudioStyles = StyleSheet.create({
  btnMicrofone: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: cores.vermelho,
    backgroundColor: `${cores.vermelho}10`,
    borderRadius: 12,
    paddingVertical: 14,
  },

  iconeMicrofone: {
    width: 18,
    height: 18,
    tintColor: cores.vermelho,
    marginRight: 8,
  },

  txtMicrofone: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.vermelho,
  },

  btnGravando: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: cores.vermelho,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },

  quadradoParar: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: cores.branco,
  },

  tempoGravando: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.vermelho,
  },

  btnPrimario: {
    backgroundColor: cores.azul,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  txtPrimario: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.branco,
  },

  btnSecundario: {
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  txtSecundario: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.cinzaEscuro,
  },

  linkRegravar: {
    marginTop: 8,
    alignItems: "center",
  },

  txtLinkRegravar: {
    fontSize: 12,
    color: cores.azul,
    textDecorationLine: "underline",
  },
});

export default gravadorAudioStyles;
