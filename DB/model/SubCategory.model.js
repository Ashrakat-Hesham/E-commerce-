import mongoose, { model, Schema, Types } from 'mongoose';

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true  ,lowercase:true},
    slug: { type: String, required: true ,lowercase:true },
    image: { type: Object },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    } /**to be converted to true later */,
    updatedBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    customId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const subCategoryModel =
  mongoose.models.SubCategory || model('SubCategory', subCategorySchema);

export default subCategoryModel;
