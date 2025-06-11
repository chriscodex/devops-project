import { Router } from 'express';
import {
  createOrden,
  updateOrden,
  getOrden,
  getOrdenes,
  getDniData,
  getRucData,
  getOrdenesByEstado,
  getOrdenesByCliente,
  deleteOrden,
  createServicioAdicional,
  updateServicioAdicional,
  deleteServicioAdicional,
  getAllServiciosAdicionalesByOrderId,
  createPrioridad,
  getPrioridades,
  updatePrioridad,
  deletePrioridad,
  getAreas,
  createArea,
  updateArea,
  deleteArea,
  getTiposServicio,
  createTipoServicio,
  updateTipoServicio,
  deleteTipoServicio,
  getTotalServiciosAdicionalesByOrderId,
  getOrdenesFinalizadas,
  getOrdenesByDate,
  getOrdenesByParameters
} from '../controllers/ordenes.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import {
  getDniDataSchema,
  getRucDataSchema,
  createOrdenSchema,
} from '../schemas/ordenes.schema.js';

const router = Router();

router.get(
  '/ordenes/adicionales/total/:ordenId',
  authRequired,
  getTotalServiciosAdicionalesByOrderId
);
router.post(
  '/ordenes/adicionales/:ordenId',
  authRequired,
  createServicioAdicional
);
router.get(
  '/ordenes/adicionales/:ordenId',
  authRequired,
  getAllServiciosAdicionalesByOrderId
);
router.put(
  '/ordenes/adicionales/:servicioId',
  authRequired,
  updateServicioAdicional
);
router.delete(
  '/ordenes/adicionales/:servicioId',
  authRequired,
  deleteServicioAdicional
);

router.post('/ordenes/cliente/:id', authRequired, getOrdenesByCliente);

router.get('/ordenes/estado/:estado', authRequired, getOrdenesByEstado);
router.post('/dni', authRequired, validateSchema(getDniDataSchema), getDniData);
router.post('/ruc', authRequired, validateSchema(getRucDataSchema), getRucData);

router.get('/prioridades', authRequired, getPrioridades);
router.post('/prioridades', authRequired, createPrioridad);
router.put('/prioridades/:id', authRequired, updatePrioridad);
router.delete('/prioridades/:id', authRequired, deletePrioridad);

router.get('/areas', authRequired, getAreas);
router.post('/areas', authRequired, createArea);
router.put('/areas/:id', authRequired, updateArea);
router.delete('/areas/:id', authRequired, deleteArea);

router.get('/tipoServicios', authRequired, getTiposServicio);
router.post('/tipoServicios', authRequired, createTipoServicio);
router.put('/tipoServicios/:id', authRequired, updateTipoServicio);
router.delete('/tipoServicios/:id', authRequired, deleteTipoServicio);

router.get('/ordenes', authRequired, getOrdenes);
router.post('/ordenes', authRequired, createOrden);
router.get('/ordenes/:id', authRequired, getOrden);
router.put('/ordenes/:id', authRequired, updateOrden);
router.delete('/ordenes/:id', authRequired, deleteOrden);

router.get('/ordenes-finalizadas', authRequired, getOrdenesFinalizadas);

router.post('/ordenes/reportes', authRequired, getOrdenesByParameters);


export default router;
