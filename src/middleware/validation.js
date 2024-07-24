import joi from 'joi';
import { Types } from 'mongoose';

const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : console.log(helper);
};
export const generalFields = {
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 6,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  id: joi.string().custom(validateObjectId),
  optionalId: joi.string().custom(validateObjectId),
  name: joi.string(),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
  headers: joi.string().required(),
};
export const validation = (schema, considerHeaders = false) => {
  return (req, res, next) => {
    let inputsData = { ...req.body, ...req.params, ...req.query };
    if (req.file || req.files) {
      inputsData.file = req.file || req.files;
    }
    if (req.headers.authorization && considerHeaders) {
      inputsData = { authorization: req.headers.authorization };
    }
    const validationResult = schema.validate(inputsData, { abortEarly: false });
    if (validationResult.error?.details) {
      return res.status(400).json({
        message: 'validation Error',
        validationErr: validationResult.error.details,
      });
    }
    return next();
  };
};
