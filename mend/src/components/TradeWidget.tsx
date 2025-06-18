import React, { useEffect, useState } from "react";

interface Trade {
  id: string;
  symbol: string;
  action: "BUY" | "SELL";
  price: number;
  explanation: string;
}

export default function TradeWidget() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTrades() {
      setLoading(true);
      try {
        const res = await fetch("/api/trades");
        const data = await res.json();
        setTrades(data);
      } catch (error) {
        console.error("Failed to fetch trades", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrades();
  }, []);

  if (loading) return <div className="p-4">Loading trades...</div>;

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white rounded shadow p-4">
      <h3 className="font-bold text-lg mb-2">Recommended Trades</h3>
      {trades.length === 0 ? (
        <p>No trades available.</p>
      ) : (
        <ul className="space-y-3">
          {trades.map((trade) => (
            <li key={trade.id} className="border rounded p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{trade.symbol}</span>
                <span
                  className={`font-bold ${
                    trade.action === "BUY" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trade.action} @ ${trade.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{trade.explanation}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
