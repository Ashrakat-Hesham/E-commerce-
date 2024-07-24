import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const addBrandVal = joi.object({
    name: generalFields.name.min(2).max(200).required(),
    image: generalFields.file.required(),
  }).required()
;

export const updateBrandVal = joi.object({
    brandId:generalFields.id.required(),
    name: generalFields.name,
    image: generalFields.file,
  }).required()
;
