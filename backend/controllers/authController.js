const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const dotenv=require('dotenv');
dotenv.config();
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ msg: 'user not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;

        // Decode token to send back useful data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.json({
          token,
          user: {
            id: decoded.user.id,
            username: decoded.user.username,
            role: decoded.user.role
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// controller for changing the password

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // 1. Find user with password field
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // 2. Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await User.updateOne(
      { _id: user._id },
      { $set: { password: user.password } }
    );

    // 5. Verify the change
    const updatedUser = await User.findById(user._id).select('+password');
    const verify = await bcrypt.compare(newPassword, updatedUser.password);
    
    if (!verify) {
      throw new Error('Password verification failed after change');
    }

    res.json({ 
      msg: 'Password changed successfully',
      verified: verify
    });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ 
      msg: 'Server error during password change',
      error: err.message
    });
  }
};
// controller for deleting the user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.user.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};