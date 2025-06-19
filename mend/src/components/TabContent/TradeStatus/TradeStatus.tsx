import React, { useState, useEffect } from 'react';
import styles from './TradeStatus.module.css';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import { getTrades, completeTrade, deleteTrade, allocateTrades, getUserBalance, updateUserBalance, suggestAllocationsWithAI } from '../../../services/api';
import { FaEye, FaTrashAlt, FaCheckCircle, FaRegSmileBeam } from 'react-icons/fa';

export const TradeStatus: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [completing, setCompleting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [selectedTrades, setSelectedTrades] = useState<(string | number)[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'complete' | 'delete' | null>(null);
  const [allocating, setAllocating] = useState(false);
  const [pendingAllocations, setPendingAllocations] = useState<any[]>([]);
  const [allocationQuantities, setAllocationQuantities] = useState<Record<string, number>>({});
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [allocationError, setAllocationError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<Record<string, number> | null>(null);
  const [allocatingApi, setAllocatingApi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, { quantity: number, explanation: string }>>({});
  const [declinedSuggestions, setDeclinedSuggestions] = useState<Set<string>>(new Set());

  const fetchTrades = () => {
    setLoading(true);
    getTrades()
      .then((resp) => {
        setTrades(resp);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrades();
    setBalanceLoading(true);
    getUserBalance()
      .then((data) => {
        // Assume backend returns { balance: number }
        setUserBalance(data.balance);
      })
      .catch(() => setUserBalance(null))
      .finally(() => setBalanceLoading(false));
  }, []);

  useEffect(() => {
    setPendingAllocations(trades.filter(t => t.status === 'pending_allocation'));
  }, [trades]);

  const totalAllocated = Object.entries(allocationQuantities).reduce((sum, [id, qty]) => {
    const trade = pendingAllocations.find(t => String(t.id) === id);
    return sum + (trade ? Number(trade.price) * qty : 0);
  }, 0);
  const remainingBalance = (userBalance ?? 0) - totalAllocated;

  const handleStartAllocation = () => {
    setAllocating(true);
    setAllocationQuantities(
      Object.fromEntries(pendingAllocations.map(t => [String(t.id), 0]))
    );
    setAllocationError(null);
    // TODO: trigger chat bubble for allocation tips
  };

  const handleQuantityChange = (id: string, qty: number) => {
    setAllocationQuantities(prev => ({ ...prev, [id]: qty }));
  };

  const handleConfirmAllocations = async () => {
    if (totalAllocated > (userBalance ?? 0)) {
      setAllocationError('You cannot allocate more than your available balance!');
      return;
    }
    setAllocatingApi(true);
    setAllocationError(null);
    try {
      const allocations = Object.entries(allocationQuantities).map(([trade_id, quantity]) => ({ trade_id: Number(trade_id), quantity }));
      console.log({ user_id: 123, allocations });
      await allocateTrades(allocations);
      setAllocating(false);
      fetchTrades();
    } catch (err) {
      setAllocationError('Failed to allocate trades. Please try again.');
    } finally {
      setAllocatingApi(false);
    }
  };

  const handleAskAI = async () => {
    setAiLoading(true);
    setAiSuggestion(null);
    setAllocationError(null);
    try {
      console.log('Requesting AI suggestions for:', pendingAllocations);
      const aiResponse = await suggestAllocationsWithAI(pendingAllocations, userBalance ?? 0);
      console.log('Raw AI response:', aiResponse);

      // Parse the response
      let parsedResponse;
      if (typeof aiResponse?.message === 'string') {
        try {
          // Clean up the response string - remove any leading/trailing whitespace and quotes
          const cleanResponse = aiResponse.message.trim().replace(/^"|"$/g, '');
          parsedResponse = JSON.parse(cleanResponse);
          console.log('Parsed response:', parsedResponse);
        } catch (error) {
          console.error('Failed to parse AI response:', error);
          setAllocationError('AI response could not be parsed.');
          setAiLoading(false);
          return;
        }
      } else {
        console.error('Invalid AI response format:', aiResponse);
        setAllocationError('AI did not return a valid response format.');
        setAiLoading(false);
        return;
      }

      // Convert the response to a standardized format
      let allocations: Array<{ id: number | string, quantity: number, explanation: string }> = [];
      
      if (Array.isArray(parsedResponse)) {
        // Handle array format: [{id, quantity, explanation}, ...]
        allocations = parsedResponse.map((item, index) => {
          // Match the trade by index position since AI is using 1-based indexing
          const trade = pendingAllocations[index];
          if (trade) {
            return {
              id: trade.id,
              quantity: item.quantity,
              explanation: item.explanation
            };
          }
          return null;
        }).filter((item): item is { id: number | string, quantity: number, explanation: string } => item !== null);
      } else if (typeof parsedResponse === 'object' && parsedResponse !== null) {
        // Handle object format: {"#1 JPM": {quantity, explanation}, ...}
        Object.entries(parsedResponse).forEach(([key, value]: [string, any], index) => {
          if (typeof value === 'object' && value !== null && 
              typeof value.quantity === 'number' && 
              typeof value.explanation === 'string') {
            const trade = pendingAllocations[index];
            if (trade) {
              allocations.push({
                id: trade.id,
                quantity: value.quantity,
                explanation: value.explanation
              });
            }
          }
        });
      }

      console.log('Standardized allocations:', allocations);
      console.log('Pending allocations:', pendingAllocations);
      
      if (allocations.length === 0) {
        console.error('No valid suggestions found in response');
        setAllocationError('AI did not provide any valid suggestions.');
        setAiLoading(false);
        return;
      }

      // Validate total allocation doesn't exceed balance
      const totalCost = allocations.reduce((sum, a) => {
        const trade = pendingAllocations.find(t => String(t.id) === String(a.id));
        return sum + (trade ? Number(trade.price) * a.quantity : 0);
      }, 0);

      if (totalCost > (userBalance ?? 0)) {
        console.error('AI suggestions exceed balance:', totalCost, 'vs', userBalance);
        setAllocationError('AI suggestions exceed available balance. Requesting new suggestions...');
        setAiLoading(false);
        // Retry with a stronger emphasis on the balance constraint
        handleAskAI();
        return;
      }

      // Map to allocationQuantities and aiSuggestions
      const newQuantities: Record<string, number> = {};
      const newSuggestions: Record<string, { quantity: number, explanation: string }> = {};
      
      allocations.forEach(a => {
        if (a && typeof a.id !== 'undefined') {
          const tradeId = String(a.id);
          console.log(`Setting suggestion for trade ${tradeId}:`, a);
          newQuantities[tradeId] = a.quantity;
          newSuggestions[tradeId] = {
            quantity: a.quantity,
            explanation: a.explanation
          };
        }
      });

      console.log('Final quantities:', newQuantities);
      console.log('Final suggestions:', newSuggestions);

      setAiSuggestion(newQuantities);
      setAiSuggestions(newSuggestions);
      setDeclinedSuggestions(new Set());
    } catch (err) {
      console.error('AI suggestion error:', err);
      setAllocationError('Failed to get AI suggestion.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAcceptSuggestion = (tradeId: string) => {
    if (aiSuggestions[tradeId]) {
      setAllocationQuantities(prev => ({
        ...prev,
        [tradeId]: aiSuggestions[tradeId].quantity
      }));
    }
  };

  const handleDeclineSuggestion = (tradeId: string) => {
    setDeclinedSuggestions(prev => new Set([...prev, tradeId]));
  };

  // Calculate P&L (mock logic, replace with real if available)
  const totalPL = trades.reduce((acc, t) => acc + (Number(t.price) * Number(t.quantity)), 0) - (trades.reduce((acc, t) => acc + (Number(t.price) * Number(t.quantity)), 0) + trades.reduce((acc, t) => acc + (Number(t.price) * Number(t.quantity)), 0));
  const todayPL = 0; // You can implement real logic if you have timestamps

  const handleView = (trade: any) => {
    setSelectedTrade(trade);
    setModalOpen(true);
  };

  // Handle select all
  useEffect(() => {
    if (selectAll) {
      setSelectedTrades(trades.map(t => t.id));
    } else if (selectedTrades.length === trades.length && trades.length > 0) {
      setSelectAll(true);
    } else if (selectedTrades.length === 0) {
      setSelectAll(false);
    }
  }, [selectAll, trades]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTrades([]);
      setSelectAll(false);
    } else {
      setSelectedTrades(trades.map(t => t.id));
      setSelectAll(true);
    }
  };

  const handleSelectTrade = (id: string | number) => {
    setSelectedTrades(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleCompleteSelected = async () => {
    setCompleting(true);
    let totalProceeds = 0;
    // Find the selected trades in the trades array
    const selectedTradeObjs = trades.filter(t => selectedTrades.includes(t.id));
    for (const trade of selectedTradeObjs) {
      await completeTrade(Number(trade.id));
      // Only add proceeds if trade has price and quantity
      if (trade.price && trade.quantity) {
        totalProceeds += Number(trade.price) * Number(trade.quantity);
      }
    }
    // Update user balance
    let newBalance = userBalance ?? 0;
    newBalance += totalProceeds;
    try {
      await updateUserBalance(123, newBalance);
      setUserBalance(newBalance);
    } catch {
      // Optionally handle error
    }
    setCompleting(false);
    setSelectedTrades([]);
    setSelectAll(false);
    setConfirmAction(null);
    fetchTrades();
    // Refresh balance after completing trades
    setBalanceLoading(true);
    getUserBalance()
      .then((data) => {
        setUserBalance(data.balance);
      })
      .catch(() => setUserBalance(null))
      .finally(() => setBalanceLoading(false));
  };

  const handleDeleteSelected = async () => {
    setDeleting(true);
    for (const id of selectedTrades) {
      await deleteTrade(Number(id));
    }
    setDeleting(false);
    setSelectedTrades([]);
    setSelectAll(false);
    setConfirmAction(null);
    fetchTrades();
  };

  // Map backend status to user-friendly label and badge color
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_allocation':
        return 'Pending Allocation';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending_allocation':
        return styles.statusPending;
      case 'active':
        return styles.statusActive;
      case 'completed':
        return styles.statusCompleted;
      default:
        return styles.statusDefault;
    }
  };

  return (
    <div className={styles.tradeStatus}>
      {/* Pending Allocations Section */}
      {pendingAllocations.length > 0 && !allocating && (
        <div className={styles.pendingAllocationsBox}>
          <div className={styles.llamaMascot}><FaRegSmileBeam size={48} /></div>
          <div>
            <h3>Pending Allocations</h3>
            <p>You have {pendingAllocations.length} trade(s) waiting for quantity allocation!</p>
            <div className={styles.balanceDisplay}>
              {balanceLoading || userBalance === null ? (
                <span>Loading balance...</span>
              ) : (
                <>
                  Balance: <b>${userBalance.toLocaleString()}</b>
                </>
              )}
            </div>
            <button className={styles.allocateButton} onClick={handleStartAllocation}>
              🦙 Let's Allocate!
            </button>
          </div>
        </div>
      )}
      {/* Allocation UI */}
      {pendingAllocations.length > 0 && allocating && (
        <div className={styles.allocationUI}>
          <h3>Allocate Quantities</h3>
          <div className={styles.balanceDisplay}>
            {balanceLoading || userBalance === null ? (
              <span>Loading balance...</span>
            ) : (
              <>
                Balance: <b>${userBalance.toLocaleString()}</b> | Allocated: <b>${totalAllocated.toLocaleString()}</b> | Remaining: <b style={{ color: remainingBalance < 0 ? '#f43f5e' : '#22c55e' }}>${remainingBalance.toLocaleString()}</b>
              </>
            )}
          </div>
          <div className={styles.allocationTable}>
            <div className={styles.allocationHeader}>
              <span>Symbol</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Cost</span>
            </div>
            {pendingAllocations.map(trade => (
              <div className={styles.allocationRow} key={trade.id}>
                <span>{trade.symbol}</span>
                <span>${Number(trade.price).toFixed(2)}</span>
                <span>
                  <input
                    type="number"
                    min={0}
                    value={allocationQuantities[String(trade.id)] ?? 0}
                    onChange={e => handleQuantityChange(String(trade.id), Number(e.target.value))}
                    className={styles.quantityInput}
                    title="Enter quantity to purchase"
                  />
                </span>
                <span>${((allocationQuantities[String(trade.id)] ?? 0) * Number(trade.price)).toFixed(2)}</span>
                {aiSuggestions[String(trade.id)] && !declinedSuggestions.has(String(trade.id)) && (
                  <>
                    <div className={styles.allocationActions}>
                      <button
                        className={styles.acceptButton}
                        onClick={() => handleAcceptSuggestion(String(trade.id))}
                        title="Accept AI suggestion"
                      >
                        ✓
                      </button>
                      <button
                        className={styles.declineButton}
                        onClick={() => handleDeclineSuggestion(String(trade.id))}
                        title="Decline AI suggestion"
                      >
                        ✕
                      </button>
                    </div>
                    <div className={styles.aiExplanation}>
                      <strong>AI suggests: {aiSuggestions[String(trade.id)].quantity} units</strong>
                      <br />
                      {aiSuggestions[String(trade.id)].explanation}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {allocationError && <div className={styles.allocationError}>{allocationError}</div>}
          <div className={styles.allocationActions}>
            <button className={styles.aiButton} onClick={handleAskAI} disabled={aiLoading}>
              {aiLoading ? 'Thinking...' : '🤖 Ask AI'}
            </button>
            <button className={styles.confirmButton} onClick={handleConfirmAllocations} disabled={userBalance === null || totalAllocated > userBalance || totalAllocated === 0 || allocatingApi}>
              {allocatingApi ? 'Allocating...' : 'Confirm Purchases'}
            </button>
            <button className={styles.cancelButton} onClick={() => setAllocating(false)}>
              Cancel
            </button>
          </div>
          {/* TODO: Integrate chat bubble/tooltips for allocation tips */}
        </div>
      )}
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
              <div className={styles.value}>{trades.length}</div>
            </div>
            <div className={styles.statusCard}>
              <h3>Pending Orders</h3>
              <div className={styles.value}>{trades.length}</div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Recent Trades</h3>
              {selectedTrades.length > 0 && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className={styles.actionIconButton}
                    title="Complete Selected"
                    style={{ color: '#22c55e', fontSize: 20, border: '1px solid #22c55e', background: 'white', padding: '0.5rem 1rem' }}
                    disabled={completing}
                    onClick={() => setConfirmAction('complete')}
                  >
                    <span style={{ display: 'inline-block', marginRight: 8 }}><FaCheckCircle /></span> Complete Selected
                  </button>
                  <button
                    className={styles.actionIconButton}
                    title="Delete Selected"
                    style={{ color: '#f43f5e', fontSize: 20, border: '1px solid #f43f5e', background: 'white', padding: '0.5rem 1rem' }}
                    disabled={deleting}
                    onClick={() => setConfirmAction('delete')}
                  >
                    <span style={{ display: 'inline-block', marginRight: 8 }}><FaTrashAlt /></span> Delete Selected
                  </button>
                </div>
              )}
            </div>
            <div className={styles.tradeTable}>
              <div className={styles.tableHeader}>
                <span>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className={styles.tableCheckbox}
                  />
                </span>
                <span>Symbol</span>
                <span>Action</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Status</span>
                <span>Date</span>
                <span></span>
              </div>
              {trades.map(trade => (
                <div className={styles.tableRow} key={trade.id || (trade.symbol + '-' + (trade.executed_at || ''))}>
                  <span>
                    <input
                      type="checkbox"
                      checked={selectedTrades.includes(trade.id)}
                      onChange={() => handleSelectTrade(trade.id)}
                      className={styles.tableCheckbox}
                    />
                  </span>
                  <span>{trade.symbol}</span>
                  <span>{trade.action}</span>
                  <span>${Number(trade.price).toFixed(2)}</span>
                  <span>{trade.quantity}</span>
                  <span>{getStatusLabel(trade.status)}</span>
                  <span>{trade.executed_at || '-'}</span>
                  <span className={styles.actionsCell}>
                    <button
                      className={styles.actionIconButton}
                      title="View"
                      onClick={() => handleView(trade)}
                      style={{ color: '#3182ce' }}
                    >
                      <FaEye size={20} />
                    </button>
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
      {/* Confirmation Modal for Complete/Delete */}
      <Modal isOpen={!!confirmAction} onClose={() => setConfirmAction(null)} title={confirmAction === 'complete' ? 'Complete Selected Trades?' : 'Delete Selected Trades?'}>
        <div style={{ padding: 16, textAlign: 'center' }}>
          <p>Are you sure you want to {confirmAction} {selectedTrades.length} selected trade{selectedTrades.length !== 1 ? 's' : ''}?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
            <button
              className={styles.actionIconButton}
              style={{ color: confirmAction === 'complete' ? '#22c55e' : '#f43f5e', fontSize: 22, padding: '0.5rem 1.5rem', border: `1px solid ${confirmAction === 'complete' ? '#22c55e' : '#f43f5e'}`, background: 'white' }}
              onClick={confirmAction === 'complete' ? handleCompleteSelected : handleDeleteSelected}
              disabled={completing || deleting}
            >
              {completing || deleting
                ? <span className={styles.completingSpinner}></span>
                : <>{confirmAction === 'complete' ? (<span style={{ display: 'inline-block', marginRight: 8 }}><FaCheckCircle /></span>) : (<span style={{ display: 'inline-block', marginRight: 8 }}><FaTrashAlt /></span>)}{confirmAction === 'complete' ? 'Complete' : 'Delete'}</>}
            </button>
            <button
              className={styles.actionIconButton}
              style={{ color: '#374151', fontSize: 22, padding: '0.5rem 1.5rem', border: '1px solid #d1d5db', background: 'white' }}
              onClick={() => setConfirmAction(null)}
              disabled={completing || deleting}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 