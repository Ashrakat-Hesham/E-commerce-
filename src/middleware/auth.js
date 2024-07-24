import userModel from '../../DB/model/User.model.js';
import { verifyToken } from '../utils/GenerateAndVerifyToken.js';
import { asyncHandler } from '../utils/errorHandling.js';
export const roles = {
  admin: 'Admin',
  user: 'User',
  hr: 'HR',
};

export const auth = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return next(new Error('Invalid Bearer key'));
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];
    if (!token) {
      return next(new Error('Invalid token'));
    }
    const decoded = verifyToken({ token });
    if (!decoded) {
      return next(new Error('Invalid token payload'));
    }
    const user = await userModel
      .findById(decoded.id)
      .select('role userName image changePasswordTime');
    if (!user) {
      return next(new Error('Not registered user'));
    }
    if (parseInt(user.changePasswordTime / 1000) > decoded.iat) {
      return next(new Error('Expired token'));
    }
    if (!accessRoles.includes(user.role)) {
      return next(new Error('Not authorized user'));
    }
    req.user = user;
    next();
  });
};
