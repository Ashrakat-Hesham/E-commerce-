import mongoose, { Schema, Types, model } from 'mongoose';

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, 'userName is required'],
      min: [2, 'Minimum length 2 char'],
      max: [20, 'Maximum length 20 char'],
      lowercase: true,
    },
    email: {
      type: String,
      unique: [true, 'Email must be unique value'],
      required: [true, 'Email is required'],
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: String,
    gender: { type: String, default: 'male', enum: ['male', 'female'] },
    phone: {
      type: String,
    },
    DOB: String,
    role: {
      type: String,
      default: 'User',
      enum: ['User', 'Admin'],
    },
    status: {
      type: String,
      default: 'Offline',
      enum: ['Offline', 'Online'],
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    image: Object,
    forgetCode: { type: String },
    changePasswordTime: {
      type: Date,
    },
    wishlist: { type: Types.ObjectId, ref: 'Product' },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);
userSchema.virtual('review', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'createdBy',
});
const userModel = mongoose.models.User || model('User', userSchema);
export default userModel;
