export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  status: "idle" | "loading" | "authenticated" | "unauthenticated" | "error";
  error?: string;
}
