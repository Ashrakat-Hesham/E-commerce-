import { auth } from '../../middleware/auth.js';
import { endPoint } from './cart.endPoint.js';
import * as cartController from './controller/cart.js';
import { Router } from 'express';
const router = Router();

router.post('/', auth(endPoint.create), cartController.createCart);
router.patch('/remove', auth(endPoint.create), cartController.removeItem);
router.patch('/clear', auth(endPoint.create), cartController.clearCart);

export default router;
