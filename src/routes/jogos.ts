import { Router } from 'express';
import * as db from '../database/jogo';
import { createJogoSchema, updateJogoSchema, addPlataformaSchema } from '../model/jogo';

export const jogosRouter = Router();

function parseId(p: string) {
  const n = Number(p);
  return Number.isInteger(n) && n > 0 ? n : null;
}

jogosRouter.get('/', async (_req, res, next) => {
  try {
    res.json(await db.findAllJogos());
  } catch (e) {
    next(e);
  }
});

jogosRouter.post('/', async (req, res, next) => {
  try {
    const { titulo, idGenero } = createJogoSchema.parse(req.body);
    res.status(201).json(await db.createJogo(titulo, idGenero));
  } catch (e) {
    next(e);
  }
});

jogosRouter.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'ID inválido' }); return; }
    res.json(await db.findJogoById(id));
  } catch (e) {
    next(e);
  }
});

jogosRouter.put('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'ID inválido' }); return; }
    const data = updateJogoSchema.parse(req.body);
    res.json(await db.updateJogo(id, data));
  } catch (e) {
    next(e);
  }
});

jogosRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'ID inválido' }); return; }
    await db.deleteJogo(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

jogosRouter.post('/:id/plataformas', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'ID inválido' }); return; }
    const { plataformaId } = addPlataformaSchema.parse(req.body);
    res.json(await db.addPlataforma(id, plataformaId));
  } catch (e) {
    next(e);
  }
});

jogosRouter.delete('/:id/plataformas/:plataformaId', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const plataformaId = parseId(req.params.plataformaId);
    if (!id || !plataformaId) { res.status(400).json({ error: 'ID inválido' }); return; }
    res.json(await db.removePlataforma(id, plataformaId));
  } catch (e) {
    next(e);
  }
});
