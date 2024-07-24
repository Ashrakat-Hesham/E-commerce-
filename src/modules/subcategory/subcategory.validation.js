import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const addCategoryVal = {
  body: joi
    .object({
      name: generalFields.name.min(2).max(200).required(),
      file: generalFields.file.required(),
      categoryId: generalFields.id,
    })
    .required(),
};

export const updateCategoryVal = {
  body: joi
    .object({
      categoryId: generalFields.id.error('Not valid category id').required(),
      name: generalFields.name,
      files: generalFields.file,
    })
    .required(),
};
