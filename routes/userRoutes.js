const express = require('express');
const { route } = require('express/lib/router');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//3) ROUTES

const router = express.Router();
router.post('/signup', authController.signUp);

//Rourtes for User
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
