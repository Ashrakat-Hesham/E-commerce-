import mongoose, { Schema, Types, model } from 'mongoose';

const productSchema = new Schema(
  {
    customId: String,
    name: { type: String, lowerCase: true, trim: true, lowercase: true },
    slug: { type: String, lowerCase: true, trim: true, lowercase: true },
    description: String,
    stock: { type: Number, default: 1 },
    price: { type: Number, default: 1 },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 1 },
    colors: [String],
    size: { type: [String], enum: ['S', 'M', 'L', 'XL'] },
    mainImage: { type: Object },
    subImages: [{ type: Object }],
    categoryId: { type: Types.ObjectId, ref: 'Category' },
    subCategoryId: { type: Types.ObjectId, ref: 'SubCategory' },
    brandId: { type: Types.ObjectId, ref: 'Brand' },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    } /**to be converted to true later */,
    updatedBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
    isDeleted: { type: Boolean, default: false },
    wishUserListIds: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);
productSchema.virtual('review', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId',
});
const productModel = mongoose.models.Product || model('Product', productSchema);

export default productModel;
