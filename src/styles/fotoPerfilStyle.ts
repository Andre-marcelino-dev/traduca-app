import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

const fotoPerfilStyle = StyleSheet.create({
  sobrepor: {
    flex: 1,
    backgroundColor: cores.preto80,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  conteudo: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: cores.branco,
    borderWidth: 2,
    borderColor: cores.azul,
    borderRadius: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  btnFechar: {
    alignSelf: "flex-start",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: cores.azul,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  iconeFechar: {
    width: 14,
    height: 14,
  },

  iconeBox: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: cores.azul,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  icone: {
    width: 40,
    height: 40,
    tintColor: cores.branco,
  },

  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.preto,
    marginBottom: 20,
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 46,
    borderRadius: 12,
    marginBottom: 12,
  },

  btnPreenchido: {
    backgroundColor: cores.azul,
  },

  btnIcone: {
    width: 16,
    height: 16,
    marginRight: 8,
  },

  btnTextoPreenchido: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.branco,
  },

  txtErro: {
    fontSize: 13,
    color: cores.vermelho,
    textAlign: "center",
    marginTop: 12,
  },

  txtSucesso: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.verde,
    textAlign: "center",
    marginTop: 12,
  },
});

export default fotoPerfilStyle;
