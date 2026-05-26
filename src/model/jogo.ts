import { z } from 'zod';

export const createJogoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  idGenero: z.number().int().positive('idGenero deve ser um inteiro positivo'),
});

export const updateJogoSchema = z
  .object({
    titulo: z.string().min(1, 'Título é obrigatório'),
    idGenero: z.number().int().positive('idGenero deve ser um inteiro positivo'),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar',
  });

export const addPlataformaSchema = z.object({
  plataformaId: z.number().int().positive('plataformaId deve ser um inteiro positivo'),
});

export type CreateJogoInput = z.infer<typeof createJogoSchema>;
export type UpdateJogoInput = z.infer<typeof updateJogoSchema>;
export type AddPlataformaInput = z.infer<typeof addPlataformaSchema>;
