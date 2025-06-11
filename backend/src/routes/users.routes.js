import { Router } from 'express';
import {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
} from '../controllers/users.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.get('/users', authRequired, getUsers);
router.get('/users/:id', authRequired, getUser);
router.delete('/users/:id', authRequired, deleteUser);
router.put('/users/:userId', authRequired, updateUser);

export default router;
