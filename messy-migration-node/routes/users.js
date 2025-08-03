const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserCreation, validateUserUpdate, validateLogin } = require('../middleware/validators');
const { validationResult } = require('express-validator');

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

router.get('/', userController.healthCheck);
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);

router.post('/users', validateUserCreation, runValidation, userController.createUser);
router.put('/user/:id', validateUserUpdate, runValidation, userController.updateUser);
router.delete('/user/:id', userController.deleteUser);
router.get('/search', userController.searchUsers);
router.post('/login', validateLogin, runValidation, userController.loginUser);

module.exports = router;
