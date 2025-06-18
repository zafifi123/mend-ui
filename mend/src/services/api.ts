const API_BASE = 'http://localhost:8000/api';

// Mock API for Mend Trading App

// --- Watchlist ---
export async function getWatchlist() {
  return [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.5, change: '+1.2%', volume: 1200000, marketCap: '2.8T', sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.8, change: '-0.8%', volume: 900000, marketCap: '800B', sector: 'Automotive' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 485.2, change: '+2.1%', volume: 1500000, marketCap: '1.2T', sector: 'Technology' },
  ];
}
export async function addToWatchlist(symbol: string) {
  return { success: true };
}
export async function removeFromWatchlist(symbol: string) {
  return { success: true };
}

// --- Trades ---
export async function getTradeHistory() {
  return [
    { id: 4, symbol: 'MSFT', action: 'BUY', price: 320.0, quantity: 8, status: 'Completed', executed_at: '2024-06-01' },
    { id: 5, symbol: 'GOOG', action: 'SELL', price: 2800.0, quantity: 1, status: 'Completed', executed_at: '2024-05-28' },
  ];
}
export async function getActiveTrades() {
  return [
    { id: 1, symbol: 'AAPL', action: 'BUY', price: 175.5, quantity: 10, status: 'Active', executed_at: '-' },
    { id: 2, symbol: 'TSLA', action: 'SELL', price: 245.8, quantity: 5, status: 'Active', executed_at: '-' },
  ];
}
export async function getPendingOrders() {
  return [
    { id: 3, symbol: 'NVDA', action: 'BUY', price: 480.0, quantity: 2, status: 'Pending', executed_at: '-' },
  ];
}
export async function addTrade(trade: any) {
  return { success: true, trade };
}

// --- Recommendations ---
export async function getRecommendations() {
  return [
    {
      id: 1,
      symbol: 'AAPL',
      name: 'Apple Inc.',
      recommendation: 'BUY',
      confidence: 85,
      price: '$175.50',
      change: '+2.3%',
      reasoning: 'Strong Q4 earnings, new product launches, and expanding services revenue.',
      risk: 'Low',
      timeframe: '3-6 months',
      sector: 'Technology',
    },
    {
      id: 2,
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      recommendation: 'HOLD',
      confidence: 72,
      price: '$245.80',
      change: '-1.2%',
      reasoning: 'Production challenges offset by strong demand and market leadership.',
      risk: 'Medium',
      timeframe: '1-3 months',
      sector: 'Technology',
    },
    {
      id: 3,
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      recommendation: 'BUY',
      confidence: 91,
      price: '$485.20',
      change: '+4.1%',
      reasoning: 'AI chip demand surge, gaming recovery, and data center growth.',
      risk: 'Medium',
      timeframe: '6-12 months',
      sector: 'Technology',
    },
    {
      id: 4,
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      recommendation: 'BUY',
      confidence: 88,
      price: '$380.15',
      change: '+1.8%',
      reasoning: 'Cloud services growth, AI integration, and strong enterprise adoption.',
      risk: 'Low',
      timeframe: '3-6 months',
      sector: 'Technology',
    },
    {
      id: 5,
      symbol: 'JNJ',
      name: 'Johnson & Johnson',
      recommendation: 'HOLD',
      confidence: 65,
      price: '$160.00',
      change: '+0.5%',
      reasoning: 'Stable healthcare demand and strong dividend history.',
      risk: 'Low',
      timeframe: '6-12 months',
      sector: 'Healthcare',
    },
  ];
}
export async function addRecommendationToWatchlist(symbol: string) {
  return { success: true };
}

// --- Market Insights ---
export async function getMarketInsights() {
  return {
    sentiment: 'Bullish',
    topSectors: ['Technology', 'Healthcare'],
    volatilityAlert: 'Increased volatility expected this week due to earnings season and Fed announcements.',
  };
}
export async function getTrendingStocks() {
  return [
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOG', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  ];
}
export async function getTopMovers() {
  return [
    { symbol: 'AAPL', name: 'Apple Inc.', change: '+3.2%' },
    { symbol: 'TSLA', name: 'Tesla Inc.', change: '-2.1%' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', change: '+4.5%' },
  ];
}

// --- News ---
export async function fetchNews(symbol: string) {
  return [
    { title: `Latest news for ${symbol} 1`, url: 'https://news.example.com/1' },
    { title: `Latest news for ${symbol} 2`, url: 'https://news.example.com/2' },
    { title: `Latest news for ${symbol} 3`, url: 'https://news.example.com/3' },
  ];
}

// --- Trade Suggestions ---
export async function fetchTradeSuggestions(symbol: string) {
  return [
    { symbol: 'AAPL', recommendation: 'Buy', score: 0.91 },
    { symbol: 'MSFT', recommendation: 'Hold', score: 0.75 },
    { symbol: 'TSLA', recommendation: 'Sell', score: 0.35 },
  ];
}

// --- Chat ---
export async function sendChatMessage(message: string) {
  return { message: `Mock AI response to: ${message}` };
}
