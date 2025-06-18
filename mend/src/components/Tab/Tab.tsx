import React from 'react';
import type { TabProps } from '../../types';
import styles from './Tab.module.css';

const getTabIcon = (name: string) => {
  switch (name) {
    case 'Explore':
      return '🔍';
    case 'Recommendations':
      return '💡';
    case 'Watchlist':
      return '⭐';
    case 'Trade Status':
      return '📊';
    default:
      return '📄';
  }
};

export const Tab: React.FC<TabProps> = ({ name, isActive, onClick }) => {
  return (
    <button
      className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ''}`}
      onClick={onClick}
      aria-selected={isActive}
      role="tab"
    >
      <span className={styles.tabIcon}>{getTabIcon(name)}</span>
      {name}
    </button>
  );
}; 