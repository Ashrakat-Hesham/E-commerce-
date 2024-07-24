import { asyncHandler } from '../../../utils/errorHandling.js';
import reviewModel from '../../../../DB/model/Reviews.model.js';
import orderModel from '../../../../DB/model/Order.Model.js';
export const createReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { comment, rating, orderId } = req.body;
  const order = await orderModel.findOne({
    userId: req.user._id,
    status: 'delivered',
    'products.productId': productId,
  });
  if (!order) {
    return next(new Error('you can not review product until you receive it'));
  }
  if (
    await reviewModel.findOne({
      orderId: order?._id,
      createdBy: req.user._id,
      productId,
    })
  ) {
    return next(new Error('Already reviewed by you'));
  }
  const review = await reviewModel.create({
    comment,
    rating,
    createdBy: req.user._id,
    productId,
    orderId: order._id,
  });
  return res.status(201).json({ message: 'Done', review });
});

export const getReviews = asyncHandler(async (req, res, next) => {
  const reviews = await reviewModel.find().populate([{ path: 'product' }]);
  return res.json ({message:"Done",reviews})
});

export const updateReview = asyncHandler(async (req, res, next) => {
  const { productId, reviewId } = req.params;
  const review = await reviewModel.findOne({ _id: reviewId });
  if (!review) {
    return next(new Error('Review Id does not exist'));
  }
  await reviewModel.updateOne({ _id: reviewId, productId }, req.body);
  return res.json({ message: 'Done' });
});
