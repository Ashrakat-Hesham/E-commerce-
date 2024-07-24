import { Router } from 'express';
const categoryRouter = Router();
import * as category from './controller/category.js';
import * as Val from './category.validation.js';
import { fileUpload, fileValidation } from '../../utils/multer.js';
import { validation } from '../../middleware/validation.js';
import subcategoryRouter from '../subcategory/subcategory.router.js';
import { auth, roles } from '../../middleware/auth.js';
import { endPoint } from './category.endPoint.js';
categoryRouter.use('/:categoryId/subcategory', subcategoryRouter);
categoryRouter
  .route('/')
  .post(
    auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.addCategoryVal),
    category.addCategory
  )
  .get(auth(Object.values(roles)), category.getAllCategories);

categoryRouter
  .route('/:categoryId')
  .put(
    auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.updateCategoryVal),
    category.updateCategory
  )
  // .get('/:categoryId', category.getSpecificCategory);
// categoryRouter.route('/:id').delete( category.deleteCategory);

export default categoryRouter;
