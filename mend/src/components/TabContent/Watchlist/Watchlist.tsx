import React, { useState, useEffect } from 'react';
import styles from './Watchlist.module.css';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../../../services/api';

// Helper to format market cap
function formatMarketCap(value: number | string) {
  if (value == null) return '-';
  let num = value;
  if (typeof value === 'string') {
    num = Number(value.replace(/[,\s]/g, ''));
  }
  if (typeof num !== 'number') num = Number(num);
  if (isNaN(num)) return '-';
  if (num >= 1e12) return (num / 1e12).toFixed(2).replace(/\.00$/, '') + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2).replace(/\.00$/, '') + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, '') + 'K';
  return num.toString();
}

export const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWatchlist();
      setWatchlist(data);
    } catch (e) {
      setError('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemove = async (symbol: string) => {
    setRemoving(symbol);
    try {
      await removeFromWatchlist(symbol);
      await fetchData();
    } catch (e) {
      setError('Failed to remove stock');
    } finally {
      setRemoving(null);
    }
  };

  const handleAdd = async () => {
    if (!newSymbol.trim()) return;
    setAdding(true);
    try {
      await addToWatchlist(newSymbol.toUpperCase());
      setNewSymbol('');
      setModalOpen(false);
      await fetchData();
    } catch (e) {
      setError('Failed to add stock');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={styles.watchlist}>
      <h2>Your Watchlist</h2>
      <Button onClick={() => setModalOpen(true)} style={{ marginBottom: 16 }}>+ Add Stock</Button>
      {loading ? (
        <div className={styles.placeholder}><p>Loading...</p></div>
      ) : error ? (
        <div className={styles.placeholder}><p>{error}</p></div>
      ) : (
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
                <span>${Number(stock.price).toFixed(2)}</span>
                <span className={stock.change.startsWith('+') ? styles.changePositive : styles.changeNegative}>{stock.change}</span>
                <span>{Number(stock.volume).toLocaleString()}</span>
                <span>{stock.marketCap ? formatMarketCap(stock.marketCap) : '-'}</span>
                <span>{stock.sector}</span>
                <span className={styles.actionsCell}>
                  <button className={styles.actionButton} onClick={() => handleRemove(stock.symbol)} disabled={removing === stock.symbol}>
                    <span className={styles.removeIcon}>×</span>
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add to Watchlist">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            placeholder="Stock symbol (e.g. MSFT)"
            value={newSymbol}
            onChange={e => setNewSymbol(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            disabled={adding}
          />
          <Button onClick={handleAdd} disabled={adding}>Add</Button>
        </div>
      </Modal>
    </div>
  );
}; 