const express = require('express');
const { route } = require('express/lib/router');
const userControllers = require('../controllers/userControllers');
//3) ROUTES

const router = express.Router();

//Rourtes for User
router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
