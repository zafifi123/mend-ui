import React, { useState, useEffect } from 'react';
import styles from './TradeStatus.module.css';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import { getTradeHistory, getActiveTrades, getPendingOrders } from '../../../services/api';

export const TradeStatus: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTrades, setActiveTrades] = useState<any[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [active, pending, history] = await Promise.all([
        getActiveTrades(),
        getPendingOrders(),
        getTradeHistory(),
      ]);
      setActiveTrades(active);
      setPendingOrders(pending);
      setTradeHistory(history);
    } catch (e) {
      setError('Failed to load trades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const trades = [...activeTrades, ...pendingOrders, ...tradeHistory];

  // Calculate P&L (mock logic, replace with real if available)
  const totalPL = tradeHistory.reduce((acc, t) => acc + (Number(t.price) * Number(t.quantity)), 0) - (activeTrades.reduce((acc, t) => acc + (Number(t.price) * Number(t.quantity)), 0) + pendingOrders.reduce((acc, t) => acc + (Number(t.price) * Number(t.quantity)), 0));
  const todayPL = 0; // You can implement real logic if you have timestamps

  const handleView = (trade: any) => {
    setSelectedTrade(trade);
    setModalOpen(true);
  };

  return (
    <div className={styles.tradeStatus}>
      <h2>Trade Status</h2>
      {loading ? (
        <div className={styles.placeholder}><p>Loading...</p></div>
      ) : error ? (
        <div className={styles.placeholder}><p>{error}</p></div>
      ) : (
        <>
          <div className={styles.statusGrid}>
            <div className={styles.statusCard}>
              <h3>Active Trades</h3>
              <div className={styles.value}>{activeTrades.length}</div>
            </div>
            <div className={styles.statusCard}>
              <h3>Pending Orders</h3>
              <div className={styles.value}>{pendingOrders.length}</div>
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
                  <span>${Number(trade.price).toFixed(2)}</span>
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
        </>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Trade Details">
        {selectedTrade && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><b>Symbol:</b> {selectedTrade.symbol}</div>
            <div><b>Action:</b> {selectedTrade.action}</div>
            <div><b>Price:</b> ${Number(selectedTrade.price).toFixed(2)}</div>
            <div><b>Quantity:</b> {selectedTrade.quantity}</div>
            <div><b>Status:</b> {selectedTrade.status}</div>
            {selectedTrade.executed_at && <div><b>Date:</b> {selectedTrade.executed_at}</div>}
          </div>
        )}
      </Modal>
    </div>
  );
}; 