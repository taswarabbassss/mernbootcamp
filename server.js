const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

//console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose
  .connect(DB, options)
  .then(conn => {
    console.log('Database Connected Successfully!😀😀');
  })
  .catch(e => console.log(e));

const port = process.env.PORT || 3000;
hostname = '127.0.0.1';

//4) START OF SERVER
app.listen(port, hostname, () => {
  console.log(`App is running on port ${port}`);
});
