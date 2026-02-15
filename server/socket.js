let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: { origin: "*" }
    });

    io.on("connection", socket => {
      socket.on("joinPoll", pollId => {
        socket.join(pollId);
      });
    });
  },

  emitVote: (pollId, pollData) => {
    io.to(pollId).emit("voteUpdate", pollData);
  }
};
