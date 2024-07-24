import { roles } from '../../middleware/auth.js';

export const endPoint = { createReview: roles.user, updateReview: roles.user };
