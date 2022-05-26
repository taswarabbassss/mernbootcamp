const express = require('express');
const tourControllers = require('./../controllers/tourControllers');
const router = express.Router();

//Create a checkBody middleware
//if the request contain name and price propery
//if not return 400 (bad request)
//add it to the post Handler stack

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router.route('/tours-stats').get(tourControllers.getTourStats);
router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);

// router.param('id', tourControllers.checkId);
router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.createNewTour);
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;
