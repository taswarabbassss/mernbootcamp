const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
    minLength: 8,
    Selection: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your Password'],
    validate: {
      //This Only Works on Create and SAVE!!!
      validator: function(el) {
        return el === this.password; // abc === abc it will return true
      },
      message: 'Passwords are not Same!'
    }
  },
  passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
  // Only run this statement if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwrodConfirm field
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changesPasswordAfter = function(JWTTimestamp) {
  // If anytime user has changed the password
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  // False means password is not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
