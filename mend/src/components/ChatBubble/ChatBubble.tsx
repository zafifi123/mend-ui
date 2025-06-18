import React, { useRef, useEffect } from 'react';
import type { ChatBubbleProps } from '../../types';
import styles from './ChatBubble.module.css';

export const ChatBubble: React.FC<ChatBubbleProps> = ({ onOpen, position, onPositionChange }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (dragging.current && bubbleRef.current) {
        let newX = e.clientX - offset.current.x;
        let newY = e.clientY - offset.current.y;

        // clamp inside viewport
        newX = Math.max(10, Math.min(window.innerWidth - 60, newX));
        newY = Math.max(10, Math.min(window.innerHeight - 60, newY));

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
    if (bubbleRef.current) {
      dragging.current = true;
      const rect = bubbleRef.current.getBoundingClientRect();
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  }

  return (
    <div
      ref={bubbleRef}
      className={styles.chatBubble}
      onMouseDown={onMouseDown}
      onClick={onOpen}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      ��
    </div>
  );
}; 