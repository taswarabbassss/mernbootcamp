const express = require('express');
const tourController = require('../controllers/tourController');

const authController = require('../controllers/authController');

// Router
const router = express.Router();
//Create a checkBody middleware
//if the request contain name and price propery
//if not return 400 (bad request)
//add it to the post Handler stack

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tours-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// router.param('id', tourControllers.checkId);
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createNewTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
