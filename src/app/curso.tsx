import { router } from "expo-router";

import { Image, Pressable, Text, View } from "react-native";

import BarraProgresso from "@/components/barra-progresso";
import TelaComAbas from "@/components/tela-com-abas";
import cursoStyles from "@/styles/cursoStyles";
import { cores } from "@/styles/variaveis";

type StatusModulo = "concluido" | "atual" | "bloqueado";

const modulos: {
  titulo: string;
  aulas: number;
  duracao: string;
  status: StatusModulo;
}[] = [
  { titulo: "Módulo Fundamentos 01", aulas: 8, duracao: "2h30", status: "concluido" },
  { titulo: "Módulo Vocabulário 02", aulas: 8, duracao: "2h30", status: "concluido" },
  { titulo: "Módulo Conversação 03", aulas: 8, duracao: "2h30", status: "atual" },
  { titulo: "Módulo Verbalização 04", aulas: 8, duracao: "2h30", status: "bloqueado" },
];

const estiloPorStatus: Record<StatusModulo, object> = {
  concluido: cursoStyles.moduloCardConcluido,
  atual: cursoStyles.moduloCardAtual,
  bloqueado: cursoStyles.moduloCardBloqueado,
};

export default function CursoScreen() {
  return (
    <TelaComAbas titulo="Curso" subtitulo="Visualize a carga horária e conteúdo do curso">
      <View style={cursoStyles.abasLinha}>
        <View style={[cursoStyles.abaItem, cursoStyles.abaItemSelecionada]}>
          <Text style={[cursoStyles.abaItemTexto, cursoStyles.abaItemTextoSelecionada]}>
            Curso
          </Text>
        </View>

        <Pressable style={cursoStyles.abaItem} onPress={() => router.navigate("/materiais")}>
          <Text style={cursoStyles.abaItemTexto}>Materiais</Text>
        </Pressable>
      </View>

      <View style={cursoStyles.cardCargaHoraria}>
        <View style={cursoStyles.cardCargaHorariaTopo}>
          <Text style={cursoStyles.cargaHorariaLabel}>Carga Horária:</Text>

          <View style={cursoStyles.cargaHorariaBadge}>
            <Image
              source={require("@/assets/images/imgIcon/relogio-azul.png")}
              style={cursoStyles.cargaHorariaBadgeIcone}
            />
            <Text style={cursoStyles.cargaHorariaBadgeTexto}>18h total</Text>
          </View>
        </View>

        <Text style={cursoStyles.cargaHorariaResumo}>48 aulas · 6 módulos</Text>

        <BarraProgresso porcentagem={62} cor={cores.azul} />
      </View>

      <Text style={cursoStyles.secaoTitulo}>Conteúdo do curso</Text>

      {modulos.map((modulo) => (
        <Pressable
          key={modulo.titulo}
          style={[cursoStyles.moduloCard, estiloPorStatus[modulo.status]]}
          disabled={modulo.status === "bloqueado"}
          onPress={() => router.navigate("/curso-modulo")}
        >
          <View style={cursoStyles.moduloTopo}>
            <Text
              style={[
                cursoStyles.moduloTitulo,
                modulo.status === "bloqueado" && cursoStyles.moduloTituloBloqueado,
              ]}
            >
              {modulo.titulo}
            </Text>

            {modulo.status === "atual" && (
              <Text style={cursoStyles.moduloTag}>Você está aqui</Text>
            )}
          </View>

          <Text style={cursoStyles.moduloInfo}>
            {modulo.aulas} aulas · {modulo.duracao}
          </Text>

          {modulo.status === "concluido" && (
            <View style={cursoStyles.moduloStatusLinha}>
              <Image
                source={require("@/assets/images/imgIcon/check.png")}
                style={cursoStyles.moduloStatusIcone}
              />
              <Text style={[cursoStyles.moduloStatusTexto, { color: cores.verde }]}>
                Concluído
              </Text>
            </View>
          )}

          {modulo.status === "atual" && (
            <View style={cursoStyles.moduloStatusLinha}>
              <Image
                source={require("@/assets/images/imgIcon/play.png")}
                style={[cursoStyles.moduloStatusIcone, { tintColor: cores.azul }]}
              />
              <Text style={[cursoStyles.moduloStatusTexto, { color: cores.azul }]}>
                Em andamento
              </Text>
            </View>
          )}

          {modulo.status === "bloqueado" && (
            <Text style={cursoStyles.moduloBloqueadoTexto}>
              Conclua o módulo anterior para avançar
            </Text>
          )}
        </Pressable>
      ))}
    </TelaComAbas>
  );
}
