import { StatusCodes } from 'http-status-codes';
import productModel from '../../../../DB/model/Product.model.js';
import cartModel from '../../../../DB/model/Cart.model.js';
import { asyncHandler } from '../../../utils/errorHandling.js';

export const createCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  //                                                          check product is exist?
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error('In-valid productId', StatusCodes.NOT_FOUND));
  }
  //                                                  check quantity and is not soft deleted
  if (product.stock < quantity || product.isDeleted) {
    await productModel.updateOne(
      { _id: productId },
      { $addToSet: { wishUserListIds: req.user._id } }
    );
    return next(
      new Error(
        `Product quantity can not be more than ${product.stock}`,
        StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE
      )
    );
  }
  //                                                                check cart

  const cart = await cartModel.findOne({ userId: req.user._id });
  //                                                                not available => create cart
  if (!cart) {
    const newCart = await cartModel.create({
      userId: req.user._id,
      products: [{ productId, quantity }],
    });
    return res.json({ message: 'Done', cart: newCart }, StatusCodes.CREATED);
  }

  //                                                        cart has the product and want to update quantity
  let matchProduct = false;
  for (let i = 0; i < cart.products.length; i++) {
    if (cart.products[i].productId.toString() == productId) {
      cart.products[i].quantity = quantity;
      matchProduct = true;
      break;
    }
  }
  //                                                     product does not exist and will be added to the cart
  if (!matchProduct) {
    cart.products.push({ productId, quantity });
  }

  await cart.save();
  return res.json({ message: 'Done', cart }, StatusCodes.CREATED);
});
//                                remove item
export async function removeProduct(userId, productIds) {
  await cartModel.updateOne(
    { userId },
    {
      $pull: { products: { productId: { $in: productIds } } },
    }
  );
}
export const removeItem = asyncHandler(async (req, res, next) => {
  const { productIds } = req.body;
  removeProduct(req.user._id, productIds);
  return res.json({ message: 'Done' });
});
//                                clear cart
export async function emptyCart(userId) {
  await cartModel.updateOne({ userId }, { products: [] });
}

export const clearCart = asyncHandler(async (req, res, next) => {
  emptyCart(req.user._id);
  return res.json({ message: 'Done' });
});
