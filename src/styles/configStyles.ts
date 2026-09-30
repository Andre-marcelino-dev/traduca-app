import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

const configStyles = StyleSheet.create({
  cardBoasVindas: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.azul,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: cores.azul,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarIcone: {
    width: 28,
    height: 28,
    tintColor: cores.branco,
  },

  avatarFoto: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  boasVindasTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: cores.preto,
  },

  boasVindasSubtitulo: {
    fontSize: 12,
    color: cores.cinzaEscuro,
    marginTop: 2,
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

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.azul,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },

  itemIconeBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${cores.azul}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  itemIcone: {
    width: 20,
    height: 20,
  },

  itemCorpo: {
    flex: 1,
  },

  itemTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.preto,
  },

  itemSubtitulo: {
    fontSize: 12,
    color: cores.cinzaEscuro,
    marginTop: 2,
  },

  itemSeta: {
    width: 14,
    height: 14,
    tintColor: cores.azul,
    transform: [{ rotate: "180deg" }],
  },

  btnInstalar: {
    borderWidth: 1,
    borderColor: cores.azul,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  txtBtnInstalar: {
    fontSize: 12,
    fontWeight: "bold",
    color: cores.azul,
  },

  btnSair: {
    backgroundColor: cores.azul,
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  txtBtnSair: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.branco,
  },
});

export default configStyles;
