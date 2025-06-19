export interface TabProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

export interface ChatBubbleProps {
  onOpen: () => void;
  position: { x: number; y: number };
  onPositionChange: (x: number, y: number) => void;
}

export interface ChatWindowProps {
  onClose: () => void;
  position: { x: number; y: number };
  onPositionChange?: (x: number, y: number) => void;
  onQuickAction?: (action: QuickActionType) => void;
}

export interface TabContentProps {
  activeTab: string;
}

export type TabName = 'Explore' | 'Recommendations' | 'Watchlist' | 'Trade Status';

export type QuickActionType = 'view-recommendations' | 'view-trades' | 'view-watchlist' | 'add-to-watchlist'; 