import { z } from 'zod';

export const updateUserSchema = z.object({
  id: z.string({
    required_error: 'Id es requerido',
  }),
  username: z.string({
    required_error: 'Usuario es requerido',
  }),
  email: z
    .string({
      required_error: 'Email es requerido',
    })
    .email({ message: 'Email inválido' }),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(6, { message: 'La contraseña debería ser de al menos 6 caracteres' }),
});
