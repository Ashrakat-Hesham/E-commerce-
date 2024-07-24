import mongoose, { Schema, Types, model } from 'mongoose';

const couponSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, lowercase: true },
    image: { type: Object },
    usedBy: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
    amount: { type: Number, required: true, default: 1 },
    expiryDate: { type: Date, required: true },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    } /**to be converted to true later */,
    updatedBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const couponModel = mongoose.models.Coupon || model('Coupon', couponSchema);

export default couponModel;
