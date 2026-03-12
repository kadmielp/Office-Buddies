export type ProgressProps = {
  progress: number;
};

export const Progress: React.FC<ProgressProps> = ({ progress }) => {
  const normalizedProgress = Number.isFinite(progress)
    ? Math.max(0, Math.min(100, progress))
    : undefined;

  return (
    <progress
      max={100}
      value={normalizedProgress}
      aria-label="Progress"
    />
  );
};
