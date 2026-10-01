import { StyleSheet } from "react-native";
import { cores } from "./variaveis";

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.branco,
  },

  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: cores.cinza,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  cabecalhoEsquerda: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.branco,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarIcone: {
    width: 26,
    height: 26,
  },

  avatarFoto: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },

  boasVindas: {
    fontSize: 14,
    color: cores.preto,
  },

  nomeAluno: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.preto,
  },

  btnNotificacao: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.branco,
    alignItems: "center",
    justifyContent: "center",
  },

  iconeNotificacao: {
    width: 22,
    height: 22,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  card: {
    width: "47%",
    aspectRatio: 1,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.cinza,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  cardPressed: {
    backgroundColor: cores.cinza,
  },

  cardIcone: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },

  cardTexto: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.azul,
  },
});

export default homeStyles;
