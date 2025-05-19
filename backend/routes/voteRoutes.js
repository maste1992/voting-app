const express = require('express');
const router = express.Router();
const { isAuthenticated, isVoter ,isAdmin, isVoterOrAdmin} = require('../middleware/auth'); // Single import with destructuring
const voteController = require('../controllers/voteController');

// Protected voting route
router.post('/vote',
  isAuthenticated, 
  
  isVoterOrAdmin ,     
  voteController.castVote 
);

// Public results route
router.get('/results', voteController.getResults);

module.exports = router;