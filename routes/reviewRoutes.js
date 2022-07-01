const express = require('express');
const Review = require('./../models/reviewModel');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// Router
const router = express.Router();
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createNewReview
  );

module.exports = router;
