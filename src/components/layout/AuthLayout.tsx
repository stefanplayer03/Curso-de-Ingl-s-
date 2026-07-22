import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ConversationWave } from "@/components/ui/ConversationWave";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Layout compartilhado por Login, Cadastro e Recuperação de senha.
 * Painel esquerdo carrega a identidade de marca (onda de conversa);
 * painel direito é sempre o formulário, mantendo consistência entre telas.
 */
export function AuthLayout({ eyebrow, title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen bg-paper dark:bg-paper-dark lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-700 p-12 lg:flex">
        <span className="font-display text-2xl font-semibold text-paper">English AI Master</span>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md"
        >
          <ConversationWave className="mb-8 w-full max-w-xs" />
          <p className="font-display text-3xl font-medium leading-snug text-paper">
            Aprenda inglês conversando de verdade — não decorando listas de palavras.
          </p>
          <p className="mt-4 font-body text-sm text-brand-100">
            Viagens, entrevistas, filmes, música. Uma IA professora que se adapta a você.
          </p>
        </motion.div>

        <span className="font-mono text-xs text-brand-100/70">A0 → C2</span>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto w-full max-w-sm"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-brand-500 dark:text-brand-300">
            {eyebrow}
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink dark:text-ink-dark">
            {title}
          </h1>
          <p className="mt-2 font-body text-sm text-ink-soft dark:text-ink-dark/70">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 font-body text-sm">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}
