import Joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const headers = Joi.object({
  authorization: generalFields.headers,
}).required();


export const createProduct = Joi.object({
  name: generalFields.name.min(2).max(15).required(),
  description: generalFields.name.min(2).max(150000).required(),
  size: Joi.array(),
  colors: Joi.array(),
  stock: Joi.number().positive().integer().required(),
  price: Joi.number().positive().min(1).required(),
  discount: Joi.number().positive().min(1),
  categoryId: generalFields.id,
  subCategoryId: generalFields.id,
  brandId: generalFields.id,
  file: Joi.object({
    mainImage: Joi.array()
      .items(generalFields.file.required())
      .length(1)
      .required(),
    subImages: Joi.array().items(generalFields.file).min(1).max(5),
  }),
}).required();

export const updateProduct = Joi.object({
  name: generalFields.name.min(2).max(15),
  description: generalFields.name.min(2).max(150000),
  size: Joi.array(),
  colors: Joi.array(),
  stock: Joi.number().positive().integer(),
  price: Joi.number().positive().min(1),
  discount: Joi.number().positive().min(1),
  productId: generalFields.id.required(),
  categoryId: generalFields.optionalId,
  subCategoryId: generalFields.optionalId,
  brandId: generalFields.optionalId,
  file: Joi.object({
    mainImage: Joi.array().items(generalFields.file.required()).max(1),
    subImages: Joi.array().items(generalFields.file.required()).min(1).max(5),
  }),
}).required();

export const wishlist = Joi.object({
  productId: generalFields.id.required(),
}).required();
