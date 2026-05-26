import { prisma } from '../prisma';

function httpError(statusCode: number, message: string): Error {
  return Object.assign(new Error(message), { statusCode });
}

export async function createGenero(nome: string) {
  const existing = await prisma.genero.findUnique({ where: { nome } });
  if (existing) throw httpError(409, 'Já existe um gênero com esse nome');
  return prisma.genero.create({ data: { nome } });
}

export async function findAllGeneros() {
  return prisma.genero.findMany({ orderBy: { nome: 'asc' } });
}

export async function findGeneroById(id: number) {
  const genero = await prisma.genero.findUnique({ where: { id } });
  if (!genero) throw httpError(404, 'Gênero não encontrado');
  return genero;
}

export async function updateGenero(id: number, nome: string) {
  await findGeneroById(id);
  const conflict = await prisma.genero.findFirst({ where: { nome, NOT: { id } } });
  if (conflict) throw httpError(409, 'Já existe um gênero com esse nome');
  return prisma.genero.update({ where: { id }, data: { nome } });
}

export async function deleteGenero(id: number) {
  await findGeneroById(id);
  const count = await prisma.jogo.count({ where: { idGenero: id } });
  if (count > 0) throw httpError(409, 'Gênero possui jogos associados e não pode ser removido');
  return prisma.genero.delete({ where: { id } });
}
