import React, { useRef, useEffect, useCallback } from 'react';
import type { ChatBubbleProps } from '../../types';
import styles from './ChatBubble.module.css';

// Custom hook for draggable functionality
const useDraggable = (position: { x: number; y: number }, onPositionChange: (x: number, y: number) => void) => {
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return;
    
    const newX = Math.max(10, Math.min(window.innerWidth - 80, e.clientX - offset.current.x));
    const newY = Math.max(10, Math.min(window.innerHeight - 80, e.clientY - offset.current.y));
    
    onPositionChange(newX, newY);
  }, [onPositionChange]);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
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

  return { handleMouseDown, startPos };
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({ onOpen, position, onPositionChange }) => {
  const { handleMouseDown, startPos } = useDraggable(position, onPositionChange);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const deltaX = Math.abs(e.clientX - startPos.current.x);
    const deltaY = Math.abs(e.clientY - startPos.current.y);
    
    if (deltaX < 5 && deltaY < 5) {
      onOpen();
    }
  }, [onOpen, startPos]);

  return (
    <div
      className={styles.chatBubble}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      💬
    </div>
  );
}; 