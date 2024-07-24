import mongoose, { Schema, Types, model } from 'mongoose';

const orderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    canceledBy: { type: Types.ObjectId, ref: 'User' },
    updatedBy: { type: Types.ObjectId, ref: 'User' },
    address: { type: String, required: true },
    phone: [{ type: String, required: true }],
    note: String,
    products: [
      {
        name: { type: String, required: true },
        productId: {
          type: Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
        unitPrice: { type: Number, required: true, default: 1 },
        FinalPrice: { type: Number, required: true, default: 1 },
      },
    ],
    couponId: {
      type: Types.ObjectId,
      ref: 'Coupon',
    },
    subTotal: { type: Number, default: 1, required: true },
    finalPrice: { type: Number, default: 1, required: true },
    paymentType: {
      type: String,
      default: 'cash',
      enum: ['cash', 'card'],
    },
    status: {
      type: String,
      default: 'placed',
      required: true,
      enum: [
        'waitPayment',
        'placed',
        'canceled',
        'rejected',
        'onWay',
        'delivered',
      ],
    },
    reason: { type: String },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
orderSchema.virtual('review', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'orderId',
});
const orderModel = mongoose.models.Order || model('Order', orderSchema);

export default orderModel;
