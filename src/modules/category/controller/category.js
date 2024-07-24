import slugify from 'slugify';
import categoryModel from '../../../../DB/model/Category.model.js';
import cloudinary from '../../../utils/cloudinary.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../../../utils/errorHandling.js';
import { auth } from '../../../middleware/auth.js';

export const addCategory = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  if (!name)
    return next(new Error('category Name is required', StatusCodes.NOT_FOUND));

  if (!req.file.path) {
    return next(new Error('category Image is required', StatusCodes.NOT_FOUND));
  }
  const isExist = await categoryModel.findOne({ name });
  if (isExist) {
    return next(
      new Error(`Category ${name} already exist`, StatusCodes.CONFLICT)
    );
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: 'category' }
  );
  const category = await categoryModel.create({
    name: name,
    slug: slugify(name, '-'),
    image: { public_id, secure_url },
    createdBy: req.user._id,
  });
  return res
    .status(StatusCodes.CREATED)
    .json({ message: 'done', category, status: ReasonPhrases.CREATED });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const name = req.body.name;

  const category = await categoryModel.findById(req.params.categoryId);
  if (!category) {
    return next(new Error(`category doesn't exist`, StatusCodes.NOT_FOUND));
  }
  if (name && category.name == name) {
    return next(
      new Error(
        `Sorry cannot update category name with the same name ${name}`,
        StatusCodes.CONFLICT
      )
    );
  }
  req.body.name = name;
  const isExist = await categoryModel.findOne({
    name,
    _id: { $ne: req.params.categoryId },
  });

  if (isExist) {
    next(
      new Error(
        `category ${name} already existS`,
        StatusCodes.CONFLICT
      )
    );
  } else {
    category.name = name;
    category.slug = slugify(name);
  }

  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: 'category' }
    );
    await cloudinary.uploader.destroy(category.image.public_id);
    category.image = { public_id, secure_url };
  }
  category.updatedBy = req.user._id;
  await category.save();
  return res
    .status(StatusCodes.OK)
    .json({ message: 'Done', category, status: ReasonPhrases.OK });
});

export const getSpecificCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.categoryId);
  !category ?? next(new Error("category doesn't exist"));
  return res.status(StatusCodes.OK).json({ message: 'Done', category });
});

export const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await categoryModel.find({});
  return res
    .status(StatusCodes.OK)
    .json({ message: 'Done', categories, status: ReasonPhrases.OK });
});

// export const deleteCategory = asyncHandler(async (req, res, next) => {
//     const { id } = req.params;
//     const checkCategory = await categoryModel.findById(id)
//     if (!checkCategory) { return next(new Error("category doesn't exist")) }
//     await cloudinary.uploader.destroy(checkCategory.image.public_id)
//     await categoryModel.deleteOne({ _id: id })
//     return res.status(StatusCodes.OK).json({ message: 'done' })
// })
