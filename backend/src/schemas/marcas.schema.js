import { z } from 'zod';

export const createMarcaSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre de la marca es requerido' })
    .min(1, { message: 'Ingrese al menos 1 caracter' }),
});
