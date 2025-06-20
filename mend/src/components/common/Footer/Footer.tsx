import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; 2025 Mend. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="mailto:contact@mend.com" className={styles.link}>Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 