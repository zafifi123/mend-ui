import React, { useState, useEffect, useCallback } from 'react';
import styles from './Explore.module.css';
import { FaChartLine, FaChartBar, FaRobot, FaRegBell, FaSearch, FaExternalLinkAlt, FaLightbulb, FaExchangeAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Ensure these are imported
import { getMarketOverview, getTopMovers, getRecommendations, getUserStats } from '../../../services/api';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';

// --- Interfaces ---
interface MarketData {
    index: string;
    value: number;
    change: number;
    changePercent: number;
}

interface TopMover {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
}

interface Recommendation {
    symbol: string;
    action: 'Buy' | 'Sell' | 'Hold';
    confidence: number;
    risk_level: string;
    reasoning: string;
}

interface UserStats {
    portfolio_value: number;
    portfolio_change: number;
    portfolio_change_percent: number;
    active_positions: number;
    unique_symbols: number;
    win_rate: number;
    risk_score: number;
    risk_level: string;
}

// --- Mock Data (for development/demo purposes) ---
const mockMarketData: MarketData[] = [
    { index: 'DOW JONES', value: 38852.27, change: -31.21, changePercent: -0.08 },
    { index: 'S&P 500', value: 5352.96, change: -1.04, changePercent: -0.02 },
    { index: 'NASDAQ', value: 17173.12, change: 15.11, changePercent: 0.09 },
    { index: 'RUSSELL 2000', value: 2035.75, change: 8.58, changePercent: 0.42 },
];

const mockTopMovers: TopMover[] = [
    { symbol: 'GME', name: 'GameStop Corp.', price: 28.50, change: 4.85, changePercent: 20.55, volume: 125000000 },
    { symbol: 'AMC', name: 'AMC Entertainment', price: 5.15, change: 0.60, changePercent: 13.20, volume: 98000000 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 1210.50, change: -12.30, changePercent: -1.01, volume: 45000000 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 177.50, change: 2.10, changePercent: 1.20, volume: 89000000 },
];

const mockRecommendations: Recommendation[] = [
    { symbol: 'GOOGL', action: 'Buy', confidence: 0.92, risk_level: 'Low', reasoning: 'Strong earnings growth and expanding cloud services market.' },
    { symbol: 'AMZN', action: 'Hold', confidence: 0.75, risk_level: 'Moderate', reasoning: 'Steady e-commerce growth but increasing competition.' },
    { symbol: 'MSFT', action: 'Buy', confidence: 0.88, risk_level: 'Low', reasoning: 'Robust cloud computing segment and strategic AI investments.' },
    { symbol: 'NFLX', action: 'Sell', confidence: 0.60, risk_level: 'High', reasoning: 'Subscriber growth concerns and increased content spending.' },
    { symbol: 'AAPL', action: 'Hold', confidence: 0.80, risk_level: 'Moderate', reasoning: 'Consistent performance but faces regulatory scrutiny.' },
    { symbol: 'FB', action: 'Hold', confidence: 0.70, risk_level: 'Moderate', reasoning: 'Social media dominance but regulatory headwinds.' },
    { symbol: 'BABA', action: 'Buy', confidence: 0.85, risk_level: 'High', reasoning: 'E-commerce and cloud growth in emerging markets.' },
];

const mockUserStats: UserStats = {
    portfolio_value: 125345.67,
    portfolio_change: 2345.12,
    portfolio_change_percent: 1.9,
    active_positions: 12,
    unique_symbols: 8,
    win_rate: 0.68,
    risk_score: 6.5,
    risk_level: 'Moderate',
};

// --- Explore Component ---
export const Explore: React.FC = () => {
    const [marketData, setMarketData] = useState<MarketData[]>(mockMarketData);
    const [topMovers, setTopMovers] = useState<TopMover[]>(mockTopMovers);
    const [aiRecommendations, setAiRecommendations] = useState<Recommendation[]>(mockRecommendations);
    const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
    const [loading, setLoading] = useState({
        market: false,
        movers: false,
        recommendations: true,
        stats: false
    });
    const [error, setError] = useState({
        market: '',
        movers: '',
        recommendations: '',
        stats: ''
    });

    // State for AI Insights carousel
    const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

    const handleQuickAction = useCallback((actionType: string) => {
        console.log(`Performing quick action: ${actionType}`);
        alert(`Navigating to ${actionType} feature! (Demo action)`);
    }, []);

    // Carousel navigation handlers
    const handlePrevInsight = useCallback(() => {
        setCurrentInsightIndex((prevIndex) =>
            prevIndex === 0 ? aiRecommendations.length - 1 : prevIndex - 1
        );
    }, [aiRecommendations.length]);

    const handleNextInsight = useCallback(() => {
        setCurrentInsightIndex((prevIndex) =>
            prevIndex === aiRecommendations.length - 1 ? 0 : prevIndex + 1
        );
    }, [aiRecommendations.length]);

    useEffect(() => {
        setLoading(prev => ({ ...prev, recommendations: true }));
        setError(prev => ({ ...prev, recommendations: '' }));
        getRecommendations()
            .then(data => {
                setAiRecommendations(data);
                setCurrentInsightIndex(0);
            })
            .catch(error => {
                setError(prev => ({ ...prev, recommendations: 'Failed to load AI recommendations.' }));
                console.error("Error fetching recommendations:", error)
            })
            .finally(() => setLoading(prev => ({ ...prev, recommendations: false })));

        setLoading(prev => ({ ...prev, market: true }));
        setError(prev => ({ ...prev, market: '' }));
        getMarketOverview()
            .then(setMarketData)
            .catch(error => {
                setError(prev => ({ ...prev, market: 'Failed to load market overview.' }));
                console.error("Error fetching market overview:", error)
            })
            .finally(() => setLoading(prev => ({ ...prev, market: false })));

        setLoading(prev => ({ ...prev, movers: true }));
        setError(prev => ({ ...prev, movers: '' }));
        getTopMovers()
            .then(setTopMovers)
            .catch(error => {
                setError(prev => ({ ...prev, movers: 'Failed to load top movers.' }));
                console.error("Error fetching top movers:", error)
            })
            .finally(() => setLoading(prev => ({ ...prev, movers: false })));

        setLoading(prev => ({ ...prev, stats: true }));
        setError(prev => ({ ...prev, stats: '' }));
        getUserStats()
            .then(setUserStats)
            .catch(error => {
                setError(prev => ({ ...prev, stats: 'Failed to load user stats.' }));
                console.error("Error fetching user stats:", error)
            })
            .finally(() => setLoading(prev => ({ ...prev, stats: false })));
    }, []);

    const currentInsight = aiRecommendations[currentInsightIndex];

    return (
        <div className={styles.explorePage}>

            {/* Quick Actions - occupies 6 of 12 columns */}
            <section className={styles.quickActions} style={{ gridColumn: 'span 6' }}>
                <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}><FaLightbulb size={20} /></span>
                    Quick Actions
                </h2>
                <div className={styles.actionsGrid}>
                    <div className={styles.actionCard} onClick={() => handleQuickAction('Market Research')}>
                        <span className={styles.actionIcon}><FaSearch size={24} /></span>
                        <div className={styles.actionText}>
                            <h3>Market Research</h3>
                            <p>Analyze trends & get detailed insights</p>
                        </div>
                        <button className={styles.actionButton}>Explore</button>
                    </div>
                    <div className={styles.actionCard} onClick={() => handleQuickAction('AI Assistant')}>
                        <span className={styles.actionIcon}><FaRobot size={24} /></span>
                        <div className={styles.actionText}>
                            <h3>AI Assistant</h3>
                            <p>Personalized trading recommendations</p>
                        </div>
                        <button className={styles.actionButton}>Ask AI</button>
                    </div>
                    <div className={styles.actionCard} onClick={() => handleQuickAction('New Trade')}>
                        <span className={styles.actionIcon}><FaExchangeAlt size={24} /></span>
                        <div className={styles.actionText}>
                            <h3>New Trade</h3>
                            <p>Quickly open a new position</p>
                        </div>
                        <button className={styles.actionButton}>Trade Now</button>
                    </div>
                </div>
            </section>

            {/* AI-Powered Insights (Carousel Deck) - occupies 6 of 12 columns */}
            <section className={styles.aiInsights} style={{ gridColumn: 'span 6' }}>
                <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}><FaRobot size={20} /></span>
                    AI-Powered Insights
                </h2>
                <div className={styles.insightsCarouselContainer}>
                    {loading.recommendations ? (
                        <LoadingSpinner message="Loading AI insights..." />
                    ) : error.recommendations ? (
                        <div className={styles.errorState}>{error.recommendations}</div>
                    ) : aiRecommendations.length > 0 ? (
                        <>
                            {/* Previous Button - Now correctly includes the icon */}
                            <button
                                className={`${styles.carouselNavButton} ${styles.prev}`}
                                onClick={handlePrevInsight}
                                disabled={aiRecommendations.length <= 1}
                            >
                                <FaChevronLeft />
                            </button>

                            <div className={styles.insightCard}>
                                <div className={styles.insightHeader}>
                                    <div className={styles.insightSymbol}>{currentInsight?.symbol}</div>
                                    <div className={`${styles.insightAction} ${styles[currentInsight?.action.toLowerCase() || '']}`}>
                                        {currentInsight?.action === 'Buy' && '▲ '}
                                        {currentInsight?.action === 'Sell' && '▼ '}
                                        {currentInsight?.action === 'Hold' && '● '}
                                        {currentInsight?.action}
                                    </div>
                                </div>
                                <div className={styles.insightBody}>
                                    <div className={styles.insightMetrics}>
                                        <div className={styles.metric}>
                                            <span className={styles.metricLabel}>Confidence</span>
                                            <span className={styles.metricValue}>{Math.round((currentInsight?.confidence || 0) * 100)}%</span>
                                        </div>
                                        <div className={styles.metric}>
                                            <span className={styles.metricLabel}>Risk</span>
                                            <span className={styles.metricValue}>{currentInsight?.risk_level}</span>
                                        </div>
                                    </div>
                                    <p className={styles.insightReasoning}>{currentInsight?.reasoning}</p>
                                </div>
                                <a href={`/analysis/${currentInsight?.symbol}`} className={styles.insightLink} onClick={(e) => { e.preventDefault(); handleQuickAction(`View Analysis for ${currentInsight?.symbol}`); }}>
                                    View Full Analysis <FaExternalLinkAlt size={12} />
                                </a>
                            </div>

                            {/* Next Button - Now correctly includes the icon */}
                            <button
                                className={`${styles.carouselNavButton} ${styles.next}`}
                                onClick={handleNextInsight}
                                disabled={aiRecommendations.length <= 1}
                            >
                                <FaChevronRight />
                            </button>
                            <div className={styles.carouselDots}>
                                {aiRecommendations.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`${styles.dot} ${index === currentInsightIndex ? styles.activeDot : ''}`}
                                        onClick={() => setCurrentInsightIndex(index)}
                                    ></span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={styles.noDataState}>No AI insights available at this time.</div>
                    )}
                </div>
            </section>

            {/* Market Overview - occupies 6 of 12 columns */}
            <section className={styles.marketOverview} style={{ gridColumn: 'span 6' }}>
                <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}><FaChartLine size={20} /></span>
                    Market Overview
                </h2>
                <div className={styles.marketGrid}>
                    {loading.market ? (
                        <LoadingSpinner message="Loading market data..." />
                    ) : error.market ? (
                        <div className={styles.errorState}>{error.market}</div>
                    ) : (
                        marketData.map(index => (
                            <div key={index.index} className={styles.marketCard}>
                                <div className={styles.marketIndex}>{index.index}</div>
                                <div className={styles.marketValue}>{index.value.toLocaleString()}</div>
                                <div className={`${styles.marketChange} ${index.change >= 0 ? styles.positive : styles.negative}`}>
                                    {index.change >= 0 ? '▲' : '▼'} {Math.abs(index.change).toLocaleString()} ({index.changePercent.toFixed(2)}%)
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Top Movers - occupies 6 of 12 columns */}
            <section className={styles.topMovers} style={{ gridColumn: 'span 6' }}>
                <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}><FaChartBar size={20} /></span>
                    Top Movers
                </h2>
                <div className={styles.moversGrid}>
                    {loading.movers ? (
                        <LoadingSpinner message="Loading top movers..." />
                    ) : error.movers ? (
                        <div className={styles.errorState}>{error.movers}</div>
                    ) : (
                        topMovers.map(mover => (
                            <div key={mover.symbol} className={styles.moverCard}>
                                <div className={styles.moverHeader}>
                                    <div className={styles.moverSymbol}>{mover.symbol}</div>
                                    <div className={styles.moverName}>{mover.name}</div>
                                </div>
                                <div className={styles.moverStats}>
                                    <div className={styles.moverPrice}>${mover.price.toFixed(2)}</div>
                                    <div className={`${styles.moverChange} ${mover.change >= 0 ? styles.positive : styles.negative}`}>
                                        {mover.change >= 0 ? '▲' : '▼'} {Math.abs(mover.changePercent).toFixed(2)}%
                                    </div>
                                </div>
                                <div className={styles.moverVolume}>
                                    Vol: {(mover.volume / 1000000).toFixed(1)}M
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Your Trading Activity - occupies all 12 columns */}
            <section className={styles.tradingActivity} style={{ gridColumn: 'span 12' }}>
                <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}><FaRegBell size={20} /></span>
                    Your Trading Activity
                </h2>
                {loading.stats ? (
                    <LoadingSpinner message="Loading your stats..." />
                ) : error.stats ? (
                    <div className={styles.errorState}>{error.stats}</div>
                ) : userStats && (
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Portfolio Value</div>
                            <div className={styles.statValue}>${userStats.portfolio_value.toLocaleString()}</div>
                            <div className={`${styles.statChange} ${userStats.portfolio_change >= 0 ? styles.positive : styles.negative}`}>
                                {userStats.portfolio_change >= 0 ? '▲' : '▼'} {Math.abs(userStats.portfolio_change_percent).toFixed(2)}%
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Active Positions</div>
                            <div className={styles.statValue}>{userStats.active_positions}</div>
                            <div className={styles.statSubtext}>Across {userStats.unique_symbols} symbols</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Win Rate</div>
                            <div className={styles.statValue}>{(userStats.win_rate * 100).toFixed(1)}%</div>
                            <div className={styles.statSubtext}>Last 30 days</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Risk Score</div>
                            <div className={styles.statValue}>{userStats.risk_score.toFixed(1)}</div>
                            <div className={styles.statSubtext}>{userStats.risk_level} Risk Profile</div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};