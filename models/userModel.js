const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must have a name'],
    trim: true,
    maxLength: [40, "A user's name must have more or equal to 40 characters"],
    minLength: [1, "A user's name must have les or equal then 1 characters"]
  },
  email: {
    type: String,
    required: [true, 'A User must have a Email'],
    unique: true,
    trim: true,
    maxLength: [60, "A user's email must have more or equal to 60 characters"],
    minLength: [5, "A user's name must have les or equal then 5 characters"],
    lowercase: true,
    validate: [validator.isEmail, 'Email Address is']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a Password'],
    minLength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your Password']
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
