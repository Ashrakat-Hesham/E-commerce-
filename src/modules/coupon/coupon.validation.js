import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const addCouponVal = joi
  .object({
    name: generalFields.name.min(2).max(200).required(),
    amount: joi.number().positive().min(1).max(100).required(),
    expiryDate: joi.date().greater(Date.now()).required(),
    file: generalFields.file,
    usedBy: generalFields.id,
  })
  .required();

export const updateCouponVal = joi
  .object({
    couponId: generalFields.id.required(),
    amount: joi.number().positive().min(1).max(100),
    expiryDate: joi.date().greater(Date.now()),
    name: generalFields.name.min(2).max(200).required(),
    file: generalFields.file,
    usedBy: generalFields.id,
  })
  .required();
