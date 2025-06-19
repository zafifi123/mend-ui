import React, { useState, useEffect } from 'react';
import styles from './Recommendations.module.css';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import { getRecommendations, addRecommendationToWatchlist, addTrade, acceptRecommendation } from '../../../services/api';

export const Recommendations: React.FC = () => {
  const [risk, setRisk] = useState('All Levels');
  const [timeframe, setTimeframe] = useState('All Timeframes');
  const [sector, setSector] = useState('All Sectors');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRec, setSelectedRec] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [showAcceptAnim, setShowAcceptAnim] = useState(false);
  const [acceptMsg, setAcceptMsg] = useState('');
  const [confettiPieces, setConfettiPieces] = useState<any[]>([]);

  // Dynamically generate filter options from data
  const riskLevels = ['All Levels', ...Array.from(new Set(recommendations.map(r => r.risk_level).filter(Boolean)))];
  const timeframes = ['All Timeframes', ...Array.from(new Set(recommendations.map(r => r.timeframe).filter(Boolean)))];
  const sectors = ['All Sectors', ...Array.from(new Set(recommendations.map(r => r.sector).filter(Boolean)))];

  useEffect(() => {
    setLoading(true);
    setError(null);
    getRecommendations()
      .then(setRecommendations)
      .catch(() => setError('Failed to load recommendations'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log('Recommendations:', recommendations);
  }, [recommendations]);

  const filtered = recommendations.filter(rec =>
    (risk === 'All Levels' || rec.risk_level === risk) &&
    (timeframe === 'All Timeframes' || rec.timeframe === timeframe) &&
    (sector === 'All Sectors' || rec.sector === sector)
  );

  const handleView = (rec: any) => {
    setSelectedRec(rec);
    setModalOpen(true);
  };

  const handleAddToWatchlist = async (symbol: string) => {
    setAdding(symbol);
    try {
      await addRecommendationToWatchlist(symbol);
    } catch {
      setError('Failed to add to watchlist');
    } finally {
      setAdding(null);
    }
  };

  const handleAccept = async (rec: any) => {
    setAccepting(rec.symbol);
    setShowAcceptAnim(true);
    setAcceptMsg('');
    setConfettiPieces(generateConfetti());
    try {
      await acceptRecommendation(rec.id);
      setAcceptMsg('Trade accepted and added!');
      setRecommendations(prev => prev.filter(r => (r.id ?? r.symbol) !== (rec.id ?? rec.symbol)));
    } catch {
      setAcceptMsg('Failed to accept trade.');
    } finally {
      setTimeout(() => {
        setShowAcceptAnim(false);
        setAccepting(null);
        setAcceptMsg('');
        setConfettiPieces([]);
      }, 2000);
    }
  };

  // Confetti generator
  function generateConfetti() {
    const colors = ['#22c55e', '#10b981', '#f59e42', '#3b82f6', '#f43f5e', '#fbbf24'];
    return Array.from({ length: 32 }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: Math.random() * 360,
      key: i + '-' + Date.now(),
    }));
  }

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

      {loading ? (
        <div className={styles.placeholder}><p>Loading...</p></div>
      ) : error ? (
        <div className={styles.placeholder}><p>{error}</p></div>
      ) : (
        <div className={styles.recommendationsGrid}>
          {filtered.map((rec) => (
            <div key={rec.symbol + rec.created_at} className={styles.recommendationCard}>
              <div className={styles.cardHeader}>
                <div className={styles.stockInfo}>
                  <div className={styles.symbol}>{rec.symbol}</div>
                  <div className={styles.name}>{rec.name}</div>
                </div>
                <div className={`${styles.recommendation} ${styles[rec.action?.toLowerCase() || '']}`}>
                  {rec.action}
                </div>
              </div>

              <div className={styles.priceInfo}>
                <div className={styles.currentPrice}>{rec.price_target}</div>
                {/* No change field in new API, so omit or replace as needed */}
              </div>

              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Confidence</span>
                  <div className={styles.confidenceBar}>
                    <div 
                      className={styles.confidenceFill} 
                      style={{ width: `${Math.round((rec.confidence || 0) * 100)}%` }}
                    ></div>
                  </div>
                  <span className={styles.metricValue}>{Math.round((rec.confidence || 0) * 100)}%</span>
                </div>
              </div>

              <div className={styles.reasoning}>
                <h4>AI Analysis</h4>
                <p>{rec.reasoning}</p>
              </div>

              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Risk:</span>
                  <span className={`${styles.risk} ${styles[rec.risk_level?.toLowerCase() || '']}`}>{rec.risk_level}</span>
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
                <Button style={{ marginRight: 8 }} onClick={() => handleAddToWatchlist(rec.symbol)} disabled={adding === rec.symbol}>
                  Add to Watchlist
                </Button>
                <Button onClick={() => handleView(rec)} style={{ background: '#3182ce' }}>View Details</Button>
                <Button onClick={() => handleAccept(rec)} style={{ background: '#10B981' }} disabled={accepting === rec.symbol}>Accept</Button>
              </div>
            </div>
          ))}
        </div>
      )}

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
            <div><b>Action:</b> {selectedRec.action}</div>
            <div><b>Confidence:</b> {Math.round((selectedRec.confidence || 0) * 100)}%</div>
            <div><b>ML Confidence:</b> {Math.round((selectedRec.ml_confidence || 0) * 100)}%</div>
            <div><b>Llama Confidence:</b> {Math.round((selectedRec.llama_confidence || 0) * 100)}%</div>
            <div><b>Consensus Score:</b> {selectedRec.consensus_score}</div>
            <div><b>Price Target:</b> {selectedRec.price_target}</div>
            <div><b>Stop Loss:</b> {selectedRec.stop_loss}</div>
            <div><b>Risk Level:</b> {selectedRec.risk_level}</div>
            <div><b>Timeframe:</b> {selectedRec.timeframe}</div>
            <div><b>Sector:</b> {selectedRec.sector}</div>
            <div><b>Created At:</b> {selectedRec.created_at}</div>
            <div><b>AI Reasoning:</b> {selectedRec.reasoning}</div>
          </div>
        )}
      </Modal>
      {/* Accept animation overlay */}
      {showAcceptAnim && (
        <div className={styles.acceptOverlay}>
          <div className={styles.pulseGlow}></div>
          <div className={styles.acceptAnimBox}>
            <svg className={styles.checkmarkDraw} viewBox="0 0 80 80">
              <path d="M20 45 L35 60 L60 25" />
            </svg>
            <div className={styles.checkmarkAnim}>✔</div>
            <div className={styles.acceptMsg}>{acceptMsg || 'Accepted!'}</div>
          </div>
          <div className={styles.confetti}>
            {confettiPieces.map(piece => (
              <div
                key={piece.key}
                className={styles.confettiPiece}
                style={{
                  left: `${piece.left}%`,
                  background: piece.color,
                  animationDelay: `${piece.delay}s`,
                  transform: `rotate(${piece.rotate}deg)`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 