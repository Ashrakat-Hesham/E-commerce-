import { roles } from '../../middleware/auth.js';

export const endPoint = {
  create: [roles.user],
  cancel: [roles.user],
  updateStatusByAdmin: [roles.admin],
};
