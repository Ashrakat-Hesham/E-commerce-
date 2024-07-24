import { nanoid } from 'nanoid';
import cloudinary from '../../../../node_modules/cloudinary/cloudinary.js';
import categoryModel from '../../../../DB/model/Category.model.js';
import subCategoryModel from '../../../../DB/model/SubCategory.model.js';
import { asyncHandler } from '../../../utils/errorHandling.js';
import slugify from 'slugify';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const addSubCategory = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const { categoryId } = req.params;
  if (!categoryId) {
    return next(new Error(`categoryId doesn't exist`, StatusCodes.NOT_FOUND));
  }
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new Error(`category doesn't exist`, StatusCodes.NOT_FOUND));
  }
  if (!name)
    return next(
      new Error('subcategory Name is required', StatusCodes.NOT_FOUND)
    );
  if (!req.file.path) {
    return next(
      new Error('subcategory Images are required', StatusCodes.NOT_FOUND)
    );
  }
  const isExist = await subCategoryModel.findOne({ name: name });
  if (isExist) {
    return next(
      new Error(`subCategory ${name} already exist`, StatusCodes.CONFLICT)
    );
  }
  const customId = nanoid();
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.ApAPP_NAME}/${category.name}/${name}/${customId}`,
    }
  );
  const subcategory = await subCategoryModel.create({
    name,
    slug: slugify(req.body.name, '-'),
    image: { public_id, secure_url },
    categoryId,
    customId,
    createdBy: req.user._id,
  });
  return res
    .status(StatusCodes.CREATED)
    .json({ message: 'done', subcategory, status: ReasonPhrases.CREATED });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { categoryId, subcategoryId } = req.params;
  const name = req.body.name;
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new Error(`category doesn't exist`, StatusCodes.NOT_FOUND));
  }
  const subcategory = await subCategoryModel.findOne({
    _id: subcategoryId,
  });
  if (!subcategory) {
    return next(new Error(`subcategory doesn't exist`, StatusCodes.NOT_FOUND));
  }
  if (name && subcategory.name == name) {
    return next(
      new Error(
        `Sorry cannot update subcategory name with the same name ${name}`,
        StatusCodes.CONFLICT
      )
    );
  }
  req.body.name = name;
  const isExist = await categoryModel.findOne({
    name,
    _id: { $ne: req.params.subcategoryId },
  });

  if (isExist) {
    next(new Error(`category ${name} already existS`, StatusCodes.CONFLICT));
  } else {
    subcategory.name = name;
    subcategory.slug = slugify(name);
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.ApAPP_NAME}/${category.name}/${name}/${subcategory.customId}`,
      }
    );
    await cloudinary.uploader.destroy(subcategory.image.public_id);
    subcategory.image = { public_id, secure_url };
  }
  subcategory.updatedBy = req.user._id;
  await subcategory.save();
  return res
    .status(StatusCodes.OK)
    .json({ message: 'Done', subcategory, status: ReasonPhrases.OK });
});

export const getSpecificSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await subCategoryModel.findById(req.params.subcategoryId);
  !subCategory ?? next(new Error("subCategory doesn't exist"));
  return res.status(StatusCodes.OK).json({ message: 'Done', subCategory });
});

export const getAllSubCategories = asyncHandler(async (req, res, next) => {
  const subCategories = await subCategoryModel
    .find({})
    .populate([{ path: 'categoryId' }]);
  return res
    .status(StatusCodes.OK)
    .json({ message: 'Done', subCategories, status: ReasonPhrases.OK });
});
