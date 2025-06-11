import { Router } from 'express';
import { getTecnicos, createTecnico } from '../controllers/tecnicos.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.get('/tecnicos', authRequired, getTecnicos);
router.post('/tecnicos', authRequired, createTecnico);

export default router;
