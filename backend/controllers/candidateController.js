const Candidate = require('../models/Candidate');


exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ votesCount: -1 });
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.addCandidate = async (req, res) => {
  const { name, party, bio } = req.body;

  try {
    const newCandidate = new Candidate({
      name,
      party,
      bio
    });

    const candidate = await newCandidate.save();
    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};