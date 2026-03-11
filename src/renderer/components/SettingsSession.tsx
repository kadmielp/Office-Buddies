export const SettingsSession: React.FC = () => {
  return (
    <div>
      <fieldset>
        <legend>Session</legend>
        <p style={{ marginTop: 0 }}>
          Session-specific controls will live here once we decide how the app
          should expose active context, reset actions, and temporary runtime
          behavior.
        </p>
        <p style={{ marginBottom: 0 }}>
          The knowledge base has been moved into its own tab so this panel can
          stay focused on session flow and controls.
        </p>
      </fieldset>
    </div>
  );
};
