const User = require('../models/User');
const bcrypt = require('bcryptjs');
const e = require('express');
const { validationResult } = require('express-validator');


exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, role } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      password,
      role
    });

    await user.save();
    res.json({ 
        msg: 'User registered successfully',
        user: {
          username: user.username,
          role: user.role
        }
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// get all users
exports.getAllUsers = async (req, res) => { 
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}