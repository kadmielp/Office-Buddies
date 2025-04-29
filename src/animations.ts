export const ANIMATION_KEYS = [
  'Alert', 'CheckingSomething', 'Congratulate', 'Default', 'EmptyTrash', 'Explain', 'GestureDown', 'GestureLeft', 'GestureRight', 'GestureUp', 'GetArtsy', 'GetAttention', 'GetTechy', 'GetWizardy', 'GoodBye', 'Greeting', 'Hearing_1', 'Hide', 'Idle1_1', 'IdleAtom', 'IdleEyeBrowRaise', 'IdleFingerTap', 'IdleHeadScratch', 'IdleRopePile', 'IdleSideToSide', 'IdleSnooze', 'LookDown', 'LookDownLeft', 'LookDownRight', 'LookLeft', 'LookRight', 'LookUp', 'LookUpLeft', 'LookUpRight', 'Print', 'Processing', 'RestPose', 'Save', 'Searching', 'SendMail', 'Show', 'Thinking', 'Wave', 'Writing'
] as const;

export const ANIMATION_KEYS_BRACKETS = ANIMATION_KEYS.map((k) => `[${k}]`);
export const IDLE_ANIMATION_KEYS = ANIMATION_KEYS.filter((k) => k.startsWith('Idle'));

export type AnimationKey = typeof ANIMATION_KEYS[number];

