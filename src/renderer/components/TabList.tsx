import React from 'react';

export type TabListTab = {
  label: string;
  content: React.ReactNode;
}

export interface TabListProps {
  tabs: TabListTab[];
}

export function TabList({ tabs }: TabListProps) {
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  return (
    <div className="window-body">
      <menu role="tablist">
        {tabs.map((tab, index) => (
          <li
            key={index}
            role="tab"
            aria-selected={activeTabIndex === index}
            onClick={() => setActiveTabIndex(index)}
            style={{
              cursor: 'pointer',
            }}
          >
            <a>{tab.label}</a>
          </li>
        ))}
      </menu>
      <div className="window" role="tabpanel">
        <div className="window-body">
          {tabs[activeTabIndex]?.content}
        </div>
      </div>
    </div>
  );
}
