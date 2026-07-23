import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/utils/validators";
import { ROUTES } from "@/constants/routes";

export function ForgotPasswordPage() {
  const { sendPasswordReset, isSubmitting, formError } = useAuth();
  const [wasSent, setWasSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await sendPasswordReset(values.email);
      setWasSent(true);
    } catch {
      // erro já tratado e exposto via formError pelo useAuth
    }
  }

  return (
    <AuthLayout
      eyebrow="Sem problemas"
      title="Recuperar senha"
      subtitle="Te enviamos um link para você criar uma senha nova."
      footer={
        <Link to={ROUTES.login} className="font-semibold text-brand-500 hover:underline">
          Voltar para o login
        </Link>
      }
    >
      {wasSent ? (
        <p className="font-body text-sm text-ink-soft dark:text-ink-dark/70">
          Prontinho! Confira sua caixa de entrada para redefinir sua senha.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          {formError && <p className="font-body text-sm text-danger">{formError}</p>}

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Enviar link de recuperação
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
