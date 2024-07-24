import userModel from '../../../../DB/model/User.model.js';
import { asyncHandler } from '../../../utils/errorHandling.js';
import deleteOne from '../../../utils/refactor.js';

export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find().populate([{ path: 'review' }]);
  return res.json({ message: 'Done', users });
});

export const deleteUser = deleteOne(userModel, 'User');
