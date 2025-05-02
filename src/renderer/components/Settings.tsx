import { useState } from "react";
import { TabList } from "./TabList";
import { SettingsModel } from "./SettingsModel";
import { BubbleWindowBottomBar } from "./BubbleWindowBottomBar";
import { SettingsAdvanced } from "./SettingsAdvanced";
import { SettingsGeneral } from "./SettingsGeneral";
import { BubbleView, useBubbleView } from "../contexts/BubbleViewContext";

export type SettingsTab = "general" | "model" | "advanced" | "about";

export type SettingsProps = {
  onClose: () => void;
};

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { currentView } = useBubbleView();
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    bubbleViewToSettingsTab(currentView),
  );

  const tabs = [
    { label: "General", key: "general", content: <SettingsGeneral /> },
    { label: "Model", key: "model", content: <SettingsModel /> },
    { label: "Advanced", key: "advanced", content: <SettingsAdvanced /> },
    { label: "About", key: "about", content: <div>Credits</div> },
  ];

  return (
    <>
      <TabList
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as SettingsTab)}
      />
      <BubbleWindowBottomBar>
        <button onClick={onClose}>Back to Chat</button>
      </BubbleWindowBottomBar>
    </>
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
    return "general";
  }

  const settingsTab = view.replace(/settings-?/, "");
  const settingsTabs = ["general", "model", "advanced", "about"] as const;

  if (settingsTabs.includes(settingsTab as SettingsTab)) {
    return settingsTab as SettingsTab;
  }

  return "general";
}
