import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { ActivityIndicator, Pressable, Text, View } from "react-native";

import TelaComAbas from "@/components/tela-com-abas";
import { apiFetch, ApiError } from "@/services/api";
import cursoModuloStyles from "@/styles/cursoModuloStyles";
import { cores } from "@/styles/variaveis";

type AulaApi = {
  id_aula: number;
  numero: number;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  duracao_minutos: number | null;
  ao_vivo: boolean;
  link_aula: string | null;
  professor: string;
  presenca: "presente" | "falta" | "justificado" | null;
  concluida: boolean;
};

type ModuloDetalheApi = {
  curso: string;
  nivel: string;
  modulo: {
    id_modulo: number;
    ordem_modulo: number;
    nome_modulo: string;
    descricao_modulo: string;
    carga_horaria_minutos: number;
  };
  progresso: {
    total_aulas: number;
    aulas_concluidas: number;
    percentual: number;
    concluido: boolean;
  };
  proximo_modulo: { id_modulo: number; nome_modulo: string; liberado: boolean } | null;
  aulas: AulaApi[];
};

export default function CursoModuloScreen() {
  const { modulo: idModuloParam } = useLocalSearchParams<{ modulo?: string }>();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [dados, setDados] = useState<ModuloDetalheApi | null>(null);

  useEffect(() => {
    carregarModulo();
  }, [idModuloParam]);

  async function carregarModulo() {
    if (!idModuloParam) {
      setErro("Módulo não informado.");
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const resposta = await apiFetch<{ success: boolean; data: ModuloDetalheApi }>(
        `/aluno/modulos/${idModuloParam}`,
      );

      setDados(resposta.data);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        router.replace("/");
        return;
      }

      setErro(e instanceof ApiError ? e.message : "Sem conexão com o servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <TelaComAbas titulo="Curso" subtitulo="Visualizar a carga horária e conteúdo do curso">
      {carregando && (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator color={cores.azul} />
        </View>
      )}

      {!carregando && erro !== "" && (
        <View style={{ paddingVertical: 24, alignItems: "center" }}>
          <Text style={{ color: cores.vermelho, textAlign: "center", marginBottom: 12 }}>
            {erro}
          </Text>
          <Pressable onPress={() => router.navigate("/curso")}>
            <Text style={{ color: cores.azul, fontWeight: "bold" }}>Voltar para o curso</Text>
          </Pressable>
        </View>
      )}

      {!carregando && dados && (
        <>
          <View style={cursoModuloStyles.cardModulo}>
            <Text style={cursoModuloStyles.moduloEtiqueta}>
              {dados.curso.toUpperCase()} | MÓDULO{" "}
              {String(dados.modulo.ordem_modulo).padStart(2, "0")}
            </Text>
            <Text style={cursoModuloStyles.moduloTitulo}>{dados.modulo.nome_modulo}</Text>
            <Text style={cursoModuloStyles.moduloDescricao}>{dados.modulo.descricao_modulo}</Text>

            <View style={cursoModuloStyles.moduloInfoLinha}>
              <Text style={cursoModuloStyles.moduloInfo}>
                {dados.progresso.total_aulas} aulas · {dados.nivel}
              </Text>
            </View>
          </View>

          <View style={cursoModuloStyles.progressoTopo}>
            <Text style={cursoModuloStyles.progressoLabel}>PROGRESSO DO MÓDULO</Text>
            <Text style={cursoModuloStyles.progressoPorcentagem}>
              {dados.progresso.percentual}%
            </Text>
          </View>

          <View style={cursoModuloStyles.progressoTrilha}>
            <View
              style={[
                cursoModuloStyles.progressoPreenchimento,
                { width: `${dados.progresso.percentual}%` },
              ]}
            />
          </View>

          <Text style={cursoModuloStyles.progressoResumo}>
            {dados.progresso.aulas_concluidas} de {dados.progresso.total_aulas} aulas concluídas
          </Text>

          <Text style={cursoModuloStyles.secaoTitulo}>Aulas</Text>

          {dados.aulas.map((aula) => (
            <View
              key={aula.id_aula}
              style={[
                cursoModuloStyles.cardAula,
                aula.concluida && cursoModuloStyles.cardAulaConcluida,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={cursoModuloStyles.aulaEtiqueta}>
                  AULA {String(aula.numero).padStart(2, "0")}
                </Text>
                <Text style={cursoModuloStyles.aulaTitulo}>{aula.titulo}</Text>
                <Text style={cursoModuloStyles.aulaInfo}>
                  {aula.duracao_minutos !== null ? `${aula.duracao_minutos} min · ` : ""}
                  {aula.ao_vivo ? "Aula ao vivo" : "Gravada"}
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

          {dados.progresso.concluido && dados.proximo_modulo && (
            <Pressable
              style={cursoModuloStyles.btnProximoModulo}
              onPress={() =>
                router.navigate({
                  pathname: "/curso-modulo",
                  params: { modulo: String(dados.proximo_modulo!.id_modulo) },
                })
              }
            >
              <Text style={cursoModuloStyles.btnProximoModuloTexto}>
                Todas as aulas concluídas, siga para o próximo módulo →
              </Text>
            </Pressable>
          )}
        </>
      )}
    </TelaComAbas>
  );
}
