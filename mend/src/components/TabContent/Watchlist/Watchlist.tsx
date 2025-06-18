import React from 'react';
import styles from './Watchlist.module.css';

export const Watchlist: React.FC = () => {
  return (
    <div className={styles.watchlist}>
      <h2>Your Watchlist</h2>
      <div className={styles.watchlistTable}>
        <div className={styles.tableHeader}>
          <span>Symbol</span>
          <span>Price</span>
          <span>Change</span>
          <span>Volume</span>
          <span>Actions</span>
        </div>
        <div className={styles.placeholder}>
          <p>Add stocks to your watchlist to track their performance</p>
        </div>
      </div>
    </div>
  );
}; 