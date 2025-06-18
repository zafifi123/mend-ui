export default function TradeSuggestions({ symbol }: { symbol: string }) {
    const dummyTrades = [
      { symbol: 'AAPL', recommendation: 'Buy', score: 0.91 },
      { symbol: 'MSFT', recommendation: 'Hold', score: 0.75 },
      { symbol: 'TSLA', recommendation: 'Sell', score: 0.35 },
    ];
  
    return (
      <div>
        <h2 className="text-xl font-bold mb-3">📈 Trade Suggestions</h2>
        <ul className="space-y-3">
          {dummyTrades.map((t, i) => (
            <li
              key={i}
              className="p-3 rounded border shadow-sm bg-gradient-to-r from-white to-gray-50"
            >
              <div className="font-semibold">{t.symbol}</div>
              <div className="text-sm text-gray-600">
                Recommendation: <span className="font-medium">{t.recommendation}</span>
              </div>
              <div className="text-sm text-gray-500">Confidence: {Math.round(t.score * 100)}%</div>
            </li>
          ))}
        </ul>
  
        <div className="mt-6 text-center text-gray-400 italic">
          📊 Graphs and trade performance charts coming soon!
        </div>
      </div>
    );
  }
  