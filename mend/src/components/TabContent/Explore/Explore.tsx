import React from 'react';
import styles from './Explore.module.css';

export const Explore: React.FC = () => {
  return (
    <div className={styles.explorePage}>
      <div className={styles.welcomeCard}>
        <h1 className={styles.welcomeTitle}>Welcome to Your Trading Dashboard</h1>
        <p className={styles.welcomeSubtitle}>
          Discover powerful insights, track your portfolio, and get AI-powered recommendations to enhance your trading strategy.
        </p>
      </div>

      <div className={styles.featureGrid}>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>🔍</span>
          <h3 className={styles.featureTitle}>Market Analysis</h3>
          <p className={styles.featureDescription}>
            Get real-time market insights, trend analysis, and comprehensive data visualization to make informed trading decisions.
          </p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>💡</span>
          <h3 className={styles.featureTitle}>AI Recommendations</h3>
          <p className={styles.featureDescription}>
            Receive personalized trading suggestions powered by advanced AI algorithms and market sentiment analysis.
          </p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>⭐</span>
          <h3 className={styles.featureTitle}>Watchlist Management</h3>
          <p className={styles.featureDescription}>
            Track your favorite stocks, set alerts, and monitor performance with our intuitive watchlist tools.
          </p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>📊</span>
          <h3 className={styles.featureTitle}>Portfolio Tracking</h3>
          <p className={styles.featureDescription}>
            Monitor your trades, track performance metrics, and analyze your portfolio's growth over time.
          </p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>🤖</span>
          <h3 className={styles.featureTitle}>AI Assistant</h3>
          <p className={styles.featureDescription}>
            Chat with our AI trading assistant for instant answers, market analysis, and trading advice.
          </p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>📈</span>
          <h3 className={styles.featureTitle}>Real-time Data</h3>
          <p className={styles.featureDescription}>
            Access live market data, price feeds, and real-time notifications to stay ahead of market movements.
          </p>
        </div>
      </div>

      <div className={styles.quickStats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>$2.4M</div>
          <div className={styles.statLabel}>Portfolio Value</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>+12.5%</div>
          <div className={styles.statLabel}>This Month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>24</div>
          <div className={styles.statLabel}>Active Positions</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>8.9</div>
          <div className={styles.statLabel}>Risk Score</div>
        </div>
      </div>
    </div>
  );
}; 