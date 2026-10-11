# Melhorias recomendadas — Traduca (app + site)

Atualizado em 11/10/2026. Ordem = prioridade (o que está no topo é mais importante).

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

## 1. Próximos passos (em ordem)

1. ✅ **Notificações (sino)** — feito em 10/10 (site PR #20, app PR #15, app republicado).
   Usa a tabela `tbl_notificacoes` que já existia (sem migration). `App\Support\Notificar` cria os
   avisos quando o professor cadastra aula/atividade/material, corrige atividade, responde dúvida ou
   reagendamento; o app mostra o número no sino e abre a tela certa ao tocar no aviso.
2. ✅ **Rota temporária `/sistema/diagnostico`** — removida em 11/10 (pacote
   `traduca_atualizacao_remove_diagnostico`, 1 arquivo). `/sistema/migrate` continua.
3. **(Sem pressa) Limpeza que falta:**
   - Testes antigos quebrados no site (`ChatbotDateTest` duplicado, testes do painel admin usando
     `DATE_FORMAT`/`DATE_SUB` do MySQL rodando em SQLite, tabela `tbl_servicos` sem migration —
     a página 404 do site lê essa tabela) — não afetam o site no ar, só escondem problemas novos.
   - `EXPO_PUBLIC_API_URL` configurável no app, pra testar contra o backend local (`localhost:8081`)
     sem precisar trocar código — ainda não existe.
   - Git antigo esquecido dentro da pasta `src/` do site (`src/.git`, de 28/09, sem GitHub) —
     não atrapalha; sempre rodar o git a partir da raiz do projeto.

## 2. Fase 5 — telas ligadas ao banco de dados

**Tudo que estava planejado na Fase 5 já está pronto, no ar e testado**, incluindo os itens que
pareciam mais trabalhosos (Esqueci senha, Assistente), e também as Notificações (item novo,
feito em 10/10).

### Como fazer uma rota/tela nova (mesmo processo de sempre)

1. Criar a rota em `routes/api.php` (grupo `auth:sanctum` do aluno) + controller em
   `app/Http/Controllers/Api/V1/Aluno/`, reaproveitando a regra do controller do site quando existir.
2. Testar no local (Docker) com testes automatizados (PHPUnit).
3. Pasta na Área de Trabalho + LEIA-ME → enviar pelo FileZilla; rodar migration pendente (se tiver)
   em `https://traduca.adminfo.dev.br/sistema/migrate/<segredo>`.
4. Ligar a tela no app (função nova em `src/services/api.ts`) e testar — de preferência no link fixo
   publicado (`https://traduca-app.expo.app`, ver nota abaixo) ou no app instalado.
5. Commit em branch → Pull Request no GitHub (nunca mesclar direto, sempre pelo botão do GitHub).

### Status de cada tela

| # | Tela do app | Rota da API | De onde veio a regra | Status |
|---|---|---|---|---|
| 1 | Agenda + reagendamento | `GET /aluno/agenda`, `POST /aluno/reagendamento/solicitar` | `aluno/AulaController`, `aluno/ReagendamentoController` | ✅ feito |
| 2 | Perfil (e-mail, foto) | `PUT /aluno/perfil/email`, `POST /aluno/perfil/foto` | `aluno/AuthController` | ✅ feito |
| 3 | Alterar senha | `PUT /aluno/perfil/senha` | `aluno/AuthController` | ✅ feito |
| 4 | Desempenho | `GET /aluno/cursos/{id}/desempenho`, `POST /aluno/presencas/{id}/justificar` | `aluno/ProgressoController` | ✅ feito, confirmado ao vivo 08/10 |
| 5 | Atividades | `GET /aluno/atividades`, `GET /aluno/atividades/{id}`, `POST .../responder` | `aluno/AtividadeController` | ✅ feito |
| 6 | Dúvida | `GET/POST /aluno/duvidas` | `aluno/DuvidaController` | ✅ feito, confirmado ao vivo 08/10 |
| 7 | Assistente (chat) | `GET /aluno/chatbot/dados`, `POST /aluno/chatbot/mensagem` | `aluno/ChatbotController` | ✅ feito |
| 8 | Esqueci / Redefinir senha | `POST /aluno/senha/esqueci`, `POST /aluno/senha/redefinir` | não existia no site — criado do zero | ✅ feito, confirmado ao vivo 09/10 (código de 6 dígitos por e-mail) |
| 9 | Notificações (sino) | `GET /aluno/notificacoes`, `POST /aluno/notificacoes/{id}/lida`, `POST /aluno/notificacoes/lidas` | não existia no site — `App\Support\Notificar` + tabela `tbl_notificacoes` | ✅ feito, confirmado ao vivo 10/10 |

Também existem no site e podem virar telas no app depois: **Fórum** (`aluno/ForumController`),
**Feedback** (`aluno/FeedbackController`).

### Cuidados

- Telefone, idioma e nível no Perfil: idioma/nível já vêm de `/aluno/cursos`; **telefone**
  precisa confirmar se existe na tabela do aluno antes de criar a rota.
- Atualizar a documentação da API (`resources/views/api/documentacao.blade.php`) e o
  `RESUMO-API-TRADUCA.md` a cada rota nova.

## 3. Melhorias de segurança e qualidade

- ✅ **Segurança do login** (07/10): token no cofre do aparelho no app; aluno INATIVO bloqueado;
  trocar e-mail/senha sempre pede a senha atual.
- ✅ **Tamanho do arquivo nos Materiais** (08/10): `tamanho_bytes` incluído na API e mostrado no app.
- ✅ **Aluno com mais de um curso** (07/10): o app guarda o curso/idioma escolhido
  (`services/curso-escolhido.ts`) e usa em Curso, Materiais, Aulas e Desempenho.
- ✅ **Arquivo `alunos.zip` solto no projeto do site** — não existe mais no servidor local, resolvido.
- **Testes antigos quebrados no site** — ver item 1.2 acima (limpeza, sem pressa).
- **Endereço da API configurável** (`EXPO_PUBLIC_API_URL`) — ver item 1.2 acima.
- **Limpeza pequena no código:** indentação irregular no login. Rodar `npm run lint` de vez em quando.
- **Publicação do site só pelo FileZilla:** funciona, mas é fácil esquecer um arquivo. No futuro,
  vale um deploy automático pelo GitHub (a Locaweb aceita FTP em GitHub Actions) — só se você quiser.

## 4. Lições aprendidas (pra não repetir)

- **Link publicado do app tem endereço fixo:** `https://traduca-app.expo.app` não muda a cada
  publicação (ao contrário dos links `traduca-app--xxxxxxx.expo.app`, que são aleatórios a cada
  `eas deploy`). Usar sempre esse link fixo pra testar, e publicar com `eas deploy --prod`.
- **Cuidado com textos de exemplo em instruções** (tipo `<DEPLOY_SECRET>` numa URL): são pra
  **trocar pelo valor de verdade**, não pra copiar/colar do jeito que está escrito.
- **Sempre rodar a migration de verdade depois do FileZilla**, abrindo
  `https://traduca.adminfo.dev.br/sistema/migrate/<segredo>` com o valor real — e conferir que
  apareceu "DONE", não um erro 404.
- **Atualizar o app dos alunos são sempre 2 comandos:** `npx expo export --platform web` e depois
  `npx eas deploy --prod`. No final tem que aparecer "Production URL https://traduca-app.expo.app";
  sem o `--prod` ele só cria um link de teste.

## 5. Como cadastrar no painel para aparecer no app (lembrete)

1. **Módulos:** curso + nível iguais aos da matrícula do aluno, ordem, status ATIVO.
2. **Aulas:** escolher o **Módulo** (se ficar vazio, a aula não aparece no app), duração em minutos.
3. **Materiais:** escolher o módulo e anexar o arquivo.
4. **Presença:** presente/justificado = aula concluída.
5. Sempre no painel **do site no ar** (`traduca.adminfo.dev.br`), não no `localhost:8081`.
