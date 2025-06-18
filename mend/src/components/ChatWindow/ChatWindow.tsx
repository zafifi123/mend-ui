import React, { useState, useRef, useEffect, useCallback } from 'react';
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

const SUGGESTIONS = [
  "What stocks should I watch today?",
  "Analyze AAPL's recent performance",
  "What's the market sentiment?"
];

// Custom hook for window positioning and dragging
const useDraggableWindow = (initialPosition: { x: number; y: number }, onPositionChange?: (x: number, y: number) => void) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // Initialize position
  useEffect(() => {
    const x = Math.max(20, Math.min(initialPosition.x - 240, window.innerWidth - 500));
    const y = Math.max(20, Math.min(initialPosition.y - 360, window.innerHeight - 740));
    setPosition({ x, y });
  }, [initialPosition]);

  // Dragging handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 480, e.clientX - offset.current.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 720, e.clientY - offset.current.y));
    
    setPosition({ x: newX, y: newY });
    onPositionChange?.(newX, newY);
  }, [onPositionChange]);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragging.current = true;
    offset.current = { 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    };
  }, [position]);

  // Event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { position, handleMouseDown };
};

// Custom hook for chat functionality
const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((content: string, isUser: boolean) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    addMessage(content, true);
    setIsLoading(true);

    try {
      const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${content}`;
      const response = await sendChatMessage(fullPrompt);
      addMessage(response.message || 'Sorry, I could not process your request.', false);
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('Sorry, there was an error connecting to the AI service. Please make sure Ollama is running on your machine.', false);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, isLoading]);

  return { messages, isLoading, sendMessage };
};

// Empty state component
const EmptyState: React.FC<{ onSuggestionClick: (suggestion: string) => void }> = ({ onSuggestionClick }) => (
  <div className={styles.emptyState}>
    <div className={styles.emptyIcon}>💡</div>
    <h3 className={styles.emptyTitle}>Ask me anything about trading!</h3>
    <p className={styles.emptySubtitle}>
      I can help you with market analysis, stock recommendations, portfolio insights, and more.
    </p>
    <div className={styles.suggestions}>
      {SUGGESTIONS.map((suggestion, index) => (
        <div 
          key={index}
          className={styles.suggestionChip}
          onClick={() => onSuggestionClick(suggestion)}
        >
          "{suggestion}"
        </div>
      ))}
    </div>
  </div>
);

// Message component
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => (
  <div className={`${styles.messageBubble} ${message.isUser ? styles.userMessage : styles.aiMessage}`}>
    <div className={styles.messageContent}>{message.content}</div>
    <div className={styles.messageTimestamp}>
      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  </div>
);

// Typing indicator component
const TypingIndicator: React.FC = () => (
  <div className={`${styles.messageBubble} ${styles.aiMessage} ${styles.typingIndicator}`}>
    <div className={styles.typingDots}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
);

// Main ChatWindow component
export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, position, onPositionChange }) => {
  const [message, setMessage] = useState('');
  const { position: windowPosition, handleMouseDown } = useDraggableWindow(position, onPositionChange);
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Form handlers
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    sendMessage(message);
    setMessage('');
  }, [message, isLoading, sendMessage]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setMessage(suggestion);
  }, []);

  return (
    <div 
      className={styles.chatWindow}
      style={{ left: `${windowPosition.x}px`, top: `${windowPosition.y}px` }}
    >
      <div className={styles.chatHeader} onMouseDown={handleMouseDown} style={{ cursor: 'grab' }}>
        <span>AI Trading Assistant</span>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      
      <div className={styles.chatMessages}>
        {messages.length === 0 && <EmptyState onSuggestionClick={handleSuggestionClick} />}
        
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && <TypingIndicator />}
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