import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').max(100, 'O nome é demasiado longo'),
  email: z.string().email('Email inválido').max(255),
  phone: z.string().min(9, 'Telefone inválido').max(20, 'Telefone inválido'),
  password: z.string().min(8, 'A palavra-passe deve ter pelo menos 8 caracteres').max(100),
  role: z.enum(['BUYER', 'TENANT', 'OWNER', 'AGENT']).default('BUYER')
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'A palavra-passe é obrigatória')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token inválido'),
  password: z.string().min(8, 'A palavra-passe deve ter pelo menos 8 caracteres').max(100)
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').max(100).optional(),
  phone: z.string().min(9, 'Telefone inválido').max(20).optional(),
  avatarUrl: z.string().url('URL inválido').nullable().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'A palavra-passe atual é obrigatória'),
  newPassword: z.string().min(8, 'A nova palavra-passe deve ter pelo menos 8 caracteres').max(100)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
