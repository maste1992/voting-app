const mongoose = require('mongoose');
const CandidateSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    party: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    votesCount: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  module.exports = mongoose.model('Candidate', CandidateSchema);
