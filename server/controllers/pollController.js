const Poll = require("../models/Poll.js");
const socket = require("../socket.js");
exports.createPoll = async (req, res) => {
  const { question, options } = req.body;

  if (!question || options.length < 2)
    return res.status(400).json({ error: "Invalid poll" });

  const poll = await Poll.create({
    question,
    options: options.map(text => ({ text }))
  });

  res.json(poll);
};

// exports.getPoll = async (req, res) => {
//   const poll = await Poll.findById(req.params.id);
//   res.json(poll);
// };
exports.getPoll = async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).json({ error: "Poll not found" });

  const voterId = req.cookies.voterId;
  const ip = req.ip;
  const voterKey = voterId + ip;

  const hasVoted = poll.voters.includes(voterKey);

  res.json({
    ...poll.toObject(),
    hasVoted
  });
};


// exports.votePoll = async (req, res) => {
//   try {
//     const pollId = req.params.id;
//     const { optionIndex } = req.body;

//     const poll = await Poll.findById(pollId);
//     if (!poll) {
//       return res.status(404).json({ error: "Poll not found" });
//     }

 
//     if (optionIndex < 0 || optionIndex >= poll.options.length) {
//       return res.status(400).json({ error: "Invalid option" });
//     }

//     const voterId = req.cookies.voterId;
//     const ip = req.ip;
//     const voterKey = voterId + ip;

   
//     if (poll.voters.includes(voterKey)) {
//       return res.status(403).json({ error: "Already voted" });
//     }

 
//     poll.options[optionIndex].votes += 1;
//     poll.voters.push(voterKey);

//     await poll.save();

//     socket.emitVote(pollId, poll);

//     res.json(poll);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.votePoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const { optionIndex } = req.body;

    const voterId = req.cookies.voterId;
    const ip = req.ip;
    const voterKey = voterId + ip;

    // atomic update
    const poll = await Poll.findOneAndUpdate(
      {
        _id: pollId,
        voters: { $ne: voterKey }   // only update if NOT voted
      },
      {
        $inc: { [`options.${optionIndex}.votes`]: 1 },
        $addToSet: { voters: voterKey }
      },
      { new: true }
    );

    if (!poll) {
      return res.status(403).json({ error: "Already voted" });
    }

    socket.emitVote(pollId, poll);

    res.json(poll);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
