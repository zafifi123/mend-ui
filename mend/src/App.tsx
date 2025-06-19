import { useState, useEffect, useCallback, useMemo } from 'react';
import { Tab } from './components/Tab/Tab';
import { ChatBubble } from './components/ChatBubble/ChatBubble';
import { ChatWindow } from './components/ChatWindow/ChatWindow';
import { Explore } from './components/TabContent/Explore/Explore';
import { Recommendations } from './components/TabContent/Recommendations/Recommendations';
import { Watchlist } from './components/TabContent/Watchlist/Watchlist';
import { TradeStatus } from './components/TabContent/TradeStatus/TradeStatus';
import type { TabName, QuickActionType } from './types';
import styles from './App.module.css';

const TAB_NAMES: TabName[] = ['Explore', 'Recommendations', 'Watchlist', 'Trade Status'];

// Quick action to tab mapping
const QUICK_ACTION_TAB_MAP: Record<QuickActionType, TabName> = {
  'view-recommendations': 'Recommendations',
  'view-trades': 'Trade Status',
  'view-watchlist': 'Watchlist',
  'add-to-watchlist': 'Watchlist',
};

// Custom hook for chat state management
const useChatState = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
  const [chatWindowPosition, setChatWindowPosition] = useState({ x: 0, y: 0 });

  // Initialize chat position
  useEffect(() => {
    // Default to top right: 32px from top/right
    const x = window.innerWidth - 102; // 70px width + 32px margin
    const y = 32;
    setChatPosition({ x, y });
  }, []);

  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);
  const updateChatPosition = useCallback((x: number, y: number) => {
    setChatPosition({ x, y });
  }, []);
  const updateWindowPosition = useCallback((x: number, y: number) => {
    setChatWindowPosition({ x, y });
  }, []);

  return {
    chatOpen,
    chatPosition,
    chatWindowPosition,
    openChat,
    closeChat,
    updateChatPosition,
    updateWindowPosition,
  };
};

// Tab content mapping
const TAB_CONTENT_MAP = {
  Explore,
  Recommendations,
  Watchlist,
  'Trade Status': TradeStatus,
} as const;

// Header component
const Header: React.FC = () => (
  <header className={styles.header}>
    <div className={styles.headerTitle}>
      <span className={styles.headerIcon}>📈</span>
      Mend Trading Assistant
      <span className={styles.headerSubtitle}>AI-Powered Trading Insights</span>
    </div>
  </header>
);

// Navigation component
const Navigation: React.FC<{
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}> = ({ activeTab, onTabChange }) => (
  <nav className={styles.tabBar}>
    {TAB_NAMES.map((tab) => (
      <Tab
        key={tab}
        name={tab}
        isActive={activeTab === tab}
        onClick={() => onTabChange(tab)}
      />
    ))}
  </nav>
);

// Main App component
export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('Explore');
  const {
    chatOpen,
    chatPosition,
    openChat,
    closeChat,
    updateChatPosition,
    updateWindowPosition,
  } = useChatState();

  // Memoized tab content
  const TabContent = useMemo(() => TAB_CONTENT_MAP[activeTab], [activeTab]);

  // Handle quick actions from chat window
  const handleQuickAction = useCallback((action: QuickActionType) => {
    const targetTab = QUICK_ACTION_TAB_MAP[action];
    if (targetTab) {
      setActiveTab(targetTab);
    }
  }, []);

  return (
    <div className={styles.page}>
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className={styles.mainContent}>
        <TabContent />
      </main>

      {!chatOpen && (
        <ChatBubble
          onOpen={openChat}
          position={chatPosition}
          onPositionChange={updateChatPosition}
        />
      )}

      {chatOpen && (
        <ChatWindow 
          onClose={closeChat} 
          position={chatPosition}
          onPositionChange={updateWindowPosition}
          onQuickAction={handleQuickAction}
        />
      )}
    </div>
  );
}
