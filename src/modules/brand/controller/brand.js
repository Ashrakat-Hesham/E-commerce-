import brandModel from '../../../../DB/model/Brand.model.js';
import cloudinary from '../../../utils/cloudinary.js';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../../../utils/errorHandling.js';
import deleteOne from '../../../utils/refactor.js';

export const addBrand = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const isExist = await brandModel.findOne({ name });
  if (isExist) {
    return next(
      new Error(`Brand ${name} already exists`, StatusCodes.CONFLICT)
    );
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: 'brand' }
  );
  const brand = await brandModel.create({
    name: name,
    image: { public_id, secure_url },
    createdBy: req.user._id,
  });
  return res
    .status(StatusCodes.CREATED)
    .json({ message: 'done', brand, status: ReasonPhrases.CREATED });
});

export const updateBrand = asyncHandler(async (req, res, next) => {
  const name = req.body.name();
  const brand = await brandModel.findById(req.params.brandId);
  if (!brand) {
    return next(new Error(`brand doesn't exist`, StatusCodes.NOT_FOUND));
  }
  if (name && brand.name == name) {
    return next(
      new Error(
        `Sorry cannot update brand name with the same name ${name}`,
        StatusCodes.CONFLICT
      )
    );
  }
  const isExist = await brandModel.findOne({
    name,
    _id: { $ne: req.params.brandId },
  });

  if (isExist) {
    next(new Error(`brand ${name} already exists`, StatusCodes.CONFLICT));
  } else {
    brand.name = name;
  }

  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: 'brand' }
    );
    await cloudinary.uploader.destroy(brand.image.public_id);
    brand.image = { public_id, secure_url };
  }
  brand.updatedBy = req.user._id;
  await brand.save();
  return res
    .status(StatusCodes.OK)
    .json({ message: 'Done', brand, status: ReasonPhrases.OK });
});

export const getSpecificbrand = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.findById(req.params.brandId);
  !brand ?? next(new Error("brand doesn't exist"));
  return res.status(StatusCodes.OK).json({ message: 'Done', brand });
});

export const getAllBrands = asyncHandler(async (req, res, next) => {
  const brands = await brandModel.find({});
  return res
    .status(StatusCodes.OK)
    .json({ message: 'Done', brands, status: ReasonPhrases.OK });
});

export const deleteBrand = deleteOne(brandModel, 'Brand');
