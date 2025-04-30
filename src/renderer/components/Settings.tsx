import { TabList } from "./TabList";
import { SettingsModel } from "./SettingsModel";
import { BubbleWindowBottomBar } from "./BubbleWindowBottomBar";
import { SettingsAdvanced } from "./SettingsAdvanced";
import { SettingsGeneral } from "./SettingsGeneral";

export type SettingsProps = {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  return (
    <>
      <TabList tabs={[
        { label: 'General', content: <SettingsGeneral /> },
        { label: 'Model', content: <SettingsModel /> },
        { label: 'Advanced', content: <SettingsAdvanced /> },
        { label: 'About', content: <div>Credits</div> },
      ]} />
      <BubbleWindowBottomBar>
        <button onClick={onClose}>Back to Chat</button>
      </BubbleWindowBottomBar>
    </>
  );
}
