import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
};

const contentStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  minWidth: 320,
  maxWidth: 420,
  padding: 24,
  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  position: 'relative',
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        {title && <h2 style={{ marginTop: 0 }}>{title}</h2>}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 12, right: 16, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
} 