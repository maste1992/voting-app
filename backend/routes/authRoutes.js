const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth=require('../middleware/auth');
router.post(
  '/login',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

router.put(
  '/changepassword',
  auth.isAuthenticated,
  [
    check('currentPassword', 'current   password is required').not().isEmpty(),
    check('newPassword', 'New password is required').not().isEmpty(),
  ],
  authController.changePassword
)
module.exports = router;