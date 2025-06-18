import { useState, useEffect } from 'react';
import { Tab } from './components/Tab/Tab';
import { ChatBubble } from './components/ChatBubble/ChatBubble';
import { ChatWindow } from './components/ChatWindow/ChatWindow';
import { Explore } from './components/TabContent/Explore/Explore';
import { Recommendations } from './components/TabContent/Recommendations/Recommendations';
import { Watchlist } from './components/TabContent/Watchlist/Watchlist';
import { TradeStatus } from './components/TabContent/TradeStatus/TradeStatus';
import type { TabName } from './types';
import styles from './App.module.css';

const TAB_NAMES: TabName[] = ['Explore', 'Recommendations', 'Watchlist', 'Trade Status'];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('Explore');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
  const [chatWindowPosition, setChatWindowPosition] = useState({ x: 0, y: 0 });

  // Set initial chat position after component mounts
  useEffect(() => {
    const centerX = window.innerWidth / 2 - 35;
    const centerY = window.innerHeight / 2 - 35;
    setChatPosition({ x: centerX, y: centerY });
  }, []);

  const handleChatWindowPositionChange = (x: number, y: number) => {
    setChatWindowPosition({ x, y });
  };

  function renderTabContent() {
    switch (activeTab) {
      case 'Explore':
        return <Explore />;
      case 'Recommendations':
        return <Recommendations />;
      case 'Watchlist':
        return <Watchlist />;
      case 'Trade Status':
        return <TradeStatus />;
      default:
        return null;
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>Mend Trading Assistant</header>

      <nav className={styles.tabBar}>
        {TAB_NAMES.map((tab) => (
          <Tab
            key={tab}
            name={tab}
            isActive={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          />
        ))}
      </nav>

      <main className={styles.mainContent}>{renderTabContent()}</main>

      {!chatOpen && (
        <ChatBubble
          onOpen={() => setChatOpen(true)}
          position={chatPosition}
          onPositionChange={(x, y) => setChatPosition({ x, y })}
        />
      )}

      {chatOpen && (
        <ChatWindow 
          onClose={() => setChatOpen(false)} 
          position={chatPosition}
          onPositionChange={handleChatWindowPositionChange}
        />
      )}
    </div>
  );
}
