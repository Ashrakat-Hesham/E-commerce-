import mongoose, { Schema, Types, model } from 'mongoose';

const cartSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', unique: true, required: true },
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: 'Product',
          unique: true,
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const cartModel = mongoose.models.Cart || model('Cart', cartSchema);

export default cartModel;
