import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/utils/validators";
import { ROUTES } from "@/constants/routes";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isSubmitting, formError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
      navigate(ROUTES.dashboard);
    } catch {
      // erro já tratado e exposto via formError pelo useAuth
    }
  }

  return (
    <AuthLayout
      eyebrow="Bem-vindo de volta"
      title="Vamos continuar sua conversa"
      subtitle="Entre para retomar de onde você parou."
      footer={
        <p className="text-ink-soft dark:text-ink-dark/70">
          Ainda não tem conta?{" "}
          <Link to={ROUTES.register} className="font-semibold text-brand-500 hover:underline">
            Criar conta
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex justify-end">
          <Link
            to={ROUTES.forgotPassword}
            className="font-body text-sm text-brand-500 hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        {formError && <p className="font-body text-sm text-danger">{formError}</p>}

        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}
