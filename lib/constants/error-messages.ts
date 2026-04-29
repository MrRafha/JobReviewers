/**
 * Centralized error messages in Portuguese (pt-BR)
 * Used across the application for consistency and maintainability
 */

// Database Unavailability
export const DB_UNAVAILABLE = {
  TITLE: "Serviço temporariamente indisponível",
  MESSAGE:
    "Não foi possível carregar os dados neste momento. Tente novamente em alguns instantes.",
  RETRY_BUTTON: "Tentar novamente",
} as const;

// General errors
export const ERROR_MESSAGES = {
  GENERIC: "Ocorreu um erro. Tente novamente mais tarde.",
  CONNECTION: "Erro de conexão. Tente novamente.",
  VALIDATION: "Verifique os dados e tente novamente.",
} as const;

// Auth errors
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Email ou senha inválidos",
  PASSWORD_MISMATCH: "As senhas não coincidem",
  PASSWORD_TOO_SHORT: "A senha deve ter pelo menos 8 caracteres",
  EMAIL_REQUIRED: "Email é obrigatório",
  PASSWORD_REQUIRED: "Senha é obrigatória",
  BIRTHDATE_REQUIRED: "Data de nascimento é obrigatória",
  BIRTHDATE_INVALID: "Por favor, insira uma data de nascimento válida.",
  AGE_REQUIREMENT: "Você precisa ter pelo menos 18 anos para se cadastrar.",
  ACCOUNT_EXISTS: "Esta conta já existe",
  ACCOUNT_CREATION_FAILED: "Erro ao criar conta",
  EMAIL_SENT: "Verifique seu email para instruções de recuperação de senha.",
  EMAIL_SENT_DETAIL: "Um link de recuperação foi enviado. Válido por 1 hora.",
  TOKEN_INVALID: "Link de recuperação inválido ou expirado.",
  PASSWORD_RESET_SUCCESS:
    "Senha redefinida com sucesso! Faça login com sua nova senha.",
  PASSWORD_RESET_FAILED: "Erro ao redefinir senha. Tente novamente.",
} as const;

export const RATE_LIMIT_ERRORS = {
  REVIEW_LIMIT_EXCEEDED: "Limite de requisições excedido",
  REVIEW_LIMIT_DETAIL: "Você pode enviar 1 review por hora",
  SPAM_DETECTED: "Sua review contém padrões suspeitos de spam",
  FLOOD_DETECTED: "Múltiplas tentativas detectadas em curto período",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: "Conta criada com sucesso!",
  LOGGED_IN: "Login realizado com sucesso!",
  PASSWORD_RESET: "Senha redefinida com sucesso!",
} as const;
