import { Router } from 'express';
import * as db from '../database/genero';
import { createGeneroSchema, updateGeneroSchema } from '../model/genero';

export const generosRouter = Router();

function parseId(p: string) {
  const n = Number(p);
  return Number.isInteger(n) && n > 0 ? n : null;
}

generosRouter.get('/', async (_req, res, next) => {
  try {
    res.json(await db.findAllGeneros());
  } catch (e) {
    next(e);
  }
});

generosRouter.post('/', async (req, res, next) => {
  try {
    const { nome } = createGeneroSchema.parse(req.body);
    res.status(201).json(await db.createGenero(nome));
  } catch (e) {
    next(e);
  }
});

generosRouter.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'ID inválido' }); return; }
    res.json(await db.findGeneroById(id));
  } catch (e) {
    next(e);
  }
});

generosRouter.put('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'ID inválido' }); return; }
    const { nome } = updateGeneroSchema.parse(req.body);
    res.json(await db.updateGenero(id, nome));
  } catch (e) {
    next(e);
  }
});

generosRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'ID inválido' }); return; }
    await db.deleteGenero(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
