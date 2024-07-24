import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const signup = joi
  .object({
    userName: joi.string().min(2).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string(),
    cPassword: joi.string().valid(joi.ref('password')).required(),
  })
  .required();
export const token = joi.object({ token: joi.string().required() }).required();
export const login = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

export const sendCode = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

export const forgetPassword = joi
  .object({
    forgetCode: joi
      .string()
      .pattern(new RegExp(/^[0-9]{4}$/))
      .required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref('password')).required(),
  })
  .required();
