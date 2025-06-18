import React, { useState, useRef, useEffect } from "react";

const TAB_NAMES = ["Explore", "Recommendations", "Watchlist", "Trade Status"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Explore");
  const [chatOpen, setChatOpen] = useState(false);

  // For draggable chat bubble
  const bubbleRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 20, y: window.innerHeight - 100 });
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

        pos.current = { x: newX, y: newY };
        bubbleRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    }
    function onMouseUp() {
      dragging.current = false;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  function onMouseDown(e: React.MouseEvent) {
    if (bubbleRef.current) {
      dragging.current = true;
      const rect = bubbleRef.current.getBoundingClientRect();
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  }

  const styles: Record<string, React.CSSProperties> = {
    page: {
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#F9FAFB",
      color: "#2E2E2E",
      userSelect: chatOpen ? "none" : "auto",
    },
    header: {
      padding: "1rem 2rem",
      fontWeight: "700",
      fontSize: 24,
      borderBottom: "1.5px solid #D1D5DB",
      backgroundColor: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
      flexShrink: 0,
      userSelect: "none",
    },
    tabBar: {
      display: "flex",
      borderBottom: "1.5px solid #D1D5DB",
      backgroundColor: "#fff",
      userSelect: "none",
    },
    tabButton: {
      flex: 1,
      padding: "1rem 0",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 16,
      backgroundColor: "transparent",
      border: "none",
      color: "#6B7280",
      borderBottom: "3px solid transparent",
      transition: "color 0.3s ease, border-bottom 0.3s ease",
    },
    tabButtonActive: {
      color: "#2563EB", // blue-600
      borderBottom: "3px solid #2563EB",
      fontWeight: 700,
    },
    mainContent: {
      flex: 1,
      overflowY: "auto",
      padding: "2rem",
      backgroundColor: "#FFFFFF",
      margin: "1rem 2rem",
      borderRadius: 12,
      boxShadow:
        "0 6px 12px rgba(37, 99, 235, 0.12), 0 10px 20px rgba(37, 99, 235, 0.1)",
      border: "1.5px solid #D1D5DB",
    },
    explorePage: {
      textAlign: "center",
      maxWidth: 700,
      margin: "auto",
      color: "#374151",
      fontSize: 18,
      lineHeight: 1.6,
    },
    chatBubble: {
      position: "fixed",
      width: 60,
      height: 60,
      borderRadius: "50%",
      backgroundColor: "#2563EB",
      boxShadow:
        "0 8px 16px rgba(37, 99, 235, 0.6), 0 4px 8px rgba(0,0,0,0.12)",
      cursor: "grab",
      userSelect: "none",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: 28,
      zIndex: 1000,
      border: "2px solid #1E40AF",
      transition: "background-color 0.3s ease",
    },
    chatWindow: {
      position: "fixed",
      bottom: 80,
      right: 20,
      width: 360,
      height: 500,
      borderRadius: 16,
      backgroundColor: "white",
      boxShadow:
        "0 12px 32px rgba(0,0,0,0.18), 0 8px 24px rgba(37, 99, 235, 0.15), 0 4px 12px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      zIndex: 1001,
      overflow: "hidden",
      border: "1.5px solid #CBD5E1",
    },
    chatHeader: {
      padding: "1rem 1.5rem",
      borderBottom: "1.5px solid #E5E7EB",
      fontWeight: "700",
      fontSize: 20,
      color: "#111827",
      backgroundColor: "#F3F4F6",
      userSelect: "none",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    closeButton: {
      fontSize: 24,
      lineHeight: 1,
      cursor: "pointer",
      background: "none",
      border: "none",
      color: "#6B7280",
      fontWeight: "700",
      padding: 0,
      userSelect: "none",
      transition: "color 0.2s ease",
    },
    closeButtonHover: {
      color: "#111827",
    },
    chatMessages: {
      flex: 1,
      padding: "1rem 1.5rem",
      overflowY: "auto",
      backgroundColor: "#FFFFFF",
    },
    chatInputContainer: {
      padding: "1rem 1.5rem",
      borderTop: "1.5px solid #E5E7EB",
      backgroundColor: "#F9FAFB",
    },
    chatInput: {
      width: "100%",
      padding: "0.5rem 0.75rem",
      borderRadius: 24,
      border: "1.5px solid #D1D5DB",
      fontSize: 14,
      outline: "none",
    },
  };

  // Placeholder content for tabs
  function renderTabContent() {
    switch (activeTab) {
      case "Explore":
        return (
          <div style={styles.explorePage}>
            <h2>Welcome to your Trading Dashboard</h2>
            <p>
              Use the tabs to navigate between Recommendations, Watchlist, and
              Trade Status. Click the blue chat bubble to ask your assistant
              anything.
            </p>
          </div>
        );
      case "Recommendations":
        return <div>Recommendations widget placeholder</div>;
      case "Watchlist":
        return <div>Watchlist widget placeholder</div>;
      case "Trade Status":
        return <div>Trade Status widget placeholder</div>;
      default:
        return null;
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>Mend Trading Assistant</header>

      <nav style={styles.tabBar}>
        {TAB_NAMES.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab ? styles.tabButtonActive : {}),
            }}
            aria-selected={activeTab === tab}
            role="tab"
          >
            {tab}
          </button>
        ))}
      </nav>

      <main style={styles.mainContent}>{renderTabContent()}</main>

      {/* Draggable Chat Bubble */}
      {!chatOpen && (
        <div
          ref={bubbleRef}
          style={styles.chatBubble}
          onMouseDown={onMouseDown}
          onClick={() => setChatOpen(true)}
          title="Chat Assistant"
          aria-label="Open chat assistant"
        >
          💬
        </div>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <section style={styles.chatWindow} role="dialog" aria-modal="true" aria-label="Chat assistant window">
          <header style={styles.chatHeader}>
            Chat Assistant
            <button
              onClick={() => setChatOpen(false)}
              style={styles.closeButton}
              aria-label="Close chat assistant"
              onMouseOver={(e) => (e.currentTarget.style.color = "#111827")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#6B7280")}
            >
              ×
            </button>
          </header>
          <div style={styles.chatMessages}>
            <p style={{ color: "#6B7280" }}>
              Hi! How can I help you with your trading today?
            </p>
          </div>
          <div style={styles.chatInputContainer}>
            <input
              type="text"
              placeholder="Type a message..."
              style={styles.chatInput}
              aria-label="Chat message input"
            />
          </div>
        </section>
      )}
    </div>
  );
}
