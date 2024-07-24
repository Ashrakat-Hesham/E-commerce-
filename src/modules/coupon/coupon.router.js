import { Router } from 'express';
const couponRouter = Router();
import * as coupon from './controller/coupon.js';
import * as Val from './coupon.validation.js';
import { fileUpload, fileValidation } from '../../utils/multer.js';
import { validation } from '../../middleware/validation.js';
import { auth, roles } from '../../middleware/auth.js';
import { endPoint } from './coupon.endPoint.js';



couponRouter
  .route('/')
  .post(
    auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.addCouponVal),
    coupon.addCoupon
  )
  .get(auth(Object.values(roles)), coupon.getAllCoupons);



















couponRouter
  .route('/:couponId')
  .put(
    auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.updateCouponVal),
    coupon.updateCoupon
  )
  .get(auth(Object.values(roles)), coupon.getSpecificCoupon);
//   .delete(coupon.deletecoupon);

export default couponRouter;
