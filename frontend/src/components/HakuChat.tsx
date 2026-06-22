import { useState } from 'react';
import axios from 'axios';

export default function MaterialAssistant() {
  const [msg, setMsg] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!msg.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/haku/chat', { message: msg });
      setResponse(res.data.reply ?? JSON.stringify(res.data));
    } catch (err) {
      setResponse('Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-xl">
      <h2 className="text-2xl font-semibold text-center mb-4 text-cyan-300">
        Ask the AI Assistant
      </h2>
      <textarea
        className="w-full h-32 p-3 mb-4 text-white bg-gray-800/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
        placeholder="Enter your question..."
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <button
          className={`px-5 py-2 rounded-md transition-colors ${loading ? 'bg-gray-600' : 'bg-cyan-600 hover:bg-cyan-500'} text-white font-medium`}
          onClick={send}
          disabled={loading}
        >
          {loading ? 'Thinking…' : 'Send'}
        </button>
        <span className="text-sm text-gray-400">
          {msg.length} / 500
        </span>
      </div>
      {response && (
        <pre className="mt-4 p-4 bg-gray-800/70 rounded-md overflow-x-auto text-white whitespace-pre-wrap">
          {response}
        </pre>
      )}
    </div>
  );
}
