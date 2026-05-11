clippy.ready("Life", {
  overlayCount: 1,
  sounds: [],
  framesize: [192, 208],
  animations: {
    Default: {
      frames: [
        { duration: 180, images: [0] },
        { duration: 180, images: [1] },
        { duration: 180, images: [2] },
        { duration: 180, images: [3] },
        { duration: 180, images: [4] },
        { duration: 180, images: [5], exitBranch: 0 },
      ],
    },
    RestPose: {
      frames: [{ duration: 1000, images: [0] }],
    },
    Greeting: {
      frames: [
        { duration: 130, images: [24] },
        { duration: 130, images: [25] },
        { duration: 130, images: [26] },
        { duration: 180, images: [27] },
        { duration: 130, images: [26] },
        { duration: 130, images: [25] },
        { duration: 260, images: [24] },
      ],
    },
    Show: {
      frames: [
        { duration: 120, images: [32] },
        { duration: 120, images: [33] },
        { duration: 140, images: [34] },
        { duration: 120, images: [35] },
        { duration: 220, images: [36] },
      ],
    },
    Hide: {
      frames: [
        { duration: 120, images: [36] },
        { duration: 120, images: [35] },
        { duration: 140, images: [34] },
        { duration: 120, images: [33] },
        { duration: 220, images: [32] },
      ],
    },
    GoodBye: {
      frames: [
        { duration: 130, images: [24] },
        { duration: 130, images: [25] },
        { duration: 130, images: [26] },
        { duration: 220, images: [27] },
        { duration: 130, images: [26] },
        { duration: 130, images: [25] },
        { duration: 220, images: [24] },
      ],
    },
    Wave: {
      frames: [
        { duration: 130, images: [24] },
        { duration: 130, images: [25] },
        { duration: 130, images: [26] },
        { duration: 180, images: [27] },
        { duration: 130, images: [26] },
        { duration: 130, images: [25] },
      ],
    },
    GetAttention: {
      frames: [
        { duration: 120, images: [64] },
        { duration: 140, images: [65] },
        { duration: 140, images: [66] },
        { duration: 180, images: [68] },
        { duration: 200, images: [69] },
      ],
    },
    Congratulate: {
      frames: [
        { duration: 120, images: [32] },
        { duration: 120, images: [33] },
        { duration: 140, images: [34] },
        { duration: 120, images: [35] },
        { duration: 220, images: [36] },
      ],
    },
    Thinking: {
      frames: [
        { duration: 180, images: [64] },
        { duration: 180, images: [65] },
        { duration: 180, images: [66] },
        { duration: 180, images: [67] },
        { duration: 180, images: [68] },
        { duration: 180, images: [69], exitBranch: 0 },
      ],
    },
    Processing: {
      frames: [
        { duration: 150, images: [56] },
        { duration: 150, images: [57] },
        { duration: 150, images: [58] },
        { duration: 150, images: [59] },
        { duration: 150, images: [60] },
        { duration: 150, images: [61], exitBranch: 0 },
      ],
    },
    Searching: {
      frames: [
        { duration: 160, images: [48] },
        { duration: 160, images: [49] },
        { duration: 160, images: [50] },
        { duration: 160, images: [51] },
        { duration: 160, images: [52] },
        { duration: 160, images: [53], exitBranch: 0 },
      ],
    },
    CheckingSomething: {
      frames: [
        { duration: 160, images: [48] },
        { duration: 160, images: [49] },
        { duration: 160, images: [50] },
        { duration: 160, images: [51] },
        { duration: 160, images: [52] },
        { duration: 160, images: [53], exitBranch: 0 },
      ],
    },
    Hearing_1: {
      frames: [
        { duration: 160, images: [48] },
        { duration: 160, images: [49] },
        { duration: 160, images: [50] },
        { duration: 160, images: [51] },
        { duration: 160, images: [52] },
        { duration: 160, images: [53], exitBranch: 0 },
      ],
    },
    Writing: {
      frames: [
        { duration: 150, images: [56] },
        { duration: 150, images: [57] },
        { duration: 150, images: [58] },
        { duration: 150, images: [59] },
        { duration: 150, images: [60] },
        { duration: 150, images: [61], exitBranch: 0 },
      ],
    },
    SendMail: {
      frames: [
        { duration: 150, images: [56] },
        { duration: 150, images: [57] },
        { duration: 150, images: [58] },
        { duration: 150, images: [59] },
        { duration: 150, images: [60] },
        { duration: 240, images: [61] },
      ],
    },
    Save: {
      frames: [
        { duration: 150, images: [56] },
        { duration: 150, images: [57] },
        { duration: 150, images: [58] },
        { duration: 150, images: [59] },
        { duration: 150, images: [60] },
        { duration: 240, images: [61] },
      ],
    },
    Print: {
      frames: [
        { duration: 150, images: [56] },
        { duration: 150, images: [57] },
        { duration: 150, images: [58] },
        { duration: 150, images: [59] },
        { duration: 150, images: [60] },
        { duration: 240, images: [61] },
      ],
    },
    EmptyTrash: {
      frames: [
        { duration: 150, images: [56] },
        { duration: 150, images: [57] },
        { duration: 150, images: [58] },
        { duration: 150, images: [59] },
        { duration: 150, images: [60] },
        { duration: 240, images: [61] },
      ],
    },
    Explain: {
      frames: [
        { duration: 180, images: [64] },
        { duration: 180, images: [65] },
        { duration: 180, images: [66] },
        { duration: 180, images: [67] },
        { duration: 180, images: [68] },
        { duration: 240, images: [69] },
      ],
    },
    GetTechy: {
      frames: [
        { duration: 180, images: [64] },
        { duration: 180, images: [65] },
        { duration: 180, images: [66] },
        { duration: 180, images: [67] },
        { duration: 180, images: [68] },
        { duration: 240, images: [69] },
      ],
    },
    GetWizardy: {
      frames: [
        { duration: 180, images: [64] },
        { duration: 180, images: [65] },
        { duration: 180, images: [66] },
        { duration: 180, images: [67] },
        { duration: 180, images: [68] },
        { duration: 240, images: [69] },
      ],
    },
    Alert: {
      frames: [
        { duration: 180, images: [40] },
        { duration: 180, images: [41] },
        { duration: 180, images: [42] },
        { duration: 180, images: [43] },
        { duration: 180, images: [44] },
        { duration: 180, images: [45] },
        { duration: 180, images: [46] },
        { duration: 240, images: [47] },
      ],
    },
    GetArtsy: {
      frames: [
        { duration: 180, images: [64] },
        { duration: 180, images: [65] },
        { duration: 180, images: [66] },
        { duration: 180, images: [67] },
        { duration: 180, images: [68] },
        { duration: 240, images: [69] },
      ],
    },
    GestureRight: {
      frames: [
        { duration: 100, images: [8] },
        { duration: 100, images: [9] },
        { duration: 100, images: [10] },
        { duration: 100, images: [11] },
        { duration: 100, images: [12] },
        { duration: 100, images: [13] },
        { duration: 100, images: [14] },
        { duration: 100, images: [15] },
      ],
    },
    GestureLeft: {
      frames: [
        { duration: 100, images: [16] },
        { duration: 100, images: [17] },
        { duration: 100, images: [18] },
        { duration: 100, images: [19] },
        { duration: 100, images: [20] },
        { duration: 100, images: [21] },
        { duration: 100, images: [22] },
        { duration: 100, images: [23] },
      ],
    },
    LookLeft: {
      frames: [
        { duration: 160, images: [48] },
        { duration: 160, images: [49] },
        { duration: 160, images: [50] },
      ],
    },
    LookRight: {
      frames: [
        { duration: 160, images: [51] },
        { duration: 160, images: [52] },
        { duration: 160, images: [53] },
      ],
    },
    Idle1_1: {
      frames: [
        { duration: 180, images: [0] },
        { duration: 180, images: [1] },
        { duration: 180, images: [2] },
        { duration: 180, images: [3] },
        { duration: 180, images: [4] },
        { duration: 180, images: [5], exitBranch: 0 },
      ],
    },
    IdleEyeBrowRaise: {
      frames: [
        { duration: 180, images: [0] },
        { duration: 180, images: [1] },
        { duration: 180, images: [2] },
        { duration: 180, images: [3] },
        { duration: 180, images: [4] },
        { duration: 180, images: [5], exitBranch: 0 },
      ],
    },
  },
});
