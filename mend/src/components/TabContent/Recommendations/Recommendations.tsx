import React from 'react';
import styles from './Recommendations.module.css';

const mockRecommendations = [
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
    timeframe: '3-6 months'
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
    timeframe: '1-3 months'
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
    timeframe: '6-12 months'
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
    timeframe: '3-6 months'
  }
];

export const Recommendations: React.FC = () => {
  return (
    <div className={styles.recommendationsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Trading Recommendations</h1>
        <p className={styles.subtitle}>
          Personalized investment suggestions powered by advanced AI analysis and market sentiment
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Risk Level</label>
          <select className={styles.filterSelect}>
            <option>All Levels</option>
            <option>Low Risk</option>
            <option>Medium Risk</option>
            <option>High Risk</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Timeframe</label>
          <select className={styles.filterSelect}>
            <option>All Timeframes</option>
            <option>Short Term (1-3 months)</option>
            <option>Medium Term (3-6 months)</option>
            <option>Long Term (6+ months)</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Sector</label>
          <select className={styles.filterSelect}>
            <option>All Sectors</option>
            <option>Technology</option>
            <option>Healthcare</option>
            <option>Finance</option>
            <option>Energy</option>
          </select>
        </div>
      </div>

      <div className={styles.recommendationsGrid}>
        {mockRecommendations.map((rec) => (
          <div key={rec.id} className={styles.recommendationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.stockInfo}>
                <div className={styles.symbol}>{rec.symbol}</div>
                <div className={styles.name}>{rec.name}</div>
              </div>
              <div className={`${styles.recommendation} ${styles[rec.recommendation.toLowerCase()]}`}>
                {rec.recommendation}
              </div>
            </div>

            <div className={styles.priceInfo}>
              <div className={styles.currentPrice}>{rec.price}</div>
              <div className={`${styles.change} ${rec.change.startsWith('+') ? styles.positive : styles.negative}`}>
                {rec.change}
              </div>
            </div>

            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Confidence</span>
                <div className={styles.confidenceBar}>
                  <div 
                    className={styles.confidenceFill} 
                    style={{ width: `${rec.confidence}%` }}
                  ></div>
                </div>
                <span className={styles.metricValue}>{rec.confidence}%</span>
              </div>
            </div>

            <div className={styles.reasoning}>
              <h4>AI Analysis</h4>
              <p>{rec.reasoning}</p>
            </div>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Risk:</span>
                <span className={`${styles.risk} ${styles[rec.risk.toLowerCase()]}`}>{rec.risk}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Timeframe:</span>
                <span className={styles.timeframe}>{rec.timeframe}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.actionButton}>Add to Watchlist</button>
              <button className={`${styles.actionButton} ${styles.primary}`}>View Details</button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.insights}>
        <h2>Market Insights</h2>
        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <span className={styles.insightIcon}>📈</span>
            <h3>Market Sentiment</h3>
            <p>Overall market sentiment is bullish with 68% of stocks showing positive momentum.</p>
          </div>
          <div className={styles.insightCard}>
            <span className={styles.insightIcon}>🎯</span>
            <h3>Top Sectors</h3>
            <p>Technology and Healthcare sectors are leading with the highest AI confidence scores.</p>
          </div>
          <div className={styles.insightCard}>
            <span className={styles.insightIcon}>⚡</span>
            <h3>Volatility Alert</h3>
            <p>Increased volatility expected this week due to earnings season and Fed announcements.</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 