import React from 'react';
import styles from './TradeStatus.module.css';

export const TradeStatus: React.FC = () => {
  return (
    <div className={styles.tradeStatus}>
      <h2>Trade Status</h2>
      <div className={styles.statusGrid}>
        <div className={styles.statusCard}>
          <h3>Active Trades</h3>
          <div className={styles.value}>0</div>
        </div>
        <div className={styles.statusCard}>
          <h3>Pending Orders</h3>
          <div className={styles.value}>0</div>
        </div>
        <div className={styles.statusCard}>
          <h3>Today's P&L</h3>
          <div className={styles.value}>$0.00</div>
        </div>
        <div className={styles.statusCard}>
          <h3>Total P&L</h3>
          <div className={styles.value}>$0.00</div>
        </div>
      </div>
      <div className={styles.tradeHistory}>
        <h3>Recent Trades</h3>
        <div className={styles.placeholder}>
          <p>Your trade history will appear here</p>
        </div>
      </div>
    </div>
  );
}; 