import { prisma } from '../prisma';

function httpError(statusCode: number, message: string): Error {
  return Object.assign(new Error(message), { statusCode });
}

const include = { genero: true, plataformas: true } as const;

export async function createJogo(titulo: string, idGenero: number) {
  const genero = await prisma.genero.findUnique({ where: { id: idGenero } });
  if (!genero) throw httpError(404, 'Gênero não encontrado');
  return prisma.jogo.create({ data: { titulo, idGenero }, include });
}

export async function findAllJogos() {
  return prisma.jogo.findMany({ include, orderBy: { titulo: 'asc' } });
}

export async function findJogoById(id: number) {
  const jogo = await prisma.jogo.findUnique({ where: { id }, include });
  if (!jogo) throw httpError(404, 'Jogo não encontrado');
  return jogo;
}

export async function updateJogo(id: number, data: { titulo?: string; idGenero?: number }) {
  await findJogoById(id);
  if (data.idGenero !== undefined) {
    const genero = await prisma.genero.findUnique({ where: { id: data.idGenero } });
    if (!genero) throw httpError(404, 'Gênero não encontrado');
  }
  return prisma.jogo.update({ where: { id }, data, include });
}

export async function deleteJogo(id: number) {
  await findJogoById(id);
  return prisma.jogo.delete({ where: { id } });
}

export async function addPlataforma(id: number, plataformaId: number) {
  await findJogoById(id);
  const plataforma = await prisma.plataforma.findUnique({ where: { id: plataformaId } });
  if (!plataforma) throw httpError(404, 'Plataforma não encontrada');
  return prisma.jogo.update({
    where: { id },
    data: { plataformas: { connect: { id: plataformaId } } },
    include,
  });
}

export async function removePlataforma(id: number, plataformaId: number) {
  await findJogoById(id);
  const plataforma = await prisma.plataforma.findUnique({ where: { id: plataformaId } });
  if (!plataforma) throw httpError(404, 'Plataforma não encontrada');
  return prisma.jogo.update({
    where: { id },
    data: { plataformas: { disconnect: { id: plataformaId } } },
    include,
  });
}
