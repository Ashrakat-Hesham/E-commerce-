import mongoose, { Schema, Types, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    comment: { type: String },
    rating: { type: Number, positive: true, integer: true },
    createdBy: { type: Types.ObjectId, ref: 'User' },
    productId: { type: Types.ObjectId, ref: 'Product' },
    orderId: { type: Types.ObjectId, ref: 'Order' },
  },
  {
    timestamps: true,
  }
);

const reviewModel = mongoose.models.Reviews || model('Review', reviewSchema);
export default reviewModel;
