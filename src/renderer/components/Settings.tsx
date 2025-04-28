import { TabList } from "./TabList";
import { SettingsModel } from "./SettingsModel";
import { BubbleWindowBottomBar } from "./BubbleWindowBottomBar";

export type SettingsProps = {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  return (
    <>
      <TabList tabs={[
        { label: 'Model', content: <SettingsModel /> },
        { label: 'Credits', content: <div>Credits</div> },
      ]} />
      <BubbleWindowBottomBar>
        <button onClick={onClose}>Save</button>
      </BubbleWindowBottomBar>
    </>
  );
}
