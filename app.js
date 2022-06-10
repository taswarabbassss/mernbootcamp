const express = require('express');
const { del } = require('express/lib/application');
const res = require('express/lib/response');
const morgan = require('morgan');

const req = require('express/lib/request');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1) MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2)ROUTE HANDLERS

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Cant find ${req.originalUrl} on this server!`
  });
});

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
