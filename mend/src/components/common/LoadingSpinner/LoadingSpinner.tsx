import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, message }) => {
  return (
    <div className={styles.spinnerContainer}>
      <FaSpinner className={styles.spinner} size={size} />
      {message && <p className={styles.spinnerText}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner; 