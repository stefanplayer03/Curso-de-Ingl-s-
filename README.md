# English AI Master — Fase 1 (Fundação) + Fase 2 (Conversação) + Fase 3 (Teste de Nível)

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

## Deploy no Netlify

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
