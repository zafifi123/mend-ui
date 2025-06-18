const API_BASE = 'http://localhost:8000/api';

export async function fetchNews(symbol: string) {
    const response = await fetch(`${API_BASE}/news/${symbol}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }
  

export async function fetchTradeSuggestions(symbol: string) {
  const res = await fetch(`${API_BASE}/trades/${symbol}`);
  return res.json();
}

export async function sendChatMessage(message: string) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  return res.json();
}
