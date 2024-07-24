import { nanoid } from 'nanoid';
import brandModel from '../../../../DB/model/Brand.model.js';
import subCategoryModel from '../../../../DB/model/SubCategory.model.js';
import cloudinary from '../../../utils/cloudinary.js';
import { asyncHandler } from '../../../utils/errorHandling.js';
import slugify from 'slugify';
import productModel from '../../../../DB/model/Product.model.js';
import { StatusCodes } from 'http-status-codes';
import userModel from '../../../../DB/model/User.model.js';
import ApiFeatures from '../../../utils/ApiFeatures.js';

export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, categoryId, subCategoryId, brandId, price, discount } =
    req.body;
  //category ,subcategory
  if (
    !(await subCategoryModel.findOne({
      _id: subCategoryId,
      categoryId,
    }))
  ) {
    return next(new Error('not valid category or subcategory Id'));
  }
  //Brand
  const brand = await brandModel.findById({
    _id: brandId,
  });

  if (!brand) {
    return next(new Error('not valid brand Id'));
  }
  req.body.finalPrice = Number.parseFloat(
    price - ((discount || 0) / 100) * price
  ).toFixed(2);
  req.body.slug = slugify(name);
  req.body.customId = nanoid();
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    {
      folder: `${process.env.APP_NAME}/product/${req.body.customId}`,
    }
  );
  req.body.mainImage = { secure_url, public_id };
  if (req.files.subImages) {
    req.body.subImages = [];
    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.APP_NAME}/product/${req.body.customId}/subImages`,
        }
      );
      req.body.subImages.push({ secure_url, public_id });
    }
  }
  req.body.createdBy = req.user._id;
  const product = await productModel.create(req.body);
  if (!product) {
    return next(new Error('fail to create product'));
  }
  return res.json({ message: 'Done', product, status: StatusCodes.CREATED });
});

export const getProducts = asyncHandler(async (req, res, next) => {
  const apiFeature = new ApiFeatures(
    productModel.find().populate([{ path: 'review' }]),
    req.query
  )
    .paginate()
    .sort()
    
  const products = await apiFeature.mongooseQuery;

  for (let i = 0; i < products.length; i++) {
    let calcRating = 0;
    for (let j = 0; j < products[i].review.length; j++) {
      calcRating += products[i].review[j].rating;
    }
    let avgRating = calcRating / products[i].review.length;
    const product = products[i].toObject();
    product.avgRating = avgRating;
    products[i] = product;
  }

  return res.json({ message: 'Done', products });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { name, categoryId, subCategoryId, brandId, price, discount } =
    req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error('not valid product Id'));
  }
  //                                          category ,subcategory
  if (categoryId && subCategoryId) {
    if (
      !(await subCategoryModel.findOne({
        _id: subCategoryId,
        categoryId,
      }))
    ) {
      return next(new Error('not valid category or subcategory Id'));
    }
  }

  //                                                    Brand
  if (brandId) {
    const brand = await brandModel.findById({
      _id: brandId,
    });

    if (!brand) {
      return next(new Error('not valid brand Id'));
    }
  }
  if (price && discount) {
    req.body.finalPrice = Number.parseFloat(
      price - (discount / 100) * price
    ).toFixed(2);
  } else if (price) {
    req.body.finalPrice = Number.parseFloat(
      price - (product.discount / 100) * price
    ).toFixed(2);
  } else if (discount) {
    req.body.finalPrice = Number.parseFloat(
      product.price - (discount / 100) * product.price
    ).toFixed(2);
  }

  if (name) {
    product.slug = slugify(name);
  }

  //                                                  MAinImage
  if (req.files?.mainImage?.length) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.mainImage[0].path,
      {
        folder: `${process.env.APP_NAME}/product/${product.customId}`,
      }
    );
    await cloudinary.uploader.destroy(product.mainImage.public_id);
    req.body.mainImage = { secure_url, public_id };
  }

  //                                                  SubImages
  if (req.files.subImages) {
    let x = [];
    for (let index = 0; index < product?.subImages.length; index++) {
      const element = product?.subImages[index];
      await cloudinary.uploader.destroy(element.public_id);
    }
    for (let i = 0; i < req.files.subImages.length; i++) {
      const element = req.files.subImages[i];
      await cloudinary.uploader
        .upload(element.path, {
          folder: `${process.env.APP_NAME}/product/${product.customId}/subImages`,
        })
        .then(async (result) => {
          x?.push({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        })
        .catch((err) => console.log(err, 'err'));
    }
    product.subImages = x;
  }

  //                                                   created by user
  product.updatedBy = req.user._id;
  //                                                    update product
  const newProduct = await productModel.updateOne({ _id: productId }, product, {
    new: true,
  });
  if (!newProduct) {
    return next(new Error('fail to update product'));
  }
  return res
    .status(200)

    .json({ message: 'Done', newProduct, status: StatusCodes.OK });
});

export const addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  if (!(await productModel.findById(productId))) {
    return next(new Error('In-valid product'));
  }
  await userModel.updateOne(
    { _id: req.user.id },
    { $addToSet: { wishlist: productId } }
  );
  return res.json({ message: 'Done' });
});

export const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  await userModel.updateOne(
    { _id: req.user.id },
    { $pull: { wishlist: productId } }
  );
  return res.json({ message: 'Done' });
});
