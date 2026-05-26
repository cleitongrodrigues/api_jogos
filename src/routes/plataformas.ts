import { Router } from 'express';
import * as db from '../database/plataforma';
import { createPlataformaSchema, updatePlataformaSchema } from '../model/plataforma';

export const plataformasRouter = Router();

function parseId(p: string) {
  const n = Number(p);
  return Number.isInteger(n) && n > 0 ? n : null;
}

plataformasRouter.get('/', async (_req, res, next) => {
  try {
    res.json(await db.findAllPlataformas());
  } catch (e) {
    next(e);
  }
});

plataformasRouter.post('/', async (req, res, next) => {
  try {
    const { nome } = createPlataformaSchema.parse(req.body);
    res.status(201).json(await db.createPlataforma(nome));
  } catch (e) {
    next(e);
  }
});

plataformasRouter.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'ID inválido' }); return; }
    res.json(await db.findPlataformaById(id));
  } catch (e) {
    next(e);
  }
});

plataformasRouter.put('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'ID inválido' }); return; }
    const { nome } = updatePlataformaSchema.parse(req.body);
    res.json(await db.updatePlataforma(id, nome));
  } catch (e) {
    next(e);
  }
});

plataformasRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'ID inválido' }); return; }
    await db.deletePlataforma(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
