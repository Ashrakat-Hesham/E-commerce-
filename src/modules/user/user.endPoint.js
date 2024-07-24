import { roles } from '../../middleware/auth.js';

export const endPoint = { deleteUser: roles.admin };
