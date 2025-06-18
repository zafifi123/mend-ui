import React, { useRef, useEffect } from 'react';
import type { ChatBubbleProps } from '../../types';
import styles from './ChatBubble.module.css';

export const ChatBubble: React.FC<ChatBubbleProps> = ({ onOpen, position, onPositionChange }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (dragging.current) {
        let newX = e.clientX - offset.current.x;
        let newY = e.clientY - offset.current.y;

        // clamp inside viewport
        newX = Math.max(10, Math.min(window.innerWidth - 80, newX));
        newY = Math.max(10, Math.min(window.innerHeight - 80, newY));

        onPositionChange(newX, newY);
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
    startPos.current = { x: e.clientX, y: e.clientY };
    
    // Calculate offset from the current position
    offset.current = { 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    };
  }

  function handleClick(e: React.MouseEvent) {
    // Only open if we haven't dragged (or dragged very little)
    const deltaX = Math.abs(e.clientX - startPos.current.x);
    const deltaY = Math.abs(e.clientY - startPos.current.y);
    
    if (deltaX < 5 && deltaY < 5) {
      onOpen();
    }
  }

  return (
    <div
      ref={bubbleRef}
      className={styles.chatBubble}
      onMouseDown={onMouseDown}
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