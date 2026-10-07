import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

// Mesmo visual das "pílulas" de idioma da tela Atividades.
const seletorCursoStyles = StyleSheet.create({
  linha: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: cores.azul,
  },

  pillSelecionado: {
    backgroundColor: cores.azul,
  },

  pillTexto: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.azul,
  },

  pillTextoSelecionado: {
    color: cores.branco,
  },
});

export default seletorCursoStyles;
