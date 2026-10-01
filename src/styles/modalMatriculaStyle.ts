import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

const modalMatriculaStyle = StyleSheet.create({
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
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
  },

  iconeBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${cores.azul}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  titulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: cores.preto,
    textAlign: "center",
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 13,
    color: cores.cinzaEscuro,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 22,
  },

  btnWhatsapp: {
    width: "100%",
    height: 50,
    backgroundColor: cores.azul,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  btnWhatsappPressed: {
    opacity: 0.8,
  },

  txtWhatsapp: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.branco,
  },

  btnFechar: {
    width: "100%",
    height: 50,
    borderWidth: 2,
    borderColor: cores.azul,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  btnFecharPressed: {
    opacity: 0.7,
  },

  txtFechar: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.azul,
  },
});

export default modalMatriculaStyle;
