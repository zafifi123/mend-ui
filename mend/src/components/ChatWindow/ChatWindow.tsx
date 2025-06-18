import React, { useState, useRef, useEffect } from 'react';
import type { ChatWindowProps } from '../../types';
import { sendChatMessage } from '../../services/api';
import styles from './ChatWindow.module.css';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are a helpful trading assistant. You provide concise, accurate information about trading, markets, and financial analysis. 
Keep responses focused on trading-related topics and maintain a professional tone.`;

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, position, onPositionChange }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // Calculate initial window position based on bubble position
  useEffect(() => {
    const initialPosition = {
      x: Math.min(position.x - 240, window.innerWidth - 500), // Center on bubble, but keep in viewport
      y: Math.min(position.y - 360, window.innerHeight - 740), // Center on bubble, but keep in viewport
    };
    setWindowPosition({
      x: Math.max(20, initialPosition.x),
      y: Math.max(20, initialPosition.y),
    });
  }, [position]);

  // Dragging functionality
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (dragging.current) {
        let newX = e.clientX - offset.current.x;
        let newY = e.clientY - offset.current.y;

        // clamp inside viewport
        newX = Math.max(0, Math.min(window.innerWidth - 480, newX));
        newY = Math.max(0, Math.min(window.innerHeight - 720, newY));

        setWindowPosition({ x: newX, y: newY });
        onPositionChange?.(newX, newY);
      }
    }

    function onMouseUp() {
      dragging.current = false;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onPositionChange]);

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    dragging.current = true;
    offset.current = { 
      x: e.clientX - windowPosition.x, 
      y: e.clientY - windowPosition.y 
    };
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Add system context to the prompt
      const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${message}`;
      const response = await sendChatMessage(fullPrompt);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message || 'Sorry, I could not process your request.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error connecting to the AI service. Please make sure Ollama is running on your machine.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <div 
      ref={windowRef}
      className={styles.chatWindow}
      style={{
        left: `${windowPosition.x}px`,
        top: `${windowPosition.y}px`,
      }}
    >
      <div 
        className={styles.chatHeader}
        onMouseDown={onMouseDown}
        style={{ cursor: 'grab' }}
      >
        <span>Chat with Khalil & Najwa</span>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
      
      <div className={styles.chatMessages}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💡</div>
            <h3 className={styles.emptyTitle}>Ask me anything about trading!</h3>
            <p className={styles.emptySubtitle}>
              I can help you with market analysis, stock recommendations, portfolio insights, and more.
            </p>
            <div className={styles.suggestions}>
              <div 
                className={styles.suggestionChip}
                onClick={() => handleSuggestionClick("What stocks should I watch today?")}
              >
                "What stocks should I watch today?"
              </div>
              <div 
                className={styles.suggestionChip}
                onClick={() => handleSuggestionClick("Analyze AAPL's recent performance")}
              >
                "Analyze AAPL's recent performance"
              </div>
              <div 
                className={styles.suggestionChip}
                onClick={() => handleSuggestionClick("What's the market sentiment?")}
              >
                "What's the market sentiment?"
              </div>
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageBubble} ${
              msg.isUser ? styles.userMessage : styles.aiMessage
            }`}
          >
            <div className={styles.messageContent}>{msg.content}</div>
            <div className={styles.messageTimestamp}>
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.messageBubble} ${styles.aiMessage} ${styles.typingIndicator}`}>
            <div className={styles.typingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.chatInputContainer}>
        <input
          type="text"
          className={styles.chatInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about trading, markets, or analysis..."
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={styles.sendButton}
          disabled={isLoading || !message.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}; 