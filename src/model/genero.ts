import { z } from 'zod';

export const createGeneroSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
});

export const updateGeneroSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
});

export type CreateGeneroInput = z.infer<typeof createGeneroSchema>;
export type UpdateGeneroInput = z.infer<typeof updateGeneroSchema>;
