import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../src/socket";
import { useParams } from "react-router-dom";
// const API =import.meta.env.SERVER_URL;
export default function PollRoom() {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [error, setError] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    fetchPoll();

    socket.emit("joinPoll", id);

    socket.on("voteUpdate", (updatedPoll) => {
      setPoll(updatedPoll);
    });

   
    return () => {
      socket.off("voteUpdate");
    };
  }, [id]);

 const fetchPoll = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/polls/${id}`,
      { withCredentials: true }
    );

    setPoll(res.data);
    setHasVoted(res.data.hasVoted); 
  } catch {
    setError("Failed to load poll");
  }
};


  const vote = async (index) => {
    try {
      setError("");

      await axios.post(
        `http://localhost:5000/api/polls/${id}/vote`,
        { optionIndex: index },
        { withCredentials: true }
      );

      setHasVoted(true);

    } catch (err) {
      if (err.response?.status === 403) {
        setError("You have already voted in this poll.");
        setHasVoted(true);
      } else {
        setError("Voting failed. Try again.");
      }
    }
  };

  if (!poll) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-xl font-bold mb-4">{poll.question}</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      {poll.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => vote(i)}
          disabled={hasVoted}
          className={`block w-full border p-3 mb-2 ${
            hasVoted ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {opt.text}  --: {opt.votes}
        </button>
      ))}
    </div>
  );
}
