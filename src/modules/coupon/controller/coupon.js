import cloudinary from '../../../utils/cloudinary.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../../../utils/errorHandling.js';
import couponModel from '../../../../DB/model/Coupon.model.js';

export const addCoupon = async (req, res, next) => {
  const name = req.body.name;
  const isExist = await couponModel.findOne({ name });
  if (isExist) {
    return next(
      new Error(`coupon ${req.body.name} already exist`, StatusCodes.CONFLICT)
    );
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: 'coupon' }
    );
    req.body.image = { public_id, secure_url };
  }
  req.body.name = name;
  req.body.expiryDate = new Date(req.body.expiryDate);
  req.body.createdBy = req.user._id;
  const coupon = await couponModel.create(req.body);
  return res
    .status(StatusCodes.CREATED)
    .json({ message: 'done', coupon, status: ReasonPhrases.CREATED });
};

export const updateCoupon = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const coupon = await couponModel.findById(req.params.couponId);
  if (!coupon) {
    return next(new Error(`coupon doesn't exist`, StatusCodes.NOT_FOUND));
  }

  if (name && coupon.name == name) {
    return next(
      new Error(
        `Sorry cannot update coupon name with the same name ${name}`,
        StatusCodes.CONFLICT
      )
    );
  }
  req.body.name = name;
  const isExist = await couponModel.findOne({
    name: name,
    _id: { $ne: req.params.couponId },
  });
  if (isExist) {
    next(new Error(`coupon ${name} already existS`, StatusCodes.CONFLICT));
  } else {
    coupon.name = name;
  }
  if (req.body.expiryDate) {
    req.body.expiryDate = new Date(req.body.expiryDate);
  }

  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: 'coupon' }
    );
    if (coupon?.image) {
      await cloudinary.uploader.destroy(coupon.image.public_id);
    }
    coupon.image = { public_id, secure_url };
  }
  if (req.body.amount) {
    coupon.amount = req.body.amount;
  }
  coupon.updatedBy = req.user._id;
  await coupon.save();
  return res
    .status(StatusCodes.OK)
    .json({ message: 'Done', coupon, status: ReasonPhrases.OK });
});

export const getSpecificCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findById(req.params.couponId);
  !coupon ?? next(new Error("coupon doesn't exist"));
  return res.status(StatusCodes.OK).json({ message: 'Done', coupon });
});

export const getAllCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await couponModel.find({});
  return res
    .status(StatusCodes.OK)
    .json({ message: 'Done', coupons, status: ReasonPhrases.OK });
});

// export const deleteCoupon = asyncHandler(async (req, res, next) => {
//     const { id } = req.params;
//     const checkcoupon = await couponModel.findById(id)
//     if (!checkcoupon) { return next(new Error("coupon doesn't exist")) }
//     await cloudinary.uploader.destroy(checkcoupon.image.public_id)
//     await couponModel.deleteOne({ _id: id })
//     return res.status(StatusCodes.OK).json({ message: 'done' })
// })
