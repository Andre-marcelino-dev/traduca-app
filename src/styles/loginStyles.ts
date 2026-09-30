import { StyleSheet } from "react-native";
import { cores } from "./variaveis";
 
const loginStyles = StyleSheet.create({
  conteudo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 195,
    height: 180,
  },
 
  titulo: {
    fontSize: 40,
    fontWeight: "bold",
    color: cores.preto,
    textAlign: "center",
  },
  subtitulo: {
    marginTop: 10,
    fontSize: 20,
    color: cores.cinzaEscuro,
  },
  form: {
    width: 350,
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: "5%",
  },
 
  input: {
    height: 50,
    flexDirection: "row",
    backgroundColor: cores.cinza,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    width: 350,
    marginVertical: 10,
    justifyContent: "space-between",
  },
 
  icone: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
 
  TextInput: {
    width: "100%",
  },
 
  btnMostrarSenha: {
    justifyContent: "center",
  },
 
  mostrarSenha: {
    width: 20,
    height: 20,
    marginVertical: 5,
  },
 
  btnEsqueciSenha: {
    alignSelf: "flex-end",
  },
 
  txtEsqueciSenha: {
    fontSize: 12,
    color: cores.azul,
    textDecorationLine: "underline",
  },
 
  btnEntrar: {
    width: "80%",
    height: 50,
    backgroundColor: cores.azul,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
    borderColor: cores.cinza,
  },
 
  txtEntrar: {
    color: cores.branco,
    fontSize: 25,
    fontWeight: "bold",
  },
 
  btnEntrarPressed: {
    opacity: 0.8,
  },

  txtErro: {
    marginTop: 10,
    fontSize: 14,
    color: cores.vermelho,
    textAlign: "center",
  },
});
 
export default loginStyles;
 
 