const API_BASE = 'http://localhost:8000/api';

// Mock API for Mend Trading App

// --- Watchlist ---
export async function getWatchlist() {
  const res = await fetch(`${API_BASE}/watchlist`);
  if (!res.ok) throw new Error('Failed to fetch watchlist');
  return res.json();
}
export async function addToWatchlist(symbol: string) {
  const res = await fetch(`${API_BASE}/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol }),
  });
  if (!res.ok) throw new Error('Failed to add to watchlist');
  return res.json();
}
export async function removeFromWatchlist(symbol: string) {
  const res = await fetch(`${API_BASE}/watchlist/${symbol}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove from watchlist');
  return res.json();
}

// --- Trades ---
export async function getTradeHistory() {
  const res = await fetch(`${API_BASE}/trades/history`);
  if (!res.ok) throw new Error('Failed to fetch trade history');
  return res.json();
}
export async function getActiveTrades() {
  const res = await fetch(`${API_BASE}/trades/active`);
  if (!res.ok) throw new Error('Failed to fetch active trades');
  return res.json();
}
export async function getPendingOrders() {
  const res = await fetch(`${API_BASE}/trades/pending`);
  if (!res.ok) throw new Error('Failed to fetch pending orders');
  return res.json();
}
export async function addTrade(trade: any) {
  const res = await fetch(`${API_BASE}/trades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trade),
  });
  if (!res.ok) throw new Error('Failed to add trade');
  return res.json();
}
export async function updateTrade(trade_id: number, trade: any) {
  const res = await fetch(`${API_BASE}/trades/${trade_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trade),
  });
  if (!res.ok) throw new Error('Failed to update trade');
  return res.json();
}
export async function deleteTrade(trade_id: number) {
  const res = await fetch(`${API_BASE}/trades/${trade_id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete trade');
  return res.json();
}

// --- Recommendations ---
export async function getRecommendations() {
  const res = await fetch(`${API_BASE}/recommendations`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}
export async function addRecommendationToWatchlist(symbol: string) {
  const res = await fetch(`${API_BASE}/recommendations/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol }),
  });
  if (!res.ok) throw new Error('Failed to add recommendation to watchlist');
  return res.json();
}

// --- Market Insights ---
export async function getMarketInsights() {
  const res = await fetch(`${API_BASE}/insights`);
  if (!res.ok) throw new Error('Failed to fetch market insights');
  return res.json();
}

// --- Trending/Movers ---
export async function getTrendingStocks() {
  const res = await fetch(`${API_BASE}/trending`);
  if (!res.ok) throw new Error('Failed to fetch trending stocks');
  return res.json();
}
export async function getTopMovers() {
  const res = await fetch(`${API_BASE}/movers`);
  if (!res.ok) throw new Error('Failed to fetch top movers');
  return res.json();
}

// --- News ---
export async function fetchNews(symbol: string) {
  const res = await fetch(`${API_BASE}/news/${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}

// --- Trade Suggestions ---
export async function fetchTradeSuggestions(symbol: string) {
  const res = await fetch(`${API_BASE}/trades/suggestions/${symbol}`);
  if (!res.ok) throw new Error('Failed to fetch trade suggestions');
  return res.json();
}

// --- Chat (Ollama direct) ---
export async function sendChatMessage(message: string, stream: boolean = false, onChunk?: (chunk: string) => void) {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      prompt: message,
      stream: stream,
      // Performance optimizations for faster responses
      options: {
        num_predict: 150,        // Limit response to ~150 tokens (faster)
        temperature: 0.7,        // Slightly lower temperature for more focused responses
        top_p: 0.9,             // Nucleus sampling for better quality/speed balance
        top_k: 40,              // Top-k sampling for faster generation
        repeat_penalty: 1.1,    // Prevent repetitive text
        stop: ["\n\n", "User:", "Human:", "Assistant:"] // Stop at natural breaks
      }
    })
  });
  
  if (!res.ok) throw new Error('Failed to get response from Ollama');
  
  if (stream && onChunk) {
    // Handle streaming response
    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response body');
    
    const decoder = new TextDecoder();
    let fullResponse = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              fullResponse += data.response;
              onChunk(data.response);
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
    
    // Validate that we got a meaningful response
    if (!fullResponse.trim()) {
      throw new Error('Empty response from Ollama');
    }
    
    return { message: fullResponse };
  } else {
    // Handle non-streaming response
    const data = await res.json();
    
    // Validate the response
    if (!data.response || !data.response.trim()) {
      throw new Error('Empty response from Ollama');
    }
    
    return { message: data.response };
  }
}
