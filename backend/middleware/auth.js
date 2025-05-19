const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Main authentication middleware
function isAuthenticated(req, res, next) {
  const token = req.header('x-auth-token') || req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

// Admin role checker
function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' }); // 403 Forbidden is more appropriate
  }
  next();
}

// Voter role checker
function isVoter(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }
  
  if (req.user.role !== 'voter') {
    return res.status(403).json({ msg: 'Voter access required' });
  }
  next();
}

function isVoterOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }
  
  if (req.user.role !== 'voter' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Voter or Admin access required' });
  }
  next();
}
// Export all middlewares together
module.exports = {
  isAuthenticated,
  isAdmin,
  isVoter,
  isVoterOrAdmin
};