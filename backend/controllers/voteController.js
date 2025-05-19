const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');


exports.castVote = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.hasVoted) {
      return res.status(400).json({ msg: 'You have already voted' });
    }

    const candidate = await Candidate.findById(req.body.candidateId);
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    // Create vote
    const vote = new Vote({
      voter: req.user.id,
      candidate: req.body.candidateId
    });

    await vote.save();

    candidate.votesCount += 1;
    await candidate.save();

    user.hasVoted = true;
    await user.save();

    res.json({ msg: 'Vote cast successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.getResults = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ votesCount: -1 });
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};