import React from 'react';
import type { TabProps } from '../../types';
import styles from './Tab.module.css';

export const Tab: React.FC<TabProps> = ({ name, isActive, onClick }) => {
  return (
    <button
      className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ''}`}
      onClick={onClick}
      aria-selected={isActive}
      role="tab"
    >
      {name}
    </button>
  );
}; 