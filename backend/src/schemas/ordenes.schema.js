import { z } from 'zod';

export const getDniDataSchema = z.object({
  dni: z
    .string({ required_error: 'El DNI es requerida' })
    .length(8, { message: 'El DNI debe ser de 8 dígitos' }),
});

export const getRucDataSchema = z.object({
  ruc: z
    .string({ required_error: 'El RUC es requerido' })
    .length(11, { message: 'El RUC debe ser de 11 dígitos' }),
});

export const createOrdenSchema = z.object({
  equipo: {
    marca: z.string({
      required_error: 'marca requerida',
    }),
    categoria: z.string({
      required_error: 'categoria requerida',
    }),
    serie: z.string({
      required_error: 'serie requerida',
    }),
    accesorios: z
      .string({
        required_error: 'accesorios debe ser un string',
      })
      .optional(),
    observaciones: z
      .string({
        required_error: 'accesorios debe ser un string',
      })
      .optional(),
  },
  cliente: {
    tipo: z.string({
      required_error: 'tipo de cliente requerido',
    }),
    ruc: z
      .string({
        required_error: 'ruc debe ser un string',
      })
      .optional(),
    razonSocial: z
      .string({
        required_error: 'razón social requerida',
      })
      .optional(),
    personaResponsable: z
      .string({
        required_error: 'persona responsable requerida',
      })
      .optional(),
    celular: z
      .string({
        required_error: 'celular debe ser un string',
      })
      .optional(),
    email: z
      .string({
        required_error: 'email debe ser un string',
      })
      .optional(),
    dni: z
      .string({
        required_error: 'dni debe ser un string',
      })
      .optional(),
  },
  prioridad: z.string({
    required_error: 'prioridad requerida',
  }),
  area: z.string({
    required_error: 'area es requerido',
  }),
  tipoServicio: z.string({
    required_error: 'tipo de servicio es requerido',
  }),
  trabajo: z.string({
    required_error: 'trabajo es requerido',
  }),
  // fecha: z.string({
  //   required_error: 'fecha es requerido',
  // }),
  monto: z.string({
    required_error: 'monto es requerido',
  })
});
