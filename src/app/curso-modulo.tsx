import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";

import { ActivityIndicator, Pressable, Text, View } from "react-native";

import EstadoVazio from "@/components/estado-vazio";
import TelaComAbas from "@/components/tela-com-abas";
import { buscarModulo, formatarDuracao, ModuloDetalhe, textoAulas } from "@/services/api";
import cursoModuloStyles from "@/styles/cursoModuloStyles";
import { cores } from "@/styles/variaveis";

// Número com dois dígitos: 1 → "01".
const doisDigitos = (n: number) => String(n).padStart(2, "0");

export default function CursoModuloScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [dados, setDados] = useState<ModuloDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Busca os dados toda vez que a tela aparece (inclusive ao voltar para ela).
  useFocusEffect(
    useCallback(() => {
      if (!id) {
        setErro("Escolha um módulo na tela Curso.");
        setCarregando(false);
        return;
      }

      buscarModulo(id)
        .then((resposta) => {
          setDados(resposta);
          setErro("");
        })
        .catch((e) => {
          setDados(null);
          setErro(e instanceof Error ? e.message : "Não foi possível carregar o módulo.");
        })
        .finally(() => setCarregando(false));
    }, [id])
  );

  const modulo = dados?.modulo;
  const progresso = dados?.progresso;
  const aulas = dados?.aulas ?? [];
  const proximo = dados?.proximo_modulo;

  return (
    <TelaComAbas titulo="Curso" subtitulo="Visualizar a carga horária e conteúdo do curso">
      {carregando && <ActivityIndicator size="large" color={cores.azul} />}

      {!carregando && erro ? (
        <EstadoVazio
          icone={require("@/assets/images/imgIcon/curso-azul.png")}
          texto={erro}
        />
      ) : null}

      {!carregando && dados && modulo && progresso && (
      <>
      <View style={cursoModuloStyles.cardModulo}>
        <Text style={cursoModuloStyles.moduloEtiqueta}>
          {dados.curso.toUpperCase()} | MÓDULO {doisDigitos(modulo.ordem_modulo)}
        </Text>
        <Text style={cursoModuloStyles.moduloTitulo}>{modulo.nome_modulo}</Text>
        {modulo.descricao_modulo ? (
          <Text style={cursoModuloStyles.moduloDescricao}>{modulo.descricao_modulo}</Text>
        ) : null}

        <View style={cursoModuloStyles.moduloInfoLinha}>
          <Text style={cursoModuloStyles.moduloInfo}>
            {textoAulas(progresso.total_aulas)} · {formatarDuracao(modulo.carga_horaria_minutos)} · {dados.nivel}
          </Text>
        </View>
      </View>

      <View style={cursoModuloStyles.progressoTopo}>
        <Text style={cursoModuloStyles.progressoLabel}>PROGRESSO DO MÓDULO</Text>
        <Text style={cursoModuloStyles.progressoPorcentagem}>{progresso.percentual}%</Text>
      </View>

      <View style={cursoModuloStyles.progressoTrilha}>
        <View style={[cursoModuloStyles.progressoPreenchimento, { width: `${progresso.percentual}%` }]} />
      </View>

      <Text style={cursoModuloStyles.progressoResumo}>
        {progresso.aulas_concluidas} de {textoAulas(progresso.total_aulas)}{" "}
        {progresso.total_aulas === 1 ? "concluída" : "concluídas"}
        {progresso.total_materiais > 0
          ? ` · ${progresso.materiais_concluidos} de ${progresso.total_materiais} ${
              progresso.total_materiais === 1 ? "material concluído" : "materiais concluídos"
            }`
          : ""}
      </Text>

      <Text style={cursoModuloStyles.secaoTitulo}>Aulas</Text>

      {aulas.length === 0 && (
        <Text style={cursoModuloStyles.progressoResumo}>Nenhuma aula cadastrada neste módulo.</Text>
      )}

      {aulas.map((aula) => (
        <View
          key={aula.id_aula}
          style={[cursoModuloStyles.cardAula, aula.concluida && cursoModuloStyles.cardAulaConcluida]}
        >
          <View style={{ flex: 1 }}>
            <Text style={cursoModuloStyles.aulaEtiqueta}>AULA {doisDigitos(aula.numero)}</Text>
            <Text style={cursoModuloStyles.aulaTitulo}>{aula.titulo}</Text>
            <Text style={cursoModuloStyles.aulaInfo}>
              {aula.duracao_minutos ? `${aula.duracao_minutos} min · ` : ""}
              {aula.ao_vivo ? "Aula ao vivo" : "Aula"}
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

      {progresso.concluido && (
        <Pressable
          style={cursoModuloStyles.btnProximoModulo}
          onPress={() =>
            proximo
              ? router.push({ pathname: "/curso-modulo", params: { id: proximo.id_modulo } })
              : router.navigate("/curso")
          }
        >
          <Text style={cursoModuloStyles.btnProximoModuloTexto}>
            {proximo
              ? "Todas as aulas concluídas, siga para o próximo módulo →"
              : "Parabéns! Você concluiu o último módulo do curso →"}
          </Text>
        </Pressable>
      )}
      </>
      )}
    </TelaComAbas>
  );
}
