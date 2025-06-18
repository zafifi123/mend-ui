import React, { useState } from 'react';
import type { ChatWindowProps } from '../../types';
import styles from './ChatWindow.module.css';

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message submission here
    setMessage('');
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <span>Chat Assistant</span>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
      
      <div className={styles.chatMessages}>
        {/* Messages will be rendered here */}
      </div>

      <form onSubmit={handleSubmit} className={styles.chatInputContainer}>
        <input
          type="text"
          className={styles.chatInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
      </form>
    </div>
  );
}; 