import { Router } from 'express';
import * as orderController from './controller/order.js';
import { validation } from '../../middleware/validation.js';
import * as VAL from './order.validation.js';
import { auth } from '../../middleware/auth.js';
import { endPoint } from './order.endPoint.js';
const router = Router();

router
  .post(
    '/',
    auth(endPoint.create),
    validation(VAL.createOrder),
    orderController.createOrder
  )
  .get('/', orderController.getOrders);
router.patch(
  '/:orderId',
  auth(endPoint.cancel),
  validation(VAL.cancelOrder),
  orderController.cancelOrder
);
router.patch(
  '/:orderId/admin',
  auth(endPoint.updateStatusByAdmin),
  validation(VAL.updateStatusByAdmin),
  orderController.updateOrderStatusByAdmin
);
export default router;
