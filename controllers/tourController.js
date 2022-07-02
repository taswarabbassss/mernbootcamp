//const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Factory = require('./handlerFactory');
// Middlewares
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  console.log(req.query);

  next();
};

//Route Handlers or Controllers or Middlewares
exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filtering()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // const query = Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  });
});

exports.createNewTour = Factory.createOne(Tour);
exports.deleteTour = Factory.deleteOne(Tour);
exports.updateTour = Factory.updateOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with this ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: tour
//   });
// });

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  //Tour.findOne( { _id: req.params.id })

  if (!tour) {
    return next(new AppError('No tour found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',

    data: {
      tour
    }
  });
});

//res.send('Data Recieved😍');

// AGGREGATION PIPLINE METHOD
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        // _id: '$ratingsAverage',
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      //To sort the results according to the Average Price in Acsending Order
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

//MONTHLY PLAN
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  // const match_start = new Date(`January 1, ${year} 23:15:30`);
  // const match_end = new Date(`${year}-12-31`);
  // console.log(` ** match_start **`);
  // console.log(match_start);
  // console.log(` ** match_end **`);
  // console.log(match_end);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },

    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan
    }
  });
});

//ROUTER HANDLER GETALLTOURS
//WITHOUT APIFEATURES CLASS
// exports.getAllTours = async (req, res) => {
//   try {
//     //console.log(req.query);
//     // BUILD THE QUERY
//     // // 1A) Filtering
//     // const queryObject = { ...req.query };
//     // const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     // excludedFields.forEach(el => delete queryObject[el]);

//     // // 1B) Advanced Filtering
//     // let queryStr = JSON.stringify(queryObject);
//     // queryStr.replace('/\b(gte|gt|lte|lt\b/g', match => `$${match}`);

//     // let query = Tour.find(JSON.parse(queryStr));

//     // 2) Sorting
//     // if (req.query.sort) {
//     //   const sortBy = req.query.sort.split(',').join(' ');
//     //   query = query.sort(sortBy);
//     // } else {
//     //   query = query.sort('-createdAt');
//     // }

//     // 3) Field Liminting
//     // if (req.query.fields) {
//     //   const fields = req.query.fields.split(',').join(' ');
//     //   //console.log(fields);
//     //   query = query.select(fields);
//     // } else {
//     //   query = query.select('-__v');
//     // }

//     // 4) Pagination

//     // const page = req.query.page * 1 || 1;
//     // const limit = req.query.limit * 1 || 100;
//     // const skip = (page - 1) * limit;

//     // query = query.skip(skip).limit(limit);

//     // if (req.query.page) {
//     //   const numTour = await Tour.countDocuments();
//     //   if (skip >= numTour) throw new Error('This page does not exists');
//     // }

//     // EXECUTE QUERY
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filtering()
//       .sort()
//       .limitFields()
//       .paginate();
//     const tours = await features.query;

//     // const query = Tour.find()
//     //   .where('duration')
//     //   .equals(5)
//     //   .where('difficulty')
//     //   .equals('easy');

//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       data: {
//         tours: tours
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(404).json({
//       status: 'failed',
//       message: err
//     });
//   }
// };

//READING TOURS FROM JSON FILE
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//CHECK THE BODY IF PRICE OR NAME IS AVIALABLE IN BODY

//ID VALIDATION FUNCTION
// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is :${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };
