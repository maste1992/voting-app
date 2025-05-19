const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const candidateController = require('../controllers/candidateController');

router.get('/allcandi', candidateController.getCandidates);

router.post(
  '/createcandidate',
  [
   // auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('party', 'Party is required').not().isEmpty()
    ]
  ],
  candidateController.addCandidate
);

module.exports = router;