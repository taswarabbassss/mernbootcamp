const express = require('express');
const { del } = require('express/lib/application');
const res = require('express/lib/response');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const req = require('express/lib/request');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1) GLOBAL MIDDLEWARES

// i) Set Security HTTP headers

app.use(helmet());

// ii) Development loggin

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// iii) Limit requests form same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// iv) Body parser, reading data from body into req.body

app.use(express.json({ limit: '10kb' })); //Limiting amount of Data that comes in the body

// Data Sanitization against NoSQL query injection

app.use(mongoSanitize());

// Data Sanitization against XSS

app.use(xss());

// Prevents Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// v) Serving Static Files

app.use(express.static(`${__dirname}/public`));

// vi) A Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 2)ROUTE HANDLERS

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

//----------Simple GET Request-----------//
// app.get('/api/v1/tours', getAllTours);
// //-----------Simple POST Request----------//
// app.post('/api/v1/tours', createNewTour);
// //----------GET Request with VERIALBES-----------//
// app.get('/api/v1/tours/:id', getTour);
// //----------PATCH Request with VERIALBE ID-----------//
// app.patch('/api/v1/tours/:id', updateTour);
// //----------PATCH Request with VERIALBE ID-----------//
// app.delete('/api/v1/tours/:id', deleteTour);

// app.get('/', (req, res) => {
//   //res.status(404).send('Hello from the server side!😎');
//   res.json({
//     message: 'Hello the server is here to help you 🤗',
//     app: 'Natours',
//   });
// });

// app.post('/', (req, res) => {
//   //   res.status(404).send('Hello You can post anything to this URL!😎');
//   res.json({
//     message: 'Hello the server is here to help you 🤗',
//     app: 'Natours',
//     res_type: 'request',
//   });
// });
