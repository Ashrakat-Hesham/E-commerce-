import { Router } from 'express';
import * as authController from './controller/registration.js';
import { validation } from '../../middleware/validation.js';
import * as VAL from './auth.validation.js';
const router = Router();

router.post('/signup', validation(VAL.signup), authController.signup);
router.get(
  '/confirmEmail/:token',
  validation(VAL.token),
  authController.confirmEmail
);
router.get(
  '/requestNewConfirmEmail/:token',
  validation(VAL.token),
  authController.requestNewConfirmEmail
);
router.post('/login', validation(VAL.login), authController.login);

router.patch('/sendcode', validation(VAL.sendCode), authController.sendCode);

router.patch(
  '/forgetpassword',
  validation(VAL.forgetPassword),
  authController.forgetPassword
);

export default router;
