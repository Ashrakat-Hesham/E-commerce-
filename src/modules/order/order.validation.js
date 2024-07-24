import Joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createOrder = Joi.object({
  note: Joi.string().min(1),
  address: Joi.string().min(1).required(),
  phone: Joi.array()
    .items(Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)))
    .required(),
  couponName: Joi.string(),
  paymentType: Joi.string().valid('cash', 'card'),
  products: Joi.array()
    .items(
      Joi.object({
        productId: generalFields.id,
        quantity: Joi.number().required(),
      }).required()
    )
    .min(1),
}).required();

export const cancelOrder = Joi.object({
  orderId: generalFields.id,
  reason: Joi.string().min(1).required(),
}).required();

export const updateStatusByAdmin = Joi.object({
  orderId: generalFields.id,
  status: Joi.string().valid('rejected', 'delivered', 'onWay').required(),
}).required();
