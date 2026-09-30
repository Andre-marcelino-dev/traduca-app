# Melhorias recomendadas — Traduca (app + site)

Atualizado em 29/09/2026. Ordem = prioridade (o que está no topo é mais importante).

## Avaliação geral

**A estrutura está boa nos dois projetos.**

- **App:** telas em `src/app`, estilos separados em `src/styles`, componentes reaproveitados em
  `src/components` e agora toda conversa com o servidor fica num lugar só (`src/services`).
  Isso facilita muito continuar.
- **Site/API:** API versionada (`/api/v1`), login com token (Sanctum), limite de tentativas,
  e a regra de progresso fica num arquivo só (`ModuloProgresso.php`) usado pelo site **e** pelo app —
  por isso os dois sempre mostram o mesmo resultado.

Os pontos abaixo são ajustes, não problemas de estrutura.

---

## 1. Para fazer já (próxima sessão)

1. ✅ **Carga horária do módulo = soma das aulas** (backend) — feito e testado no local em 30/09.
   Falta só **enviar pelo FileZilla**: pasta `traduca_atualizacao_carga_horaria` na Área de Trabalho (ver LEIA-ME).
2. ✅ **Botão "Sair da conta"** agora apaga o login no servidor e no aparelho (30/09).
3. ✅ **Tela de login** leva direto para a Home quem já está logado; login vencido volta
   sozinho para a tela de login (30/09).
4. **Salvar o trabalho no Git.** App: tudo desta sessão está sem commit. Site: a correção do "02"
   no cadastro de aulas (`admin/AulaController.php` + telas de aula) também está sem commit — e
   confirmar se já foi enviada pelo FileZilla.
5. **Confirmar a migration da Fase 3 no servidor** (pendência antiga):
   abrir `https://traduca.adminfo.dev.br/sistema/migrate/<DEPLOY_SECRET>`.

## 2. Telas do app que ainda usam dados de exemplo

Já usam o banco: Login, Home (nome/foto), Config (nome/foto), Perfil (nome/e-mail/foto), Curso, Módulo, Materiais.

Ainda com dados fixos — cada uma precisa de rota nova na API (copiando a regra do painel do aluno do site):

| Tela | O que falta na API |
|---|---|
| Aulas | lista de aulas do aluno (dá para reaproveitar a do módulo) |
| Agenda | agenda do aluno |
| Atividades | listar e responder atividades |
| Desempenho | notas / frequência |
| Perfil | telefone, idioma, nível; salvar alterações; trocar foto |
| Alterar senha / Esqueci senha / Redefinir senha | rotas de senha |
| Notificações (sino) | notificações |
| Dúvida / Assistente | envio de dúvidas |

## 3. Melhorias de segurança e qualidade

- **Guardar o token com criptografia no celular** (`expo-secure-store`). Hoje usa AsyncStorage,
  que é aceitável para testes, mas no celular o SecureStore é o recomendado. No navegador continua como está.
- **Endereço da API configurável** (`EXPO_PUBLIC_API_URL`). Assim dá para testar com o banco local
  (`localhost:8081`) sem mexer no código — evita a confusão "cadastrei no local e não aparece no app".
- **Aluno com mais de um curso:** hoje o app mostra só o primeiro. Colocar uma escolha de curso.
- **Tamanho do arquivo nos Materiais:** a API não envia; incluir no backend (`tamanho_bytes`).
- **Limpeza pequena no código:** `index.tsx` importa `ScrollView` e `SafeAreaView` sem usar;
  indentação irregular no login. Rodar `npm run lint` de vez em quando.
- **Publicação do site só pelo FileZilla:** funciona, mas é fácil esquecer um arquivo. No futuro,
  vale um deploy automático pelo GitHub (a Locaweb aceita FTP em GitHub Actions) — só se você quiser.

## 4. Como cadastrar no painel para aparecer no app (lembrete)

1. **Módulos:** curso + nível iguais aos da matrícula do aluno, ordem, status ATIVO.
2. **Aulas:** escolher o **Módulo** (se ficar vazio, a aula não aparece no app), duração em minutos.
3. **Materiais:** escolher o módulo e anexar o arquivo.
4. **Presença:** presente/justificado = aula concluída.
5. Sempre no painel **do site no ar** (`traduca.adminfo.dev.br`), não no `localhost:8081`.
