# Resumo para integrar o traduca-APP com a API (atualizado em 29/09/2026)

Este arquivo foi gerado ao final do trabalho no backend (projeto `traducaidiomas`, Laravel)
para continuar no app sem perder o contexto. Próxima tarefa: **fazer o app usar a API**.

## Situação do backend

- Código: `\\wsl.localhost\Ubuntu\home\pc\dev\senac\traducaidiomas` (WSL), GitHub público
  `Andre-marcelino-dev/traducaidiomas`. Site no ar: **https://traduca.adminfo.dev.br**
  (Locaweb, pasta `/public_html/traduca`, publicado **só pelo FileZilla**; o dono do projeto não usa terminal no servidor).
- Fases já feitas, no ar e na `main` do GitHub (PRs #2, #3 e #4): 1 segurança, 2 correções, 3 API do app, 4 desempenho.
- **Pendência do backend** (lembrar o usuário):
  1. Confirmar que a migration da Fase 3 (`add_ordem_duracao_to_tbl_aulas_table`) rodou no servidor
     (abrir `https://traduca.adminfo.dev.br/sistema/migrate/<DEPLOY_SECRET>` → "DONE" ou "Nothing to migrate").
     O `DEPLOY_SECRET` está no `.env` do servidor e em `C:\Users\Pc\Desktop\traduca_deploy\.env` — nunca exibir o valor.

## Telas do app (protótipo do usuário)

1. **Home** (após login): "Bem-vindo Aluno!" + botões Aulas, Agenda, Atividades, Curso, Materiais, Config.
2. **Curso**: abas "Curso | Materiais"; carga horária + "40 aulas • 5 módulos" + barra de %; lista de módulos com
   "8 aulas • 2h30" e status **Concluído** / **Em andamento ("Você está aqui")** / **Bloqueado ("Conclua o módulo anterior para avançar")**.
3. **Módulo**: "INGLÊS | MÓDULO 01", nome, descrição, "6 aulas • 2h30 • Intermediário", "Progresso do módulo 100% — 6 de 6 aulas concluídas",
   lista "AULA 01 / Alfabeto e Pronúncia / 22 min • Aula ao vivo / Concluída", rodapé "Todas as aulas concluídas, siga para o próximo módulo".

## API — como usar

- Base: `https://traduca.adminfo.dev.br/api/v1`
- Sempre enviar `Accept: application/json`. Erros vêm em JSON: 401 (sem token), 403 (sem permissão / módulo bloqueado),
  404, 422 (validação), 429 (muitas tentativas: login 5/min, API 60/min).
- Autenticação: token Sanctum no header `Authorization: Bearer <token>`. Token vale 30 dias.
- Documentação navegável: https://traduca.adminfo.dev.br/api/documentacao

### Login do aluno
`POST /aluno/login` — corpo `{ "email_aluno": "...", "senha_aluno": "..." }`
```json
{ "success": true, "data": { "token": "1|abc...", "aluno": { "id_aluno": 1, "nome_aluno": "...", "email_aluno": "...", "foto_aluno": "arquivo.png" } } }
```
Erro: 401 `{ "success": false, "message": "Email ou senha inválidos." }`.
Foto: `https://traduca.adminfo.dev.br/traducaidiomas/alunos/<foto_aluno>` (pode vir vazia).

- `POST /aluno/logout` — apaga o token atual.
- `GET /aluno/me` — `{ id_aluno, nome_aluno, email_aluno, foto_aluno }`.

### Cursos do aluno
`GET /aluno/cursos` → `data: [{ id_curso, nome_curso, id_nivel, nome_nivel }]` (matrículas ATIVAS).

### Tela Curso
`GET /aluno/cursos/{idCurso}/modulos`
```json
{ "success": true, "data": {
  "curso": "Inglês", "nivel": "Intermediário",
  "carga_horaria_minutos": 600, "total_modulos": 5, "total_aulas": 40, "aulas_concluidas": 12, "percentual_geral": 62,
  "modulos": [{
    "id_modulo": 3, "ordem_modulo": 1, "nome_modulo": "Fundamentos", "descricao_modulo": "...",
    "carga_horaria_minutos": 150, "total_aulas": 8, "aulas_concluidas": 8,
    "total_materiais": 2, "materiais_concluidos": 2, "percentual": 100,
    "concluido": true, "liberado": true, "em_andamento": false
  }]
} }
```
Status na tela: `concluido` → "Concluído"; `em_andamento` → "Em andamento / Você está aqui"; `!liberado` → bloqueado.
404 se o aluno não tem matrícula ativa nesse curso.

### Tela Módulo
`GET /aluno/modulos/{idModulo}` — 403 `{ "message": "Conclua o módulo anterior para liberar este." }` se bloqueado.
```json
{ "success": true, "data": {
  "curso": "Inglês", "nivel": "Intermediário",
  "modulo": { "id_modulo": 3, "ordem_modulo": 1, "nome_modulo": "Fundamentos", "descricao_modulo": "...", "carga_horaria_minutos": 150 },
  "progresso": { "total_aulas": 6, "aulas_concluidas": 6, "total_materiais": 1, "materiais_concluidos": 1, "percentual": 100, "concluido": true },
  "proximo_modulo": { "id_modulo": 4, "nome_modulo": "Vocabulário", "liberado": true },
  "aulas": [{
    "id_aula": 10, "numero": 1, "titulo": "Alfabeto e Pronúncia", "descricao": "...",
    "data": "2026-09-01", "hora": "19:00", "duracao_minutos": 22,
    "ao_vivo": true, "link_aula": "https://teams...", "professor": "Renato Caetano",
    "presenca": "presente", "concluida": true
  }]
} }
```
- `numero` = nº cadastrado no painel ou a posição na lista. `duracao_minutos` pode ser `null` (não mostrar).
- `presenca`: `"presente" | "falta" | "justificado" | null`. `proximo_modulo` é `null` no último módulo.

### Aba Materiais
`GET /aluno/cursos/{idCurso}/materiais` (filtro opcional `?modulo=ID`)
```json
{ "success": true, "data": [{
  "id_material": 7, "titulo": "Apostila", "descricao": "...", "id_modulo": 3, "nome_modulo": "Fundamentos", "ordem_modulo": 1,
  "tem_arquivo": true, "extensao": "pdf", "concluido": false,
  "url_download": "https://traduca.adminfo.dev.br/api/v1/aluno/materiais/7/download"
}] }
```
`GET /aluno/materiais/{id}/download` — precisa do header com o token (não abre como link público);
baixa o arquivo e marca o material como concluído. No app: baixar com o token (ex.: expo-file-system) e abrir.

## Regras de progresso (iguais no site e no app)

- Aula **concluída** = professor marcou presença **presente** ou **justificado** (tela Presença do painel).
- Material **concluído** = aluno abriu/baixou o arquivo.
- Módulo concluído = todas as aulas ativas + materiais concluídos → libera o próximo módulo.

## Ainda não existe na API (fazer quando chegar nas telas)

Agenda, Atividades (listar/responder), Config/perfil (trocar foto/senha), notificações.
Esses recursos já existem no site (painel do aluno), então dá para criar as rotas copiando a regra dos controllers
`app/Http/Controllers/aluno/*` do backend.

## Como o usuário prefere trabalhar

- Explicar em português simples, passo a passo; ele não é muito técnico.
- Analisar antes e perguntar antes de mexer no código; trabalhar local, testar, e só depois publicar.
- Decidir o padrão mais seguro sozinho em vez de mostrar menus de opções.
- Para publicar o backend: montar uma pasta pronta na Área de Trabalho com a mesma estrutura de `/public_html/traduca`
  + LEIA-ME passo a passo para o FileZilla.
