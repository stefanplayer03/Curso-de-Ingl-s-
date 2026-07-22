import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Digite seu e-mail").email("Digite um e-mail válido"),
  password: z.string().min(1, "Digite sua senha"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Digite seu nome completo"),
    email: z.string().min(1, "Digite seu e-mail").email("Digite um e-mail válido"),
    password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Digite seu e-mail").email("Digite um e-mail válido"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
