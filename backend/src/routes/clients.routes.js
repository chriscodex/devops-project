import { Router } from 'express';
import { updateClientOrden } from '../controllers/ordenes.controller.js';
import { getClientByDni, getClientByRuc, getClients, getClientsByParameters, getClientById } from '../controllers/clients.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.get('/clientes', authRequired, getClients);
router.post('/clientes', authRequired, getClientsByParameters);
router.put('/clientes/update/:clientId/:ordenId', authRequired, updateClientOrden);
router.get('/clientes/dni/:dni', authRequired, getClientByDni);
router.get('/clientes/ruc/:ruc', authRequired, getClientByRuc);
router.get('/clientes/:orderId', authRequired, getClientById);

export default router;