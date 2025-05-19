const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');


router.post(
  '/register',
  [
    // auth,
    [
      check('username', 'Username is required').not().isEmpty(),
      check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
      check('role', 'Role is required').not().isEmpty()
    ]
  ],
  userController.registerUser
);
router.get('/allusers', 
    //auth, 
    userController.getAllUsers);

module.exports = router;