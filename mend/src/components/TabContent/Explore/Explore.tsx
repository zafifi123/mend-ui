import React from 'react';
import styles from './Explore.module.css';

export const Explore: React.FC = () => {
  return (
    <div className={styles.explorePage}>
      <h2>Welcome to your Trading Dashboard</h2>
      <p>
        Use the tabs to navigate between Recommendations, Watchlist, and
        Trade Status. Click the blue chat bubble to ask your assistant
        anything.
      </p>
    </div>
  );
}; 