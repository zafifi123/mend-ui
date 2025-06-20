const API_BASE = 'http://localhost:8000/api';

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

// Trades
export async function getTrades() {
  const res = await fetch(`${API_BASE}/trades?user_id=123`);
  if (!res.ok) throw new Error('Failed to fetch active trades');
  return res.json();
}
export async function addTrade(trade: any) {
  const res = await fetch(`${API_BASE}/trades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...trade, user_id: 123 }),
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
export async function completeTrade(trade_id: number | string) {
  const res = await fetch(`${API_BASE}/trades/${trade_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'completed' }),
  });
  if (!res.ok) throw new Error('Failed to complete trade');
  return res.json();
}

// Complete trade and credit proceeds to balance
export async function completeTradeAndCreditBalance(trade_id: number | string) {
  const res = await fetch(`${API_BASE}/trades/complete_and_credit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trade_id, user_id: 123 }),
  });
  if (!res.ok) throw new Error('Failed to complete trade and credit balance');
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
export async function acceptRecommendation(rec_id: string | number) {
  const res = await fetch(`${API_BASE}/recommendations/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rec_id }),
  });
  if (!res.ok) throw new Error('Failed to accept recommendation');
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

export async function getTopMovers(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/market/movers`);
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

// Allocate trades (quantities)
export async function allocateTrades(allocations: { trade_id: number, quantity: number }[]) {
  const res = await fetch(`${API_BASE}/trades/allocate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: 123, allocations }),
  });
  if (!res.ok) throw new Error('Failed to allocate trades');
  return res.json();
}

// Fetch user balance
export async function getUserBalance() {
  const res = await fetch(`${API_BASE}/user/balance?user_id=123`);
  if (!res.ok) throw new Error('Failed to fetch user balance');
  return res.json();
}

// Update user balance
export async function updateUserBalance(user_id: number, new_balance: number) {
  const res = await fetch(`${API_BASE}/user/balance`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, new_balance }),
  });
  if (!res.ok) throw new Error('Failed to update user balance');
  return res.json();
}

// Ask Llama AI for allocation suggestions (use the same endpoint as chat window)
export async function suggestAllocationsWithAI(recommendations: any[], balance: number) {
  console.log('Calling AI with recommendations:', recommendations, 'and balance:', balance);
  
  const prompt = `System: You are a trading allocation AI. You must output ONLY valid JSON arrays. No other text allowed.
Available balance: $${balance}
Task: Allocate quantities to trades while keeping total cost under balance.
Format: [{"id": number, "quantity": number, "explanation": "string"}]

Rules:
1. Total cost (sum of price * quantity) < $${balance}
2. All quantities must be integers
3. Allocate to all trades if possible
4. Keep explanations under 50 chars

Trades:
${recommendations.map((rec, i) => (
  `${i + 1}. ID:${rec.id} | ${rec.symbol} | $${rec.price} | ${rec.risk_level} risk | ${rec.sector}`
)).join('\n')}

Output the allocation array now:`;

  console.log('Sending prompt to AI:', prompt);

  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt,
        stream: false,
        options: {
          num_predict: 500,
          temperature: 0.6,
          top_p: 0.8,
          top_k: 30,
          repeat_penalty: 1.2,
          stop: ['```', '\n\n', 'User:', 'Human:', 'Assistant:', 'System:']
        }
      })
    });

    if (!res.ok) {
      console.error('AI API error:', res.status, res.statusText);
      throw new Error('Failed to get AI allocation suggestion');
    }

    const data = await res.json();
    console.log('Raw AI response:', data);

    if (!data.response || !data.response.trim()) {
      console.error('Empty response from AI');
      throw new Error('Empty response from Llama');
    }

    // Clean and extract JSON from response
    let jsonStr = data.response.trim();
    
    // Remove any markdown code block markers
    jsonStr = jsonStr.replace(/```json\s*|\s*```/g, '');
    
    // Try to find JSON array in the response
    const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON array found in response:', jsonStr);
      throw new Error('Invalid AI response format - no JSON array found');
    }
    jsonStr = jsonMatch[0];

    // Validate and adjust the allocations
    try {
      const parsedResponse = JSON.parse(jsonStr);
      if (!Array.isArray(parsedResponse)) {
        throw new Error('AI response is not an array');
      }

      // First pass: validate format and calculate total cost
      let totalCost = 0;
      const allocationsWithTrades = parsedResponse.map(allocation => {
        const trade = recommendations.find(r => r.id === allocation.id);
        if (!trade) {
          throw new Error(`Trade not found for id ${allocation.id}`);
        }
        if (!Number.isInteger(allocation.quantity) || allocation.quantity < 0) {
          throw new Error(`Invalid quantity for trade ${allocation.id}: ${allocation.quantity}`);
        }
        const cost = trade.price * allocation.quantity;
        return {
          ...allocation,
          trade,
          originalQuantity: allocation.quantity,
          cost
        };
      });

      totalCost = allocationsWithTrades.reduce((sum, a) => sum + a.cost, 0);

      // If total cost exceeds balance, scale down proportionally
      if (totalCost > balance) {
        console.log(`Initial allocation exceeds balance: $${totalCost.toFixed(2)} vs $${balance.toFixed(2)}`);
        
        // Calculate scaling factor
        const scalingFactor = balance / totalCost;
        
        // Scale down and round to integers while preserving relative proportions
        let remainingBalance = balance;
        const scaledAllocations = allocationsWithTrades.map((allocation, index, array) => {
          // For the last item, use remaining balance to avoid rounding errors
          if (index === array.length - 1) {
            const maxQuantity = Math.floor(remainingBalance / allocation.trade.price);
            const quantity = Math.max(0, Math.min(allocation.originalQuantity, maxQuantity));
            return {
              id: allocation.id,
              quantity,
              explanation: `${allocation.explanation} (scaled from ${allocation.originalQuantity})`
            };
          }

          // For other items, scale proportionally
          const scaledQuantity = Math.floor(allocation.originalQuantity * scalingFactor);
          const cost = scaledQuantity * allocation.trade.price;
          remainingBalance -= cost;
          
          return {
            id: allocation.id,
            quantity: scaledQuantity,
            explanation: `${allocation.explanation} (scaled from ${allocation.originalQuantity})`
          };
        });

        // Recalculate final cost
        const finalCost = scaledAllocations.reduce((sum, a) => {
          const trade = recommendations.find(r => r.id === a.id);
          return sum + (trade ? trade.price * a.quantity : 0);
        }, 0);

        console.log('Scaled down allocations:', scaledAllocations);
        console.log(`Final cost after scaling: $${finalCost.toFixed(2)}`);

        return { message: JSON.stringify(scaledAllocations) };
      }

      // If within balance, return original allocations
      console.log('Allocations within balance:', parsedResponse);
      console.log('Total cost:', totalCost.toFixed(2));
      
      return { message: JSON.stringify(parsedResponse) };
    } catch (error) {
      console.error('AI response validation error:', error);
      throw error;
    }
  } catch (error) {
    console.error('AI suggestion error:', error);
    throw error;
  }
}

// Get market overview data
export async function getMarketOverview(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/market/overview`);
  if (!res.ok) throw new Error('Failed to fetch market overview');
  return res.json();
}

// Get user stats
export async function getUserStats(): Promise<any> {
  const res = await fetch(`${API_BASE}/user/stats?user_id=123`);
  if (!res.ok) throw new Error('Failed to fetch user stats');
  return res.json();
}
