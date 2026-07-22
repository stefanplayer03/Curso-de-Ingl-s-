# English AI Master — Fases 1 a 6 (Fundação, Conversação, Teste de Nível, Gamificação, IA real, Revisão Espaçada)

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
