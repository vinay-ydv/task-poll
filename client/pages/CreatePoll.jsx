import { useState } from "react";
import axios from "axios";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 
  const create = async () => {
    setError("");


               if (!question.trim()) {
      return setError("Question is required");
    }

    const validOptions = options.filter(opt => opt.trim() !== "");

    if (validOptions.length < 2) {
      return setError("At least 2 options required");
    }

    try {
      setLoading(true);


      const res = await axios.post(
        "http://localhost:5000/api/polls",
        {
          question,
          options: validOptions
        },
        { withCredentials: true }
      );

      setLink(`${window.location.origin}/poll/${res.data._id}`);

    
      setQuestion("");
      setOptions(["", ""]);

    } catch {
      setError("Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

 
  const addOption = () => {
    setOptions([...options, ""]);
  };


  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

 
  const copyLink = () => {
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">Create Poll</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      <input
        value={question}
        className="border p-2 w-full mb-3"
        placeholder="Enter question..."
        onChange={e => setQuestion(e.target.value)}
      />

      {options.map((opt, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            value={opt}
            className="border p-2 w-full"
            placeholder={`Option ${i + 1}`}
            onChange={e => {
              const arr = [...options];
              arr[i] = e.target.value;
              setOptions(arr);
            }}
          />

          <button
            onClick={() => removeOption(i)}
            className="bg-red-500 text-white px-3"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        onClick={addOption}
        className="bg-gray-200 px-3 py-1 mb-3"
      >
        + Add Option
      </button>

      <br />

      <button
        onClick={create}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2"
      >
        {loading ? "Creating..." : "Create Poll"}
      </button>

      {link && (
        <div className="mt-6 p-3 border rounded bg-green-50">
          <p className="mb-2">Share this link:</p>

          <div className="flex gap-2">
            <input
              value={link}
              readOnly
              className="border p-2 w-full"
            />
            <button
              onClick={copyLink}
              className="bg-green-600 text-white px-3"
            >
              Copy
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
