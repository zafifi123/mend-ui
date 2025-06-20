import React, { useState, useEffect } from 'react';
import styles from './History.module.css';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import { getTradeHistory, getRecommendationHistory } from '../../../services/api';

// Mock Data for UI development
const mockTradeHistory = [
    { id: 1, symbol: 'AAPL', type: 'Buy', quantity: 10, price: 150.00, status: 'Completed', timestamp: '2025-07-15T10:30:00Z', pnl: 250.50 },
    { id: 2, symbol: 'GOOGL', type: 'Sell', quantity: 5, price: 2800.00, status: 'Completed', timestamp: '2025-07-14T14:00:00Z', pnl: -150.00 },
    { id: 3, symbol: 'TSLA', type: 'Buy', quantity: 20, price: 700.00, status: 'Canceled', timestamp: '2025-07-13T09:00:00Z', pnl: 0 },
];

const mockRecommendationHistory = [
    { id: 1, symbol: 'AMZN', action: 'Buy', priceAtRec: 3400.00, currentPrice: 3550.00, timestamp: '2025-07-10T11:00:00Z' },
    { id: 2, symbol: 'NFLX', action: 'Sell', priceAtRec: 550.00, currentPrice: 520.00, timestamp: '2025-07-09T16:00:00Z' },
];

const History: React.FC = () => {
    const [tradeHistory, setTradeHistory] = useState<any[]>([]);
    const [recommendationHistory, setRecommendationHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [trades, recommendations] = await Promise.all([
                    getTradeHistory(),
                    getRecommendationHistory(),
                ]);
                setTradeHistory(trades);
                setRecommendationHistory(recommendations);
            } catch (err) {
                setError('Failed to load history. Displaying mock data for now.');
                console.error(err);
                // Fallback to mock data on API error
                setTradeHistory(mockTradeHistory);
                setRecommendationHistory(mockRecommendationHistory);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getPnlClass = (pnl: number) => {
        if (pnl > 0) return styles.pnlPositive;
        if (pnl < 0) return styles.pnlNegative;
        return styles.pnlNeutral;
    };

    const calculatePotentialPnl = (rec: any) => {
        const priceDiff = rec.currentPrice - rec.priceAtRec;
        return rec.action === 'Buy' ? priceDiff : -priceDiff;
    };

    const renderTradeHistory = () => (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <span>Date</span>
                <span>Symbol</span>
                <span>Type</span>
                <span>Status</span>
                <span className={styles.rightAlign}>P/L ($)</span>
            </div>
            {tradeHistory.map(trade => (
                <div className={styles.tableRow} key={trade.id}>
                    <span>{new Date(trade.timestamp).toLocaleDateString()}</span>
                    <span>{trade.symbol}</span>
                    <span className={trade.type === 'Buy' ? styles.buy : styles.sell}>{trade.type}</span>
                    <span>{trade.status}</span>
                    <span className={`${styles.rightAlign} ${getPnlClass(trade.pnl)}`}>{trade.pnl.toFixed(2)}</span>
                </div>
            ))}
        </div>
    );

    const renderRecommendationHistory = () => (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <span>Date</span>
                <span>Symbol</span>
                <span>Recommendation</span>
                <span className={styles.rightAlign}>Potential P/L ($)</span>
            </div>
            {recommendationHistory.map(rec => {
                const potentialPnl = calculatePotentialPnl(rec);
                return (
                    <div className={styles.tableRow} key={rec.id}>
                        <span>{new Date(rec.timestamp).toLocaleDateString()}</span>
                        <span>{rec.symbol}</span>
                        <span className={rec.action === 'Buy' ? styles.buy : styles.sell}>{rec.action}</span>
                        <span className={`${styles.rightAlign} ${getPnlClass(potentialPnl)}`}>{potentialPnl.toFixed(2)}</span>
                    </div>
                );
            })}
        </div>
    );

    if (loading) {
        return <LoadingSpinner message="Loading history..." />;
    }

    return (
        <div className={styles.historyPage}>
            <section className={styles.historySection}>
                <h2 className={styles.sectionTitle}>Trade History</h2>
                {tradeHistory.length > 0 ? renderTradeHistory() : <p className={styles.placeholder}>No trade history found.</p>}
            </section>
            <section className={styles.historySection}>
                <h2 className={styles.sectionTitle}>Unaccepted Recommendations</h2>
                {recommendationHistory.length > 0 ? renderRecommendationHistory() : <p className={styles.placeholder}>No unaccepted recommendations found.</p>}
            </section>
            {error && <div className={styles.errorState}>{error}</div>}
        </div>
    );
};

export default History;