import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const addCategoryVal = joi
  .object({
    name: generalFields.name.min(2).max(200).required(),
    file: generalFields.file.required(),
  })
  .required();

export const updateCategoryVal = joi
  .object({
    categoryId: generalFields.id.required(),
    name: generalFields.name,

    file: generalFields.file,
  })
  .required();
