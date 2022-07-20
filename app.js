const path = require('path');
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
const cookieParser = require('cookie-parser');

const req = require('express/lib/request');

// Local Modules
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1) GLOBAL MIDDLEWARES

// v) Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

// i) Set Security HTTP headers

// app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", 'unpkg.com'],
//       styleSrc: ["'self'", 'cdnjs.cloudflare.com']
//       // fontSrc: ["'self'", "maxcdn.bootstrapcdn.com"],
//     }
//   })
// );

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'http://127.0.0.1:3000/*'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: [
          "'self'",
          'https://*.stripe.com',
          'https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js'
        ],
        frameSrc: ["'self'", 'https://*.stripe.com'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"]
      }
    }
  })
);

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
app.use(cookieParser());

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

// vi) A Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// 2)ROUTE HANDLERS

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
