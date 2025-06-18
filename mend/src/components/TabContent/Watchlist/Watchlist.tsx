import React, { useState } from 'react';
import styles from './Watchlist.module.css';
import Button from '../../common/Button';
import Modal from '../../common/Modal';

const MOCK_WATCHLIST = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.5, change: '+1.2%', volume: 1200000, marketCap: '2.8T', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.8, change: '-0.8%', volume: 900000, marketCap: '800B', sector: 'Automotive' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 485.2, change: '+2.1%', volume: 1500000, marketCap: '1.2T', sector: 'Technology' },
];

export const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState(MOCK_WATCHLIST);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');

  const handleRemove = (symbol: string) => {
    setWatchlist(watchlist.filter(stock => stock.symbol !== symbol));
  };

  const handleAdd = () => {
    if (!newSymbol.trim()) return;
    setWatchlist([
      ...watchlist,
      { symbol: newSymbol.toUpperCase(), name: 'Mock Company', price: 100, change: '+0.0%', volume: 0, marketCap: '0', sector: 'Mock' },
    ]);
    setNewSymbol('');
    setModalOpen(false);
  };

  return (
    <div className={styles.watchlist}>
      <h2>Your Watchlist</h2>
      <Button onClick={() => setModalOpen(true)} style={{ marginBottom: 16 }}>+ Add Stock</Button>
      <div className={styles.watchlistTable}>
        <div className={styles.tableHeader}>
          <span>Symbol</span>
          <span>Name</span>
          <span>Price</span>
          <span>Change</span>
          <span>Volume</span>
          <span>Market Cap</span>
          <span>Sector</span>
          <span></span>
        </div>
        {watchlist.length === 0 ? (
          <div className={styles.placeholder}>
            <p>Add stocks to your watchlist to track their performance</p>
          </div>
        ) : (
          watchlist.map(stock => (
            <div className={styles.tableRow} key={stock.symbol}>
              <span>{stock.symbol}</span>
              <span>{stock.name}</span>
              <span>${stock.price.toFixed(2)}</span>
              <span className={stock.change.startsWith('+') ? styles.changePositive : styles.changeNegative}>{stock.change}</span>
              <span>{stock.volume.toLocaleString()}</span>
              <span>{stock.marketCap}</span>
              <span>{stock.sector}</span>
              <span className={styles.actionsCell}>
                <button className={styles.actionButton} onClick={() => handleRemove(stock.symbol)}>
                  <span className={styles.removeIcon}>×</span>
                </button>
              </span>
            </div>
          ))
        )}
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add to Watchlist">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            placeholder="Stock symbol (e.g. MSFT)"
            value={newSymbol}
            onChange={e => setNewSymbol(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </Modal>
    </div>
  );
}; 