import { Router } from 'express';
const brandRouter = Router();
import * as brand from './controller/brand.js';
import * as Val from './brand.validation.js';
import { fileUpload, fileValidation } from '../../utils/multer.js';
import { validation } from '../../middleware/validation.js';
import { auth, roles } from '../../middleware/auth.js';
import { endPoint } from './brand.endPoint.js';
brandRouter
  .route('/')
  .post(
    auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.addBrandVal),
    brand.addBrand
  )
  .get(auth(Object.values(roles)), brand.getAllBrands);

brandRouter
  .route('/:brandId')
  .put(
    auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.updateBrandVal),
    brand.updateBrand
  )
  .get(auth(Object.values(roles)), brand.getSpecificbrand);
brandRouter.route(':id').delete(auth(endPoint.delete), brand.deleteBrand);

export default brandRouter;
