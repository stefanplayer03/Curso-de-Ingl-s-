import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormValues } from "@/utils/validators";
import { ROUTES } from "@/constants/routes";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isSubmitting, formError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser(values);
      navigate(ROUTES.dashboard);
    } catch {
      // erro já tratado e exposto via formError pelo useAuth
    }
  }

  return (
    <AuthLayout
      eyebrow="Primeira conversa"
      title="Crie sua conta"
      subtitle="Leva menos de um minuto. Depois é só começar a falar."
      footer={
        <p className="text-ink-soft dark:text-ink-dark/70">
          Já tem conta?{" "}
          <Link to={ROUTES.login} className="font-semibold text-brand-500 hover:underline">
            Entrar
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input label="Nome" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {formError && <p className="font-body text-sm text-danger">{formError}</p>}

        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Criar conta
        </Button>
      </form>
    </AuthLayout>
  );
}
