import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

const perfilStyles = StyleSheet.create({
  cardPerfil: {
    alignItems: "center",
    backgroundColor: cores.azul,
    borderRadius: 20,
    paddingVertical: 24,
    marginBottom: 24,
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: cores.branco,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarIcone: {
    width: 48,
    height: 48,
  },

  avatarFoto: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },

  btnCamera: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: cores.branco,
    borderWidth: 2,
    borderColor: cores.azul,
    alignItems: "center",
    justifyContent: "center",
  },

  iconeCamera: {
    width: 15,
    height: 15,
    tintColor: cores.azul,
  },

  nome: {
    fontSize: 19,
    fontWeight: "bold",
    color: cores.branco,
  },

  statusBadge: {
    backgroundColor: cores.verde,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },

  statusBadgeTexto: {
    fontSize: 12,
    fontWeight: "bold",
    color: cores.branco,
  },

  secaoTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    color: cores.preto,
    marginBottom: 12,
  },

  secao: {
    marginBottom: 24,
  },

  campo: {
    marginBottom: 12,
  },

  rotulo: {
    fontSize: 12,
    fontWeight: "bold",
    color: cores.cinzaEscuro,
    marginBottom: 6,
  },

  inputComIcone: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderWidth: 2,
    borderColor: cores.azul,
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  campoIcone: {
    width: 16,
    height: 16,
    marginRight: 10,
  },

  campoTextInput: {
    flex: 1,
    fontSize: 14,
    color: cores.preto,
  },

  campoValorTexto: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: cores.preto,
  },

  btnSalvar: {
    height: 50,
    backgroundColor: cores.azul,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  btnSalvarPressed: {
    opacity: 0.8,
  },

  txtSalvar: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.branco,
  },
});

export default perfilStyles;
