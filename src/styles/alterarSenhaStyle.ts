import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

const alterarSenhaStyle = StyleSheet.create({
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
    paddingVertical: 20,
  },

  btnFechar: {
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

  titulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: cores.preto,
    textAlign: "center",
    marginBottom: 20,
  },

  campo: {
    marginBottom: 14,
  },

  rotulo: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.preto,
    marginBottom: 6,
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderWidth: 2,
    borderColor: cores.azul,
    borderRadius: 24,
    paddingHorizontal: 16,
  },

  textInput: {
    flex: 1,
    fontSize: 14,
    color: cores.preto,
  },

  iconeMostrarSenha: {
    width: 18,
    height: 18,
  },

  btnSalvar: {
    height: 50,
    backgroundColor: cores.azul,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  btnSalvarPressed: {
    opacity: 0.8,
  },

  txtSalvar: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.branco,
  },

  txtErro: {
    fontSize: 13,
    color: cores.vermelho,
    textAlign: "center",
    marginTop: 4,
  },

  txtSucesso: {
    fontSize: 13,
    fontWeight: "bold",
    color: cores.verde,
    textAlign: "center",
    marginTop: 4,
  },
});

export default alterarSenhaStyle;
