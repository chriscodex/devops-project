import { Router } from 'express';
import {
  login,
  logout,
  register,
  profile,
  verifyToken,
} from '../controllers/auth.controller.js';
import { update } from '../controllers/users.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { updateUserSchema } from '../schemas/users.schema.js';

const router = Router();

// router.post('/register', validateSchema(registerSchema), register);
router.post('/register', register);
router.post('/login', login);

router.post('/logout', logout);
router.get('/verify', verifyToken);
router.get('/profile', authRequired, profile);

export default router;
