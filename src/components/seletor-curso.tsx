import { Pressable, Text, View } from "react-native";

import BandeiraIdioma, { idiomaDoCurso } from "@/components/bandeira-idioma";
import seletorCursoStyles from "@/styles/seletorCursoStyles";

type SeletorCursoProps = {
  cursos: { id_curso: number; nome_curso: string | null }[];
  idSelecionado: number | undefined;
  onEscolher: (idCurso: number) => void;
};

// "Inglês | Italiano": só aparece para quem tem mais de um curso.
export default function SeletorCurso({ cursos, idSelecionado, onEscolher }: SeletorCursoProps) {
  if (cursos.length < 2) return null;

  return (
    <View style={seletorCursoStyles.linha}>
      {cursos.map((curso) => {
        const selecionado = curso.id_curso === idSelecionado;
        const idioma = idiomaDoCurso(curso.nome_curso);

        return (
          <Pressable
            key={curso.id_curso}
            style={[seletorCursoStyles.pill, selecionado && seletorCursoStyles.pillSelecionado]}
            onPress={() => onEscolher(curso.id_curso)}
          >
            {idioma && <BandeiraIdioma idioma={idioma} tamanho={18} />}
            <Text
              style={[seletorCursoStyles.pillTexto, selecionado && seletorCursoStyles.pillTextoSelecionado]}
            >
              {curso.nome_curso}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
