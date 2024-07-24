import Joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createReview = Joi.object({
  comment: Joi.string().min(5).max(15000).required(),
  rating: Joi.number().positive().integer().required(),
  productId: generalFields.id.required(),
}).required();

export const updateReview = Joi.object({
  comment: Joi.string().min(5).max(15000).required(),
  rating: Joi.number().positive().integer().required(),
  productId: generalFields.id.required(),
  reviewId: generalFields.id.required(),
}).required();