import { z } from 'zod';

export const createPlataformaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
});

export const updatePlataformaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
});

export type CreatePlataformaInput = z.infer<typeof createPlataformaSchema>;
export type UpdatePlataformaInput = z.infer<typeof updatePlataformaSchema>;
