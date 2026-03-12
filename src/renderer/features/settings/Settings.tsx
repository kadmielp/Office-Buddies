import { useEffect, useState } from "react";

import { TabList } from "../../ui/TabList";
import { BubbleView, useBubbleView } from "../../contexts/BubbleViewContext";
import { SettingsModel } from "./SettingsModel";
import { SettingsAdvanced } from "./SettingsAdvanced";
import { SettingsAppearance } from "./SettingsAppearance";
import { SettingsAbout } from "./SettingsAbout";
import { SettingsSession } from "./SettingsSession";
import { SettingsKnowledge } from "./SettingsKnowledge";

export type SettingsTab =
  | "appearance"
  | "model"
  | "session"
  | "knowledge"
  | "advanced"
  | "about";

export type SettingsProps = {
  onClose?: () => void;
};

export const Settings: React.FC<SettingsProps> = () => {
  const { currentView, setCurrentView } = useBubbleView();
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    bubbleViewToSettingsTab(currentView),
  );

  useEffect(() => {
    const newTab = bubbleViewToSettingsTab(currentView);

    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [currentView, activeTab]);

  const tabs = [
    { label: "Appearance", key: "appearance", content: <SettingsAppearance /> },
    { label: "Model", key: "model", content: <SettingsModel /> },
    { label: "Session", key: "session", content: <SettingsSession /> },
    { label: "Knowledge", key: "knowledge", content: <SettingsKnowledge /> },
    { label: "Advanced", key: "advanced", content: <SettingsAdvanced /> },
    { label: "About", key: "about", content: <SettingsAbout /> },
  ];

  return (
    <TabList
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tab) => setCurrentView(`settings-${tab}` as BubbleView)}
    />
  );
};

/**
 * Converts a BubbleView to a SettingsTab.
 *
 * @param view - The BubbleView to convert.
 * @returns The SettingsTab.
 */
function bubbleViewToSettingsTab(view: BubbleView): SettingsTab {
  if (!view || !view.includes("settings")) {
    return "appearance";
  }

  const settingsTab = view.replace(/settings-?/, "");
  const settingsTabs = [
    "appearance",
    "model",
    "session",
    "knowledge",
    "advanced",
    "about",
  ] as const;

  if (settingsTabs.includes(settingsTab as SettingsTab)) {
    return settingsTab as SettingsTab;
  }

  return "appearance";
}

