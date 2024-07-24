import { validation } from '../../middleware/validation.js';
import * as Val from './reviews.validation.js';
import { endPoint } from './reviews.endPoint.js';
import { auth } from '../../middleware/auth.js';
import * as reviewController from './controller/review.js';

import { Router } from 'express';
const router = Router({ mergeParams: true });

router
  .get('/',reviewController.getReviews)
  .post(
    '/',
    auth(endPoint.createReview),
    validation(Val.createReview),
    reviewController.createReview
  );
router.put(
  '/:reviewId',
  auth(endPoint.updateReview),
  validation(Val.updateReview),
  reviewController.updateReview
);

export default router;
