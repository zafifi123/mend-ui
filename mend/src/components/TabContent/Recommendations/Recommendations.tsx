import React, { useState } from 'react';
import styles from './Recommendations.module.css';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

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

const riskLevels = ['All Levels', 'Low', 'Medium', 'High'];
const timeframes = ['All Timeframes', '1-3 months', '3-6 months', '6-12 months'];
const sectors = ['All Sectors', 'Technology', 'Healthcare', 'Finance', 'Energy'];

export const Recommendations: React.FC = () => {
  const [risk, setRisk] = useState('All Levels');
  const [timeframe, setTimeframe] = useState('All Timeframes');
  const [sector, setSector] = useState('All Sectors');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRec, setSelectedRec] = useState<any>(null);

  const filtered = mockRecommendations.filter(rec =>
    (risk === 'All Levels' || rec.risk === risk) &&
    (timeframe === 'All Timeframes' || rec.timeframe === timeframe) &&
    (sector === 'All Sectors' || rec.sector === sector)
  );

  const handleView = (rec: any) => {
    setSelectedRec(rec);
    setModalOpen(true);
  };

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
          <select className={styles.filterSelect} value={risk} onChange={e => setRisk(e.target.value)}>
            {riskLevels.map(lvl => <option key={lvl}>{lvl}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Timeframe</label>
          <select className={styles.filterSelect} value={timeframe} onChange={e => setTimeframe(e.target.value)}>
            {timeframes.map(tf => <option key={tf}>{tf}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Sector</label>
          <select className={styles.filterSelect} value={sector} onChange={e => setSector(e.target.value)}>
            {sectors.map(sec => <option key={sec}>{sec}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.recommendationsGrid}>
        {filtered.map((rec) => (
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
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Sector:</span>
                <span className={styles.timeframe}>{rec.sector}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Button style={{ marginRight: 8 }}>Add to Watchlist</Button>
              <Button onClick={() => handleView(rec)} style={{ background: '#3182ce' }}>View Details</Button>
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Recommendation Details">
        {selectedRec && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><b>Symbol:</b> {selectedRec.symbol}</div>
            <div><b>Name:</b> {selectedRec.name}</div>
            <div><b>Recommendation:</b> {selectedRec.recommendation}</div>
            <div><b>Confidence:</b> {selectedRec.confidence}%</div>
            <div><b>Price:</b> {selectedRec.price}</div>
            <div><b>Change:</b> {selectedRec.change}</div>
            <div><b>Risk:</b> {selectedRec.risk}</div>
            <div><b>Timeframe:</b> {selectedRec.timeframe}</div>
            <div><b>Sector:</b> {selectedRec.sector}</div>
            <div><b>AI Reasoning:</b> {selectedRec.reasoning}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}; 