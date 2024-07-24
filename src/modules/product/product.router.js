import { Router } from 'express';
import * as productController from './controller/product.js';
import { auth } from '../../middleware/auth.js';
import { validation } from '../../middleware/validation.js';
import * as VAL from './product.validation.js';
import { fileUpload, fileValidation } from '../../utils/multer.js';
import { endPoint } from './product.endPoint.js';
import reviewRouter from '../reviews/reviews.router.js';
const router = Router();

router.use('/:productId/review', reviewRouter);
router.get('/', productController.getProducts);

router.post(
  '/',
  validation(VAL.headers, true),
  auth(endPoint.create),
  fileUpload(fileValidation.image).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 },
  ]),
  validation(VAL.createProduct),
  productController.createProduct
);

router.put(
  '/:productId',
  validation(VAL.headers, true),
  auth(endPoint.update),
  fileUpload(fileValidation.image).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 },
  ]),
  validation(VAL.updateProduct),
  productController.updateProduct
);
router
  .patch(
    '/:productId/wishlist',
    auth(endPoint.wishList),
    validation(VAL.wishlist),
    productController.addToWishlist
  )
  .patch(
    '/:productId/wishlist/remove',
    auth(endPoint.wishList),
    validation(VAL.wishlist),
    productController.removeFromWishlist
  );

export default router;
