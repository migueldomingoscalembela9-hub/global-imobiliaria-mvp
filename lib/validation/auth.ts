import { z } from 'zod';

const phoneRegex = /^(\+?244\s?)?(9\d{8}|2\d{8})$|^(\+[1-9]\d{7,14})$/;

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres').max(100, 'O nome é demasiado longo'),
  email: z.string().trim().email('Introduza um endereço de email válido').max(255),
  phone: z
    .string()
    .trim()
    .min(9, 'O telefone deve ter pelo menos 9 dígitos')
    .max(20, 'Número de telefone demasiado longo')
    .refine((val) => {
      const clean = val.replace(/[\s\-().]/g, '');
      return phoneRegex.test(clean) || /^\+?\d{9,15}$/.test(clean);
    }, 'Número de telefone inválido. Insira um número angolano válido (ex: 923 456 789 ou +244 923 456 789) ou formato internacional.'),
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
