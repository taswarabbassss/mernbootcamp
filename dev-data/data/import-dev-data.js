const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('../../models/tourModel');

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

// READ JSON FILE trour-simple.json
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// IMPORT DATA INTO THE DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully Loaded😀');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETING ALL DATA FROM THE COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Successfully Deleted😀');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
