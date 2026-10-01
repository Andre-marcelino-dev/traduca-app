# Melhorias recomendadas — Traduca (app + site)

Atualizado em 30/09/2026. Ordem = prioridade (o que está no topo é mais importante).

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
   Enviado pelo FileZilla e conferido no site no ar (30/09).
2. ✅ **Botão "Sair da conta"** agora apaga o login no servidor e no aparelho (30/09).
3. ✅ **Tela de login** leva direto para a Home quem já está logado; login vencido volta
   sozinho para a tela de login (30/09).
4. ✅ **Trabalho salvo no GitHub** (30/09): site PR #5 e app PR #1 juntados na `main`.
5. ✅ **Migration da Fase 3 confirmada** (30/09): os campos "Nº da aula" e "Duração em minutos"
   salvam normalmente no site no ar — prova de que a migration rodou.
6. ✅ **Tela Aulas ligada ao banco** (30/09), só com a API que já existia. Testada;
   bandeiras agora são desenhadas (aparecem também no Windows). Salva no GitHub (branch `tela-aulas`).

## 2. Fase 5 — telas que ainda usam dados de exemplo

Já usam o banco: Login, Home, Config, Perfil (nome/e-mail/foto), Curso, Módulo, Materiais, Aulas.

As telas abaixo **não dá para fazer só no app**: a API ainda não tem essas informações.
A boa notícia: quase tudo já existe no **painel do aluno do site** — é só criar rotas na API
copiando a regra dos controllers de `app/Http/Controllers/aluno/` (backend).

### Como fazer cada tela (mesmo processo das outras fases)

1. Criar a rota em `routes/api.php` (grupo `auth:sanctum` do aluno) + controller em
   `app/Http/Controllers/Api/V1/Aluno/`, reaproveitando a regra do controller do site.
2. Testar no local (Docker) com um script de teste, como feito na carga horária.
3. Pasta na Área de Trabalho + LEIA-ME → enviar pelo FileZilla.
4. Ligar a tela no app (função nova em `src/services/api.ts`) e testar.
5. Commit em branch → Pull Request no GitHub.

### Ordem sugerida (do mais simples/útil para o mais trabalhoso)

| # | Tela do app | Rota nova na API (sugestão) | De onde copiar a regra no site | Dificuldade |
|---|---|---|---|---|
| 1 | **Agenda** | `GET /aluno/agenda` (aulas com data/hora) | `aluno/AulaController@index` | fácil |
| 2 | **Perfil** (salvar e-mail, trocar foto) | `PUT /aluno/perfil/email`, `POST /aluno/perfil/foto` | `aluno/AuthController@atualizarEmail`, `@atualizarFoto` | fácil/média (foto = upload) |
| 3 | **Alterar senha** (modal da Config) | `PUT /aluno/perfil/senha` | `aluno/AuthController@atualizarSenha` | fácil |
| 4 | **Desempenho** | `GET /aluno/desempenho` | `aluno/ProgressoController@index` | média |
| 5 | **Atividades** | `GET /aluno/atividades`, `GET /aluno/atividades/{id}`, `POST .../responder` | `aluno/AtividadeController@index/show/responder` | média |
| 6 | **Dúvida** | `GET /aluno/duvidas`, `POST /aluno/duvidas` | `aluno/DuvidaController@index/store` | fácil |
| 7 | **Assistente** (chat) | `GET /aluno/chatbot/dados`, `POST /aluno/chatbot/mensagem` | `aluno/ChatbotController@dados/mensagem` | média (já tem limite de uso) |
| 8 | **Esqueci / Redefinir senha** | `POST /aluno/senha/esqueci`, `POST /aluno/senha/redefinir` | **não existe no site** — criar do zero (envia e-mail com código/link) | trabalhosa (precisa e-mail configurado na Locaweb) |
| 9 | **Notificações** (sino) | `GET /aluno/notificacoes` | **não existe no site** — definir o que notificar (aula nova, atividade, material) | trabalhosa |

Também existem no site e podem virar telas no app depois: **Fórum** (`aluno/ForumController`),
**Feedback** e **Reagendamento de aula** (`aluno/FeedbackController`, `aluno/ReagendamentoController`).

### Cuidados

- Telefone, idioma e nível no Perfil: idioma/nível já vêm de `/aluno/cursos`; **telefone**
  precisa confirmar se existe na tabela do aluno antes de criar a rota.
- Atualizar a documentação da API (`resources/views/api/documentacao.blade.php`) e o
  `RESUMO-API-TRADUCA.md` a cada rota nova.
- Nenhuma dessas rotas deve precisar de migration, exceto Esqueci senha e Notificações.

## 3. Melhorias de segurança e qualidade

- **Guardar o token com criptografia no celular** (`expo-secure-store`). Hoje usa AsyncStorage,
  que é aceitável para testes, mas no celular o SecureStore é o recomendado. No navegador continua como está.
- **Endereço da API configurável** (`EXPO_PUBLIC_API_URL`). Assim dá para testar com o banco local
  (`localhost:8081`) sem mexer no código — evita a confusão "cadastrei no local e não aparece no app".
- **Aluno com mais de um curso:** a tela Aulas já deixa escolher o idioma; Curso e Materiais
  ainda mostram só o primeiro curso. Guardar o curso escolhido e usar nas três telas.
- **Tamanho do arquivo nos Materiais:** a API não envia; incluir no backend (`tamanho_bytes`).
- **Limpeza pequena no código:** indentação irregular no login. Rodar `npm run lint` de vez em quando.
- **Publicação do site só pelo FileZilla:** funciona, mas é fácil esquecer um arquivo. No futuro,
  vale um deploy automático pelo GitHub (a Locaweb aceita FTP em GitHub Actions) — só se você quiser.

## 4. Como cadastrar no painel para aparecer no app (lembrete)

1. **Módulos:** curso + nível iguais aos da matrícula do aluno, ordem, status ATIVO.
2. **Aulas:** escolher o **Módulo** (se ficar vazio, a aula não aparece no app), duração em minutos.
3. **Materiais:** escolher o módulo e anexar o arquivo.
4. **Presença:** presente/justificado = aula concluída.
5. Sempre no painel **do site no ar** (`traduca.adminfo.dev.br`), não no `localhost:8081`.
