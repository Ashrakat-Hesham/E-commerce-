import couponModel from '../../../../DB/model/Coupon.model.js';
import productModel from '../../../../DB/model/Product.model.js';
import cartModel from '../../../../DB/model/Cart.Model.js';
import { asyncHandler } from '../../../utils/errorHandling.js';
import { StatusCodes } from 'http-status-codes';
import { emptyCart, removeProduct } from '../../cart/controller/cart.js';
import orderModel from '../../../../DB/model/Order.model.js';
//    to remove all items from cart for a specific user after ordering or create order by selected products in user cart
export const createOrder = asyncHandler(async (req, res, next) => {
  const { couponName, paymentType, address, phone, note } = req.body;
  //                      check available products in cart
  if (!req.body.products) {
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart?.products?.length) {
      return next(new Error('empty cart'), { StatusCodes: 404 });
    }
    req.body.isCart = true;
    req.body.products = cart.products;
  }
  //                      check coupon exist , date , not used by auth(user)
  const coupon = await couponModel.findOne({
    name: couponName,
    usedBy: { $nin: req.user._id },
  });
  if (!coupon || coupon?.expiryDate?.getTime() < Date.now()) {
    return next(new Error(`Not valid Coupon or You have used it before`));
  }

  const finalProductList = [];
  let subTotal = 0;
  let productIds = [];

  //                         check product  :-  product id, stock , is deleted,
  for (let product of req.body.products) {
    const checkedProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
      isDeleted: false,
    });
    if (!checkedProduct) {
      return next(
        new Error(
          `In-valid product or your quantity is more than the available stock ${product.quantity}`
        )
      );
    }
    if (req.body.isCart) {
      product = product.toObject();
    }
    product.name = checkedProduct.name;
    product.unitPrice = checkedProduct.price;
    product.finalPrice = product.quantity * checkedProduct.finalPrice;
    finalProductList.push(product);
    productIds.push(product.productId);
    subTotal += product.finalPrice;
  }

  const order = await orderModel.create({
    userId: req.user._id,
    address,
    phone,
    note,
    products: finalProductList,
    couponId: coupon?._id,
    subTotal,
    finalPrice: subTotal - subTotal * (50 / 100),
    paymentType,
    status: paymentType ? 'waitPayment' : 'placed',
  });
  //          decrease product stock
  for (const product of req.body.products) {
    await productModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: -parseInt(product.quantity) } }
    );
  }
  //          push userId in usedBy in coupon
  if (coupon) {
    await couponModel.updateOne(
      { _id: coupon._id },
      { $addToSet: { usedBy: req.user._id } }
    );
  }
  //          clear items from cart
  if (req.body.isCart) {
    emptyCart(req.user._id);
  } else {
    removeProduct(req.user._id, productIds);
  }
  return res.json({ message: 'Done', order });
});

export const getOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderModel.find().populate([{ path: 'review' }]);
  return res.json({ message: 'Done', orders });
});
//                                                     cancel order

export const cancelOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { reason } = req.body;
  const order = await orderModel.findOne({
    _id: orderId,
    userId: req.user._id,
    status: { $ne: 'canceled' },
  });
  if (!order) {
    return next(
      new Error('Not-valid order Id or user Id or order was canceled by user')
    );
  }
  if (
    (order?.status != 'placed' && order?.paymentType == 'cash') ||
    (order?.status != 'waitPayment' && order?.paymentType == 'card')
  ) {
    return next(
      new Error(`cannot cancel order after being changed to ${order.status}`),
      { status: StatusCodes.NOT_FOUND }
    );
  }
  const cancelOrder = await orderModel.updateOne(
    { _id: order._id },
    { status: 'canceled', reason, canceledBy: req.user._id }
  );
  if (!cancelOrder?.matchedCount) {
    return next(new Error('fail to cancel your Order'));
  }
  //          increase product stock
  for (const product of order.products) {
    await productModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: parseInt(product.quantity) } }
    );
  }
  //          pull userId in usedBy in coupon
  if (order?.couponId) {
    await couponModel.findByIdAndUpdate(
      { _id: order?.couponId },
      { $pull: { usedBy: req.user._id } },
      { new: true }
    );
  }
  return res.status(200).json({ message: 'Done' });
});

//                                change status by Admin
export const updateOrderStatusByAdmin = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await orderModel.findOne({
    _id: orderId,
    status: { $ne: 'canceled' },
  });
  if (!order) {
    return next(new Error('Not-valid order Id or order was canceled by user'));
  }
  if (status == 'rejected') {
    //          increase product stock
    for (const product of order.products) {
      await productModel.updateOne(
        { _id: product.productId },
        { $inc: { stock: parseInt(product.quantity) } }
      );
    }
    //          pull userId in usedBy in coupon
    if (order?.couponId) {
      await couponModel.findByIdAndUpdate(
        { _id: order?.couponId },
        { $pull: { usedBy: order?.userId } },
        { new: true }
      );
    }
  }
  const updatedOrderStatus = await orderModel.updateOne(
    { _id: order._id },
    { status, updatedBy: req.user._id }
  );

  return res.status(200).json({ message: 'Done', updatedOrderStatus });
});
