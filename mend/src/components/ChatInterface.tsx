import { useState } from 'react';

export default function ChatInterface() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, `🧑‍💻 ${input}`, `🤖 (AI Response for "${input}")`]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[500px]">
      <h2 className="text-xl font-bold mb-4">💬 Chat Assistant</h2>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded mb-4 border">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 px-4 py-3 rounded-xl max-w-[80%] ${
              msg.startsWith('🧑‍💻')
                ? 'bg-blue-100 self-end ml-auto text-right'
                : 'bg-green-100 self-start mr-auto'
            }`}
          >
            {msg}
          </div>
        ))}
      </div>

      <div className="w-full">
        <div className="flex items-center border rounded-3xl shadow-md px-4 py-3 bg-white">
          <input
            type="text"
            placeholder="Ask the trading assistant something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 text-lg outline-none bg-transparent placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            className="ml-3 bg-blue-600 text-white px-5 py-2 rounded-full text-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
