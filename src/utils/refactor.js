import { asyncHandler } from './errorHandling.js';

const deleteOne = (model, name) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id);
    !document && next(new Error(`${name} not found`, 404));
    let response = {};
    response[name] = document;
    return document && res.status(200).json({ message: 'Done', ...response });
  });
};
export default deleteOne;
