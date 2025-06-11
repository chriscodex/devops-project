import { Router } from 'express';

import {
  getMarcas,
  createMarca,
  getCategoriasEquipo,
  createCategoriaEquipo,
  deleteMarca,
  updateMarca,
  updateCategoriaEquipo,
  deleteCategoriaEquipo,
} from '../controllers/equipo.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createMarcaSchema } from '../schemas/marcas.schema.js';
import { createCategoriaEquipoSchema } from '../schemas/categoriasEquipo.schema.js';

const router = Router();

router.get('/equipo/marcas', authRequired, getMarcas);

router.post(
  '/equipo/marcas',
  authRequired,
  validateSchema(createMarcaSchema),
  createMarca
);

router.put('/equipo/marcas/:id', authRequired, updateMarca);

router.delete('/equipo/marcas/:id', authRequired, deleteMarca);

router.get('/equipo/categorias', authRequired, getCategoriasEquipo);

router.post(
  '/equipo/categorias',
  authRequired,
  validateSchema(createCategoriaEquipoSchema),
  createCategoriaEquipo
);

router.put('/equipo/categorias/:id', authRequired, updateCategoriaEquipo);

router.delete('/equipo/categorias/:id', authRequired, deleteCategoriaEquipo);

export default router;
