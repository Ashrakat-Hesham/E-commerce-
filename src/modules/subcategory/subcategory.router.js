import { Router } from 'express';
import { fileUpload, fileValidation } from '../../utils/multer.js';
import * as subCategoryController from './controller/subCategory.js';
import { auth, roles } from '../../middleware/auth.js';
import { endPoint } from './subcategory.endPoint.js';
const subcategoryRouter = Router({ mergeParams: true });

subcategoryRouter
  .route('/')
  .post(
    auth(endPoint.create),
    fileUpload(fileValidation.image).single('image'),
    subCategoryController.addSubCategory
  )
  .get(auth(Object.values(roles)), subCategoryController.getAllSubCategories);

subcategoryRouter
  .route('/:subcategoryId')
  .put(
    auth(endPoint.update),
    fileUpload(fileValidation.image).single('image'),
    subCategoryController.updateCategory
  )
  .get(auth(Object.values(roles)),subCategoryController.getSpecificSubCategory);
export default subcategoryRouter;
