import React, { useState } from 'react';
import styles from './TradeStatus.module.css';
import Button from '../../common/Button';
import Modal from '../../common/Modal';

const MOCK_ACTIVE_TRADES = [
  { id: 1, symbol: 'AAPL', action: 'BUY', price: 175.5, quantity: 10, status: 'Active', executed_at: '-' },
  { id: 2, symbol: 'TSLA', action: 'SELL', price: 245.8, quantity: 5, status: 'Active', executed_at: '-' },
];
const MOCK_PENDING_ORDERS = [
  { id: 3, symbol: 'NVDA', action: 'BUY', price: 480.0, quantity: 2, status: 'Pending', executed_at: '-' },
];
const MOCK_TRADE_HISTORY = [
  { id: 4, symbol: 'MSFT', action: 'BUY', price: 320.0, quantity: 8, status: 'Completed', executed_at: '2024-06-01' },
  { id: 5, symbol: 'GOOG', action: 'SELL', price: 2800.0, quantity: 1, status: 'Completed', executed_at: '2024-05-28' },
];

export const TradeStatus: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [trades, setTrades] = useState([
    ...MOCK_ACTIVE_TRADES,
    ...MOCK_PENDING_ORDERS,
    ...MOCK_TRADE_HISTORY,
  ]);

  const handleView = (trade: any) => {
    setSelectedTrade(trade);
    setModalOpen(true);
  };

  const handleRemove = (id: number) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  const totalPL = 320.0 * 8 + 2800.0 * 1 - (175.5 * 10 + 245.8 * 5 + 480.0 * 2); // mock calculation
  const todayPL = 120.0; // mock value

  return (
    <div className={styles.tradeStatus}>
      <h2>Trade Status</h2>
      <div className={styles.statusGrid}>
        <div className={styles.statusCard}>
          <h3>Active Trades</h3>
          <div className={styles.value}>{MOCK_ACTIVE_TRADES.length}</div>
        </div>
        <div className={styles.statusCard}>
          <h3>Pending Orders</h3>
          <div className={styles.value}>{MOCK_PENDING_ORDERS.length}</div>
        </div>
        <div className={styles.statusCard}>
          <h3>Today's P&L</h3>
          <div className={styles.value}>${todayPL.toFixed(2)}</div>
        </div>
        <div className={styles.statusCard}>
          <h3>Total P&L</h3>
          <div className={styles.value}>${totalPL.toFixed(2)}</div>
        </div>
      </div>
      <div className={styles.tradeHistory}>
        <h3>Recent Trades</h3>
        <div className={styles.tradeTable}>
          <div className={styles.tableHeader}>
            <span>Symbol</span>
            <span>Action</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Status</span>
            <span>Date</span>
            <span></span>
          </div>
          {trades.map(trade => (
            <div className={styles.tableRow} key={trade.id}>
              <span>{trade.symbol}</span>
              <span>{trade.action}</span>
              <span>${trade.price}</span>
              <span>{trade.quantity}</span>
              <span>{trade.status}</span>
              <span>{trade.executed_at || '-'}</span>
              <span>
                <Button onClick={() => handleView(trade)} style={{ background: '#3182ce' }}>View</Button>
              </span>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Trade Details">
        {selectedTrade && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><b>Symbol:</b> {selectedTrade.symbol}</div>
            <div><b>Action:</b> {selectedTrade.action}</div>
            <div><b>Price:</b> ${selectedTrade.price}</div>
            <div><b>Quantity:</b> {selectedTrade.quantity}</div>
            <div><b>Status:</b> {selectedTrade.status}</div>
            {selectedTrade.executed_at && <div><b>Date:</b> {selectedTrade.executed_at}</div>}
          </div>
        )}
      </Modal>
    </div>
  );
}; 