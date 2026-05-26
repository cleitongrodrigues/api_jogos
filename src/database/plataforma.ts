import { prisma } from '../prisma';

function httpError(statusCode: number, message: string): Error {
  return Object.assign(new Error(message), { statusCode });
}

export async function createPlataforma(nome: string) {
  const existing = await prisma.plataforma.findUnique({ where: { nome } });
  if (existing) throw httpError(409, 'Já existe uma plataforma com esse nome');
  return prisma.plataforma.create({ data: { nome } });
}

export async function findAllPlataformas() {
  return prisma.plataforma.findMany({ orderBy: { nome: 'asc' } });
}

export async function findPlataformaById(id: number) {
  const plataforma = await prisma.plataforma.findUnique({ where: { id } });
  if (!plataforma) throw httpError(404, 'Plataforma não encontrada');
  return plataforma;
}

export async function updatePlataforma(id: number, nome: string) {
  await findPlataformaById(id);
  const conflict = await prisma.plataforma.findFirst({ where: { nome, NOT: { id } } });
  if (conflict) throw httpError(409, 'Já existe uma plataforma com esse nome');
  return prisma.plataforma.update({ where: { id }, data: { nome } });
}

export async function deletePlataforma(id: number) {
  const plataforma = await prisma.plataforma.findUnique({
    where: { id },
    select: { jogos: { select: { id: true }, take: 1 } },
  });
  if (!plataforma) throw httpError(404, 'Plataforma não encontrada');
  if (plataforma.jogos.length > 0)
    throw httpError(409, 'Plataforma possui jogos associados e não pode ser removida');
  return prisma.plataforma.delete({ where: { id } });
}
