# English AI Master — Fases 1 a 12 (Fundação, Conversação, Teste de Nível, Gamificação, IA real, Revisão Espaçada, Shadowing, Estatísticas, Objetivos, Lições, Modo Imersão, Relatório/Modo Professor)

Scaffold inicial do app, seguindo a arquitetura definida no prompt mestre:
React + Vite + TypeScript + Tailwind + Firebase, Clean Architecture, camadas
de abstração para IA e Voz (para nunca acoplar direto a Gemini/Vertex).

## O que já está pronto

- **Estrutura de pastas completa**: `components`, `pages`, `layouts`, `services`,
  `firebase`, `hooks`, `types`, `contexts`, `constants`, `utils`, `ai`, `speech`, `config`.
- **Firebase**: inicialização única (`firebase/app.ts`) + Auth, Firestore e Storage
  isolados em arquivos próprios. Coleções do Firestore centralizadas em `COLLECTIONS`.
- **Regras de segurança** (`firestore.rules`): cada usuário só lê/escreve os
  próprios dados; conteúdo pedagógico é somente leitura.
- **Autenticação completa**: Login, Cadastro e Recuperação de Senha, com
  validação via Zod + React Hook Form, mensagens de erro amigáveis (nunca
  ríspidas, conforme o perfil de IA do prompt mestre), e `AuthContext` +
  `useAuth` como única porta de entrada para telas.
- **Tema claro/escuro** persistido, via `ThemeContext`.
- **PWA** configurado (`vite-plugin-pwa`), manifest com nome/cores da marca.
- **Camada de abstração de IA** (`src/ai/`): interface `AiTutorProvider` +
  `MockAiTutorProvider` funcional. Trocar para Gemini/Vertex no futuro exige
  só criar um novo provider e um `case` na factory — zero mudanças no resto do app.
- **Camada de abstração de Voz** (`src/speech/`): interface `SpeechRecognizer`
  / `SpeechSynthesizer` + implementação usando as Web Speech APIs nativas
  (sem custo). Pode ser trocada por um serviço mais robusto depois.

## Fase 2 — Módulo de Conversação (novo)

- **`src/pages/Conversation.tsx`**: tela de chat com a IA professora — texto ou voz.
- **`src/hooks/useConversation.ts`**: orquestra `aiTutorProvider` (mock, por enquanto),
  `BrowserSpeechRecognizer`/`Synthesizer` e persistência no Firestore. Componentes de UI
  nunca tocam essas peças diretamente — só usam o hook.
- **`src/services/conversation.service.ts`**: salva cada sessão e mensagem em
  `conversations/{id}` no Firestore, para a IA usar como memória de longo prazo depois.
- **`src/components/conversation/`**: `ChatBubble` (mostra correções com tom encorajador,
  nunca ríspido) e `MicButton` (estado visual de escuta ativa).
- Rota nova: `/conversar`, protegida por login, acessível pelo botão no Dashboard.
- **Correção no `firestore.rules`**: a regra original não deixava *criar* documentos
  (só ler/atualizar existentes) — corrigido para validar `request.resource.data.uid`
  no `create` e `resource.data.uid` no `read/update/delete`.

## Fase 3 — Teste de Nível (novo)

- **`src/pages/PlacementTest.tsx`**: 10 perguntas de múltipla escolha, dificuldade
  crescente (`src/constants/placementQuestions.ts`), com revelação animada do nível ao final.
- **`src/hooks/usePlacementTest.ts`**: controla o fluxo e calcula o nível pela proporção de
  acertos (mapeamento simples e previsível — ver comentário no código).
- **`src/services/userProfile.service.ts`** + **`src/hooks/useUserProfile.ts`**: leitura em
  tempo real (`onSnapshot`) do perfil do usuário — já preparado para XP/streak ao vivo na
  Fase 4.
- **`src/components/layout/RequirePlacementTest.tsx`**: redireciona para o teste quem ainda
  não completou (`hasCompletedPlacementTest: false`), protegendo Dashboard e Conversação.
- O nível do teste agora alimenta de verdade a Conversação (fechei o TODO que fixava "A1").
- Novo campo `hasCompletedPlacementTest` no perfil (`users/{uid}`), `false` por padrão no cadastro.

## Fase 4 — Gamificação (novo)

- **`src/services/gamification.service.ts`**: dá XP (`awardXp`), calcula e persiste o
  streak diário (`registerDailyActivity` — compara datas de calendário, não horas) e
  desbloqueia conquistas na coleção `achievements` (id determinístico `uid_achievementId`,
  evita duplicatas).
- **`src/hooks/useGamification.ts`**: hook único que os componentes usam. Conquistas de
  limiar (XP/streak) são checadas automaticamente sempre que o perfil muda em tempo real;
  conquistas por evento (ex: primeira conversa) são desbloqueadas explicitamente via `unlock()`.
- **`src/constants/achievements.ts`**: catálogo de conquistas (fácil adicionar novas).
- **`AchievementToast`**: notificação animada, aparece no topo da tela por 4s ao desbloquear.
- **`AchievementGrid`**: grade no Dashboard mostrando desbloqueadas (coloridas) e
  bloqueadas (cinza, com cadeado).
- **`GamificationBadge`**: XP e streak sempre visíveis na topbar (`AppLayout`).
- A Conversação agora dá **+10 XP por mensagem** e desbloqueia "Primeira conversa" no
  primeiro envio.
- **Simplificação conhecida**: o streak é registrado a cada vez que o `AppLayout` monta
  (ou seja, a cada troca de página), não só uma vez por dia de fato — é seguro (idempotente),
  mas gera writes extras no Firestore. Para otimizar depois, dá pra mover esse registro para
  um contexto global que persiste entre navegações, em vez de rodar por página.

## Fase 5 — IA real com Gemini ou Groq (novo)

**Por que uma função serverless, e não a IA direto do navegador?** Chamar a API
direto do front-end exigiria colocar a chave de API no bundle do JavaScript —
qualquer pessoa poderia abrir o DevTools e roubá-la. A solução: **Netlify Functions**
(`netlify/functions/`), que rodam no servidor do Netlify sob demanda (sem servidor
pra manter) e são as únicas peças que conhecem a chave.

Dois providers reais disponíveis, escolha um via `VITE_AI_PROVIDER`:

| Provider | Função serverless | Modelo | Observação |
|---|---|---|---|
| `gemini` | `netlify/functions/chat.ts` | `gemini-2.0-flash` | Google AI Studio |
| `groq` | `netlify/functions/chat-groq.ts` | `llama-3.3-70b-versatile` | Muito rápido, tier gratuito generoso |

- **`netlify/functions/_shared/prompt.ts`**: instrução de sistema da professora de IA
  (paciente, encorajadora, corrige com gentileza) e limpeza de JSON, compartilhadas
  entre os dois providers — sem duplicar lógica.
- **`src/ai/providers/gemini.provider.ts`** e **`groq.provider.ts`**: implementam
  `AiTutorProvider` chamando `/api/chat` ou `/api/chat-groq` — nunca a API real direto.
- **`netlify.toml`**: configurado com `[functions]` e um atalho `/api/*` →
  `/.netlify/functions/:splat` (cobre ambas as funções automaticamente).
- **`useConversation`**: tem fallback amigável se a IA falhar (chave não
  configurada, erro de rede, etc.) — o chat nunca trava, só mostra uma mensagem gentil.

### Como ativar (escolha um)

**Groq** (recomendado pra começar: rápido e sem custo):
1. Pegue sua chave em **https://console.groq.com/keys**.
2. No Netlify → **Site settings → Environment variables**, adicione:
   - `GROQ_API_KEY` = sua chave
   - `VITE_AI_PROVIDER` = `groq`

**Gemini**:
1. Pegue sua chave em **https://aistudio.google.com/apikey**.
2. No Netlify → **Site settings → Environment variables**, adicione:
   - `GEMINI_API_KEY` = sua chave
   - `VITE_AI_PROVIDER` = `gemini`

Depois de qualquer um dos dois, dá um novo deploy (ou espera o próximo push disparar
um automaticamente). Pra testar localmente, seria preciso o `netlify dev` (CLI do
Netlify) rodando as functions — sem isso, `npm run dev` sozinho não acha `/api/chat*`
e o provider cai no fallback amigável de erro. Não é obrigatório: dá pra desenvolver
com `VITE_AI_PROVIDER=mock` localmente e testar a IA de verdade só depois do deploy.

## Fase 6 — Flashcards + Revisão Espaçada (novo)

O pilar pedagógico mais forte do prompt mestre: Active Recall + repetição espaçada,
totalmente automático — o aluno não precisa cadastrar vocabulário manualmente.

- **Fluxo automático**: toda vez que a IA corrige o aluno na Conversação, cada
  correção vira um cartão na coleção `reviews` (já modelada desde a Fase 1),
  via `FlashcardService.createFromCorrection` (chamado de dentro de `useConversation`).
- **`src/constants/spacedRepetition.ts`**: sistema de Leitner simplificado — 6 caixas,
  intervalos de 1/2/4/7/15/30 dias. Acertar sobe uma caixa; errar volta pra caixa 0.
- **`src/pages/Review.tsx`**: mostra os cartões vencidos um de cada vez, com efeito de
  virar a carta (frente: o que você escreveu; verso: a forma correta + explicação).
- Rota nova: `/revisao`, acessível pelo botão "Revisar cartões" no Dashboard.
- **`firestore.indexes.json`** (novo arquivo): a consulta de cartões pendentes filtra por
  `uid` e `nextReviewAt` ao mesmo tempo — isso exige um índice composto no Firestore.
  **Na primeira vez que você abrir `/revisao`**, se o índice não existir, o Firestore vai
  jogar um erro no console do navegador com um **link direto** pra criar o índice em 1
  clique (leva ~2 min pra ficar pronto). Alternativa: se você usa a Firebase CLI, o
  arquivo já está pronto pra `firebase deploy --only firestore:indexes`.

## Fase 7 — Shadowing / Pronúncia (novo)

- **`src/pages/Shadowing.tsx`**: mostra uma frase alvo do nível do aluno, ele ouve
  (`BrowserSpeechSynthesizer`, já existia desde a Fase 1), grava a si mesmo repetindo
  (`BrowserSpeechRecognizer`) e recebe uma nota de 0-100%.
- **`src/utils/textSimilarity.ts`**: calcula a nota comparando a transcrição com a frase
  alvo via distância de Levenshtein palavra-a-palavra (mais tolerante que letra-a-letra).
  Feedback sempre encorajador (`PronunciationScore`), nunca aponta "erro", só convida a tentar de novo.
- **`src/constants/shadowingPhrases.ts`**: banco de frases por nível CEFR (A0–C1).
- Dá **+5 XP por tentativa** e desbloqueia a conquista "Primeira pronúncia".
- Rota nova: `/pronuncia`, acessível pelo botão "Praticar pronúncia" no Dashboard.
- **Limitação conhecida**: a Web Speech API (reconhecimento de fala nativo do navegador)
  funciona bem no Chrome, mas tem suporte parcial/inexistente no Firefox e Safari. Para
  produção com todos os navegadores, o próximo passo seria trocar por um serviço de
  Speech-to-Text mais robusto — a abstração em `src/speech/` já foi feita pra isso: basta
  criar um novo arquivo implementando `SpeechRecognizer`/`SpeechSynthesizer`.

## Fase 8 — Estatísticas / Histórico (novo)

- **`src/services/statistics.service.ts`**: registra atividade diária (`logActivity`) num
  doc por usuário por dia (`uid_YYYY-MM-DD`, coleção `statistics`, já modelada desde a
  Fase 1) e busca os últimos N dias preenchendo dias sem atividade com zero.
- **Registro automático**, sem o aluno fazer nada: XP registrado dentro do próprio
  `useGamification.awardXp`; mensagens de conversa em `Conversation.tsx`; tentativas de
  shadowing em `Shadowing.tsx`; revisões concluídas em `useFlashcards.reviewCard`.
- **`src/pages/Statistics.tsx`**: cartões de totais (sequência, XP total, conversas e
  pronúncias nos últimos 7 dias) + gráfico de linha do XP diário (`recharts`, nova
  dependência — biblioteca open-source, sem custo).
- Rota nova: `/estatisticas`, acessível pelo botão "Ver progresso" no Dashboard.
- **Mais um índice composto no Firestore** (`firestore.indexes.json` atualizado): a
  consulta filtra `uid` + intervalo de `date` ao mesmo tempo. Mesma dica da Fase 6: se
  o índice não existir, o Firestore mostra um link direto pra criar em 1 clique.

## Fase 9 — Configurações + Objetivos do aluno (novo)

- **`src/constants/goals.ts`**: catálogo de 8 objetivos (viajar, entrevistas, filmes,
  músicas, morar fora, trabalho remoto, provas, amigos), cada um com um **tema de
  conversação associado**.
- **`src/pages/Settings.tsx`** + **`GoalSelector`**: o aluno escolhe quantos objetivos
  quiser, em chips com ícone; salva no perfil (`UserProfileService.updateGoals`).
- **Fecha o ciclo de personalização**: a Conversação agora escolhe o tema com base no
  primeiro objetivo do aluno (ex: escolheu "Viajar" → a professora puxa assunto sobre
  viagens). Sem objetivo definido, usa um tema neutro ("Daily routine").
- Rota nova: `/configuracoes`, acessível pelo ícone de engrenagem na topbar
  (`AppLayout`) — de propósito **não exige** teste de nível concluído, pra o aluno poder
  ajustar objetivos a qualquer momento.

## Fase 10 — Lições estruturadas (Gramática + Vocabulário em contexto) (novo)

Até aqui só tínhamos conversa livre. Esta fase adiciona **lições fixas**, sempre
ensinando através de frases em contexto — nunca listas de palavras soltas, seguindo o
pilar do prompt mestre.

- **`src/constants/curriculum.ts`**: 3 unidades (Vida diária/A1, Viagens/A2, Entrevistas
  de emprego/B1), cada uma com lições. Cada lição tem uma frase de ensino + explicação
  breve + 3 exercícios de múltipla escolha (reaproveita o `QuestionCard` já criado na
  Fase 3, sem duplicar componente).
- **`src/hooks/useLesson.ts`**: controla o fluxo ensino → exercícios → conclusão de uma
  lição, calcula o % de acerto.
- **`src/services/curriculum.service.ts`**: registra lições concluídas na coleção
  `progress` (já modelada desde a Fase 1), um doc por `uid_lessonId`.
- **`src/pages/Lessons.tsx`**: lista as unidades e lições, com checkmark nas concluídas.
- **`src/pages/Lesson.tsx`**: tela de uma lição — dá **+20 XP** e desbloqueia a conquista
  "Primeira lição" ao concluir; registra também nas Estatísticas (novo campo `lessons`
  no `DailyStat`, mostrado como 5º cartão em `/estatisticas`).
- Rotas novas: `/licoes` (lista) e `/licoes/:lessonId` (uma lição), acessíveis pelo botão
  "Ver lições" no Dashboard.
- **Fácil de expandir**: pra adicionar novas lições/unidades, só editar
  `src/constants/curriculum.ts` — nenhum outro arquivo precisa mudar.

## Fase 11 — Modo Imersão (novo)

Um dos módulos citados no prompt mestre. Quando ativado, a professora de IA **nunca**
responde em português nem traduz — só inglês, o tempo todo, mesmo se o aluno escrever
em português.

- **`src/components/ui/ToggleSwitch.tsx`**: switch reutilizável (novo componente de UI base).
- **Configurações** (`/configuracoes`): novo toggle "Conversar só em inglês", salvo no
  perfil (`immersionMode: boolean`, `UserProfileService.updateImmersionMode`).
- **`AiTutorProvider.converse`** agora aceita um terceiro parâmetro opcional
  (`{ immersionMode }`) — implementado em todos os providers (mock, Gemini, Groq) sem
  quebrar compatibilidade (parâmetro opcional).
- **`netlify/functions/_shared/prompt.ts`**: a instrução de sistema ganha regras extras
  quando `immersionMode` está ativo, instruindo o modelo a nunca traduzir ou responder em
  português.
- A tela de Conversação mostra um indicador "🌊 Imersão" quando ativo, e a mensagem de
  boas-vindas muda para inglês.

## Fase 12 — Relatório / Modo Professor (novo)

Junta dois itens que ainda faltavam do prompt mestre ("Relatórios" e "Modo Professor")
numa única tela: um resumo completo e **imprimível** do progresso do aluno, pra mostrar a
um professor de verdade ou compartilhar com quem acompanha os estudos.

- **`src/pages/TeacherReport.tsx`**: nível + objetivos, XP total, sequência, lições
  concluídas, gráfico de XP dos últimos 30 dias (reaproveita `XpTrendChart`), progresso
  por unidade do currículo e a grade de conquistas — tudo numa tela só.
- **Botão "Imprimir / salvar PDF"** usa `window.print()` — no diálogo de impressão do
  navegador, escolher "Salvar como PDF" gera um arquivo pra enviar por e-mail/WhatsApp.
- **Estilos de impressão** (`src/styles/index.css` + `no-print` no `AppLayout`): ao
  imprimir, a topbar (tema, logout, XP badge) some, sobrando só o conteúdo do relatório.
- **`XpTrendChart`** ganhou suporte a períodos maiores (30 dias): rótulos viram
  dia/mês em vez de dia da semana, e o eixo X fica menos poluído.
- Rota nova: `/relatorio`, acessível pelo botão "Relatório completo" no Dashboard.

## Deploy no Netlify

1. Suba este repositório no GitHub.
2. No Netlify: **Add new site → Import an existing project** e conecte o repositório.
3. Build command: `npm run build` · Publish directory: `dist` (já configurado em `netlify.toml`).
4. Em **Site settings → Environment variables**, adicione as mesmas variáveis do `.env.example`
   (as chaves do seu projeto Firebase). Sem isso o app builda, mas o Firebase não conecta.
5. Deploy contínuo: todo push na branch principal gera um novo deploy automaticamente.

## Identidade visual

Paleta *"conversa ao entardecer"*: fundo esverdeado claro (`paper`), tinta
quase-preta (`ink`), teal profundo como cor de marca (`brand`), âmbar como
acento de energia/voz (`amber`). Tipografia: Fraunces (display) + Inter
(corpo) + JetBrains Mono (dados). Elemento-assinatura: a `ConversationWave`,
uma onda sonora estilizada representando o diálogo aluno↔IA — aparece nas
telas de auth e no estado de loading.

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha com as chaves do seu projeto Firebase
npm run dev
```

Sem preencher o `.env.local`, o app builda e roda, mas o Firebase vai avisar
no console que faltam credenciais (não vai quebrar o build).

## Próximos passos sugeridos (não incluídos nesta entrega)

1. **Núcleo pedagógico**: tela de Conversação com IA (usa `aiTutorProvider` já
   pronto), Shadowing, Pronúncia (usa `BrowserSpeechRecognizer`/`Synthesizer`).
2. **Teste de nível** (define o `CefrLevel` inicial do usuário no cadastro).
3. **Dashboard real**: XP, streak, próxima lição sugerida.
4. **Gamificação**: conquistas, missões, badges — coleções já modeladas no Firestore.
5. Trocar `MockAiTutorProvider` por uma implementação real (Gemini/Vertex) —
   basta implementar `AiTutorProvider` em `src/ai/providers/`.

Recomendo continuar o desenvolvimento no **Claude Code**, direto no repositório
git — ele mantém o histórico e a consistência arquitetural entre as sessões,
o que é importante dado o tamanho do projeto.
