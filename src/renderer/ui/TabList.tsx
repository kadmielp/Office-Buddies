import React from "react";

export type TabListTab = {
  label: string;
  key: string;
  content: React.ReactNode;
};

export interface TabListProps {
  tabs: TabListTab[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function TabList({ tabs, activeTab, onTabChange }: TabListProps) {
  const [internalActiveTab, setInternalActiveTab] = React.useState(0);

  // Find the active tab index based on value
  const activeTabIndex = activeTab
    ? tabs.findIndex((tab) => tab.key === activeTab)
    : internalActiveTab;

  const handleTabClick = (index: number) => {
    if (onTabChange) {
      onTabChange(tabs[index].key);
    } else {
      setInternalActiveTab(index);
    }
  };

  const activeTabKey = tabs[activeTabIndex]?.key || "tab";
  const activePanelId = `tabpanel-${activeTabKey}`;
  const activeTabId = `tab-${activeTabKey}`;

  return (
    <div className="window-body">
      <menu role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            id={`tab-${tab.key}`}
            type="button"
            role="tab"
            aria-selected={activeTabIndex === index}
            aria-controls={`tabpanel-${tab.key}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </menu>
      <article
        className="tab-panel"
        role="tabpanel"
        id={activePanelId}
        aria-labelledby={activeTabId}
      >
        {tabs[activeTabIndex]?.content}
      </article>
    </div>
  );
}
