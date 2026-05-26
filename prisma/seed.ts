import { prisma } from '../src/prisma';

async function main() {
  // Limpa dados existentes (ordem respeitando FK)
  await prisma.jogo.deleteMany();
  await prisma.genero.deleteMany();
  await prisma.plataforma.deleteMany();

  const [acao, rpg, aventura] = await Promise.all([
    prisma.genero.create({ data: { nome: 'Ação' } }),
    prisma.genero.create({ data: { nome: 'RPG' } }),
    prisma.genero.create({ data: { nome: 'Aventura' } }),
  ]);

  const [ps5, xbox, pc, switch_] = await Promise.all([
    prisma.plataforma.create({ data: { nome: 'PlayStation 5' } }),
    prisma.plataforma.create({ data: { nome: 'Xbox Series X' } }),
    prisma.plataforma.create({ data: { nome: 'PC' } }),
    prisma.plataforma.create({ data: { nome: 'Nintendo Switch' } }),
  ]);

  await Promise.all([
    prisma.jogo.create({
      data: {
        titulo: 'God of War Ragnarök',
        idGenero: acao.id,
        plataformas: { connect: [{ id: ps5.id }] },
      },
    }),
    prisma.jogo.create({
      data: {
        titulo: 'Elden Ring',
        idGenero: rpg.id,
        plataformas: { connect: [{ id: ps5.id }, { id: xbox.id }, { id: pc.id }] },
      },
    }),
    prisma.jogo.create({
      data: {
        titulo: 'The Legend of Zelda: Tears of the Kingdom',
        idGenero: aventura.id,
        plataformas: { connect: [{ id: switch_.id }] },
      },
    }),
  ]);

  console.log('Seed concluído com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
