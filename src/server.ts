import express, { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { generosRouter } from './routes/generos';
import { plataformasRouter } from './routes/plataformas';
import { jogosRouter } from './routes/jogos';

const app = express();

app.use(express.json());

app.use('/generos', generosRouter);
app.use('/plataformas', plataformasRouter);
app.use('/jogos', jogosRouter);

app.use(
  (
    err: Error & { statusCode?: number },
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    if (err instanceof ZodError) {
      res.status(400).json({
        error: 'Dados inválidos',
        details: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
      });
      return;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(404).json({ error: 'Registro não encontrado' });
        return;
      }
      if (err.code === 'P2002') {
        res.status(409).json({ error: 'Já existe um registro com esses dados' });
        return;
      }
    }
    const status = err.statusCode ?? 500;
    res.status(status).json({ error: err.message ?? 'Erro interno do servidor' });
  },
);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
