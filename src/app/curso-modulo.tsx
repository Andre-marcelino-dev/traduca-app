import { router } from "expo-router";

import { Pressable, Text, View } from "react-native";

import TelaComAbas from "@/components/tela-com-abas";
import cursoModuloStyles from "@/styles/cursoModuloStyles";
import { cores } from "@/styles/variaveis";

const modulo = {
  idioma: "Inglês",
  numero: "01",
  titulo: "Fundamentos",
  descricao: "Pronúncia e verbos no futuro",
  aulas: 8,
  duracao: "2h30",
  nivel: "Intermediário",
};

const aulas: {
  numero: string;
  titulo: string;
  duracao: string;
  tipo: string;
  concluida: boolean;
}[] = [
  { numero: "01", titulo: "Alfabeto e Pronúncia", duracao: "12 min", tipo: "Aula ao vivo", concluida: true },
  { numero: "02", titulo: "Estrutura da Frase (SVO)", duracao: "12 min", tipo: "Aula ao vivo", concluida: true },
  { numero: "03", titulo: "Pronomes Pessoais", duracao: "12 min", tipo: "Aula ao vivo", concluida: true },
  { numero: "04", titulo: "Verbo \"To Be\"", duracao: "12 min", tipo: "Aula ao vivo", concluida: true },
  { numero: "05", titulo: "Frases Negativas e Interrogativas", duracao: "12 min", tipo: "Aula ao vivo", concluida: true },
];

export default function CursoModuloScreen() {
  const concluidas = aulas.filter((aula) => aula.concluida).length;
  const porcentagem = Math.round((concluidas / aulas.length) * 100);
  const todasConcluidas = concluidas === aulas.length;

  return (
    <TelaComAbas titulo="Curso" subtitulo="Visualizar a carga horária e conteúdo do curso">
      <View style={cursoModuloStyles.cardModulo}>
        <Text style={cursoModuloStyles.moduloEtiqueta}>
          {modulo.idioma.toUpperCase()} | MÓDULO {modulo.numero}
        </Text>
        <Text style={cursoModuloStyles.moduloTitulo}>{modulo.titulo}</Text>
        <Text style={cursoModuloStyles.moduloDescricao}>{modulo.descricao}</Text>

        <View style={cursoModuloStyles.moduloInfoLinha}>
          <Text style={cursoModuloStyles.moduloInfo}>
            {modulo.aulas} aulas · {modulo.duracao} · {modulo.nivel}
          </Text>
        </View>
      </View>

      <View style={cursoModuloStyles.progressoTopo}>
        <Text style={cursoModuloStyles.progressoLabel}>PROGRESSO DO MÓDULO</Text>
        <Text style={cursoModuloStyles.progressoPorcentagem}>{porcentagem}%</Text>
      </View>

      <View style={cursoModuloStyles.progressoTrilha}>
        <View style={[cursoModuloStyles.progressoPreenchimento, { width: `${porcentagem}%` }]} />
      </View>

      <Text style={cursoModuloStyles.progressoResumo}>
        {concluidas} de {aulas.length} aulas concluídas
      </Text>

      <Text style={cursoModuloStyles.secaoTitulo}>Aulas</Text>

      {aulas.map((aula) => (
        <View
          key={aula.numero}
          style={[cursoModuloStyles.cardAula, aula.concluida && cursoModuloStyles.cardAulaConcluida]}
        >
          <View style={{ flex: 1 }}>
            <Text style={cursoModuloStyles.aulaEtiqueta}>AULA {aula.numero}</Text>
            <Text style={cursoModuloStyles.aulaTitulo}>{aula.titulo}</Text>
            <Text style={cursoModuloStyles.aulaInfo}>
              {aula.duracao} · {aula.tipo}
            </Text>
          </View>

          <Text
            style={[
              cursoModuloStyles.aulaStatus,
              { color: aula.concluida ? cores.verde : cores.cinzaEscuro },
            ]}
          >
            {aula.concluida ? "Concluída" : "Pendente"}
          </Text>
        </View>
      ))}

      {todasConcluidas && (
        <Pressable style={cursoModuloStyles.btnProximoModulo} onPress={() => router.navigate("/curso")}>
          <Text style={cursoModuloStyles.btnProximoModuloTexto}>
            Todas as aulas concluídas, siga para o próximo módulo →
          </Text>
        </Pressable>
      )}
    </TelaComAbas>
  );
}
