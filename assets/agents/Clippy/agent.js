clippy.ready("Clippy", {
  overlayCount: 1,
  sounds: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
  ],
  framesize: [124, 93],
  animations: {
    Congratulate: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 10, images: [[124, 0]] },
        // #2
        { duration: 10, images: [[248, 0]] },
        // #3
        { duration: 10, images: [[372, 0]], sound: "14" },
        // #4
        { duration: 10, images: [[496, 0]] },
        // #5
        { duration: 10, images: [[620, 0]] },
        // #6
        { duration: 10, images: [[744, 0]] },
        // #7
        { duration: 10, images: [[868, 0]] },
        // #8
        { duration: 10, images: [[992, 0]], sound: "1" },
        // #9
        { duration: 100, images: [[1116, 0]] },
        // #10
        { duration: 100, images: [[1240, 0]] },
        // #11
        { duration: 100, images: [[1364, 0]] },
        // #12
        { duration: 1200, images: [[1488, 0]] },
        // #13
        { duration: 100, images: [[1612, 0]], sound: "10" },
        // #14
        { duration: 100, images: [[1736, 0]] },
        // #15
        { duration: 1200, images: [[1488, 0]] },
        // #16
        { duration: 100, images: [[1860, 0]] },
        // #17
        { duration: 100, images: [[1984, 0]] },
        // #18
        { duration: 100, images: [[2108, 0]] },
        // #19
        { duration: 100, images: [[2232, 0]] },
        // #20
        { duration: 100, images: [[2356, 0]], exitBranch: 21 },
        // #21
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookRight: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 6 },
        // #1
        { duration: 100, images: [[620, 651]], exitBranch: 5 },
        // #2
        { duration: 100, images: [[744, 651]], exitBranch: 4 },
        // #3
        { duration: 1200, images: [[868, 651]] },
        // #4
        { duration: 100, images: [[992, 651]] },
        // #5
        { duration: 100, images: [[1116, 651]] },
        // #6
        { duration: 100, images: [[0, 0]] },
      ],
    },
    SendMail: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[1240, 1209]] },
        // #2
        { duration: 100, images: [[1364, 1209]] },
        // #3
        { duration: 100, images: [[1488, 1209]] },
        // #4
        { duration: 100, images: [[1612, 1209]] },
        // #5
        { duration: 100, images: [[1736, 1209]] },
        // #6
        { duration: 100, images: [[1860, 1209]] },
        // #7
        { duration: 100, images: [[1984, 1209]] },
        // #8
        { duration: 100, images: [[2108, 1209]] },
        // #9
        { duration: 100, images: [[2232, 1209]] },
        // #10
        { duration: 100, images: [[2356, 1209]] },
        // #11
        { duration: 100, images: [[2480, 1209]] },
        // #12
        { duration: 100, images: [[2604, 1209]] },
        // #13
        { duration: 100, images: [[2728, 1209]] },
        // #14
        { duration: 100, images: [[2852, 1209]] },
        // #15
        { duration: 100, images: [[2976, 1209]] },
        // #16
        { duration: 100, images: [[3100, 1209]] },
        // #17
        { duration: 100, images: [[3224, 1209]] },
        // #18
        { duration: 100, images: [[0, 1302]] },
        // #19
        { duration: 100, images: [[124, 1302]] },
        // #20
        { duration: 100, images: [[248, 1302]] },
        // #21
        { duration: 100, images: [[372, 1302]], sound: "14" },
        // #22
        { duration: 100, images: [[496, 1302]], exitBranch: 24 },
        // #23
        { duration: 100, images: [[620, 1302]] },
        // #24
        { duration: 100, images: [[744, 1302]], exitBranch: 26 },
        // #25
        { duration: 100, images: [[868, 1302]] },
        // #26
        { duration: 100, images: [[992, 1302]], exitBranch: 27 },
        // #27
        { duration: 100, images: [[1116, 1302]], exitBranch: 28 },
        // #28
        { duration: 100, images: [[1240, 1302]], exitBranch: 29 },
        // #29
        { duration: 100, images: [[1364, 1302]], exitBranch: 30 },
        // #30
        { duration: 100, images: [[1488, 1302]], exitBranch: 31 },
        // #31
        { duration: 100, images: [[1612, 1302]], exitBranch: 32 },
        // #32
        { duration: 100, images: [[1736, 1302]] },
        // #33
        { duration: 100, images: [[1860, 1302]] },
        // #34
        { duration: 100, images: [[1984, 1302]] },
        // #35
        { duration: 100, images: [[2108, 1302]] },
        // #36
        { duration: 100, images: [[2232, 1302]] },
        // #37
        { duration: 100, images: [[2356, 1302]] },
        // #38
        { duration: 100, images: [[2480, 1302]] },
        // #39
        { duration: 100, images: [[2604, 1302]] },
        // #40
        { duration: 100, images: [[2728, 1302]] },
        // #41
        { duration: 100, images: [[2852, 1302]] },
        // #42
        { duration: 100, images: [[2976, 1302]] },
        // #43
        { duration: 100, images: [[3100, 1302]] },
        // #44
        { duration: 100, images: [[3224, 1302]] },
        // #45
        { duration: 100, images: [[0, 1395]] },
        // #46
        { duration: 100, images: [[124, 1395]] },
        // #47
        { duration: 100, images: [[248, 1395]], exitBranch: 48 },
        // #48
        { duration: 100, images: [[372, 1395]], exitBranch: 49 },
        // #49
        { duration: 100, images: [[496, 1395]] },
        // #50
        { duration: 100, images: [[620, 1395]], sound: "4" },
        // #51
        { duration: 100, images: [[744, 1395]] },
        // #52
        { duration: 100, images: [[868, 1395]] },
        // #53
        { duration: 600 },
        // #54
        { duration: 100, images: [[992, 1395]] },
        // #55
        { duration: 100, images: [[1116, 1395]] },
        // #56
        { duration: 100, images: [[1240, 1395]] },
        // #57
        { duration: 100, images: [[1364, 1395]] },
        // #58
        { duration: 100, images: [[1488, 1395]] },
        // #59
        { duration: 100, images: [[1612, 1395]] },
        // #60
        { duration: 100, images: [[1736, 1395]] },
        // #61
        { duration: 100, images: [[1860, 1395]] },
        // #62
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Thinking: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[124, 93]] },
        // #2
        { duration: 100, images: [[248, 93]] },
        // #3
        { duration: 100, images: [[372, 93]] },
        // #4
        { duration: 100, images: [[496, 93]], sound: "14" },
        // #5
        { duration: 100, images: [[620, 93]] },
        // #6
        { duration: 100, images: [[744, 93]] },
        // #7
        { duration: 100, images: [[868, 93]] },
        // #8
        { duration: 100, images: [[992, 93]] },
        // #9
        { duration: 100, images: [[1116, 93]] },
        // #10
        { duration: 100, images: [[1240, 93]] },
        // #11
        { duration: 100, images: [[1364, 93]] },
        // #12
        { duration: 100, images: [[1488, 93]] },
        // #13
        { duration: 100, images: [[1612, 93]] },
        // #14
        { duration: 100, images: [[1736, 93]], sound: "4" },
        // #15
        { duration: 100, images: [[1860, 93]] },
        // #16
        { duration: 100, images: [[1984, 93]] },
        // #17
        { duration: 100, images: [[2108, 93]] },
        // #18
        { duration: 100, images: [[2232, 93]] },
        // #19
        { duration: 100, images: [[2356, 93]] },
        // #20
        { duration: 100, images: [[2480, 93]] },
        // #21
        { duration: 100, images: [[2604, 93]] },
        // #22
        { duration: 100, images: [[2728, 93]] },
        // #23
        { duration: 100, images: [[2852, 93]] },
        // #24
        { duration: 100, images: [[2976, 93]] },
        // #25
        { duration: 100, images: [[3100, 93]] },
        // #26
        { duration: 100, images: [[3224, 93]] },
        // #27
        { duration: 100, images: [[0, 186]] },
        // #28
        { duration: 100, images: [[124, 186]] },
        // #29
        { duration: 100, images: [[248, 186]] },
        // #30
        { duration: 100, images: [[372, 186]] },
        // #31
        { duration: 100, images: [[496, 186]] },
        // #32
        {
          duration: 100,
          images: [[620, 186]],
          exitBranch: 33,
          branching: { branches: [{ frameIndex: 21, weight: 100 }] },
        },
        // #33
        { duration: 100, images: [[744, 186]] },
        // #34
        { duration: 100, images: [[868, 186]] },
        // #35
        { duration: 100, images: [[992, 186]] },
        // #36
        { duration: 100, images: [[992, 93]] },
        // #37
        { duration: 100, images: [[868, 93]] },
        // #38
        { duration: 100, images: [[744, 93]], sound: "14" },
        // #39
        { duration: 100, images: [[620, 93]] },
        // #40
        { duration: 100, images: [[496, 93]] },
        // #41
        { duration: 100, images: [[372, 93]] },
        // #42
        { duration: 100, images: [[248, 93]] },
        // #43
        { duration: 100, images: [[124, 93]] },
        // #44
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Explain: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[1116, 186]] },
        // #2
        { duration: 100, images: [[1240, 186]] },
        // #3
        { duration: 900, images: [[1364, 186]] },
        // #4
        { duration: 100, images: [[1240, 186]] },
        // #5
        { duration: 100, images: [[1116, 186]] },
        // #6
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleRopePile: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[1488, 186]], exitBranch: 74 },
        // #2
        { duration: 100, images: [[1612, 186]] },
        // #3
        { duration: 100, images: [[1736, 186]], exitBranch: 74 },
        // #4
        { duration: 100, images: [[1860, 186]] },
        // #5
        { duration: 100, images: [[1984, 186]], exitBranch: 74 },
        // #6
        { duration: 100, images: [[2108, 186]] },
        // #7
        { duration: 100, images: [[2232, 186]], exitBranch: 74 },
        // #8
        { duration: 100, images: [[2356, 186]] },
        // #9
        { duration: 100, images: [[2480, 186]], exitBranch: 74 },
        // #10
        { duration: 100, images: [[2604, 186]] },
        // #11
        { duration: 100, images: [[2728, 186]], exitBranch: 74 },
        // #12
        { duration: 100, images: [[2852, 186]] },
        // #13
        { duration: 100, images: [[2976, 186]], exitBranch: 74 },
        // #14
        { duration: 100, images: [[3100, 186]] },
        // #15
        { duration: 100, images: [[3224, 186]], exitBranch: 74 },
        // #16
        { duration: 100, images: [[0, 279]] },
        // #17
        { duration: 100, images: [[124, 279]], exitBranch: 74 },
        // #18
        { duration: 100, images: [[248, 279]] },
        // #19
        { duration: 100, images: [[372, 279]], exitBranch: 74 },
        // #20
        { duration: 100, images: [[496, 279]] },
        // #21
        { duration: 100, images: [[620, 279]], exitBranch: 74 },
        // #22
        { duration: 100, images: [[744, 279]] },
        // #23
        { duration: 100, images: [[868, 279]], exitBranch: 74 },
        // #24
        { duration: 100, images: [[992, 279]] },
        // #25
        { duration: 100, images: [[1116, 279]], exitBranch: 74 },
        // #26
        { duration: 100, images: [[1240, 279]] },
        // #27
        { duration: 100, images: [[1364, 279]], exitBranch: 74 },
        // #28
        { duration: 100, images: [[1488, 279]] },
        // #29
        { duration: 100, images: [[1612, 279]], exitBranch: 74 },
        // #30
        { duration: 100, images: [[1736, 279]] },
        // #31
        { duration: 100, images: [[1860, 279]], exitBranch: 74 },
        // #32
        { duration: 100, images: [[1984, 279]] },
        // #33
        { duration: 100, images: [[2108, 279]], exitBranch: 74 },
        // #34
        { duration: 100, images: [[2232, 279]] },
        // #35
        { duration: 100, images: [[2356, 279]] },
        // #36
        { duration: 100, images: [[2480, 279]], exitBranch: 74 },
        // #37
        { duration: 100, images: [[2604, 279]] },
        // #38
        { duration: 100, images: [[2728, 279]], exitBranch: 40 },
        // #39
        { duration: 100, images: [[2852, 279]] },
        // #40
        { duration: 100, images: [[2976, 279]], exitBranch: 42 },
        // #41
        { duration: 100, images: [[3100, 279]] },
        // #42
        { duration: 100, images: [[3224, 279]], exitBranch: 44 },
        // #43
        { duration: 100, images: [[0, 372]] },
        // #44
        { duration: 100, images: [[124, 372]], exitBranch: 46 },
        // #45
        { duration: 100, images: [[248, 372]] },
        // #46
        { duration: 100, images: [[372, 372]], exitBranch: 48 },
        // #47
        { duration: 100, images: [[496, 372]] },
        // #48
        { duration: 100, images: [[620, 372]], exitBranch: 50 },
        // #49
        { duration: 100, images: [[744, 372]] },
        // #50
        { duration: 100, images: [[868, 372]], exitBranch: 52 },
        // #51
        { duration: 100, images: [[992, 372]] },
        // #52
        { duration: 100, images: [[1116, 372]], exitBranch: 54 },
        // #53
        { duration: 100, images: [[1240, 372]] },
        // #54
        { duration: 100, images: [[1364, 372]], exitBranch: 56 },
        // #55
        { duration: 100, images: [[1488, 372]] },
        // #56
        { duration: 100, images: [[1612, 372]], exitBranch: 58 },
        // #57
        { duration: 100, images: [[1736, 372]] },
        // #58
        { duration: 100, images: [[1860, 372]], exitBranch: 5 },
        // #59
        { duration: 100, images: [[1984, 372]] },
        // #60
        { duration: 100, images: [[2108, 372]], exitBranch: 70 },
        // #61
        {
          duration: 100,
          images: [[2232, 372]],
          exitBranch: 70,
          branching: { branches: [{ frameIndex: 61, weight: 95 }] },
        },
        // #62
        {
          duration: 100,
          images: [[2356, 372]],
          exitBranch: 70,
          branching: {
            branches: [
              { frameIndex: 61, weight: 25 },
              { frameIndex: 67, weight: 25 },
              { frameIndex: 65, weight: 25 },
            ],
          },
        },
        // #63
        {
          duration: 100,
          images: [[2480, 372]],
          exitBranch: 70,
          branching: { branches: [{ frameIndex: 63, weight: 95 }] },
        },
        // #64
        {
          duration: 100,
          images: [[2604, 372]],
          exitBranch: 70,
          branching: {
            branches: [
              { frameIndex: 61, weight: 25 },
              { frameIndex: 67, weight: 25 },
              { frameIndex: 63, weight: 25 },
            ],
          },
        },
        // #65
        {
          duration: 100,
          images: [[2728, 372]],
          exitBranch: 70,
          branching: { branches: [{ frameIndex: 65, weight: 95 }] },
        },
        // #66
        {
          duration: 100,
          images: [[2604, 372]],
          exitBranch: 70,
          branching: {
            branches: [
              { frameIndex: 61, weight: 25 },
              { frameIndex: 65, weight: 25 },
              { frameIndex: 63, weight: 25 },
            ],
          },
        },
        // #67
        {
          duration: 100,
          images: [[2852, 372]],
          exitBranch: 70,
          branching: { branches: [{ frameIndex: 67, weight: 95 }] },
        },
        // #68
        {
          duration: 100,
          images: [[2604, 372]],
          exitBranch: 70,
          branching: {
            branches: [
              { frameIndex: 65, weight: 25 },
              { frameIndex: 67, weight: 25 },
              { frameIndex: 63, weight: 25 },
            ],
          },
        },
        // #69
        {
          duration: 100,
          images: [[2976, 372]],
          exitBranch: 70,
          branching: { branches: [{ frameIndex: 61, weight: 95 }] },
        },
        // #70
        { duration: 100, images: [[3100, 372]] },
        // #71
        { duration: 100, images: [[3224, 372]] },
        // #72
        { duration: 100, images: [[0, 465]] },
        // #73
        { duration: 100, images: [[124, 465]] },
        // #74
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleAtom: {
      frames: [
        // #0
        {
          duration: 100,
          images: [[0, 0]],
          branching: { branches: [{ frameIndex: 44, weight: 97 }] },
        },
        // #1
        { duration: 100, images: [[124, 93]] },
        // #2
        { duration: 100, images: [[248, 93]] },
        // #3
        { duration: 100, images: [[372, 93]] },
        // #4
        { duration: 100, images: [[496, 93]] },
        // #5
        { duration: 100, images: [[620, 93]] },
        // #6
        { duration: 100, images: [[744, 93]] },
        // #7
        { duration: 100, images: [[868, 93]] },
        // #8
        { duration: 100, images: [[992, 93]] },
        // #9
        { duration: 100, images: [[1116, 93]] },
        // #10
        { duration: 100, images: [[1240, 93]] },
        // #11
        { duration: 100, images: [[1364, 93]] },
        // #12
        { duration: 100, images: [[1488, 93]] },
        // #13
        { duration: 100, images: [[1612, 93]] },
        // #14
        { duration: 100, images: [[1736, 93]] },
        // #15
        { duration: 100, images: [[1860, 93]] },
        // #16
        { duration: 100, images: [[1984, 93]] },
        // #17
        { duration: 100, images: [[2108, 93]] },
        // #18
        { duration: 100, images: [[2232, 93]] },
        // #19
        { duration: 100, images: [[2356, 93]] },
        // #20
        { duration: 100, images: [[2480, 93]] },
        // #21
        { duration: 100, images: [[2604, 93]] },
        // #22
        { duration: 100, images: [[2728, 93]] },
        // #23
        { duration: 100, images: [[2852, 93]] },
        // #24
        { duration: 100, images: [[2976, 93]] },
        // #25
        { duration: 100, images: [[3100, 93]] },
        // #26
        { duration: 100, images: [[3224, 93]] },
        // #27
        { duration: 100, images: [[0, 186]] },
        // #28
        { duration: 100, images: [[124, 186]] },
        // #29
        { duration: 100, images: [[248, 186]] },
        // #30
        { duration: 100, images: [[372, 186]] },
        // #31
        { duration: 100, images: [[496, 186]] },
        // #32
        {
          duration: 100,
          images: [[620, 186]],
          exitBranch: 33,
          branching: { branches: [{ frameIndex: 21, weight: 95 }] },
        },
        // #33
        { duration: 100, images: [[744, 186]] },
        // #34
        { duration: 100, images: [[868, 186]] },
        // #35
        { duration: 100, images: [[992, 186]] },
        // #36
        { duration: 100, images: [[992, 93]] },
        // #37
        { duration: 100, images: [[868, 93]] },
        // #38
        { duration: 100, images: [[744, 93]] },
        // #39
        { duration: 100, images: [[620, 93]] },
        // #40
        { duration: 100, images: [[496, 93]] },
        // #41
        { duration: 100, images: [[372, 93]] },
        // #42
        { duration: 100, images: [[248, 93]] },
        // #43
        { duration: 100, images: [[124, 93]] },
        // #44
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Print: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[248, 465]] },
        // #2
        { duration: 100, images: [[372, 465]] },
        // #3
        { duration: 100, images: [[496, 465]] },
        // #4
        { duration: 100, images: [[620, 465]], sound: "5" },
        // #5
        { duration: 100, images: [[744, 465]] },
        // #6
        { duration: 100, images: [[868, 465]] },
        // #7
        { duration: 100, images: [[992, 465]] },
        // #8
        { duration: 100, images: [[1116, 465]] },
        // #9
        { duration: 100, images: [[1240, 465]] },
        // #10
        { duration: 100, images: [[1364, 465]], sound: "8" },
        // #11
        { duration: 150, images: [[1488, 465]] },
        // #12
        { duration: 100, images: [[1612, 465]], sound: "8" },
        // #13
        { duration: 100, images: [[1736, 465]] },
        // #14
        { duration: 100, images: [[1860, 465]] },
        // #15
        { duration: 100, images: [[1984, 465]] },
        // #16
        { duration: 100, images: [[2108, 465]] },
        // #17
        { duration: 100, images: [[2232, 465]] },
        // #18
        { duration: 100, images: [[2356, 465]] },
        // #19
        { duration: 100, images: [[2480, 465]] },
        // #20
        { duration: 100, images: [[2604, 465]] },
        // #21
        { duration: 100, images: [[2728, 465]] },
        // #22
        { duration: 450, images: [[2852, 465]] },
        // #23
        { duration: 200, images: [[2976, 465]] },
        // #24
        { duration: 100, images: [[3100, 465]], exitBranch: 26 },
        // #25
        { duration: 100, images: [[3224, 465]], sound: "7" },
        // #26
        { duration: 100, images: [[0, 558]], exitBranch: 28 },
        // #27
        { duration: 100, images: [[124, 558]] },
        // #28
        { duration: 100, images: [[248, 558]], exitBranch: 30 },
        // #29
        { duration: 100, images: [[372, 558]] },
        // #30
        { duration: 600, images: [[496, 558]], exitBranch: 32 },
        // #31
        { duration: 100, images: [[620, 558]], sound: "7" },
        // #32
        { duration: 100, images: [[744, 558]], exitBranch: 34 },
        // #33
        { duration: 100, images: [[868, 558]] },
        // #34
        { duration: 100, images: [[992, 558]], exitBranch: 36 },
        // #35
        { duration: 100, images: [[1116, 558]] },
        // #36
        { duration: 600, images: [[1240, 558]], exitBranch: 38 },
        // #37
        { duration: 100, images: [[1364, 558]], sound: "7" },
        // #38
        { duration: 100, images: [[1488, 558]], exitBranch: 40 },
        // #39
        { duration: 100, images: [[1612, 558]] },
        // #40
        { duration: 100, images: [[1736, 558]], exitBranch: 44 },
        // #41
        { duration: 600, images: [[1860, 558]] },
        // #42
        { duration: 100, images: [[1984, 558]], exitBranch: 44, sound: "7" },
        // #43
        { duration: 100, images: [[2108, 558]] },
        // #44
        { duration: 100, images: [[2232, 558]], exitBranch: 46 },
        // #45
        { duration: 100, images: [[2356, 558]] },
        // #46
        { duration: 100, images: [[2480, 558]], exitBranch: 48 },
        // #47
        { duration: 100, images: [[2604, 558]] },
        // #48
        { duration: 100, images: [[2728, 558]], exitBranch: 51 },
        // #49
        { duration: 600, images: [[2852, 558]] },
        // #50
        { duration: 100, images: [[2976, 558]] },
        // #51
        { duration: 100, images: [[3100, 558]], exitBranch: 53 },
        // #52
        { duration: 100, images: [[3224, 558]], sound: "11" },
        // #53
        { duration: 100, images: [[0, 651]] },
        // #54
        { duration: 100, images: [[124, 651]] },
        // #55
        { duration: 100, images: [[248, 651]] },
        // #56
        { duration: 100, images: [[372, 651]], exitBranch: 58 },
        // #57
        { duration: 100, images: [[496, 651]] },
        // #58
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Hide: {
      frames: [
        // #0
        { duration: 10, images: [[0, 0]] },
        // #1
        { duration: 10, images: [[2480, 0]] },
        // #2
        { duration: 10, images: [[2604, 0]] },
        // #3
        { duration: 10, images: [[2728, 0]] },
        // #4
        { duration: 10 },
      ],
    },
    GetAttention: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[1240, 651]] },
        // #2
        { duration: 100, images: [[1364, 651]] },
        // #3
        { duration: 100, images: [[1488, 651]] },
        // #4
        { duration: 100, images: [[1612, 651]] },
        // #5
        { duration: 100, images: [[1736, 651]] },
        // #6
        { duration: 100, images: [[1860, 651]] },
        // #7
        { duration: 100, images: [[1984, 651]] },
        // #8
        { duration: 100, images: [[2108, 651]] },
        // #9
        { duration: 100, images: [[2232, 651]], sound: "10" },
        // #10
        { duration: 150, images: [[2356, 651]] },
        // #11
        { duration: 150, images: [[2232, 651]], sound: "10" },
        // #12
        { duration: 150, images: [[2356, 651]] },
        // #13
        { duration: 150, images: [[2232, 651]], sound: "10" },
        // #14
        { duration: 150, images: [[2480, 651]] },
        // #15
        { duration: 100, images: [[2604, 651]] },
        // #16
        { duration: 100, images: [[2728, 651]] },
        // #17
        { duration: 100, images: [[2852, 651]] },
        // #18
        { duration: 100, images: [[2976, 651]] },
        // #19
        { duration: 100, images: [[3100, 651]] },
        // #20
        { duration: 100, images: [[3224, 651]] },
        // #21
        { duration: 100, images: [[0, 744]] },
        // #22
        { duration: 100, images: [[124, 744]], exitBranch: 23 },
        // #23
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Save: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[3100, 837]] },
        // #2
        { duration: 130, images: [[3224, 837]], sound: "13" },
        // #3
        { duration: 130, images: [[0, 930]] },
        // #4
        { duration: 100, images: [[124, 930]] },
        // #5
        { duration: 100, images: [[248, 930]] },
        // #6
        { duration: 100, images: [[372, 930]] },
        // #7
        { duration: 100, images: [[496, 930]], exitBranch: 10 },
        // #8
        { duration: 450, images: [[620, 930]] },
        // #9
        { duration: 100, images: [[496, 930]], exitBranch: 10 },
        // #10
        { duration: 100, images: [[744, 930]] },
        // #11
        { duration: 100, images: [[868, 930]] },
        // #12
        { duration: 100, images: [[992, 930]] },
        // #13
        { duration: 130, images: [[1116, 930]], sound: "8" },
        // #14
        { duration: 130, images: [[1240, 930]] },
        // #15
        { duration: 130, images: [[1364, 930]] },
        // #16
        { duration: 130, images: [[1488, 930]], sound: "8" },
        // #17
        { duration: 130, images: [[1612, 930]], sound: "8" },
        // #18
        { duration: 130, images: [[1736, 930]] },
        // #19
        { duration: 130, images: [[1860, 930]], sound: "8" },
        // #20
        { duration: 100, images: [[1984, 930]] },
        // #21
        { duration: 100, images: [[2108, 930]], sound: "9" },
        // #22
        { duration: 160, images: [[2232, 930]] },
        // #23
        { duration: 100, images: [[2356, 930]], sound: "2" },
        // #24
        { duration: 100, images: [[2480, 930]] },
        // #25
        { duration: 100, images: [[2604, 930]] },
        // #26
        { duration: 100, images: [[2728, 930]], exitBranch: 34 },
        // #27
        { duration: 450, images: [[2852, 930]] },
        // #28
        { duration: 100, images: [[2976, 930]], exitBranch: 34, sound: "10" },
        // #29
        { duration: 400, images: [[3100, 930]] },
        // #30
        { duration: 100, images: [[3224, 930]], exitBranch: 34 },
        // #31
        { duration: 100, images: [[0, 1023]] },
        // #32
        { duration: 100, images: [[124, 1023]] },
        // #33
        { duration: 100, images: [[248, 1023]] },
        // #34
        { duration: 100, images: [[372, 1023]] },
        // #35
        { duration: 100, images: [[496, 1023]] },
        // #36
        { duration: 100, images: [[620, 1023]] },
        // #37
        { duration: 100, images: [[744, 1023]] },
        // #38
        { duration: 100, images: [[868, 1023]] },
        // #39
        { duration: 100, images: [[992, 1023]] },
        // #40
        { duration: 100, images: [[1116, 1023]] },
        // #41
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GetTechy: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[124, 93]] },
        // #2
        { duration: 100, images: [[248, 93]] },
        // #3
        { duration: 100, images: [[372, 93]] },
        // #4
        { duration: 100, images: [[496, 93]], sound: "14" },
        // #5
        { duration: 100, images: [[620, 93]] },
        // #6
        { duration: 100, images: [[744, 93]] },
        // #7
        { duration: 100, images: [[868, 93]] },
        // #8
        { duration: 100, images: [[992, 93]] },
        // #9
        { duration: 100, images: [[1116, 93]] },
        // #10
        { duration: 100, images: [[1240, 93]] },
        // #11
        { duration: 100, images: [[1364, 93]] },
        // #12
        { duration: 100, images: [[1488, 93]] },
        // #13
        { duration: 100, images: [[1612, 93]] },
        // #14
        { duration: 100, images: [[1736, 93]], sound: "4" },
        // #15
        { duration: 100, images: [[1860, 93]] },
        // #16
        { duration: 100, images: [[1984, 93]] },
        // #17
        { duration: 100, images: [[2108, 93]] },
        // #18
        { duration: 100, images: [[2232, 93]] },
        // #19
        { duration: 100, images: [[2356, 93]] },
        // #20
        { duration: 100, images: [[2480, 93]] },
        // #21
        { duration: 100, images: [[2604, 93]] },
        // #22
        { duration: 100, images: [[2728, 93]] },
        // #23
        { duration: 100, images: [[2852, 93]] },
        // #24
        { duration: 100, images: [[2976, 93]] },
        // #25
        { duration: 100, images: [[3100, 93]] },
        // #26
        { duration: 100, images: [[3224, 93]] },
        // #27
        { duration: 100, images: [[0, 186]] },
        // #28
        { duration: 100, images: [[124, 186]] },
        // #29
        { duration: 100, images: [[248, 186]] },
        // #30
        { duration: 100, images: [[372, 186]] },
        // #31
        { duration: 100, images: [[496, 186]] },
        // #32
        {
          duration: 100,
          images: [[620, 186]],
          exitBranch: 33,
          branching: { branches: [{ frameIndex: 21, weight: 100 }] },
        },
        // #33
        { duration: 100, images: [[744, 186]] },
        // #34
        { duration: 100, images: [[868, 186]] },
        // #35
        { duration: 100, images: [[992, 186]] },
        // #36
        { duration: 100, images: [[992, 93]] },
        // #37
        { duration: 100, images: [[868, 93]] },
        // #38
        { duration: 100, images: [[744, 93]], sound: "14" },
        // #39
        { duration: 100, images: [[620, 93]] },
        // #40
        { duration: 100, images: [[496, 93]] },
        // #41
        { duration: 100, images: [[372, 93]] },
        // #42
        { duration: 100, images: [[248, 93]] },
        // #43
        { duration: 100, images: [[124, 93]] },
        // #44
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GestureUp: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[868, 744]] },
        // #2
        { duration: 100, images: [[992, 744]] },
        // #3
        { duration: 100, images: [[1116, 744]] },
        // #4
        { duration: 100, images: [[1240, 744]] },
        // #5
        { duration: 100, images: [[1364, 744]], exitBranch: 11 },
        // #6
        { duration: 100, images: [[1488, 744]] },
        // #7
        {
          duration: 100,
          images: [[1612, 744]],
          branching: { branches: [{ frameIndex: 5, weight: 50 }] },
        },
        // #8
        { duration: 100, images: [[1736, 744]] },
        // #9
        { duration: 1200, images: [[1860, 744]] },
        // #10
        { duration: 100, images: [[1984, 744]] },
        // #11
        { duration: 100, images: [[1364, 744]] },
        // #12
        { duration: 100, images: [[1240, 744]] },
        // #13
        { duration: 100, images: [[1116, 744]] },
        // #14
        { duration: 100, images: [[992, 744]] },
        // #15
        { duration: 100, images: [[868, 744]] },
        // #16
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Idle1_1: {
      frames: [
        // #0
        {
          duration: 100,
          images: [[0, 0]],
          branching: { branches: [{ frameIndex: 37, weight: 20 }] },
        },
        // #1
        {
          duration: 100,
          images: [[2108, 744]],
          exitBranch: 2,
          branching: { branches: [{ frameIndex: 1, weight: 95 }] },
        },
        // #2
        { duration: 100, images: [[2232, 744]], exitBranch: 16 },
        // #3
        { duration: 100, images: [[2356, 744]] },
        // #4
        {
          duration: 300,
          images: [[2480, 744]],
          exitBranch: 5,
          branching: { branches: [{ frameIndex: 4, weight: 95 }] },
        },
        // #5
        {
          duration: 100,
          images: [[2604, 744]],
          exitBranch: 16,
          branching: {
            branches: [
              { frameIndex: 9, weight: 25 },
              { frameIndex: 12, weight: 25 },
              { frameIndex: 15, weight: 25 },
            ],
          },
        },
        // #6
        { duration: 100, images: [[2728, 744]] },
        // #7
        {
          duration: 300,
          images: [[2852, 744]],
          exitBranch: 8,
          branching: {
            branches: [
              { frameIndex: 7, weight: 94 },
              { frameIndex: 5, weight: 3 },
            ],
          },
        },
        // #8
        { duration: 100, images: [[2976, 744]], exitBranch: 16 },
        // #9
        { duration: 100, images: [[3100, 744]] },
        // #10
        {
          duration: 300,
          images: [[3224, 744]],
          exitBranch: 11,
          branching: {
            branches: [
              { frameIndex: 10, weight: 94 },
              { frameIndex: 8, weight: 2 },
              { frameIndex: 5, weight: 2 },
            ],
          },
        },
        // #11
        { duration: 100, images: [[0, 837]], exitBranch: 16 },
        // #12
        { duration: 100, images: [[124, 837]] },
        // #13
        {
          duration: 300,
          images: [[248, 837]],
          exitBranch: 14,
          branching: {
            branches: [
              { frameIndex: 13, weight: 93 },
              { frameIndex: 11, weight: 3 },
              { frameIndex: 5, weight: 2 },
            ],
          },
        },
        // #14
        { duration: 100, images: [[372, 837]], exitBranch: 16 },
        // #15
        { duration: 100, images: [[496, 837]] },
        // #16
        {
          duration: 300,
          images: [[620, 837]],
          exitBranch: 17,
          branching: { branches: [{ frameIndex: 16, weight: 95 }] },
        },
        // #17
        {
          duration: 100,
          images: [[744, 837]],
          exitBranch: 36,
          branching: { branches: [{ frameIndex: 36, weight: 90 }] },
        },
        // #18
        { duration: 100, images: [[868, 837]] },
        // #19
        { duration: 300, images: [[992, 837]], exitBranch: 35 },
        // #20
        { duration: 100, images: [[1116, 837]] },
        // #21
        { duration: 100, images: [[1240, 837]], exitBranch: 35 },
        // #22
        {
          duration: 300,
          images: [[1364, 837]],
          exitBranch: 23,
          branching: {
            branches: [
              { frameIndex: 22, weight: 94 },
              { frameIndex: 23, weight: 3 },
            ],
          },
        },
        // #23
        {
          duration: 100,
          images: [[1488, 837]],
          exitBranch: 35,
          branching: {
            branches: [
              { frameIndex: 24, weight: 25 },
              { frameIndex: 27, weight: 25 },
              { frameIndex: 30, weight: 25 },
            ],
          },
        },
        // #24
        { duration: 100, images: [[1612, 837]] },
        // #25
        {
          duration: 300,
          images: [[1736, 837]],
          exitBranch: 26,
          branching: {
            branches: [
              { frameIndex: 25, weight: 94 },
              { frameIndex: 23, weight: 3 },
            ],
          },
        },
        // #26
        { duration: 100, images: [[1860, 837]], exitBranch: 35 },
        // #27
        { duration: 100, images: [[1984, 837]] },
        // #28
        {
          duration: 300,
          images: [[2108, 837]],
          exitBranch: 29,
          branching: {
            branches: [
              { frameIndex: 28, weight: 94 },
              { frameIndex: 23, weight: 3 },
            ],
          },
        },
        // #29
        { duration: 100, images: [[2232, 837]], exitBranch: 35 },
        // #30
        { duration: 100, images: [[2356, 837]] },
        // #31
        {
          duration: 300,
          images: [[2480, 837]],
          exitBranch: 32,
          branching: {
            branches: [
              { frameIndex: 31, weight: 94 },
              { frameIndex: 23, weight: 3 },
            ],
          },
        },
        // #32
        { duration: 100, images: [[2604, 837]], exitBranch: 35 },
        // #33
        { duration: 100, images: [[2728, 837]] },
        // #34
        {
          duration: 300,
          images: [[2852, 837]],
          exitBranch: 35,
          branching: { branches: [{ frameIndex: 34, weight: 80 }] },
        },
        // #35
        { duration: 100, images: [[2976, 837]] },
        // #36
        { duration: 100, images: [[0, 0]], exitBranch: 42 },
        // #37
        { duration: 100, images: [[1116, 186]] },
        // #38
        { duration: 100, images: [[1240, 186]] },
        // #39
        { duration: 900, images: [[1364, 186]] },
        // #40
        { duration: 100, images: [[1240, 186]] },
        // #41
        { duration: 100, images: [[1116, 186]] },
        // #42
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Processing: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[1240, 1023]], sound: "14" },
        // #2
        { duration: 100, images: [[1364, 1023]] },
        // #3
        { duration: 100, images: [[1488, 1023]] },
        // #4
        { duration: 100, images: [[1612, 1023]], exitBranch: 33 },
        // #5
        { duration: 100, images: [[1736, 1023]] },
        // #6
        { duration: 100, images: [[1860, 1023]] },
        // #7
        { duration: 100, images: [[1984, 1023]] },
        // #8
        { duration: 100, images: [[2108, 1023]], sound: "11" },
        // #9
        { duration: 100, images: [[2232, 1023]], exitBranch: 31 },
        // #10
        { duration: 100, images: [[2356, 1023]] },
        // #11
        { duration: 100, images: [[2480, 1023]] },
        // #12
        { duration: 100, images: [[2604, 1023]] },
        // #13
        { duration: 100, images: [[2728, 1023]], exitBranch: 31 },
        // #14
        { duration: 100, images: [[2852, 1023]] },
        // #15
        { duration: 100, images: [[2976, 1023]] },
        // #16
        { duration: 100, images: [[3100, 1023]] },
        // #17
        { duration: 100, images: [[3224, 1023]] },
        // #18
        { duration: 100, images: [[0, 1116]], sound: "11" },
        // #19
        { duration: 100, images: [[124, 1116]] },
        // #20
        { duration: 100, images: [[248, 1116]] },
        // #21
        { duration: 100, images: [[372, 1116]] },
        // #22
        { duration: 100, images: [[496, 1116]] },
        // #23
        { duration: 100, images: [[620, 1116]] },
        // #24
        { duration: 100, images: [[744, 1116]] },
        // #25
        { duration: 100, images: [[868, 1116]] },
        // #26
        { duration: 100, images: [[992, 1116]] },
        // #27
        {
          duration: 100,
          images: [[1116, 1116]],
          exitBranch: 28,
          branching: { branches: [{ frameIndex: 7, weight: 100 }] },
        },
        // #28
        { duration: 100, images: [[1240, 1116]], sound: "11" },
        // #29
        { duration: 100, images: [[1364, 1116]] },
        // #30
        { duration: 100, images: [[1488, 1116]] },
        // #31
        { duration: 100, images: [[1612, 1116]] },
        // #32
        { duration: 100, images: [[1736, 1116]] },
        // #33
        { duration: 100, images: [[1860, 1116]] },
        // #34
        { duration: 100, images: [[1984, 1116]] },
        // #35
        { duration: 100, images: [[2108, 1116]] },
        // #36
        { duration: 100, images: [[2232, 1116]] },
        // #37
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Alert: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[2356, 1116]] },
        // #2
        { duration: 100, images: [[2480, 1116]] },
        // #3
        { duration: 100, images: [[2604, 1116]] },
        // #4
        { duration: 100, images: [[2728, 1116]] },
        // #5
        { duration: 100, images: [[2852, 1116]] },
        // #6
        { duration: 100, images: [[2976, 1116]], sound: "6" },
        // #7
        { duration: 100, images: [[3100, 1116]] },
        // #8
        { duration: 100, images: [[3224, 1116]] },
        // #9
        { duration: 100, images: [[0, 1209]] },
        // #10
        { duration: 500, images: [[124, 1209]], exitBranch: 13 },
        // #11
        { duration: 100, images: [[248, 1209]], exitBranch: 13 },
        // #12
        { duration: 100, images: [[372, 1209]] },
        // #13
        { duration: 100, images: [[496, 1209]] },
        // #14
        { duration: 100, images: [[620, 1209]] },
        // #15
        { duration: 100, images: [[744, 1209]] },
        // #16
        { duration: 100, images: [[868, 1209]] },
        // #17
        { duration: 100, images: [[992, 1209]] },
        // #18
        { duration: 100, images: [[1116, 1209]] },
        // #19
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookUpRight: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 6 },
        // #1
        { duration: 100, images: [[248, 744]], exitBranch: 5 },
        // #2
        { duration: 100, images: [[372, 744]], exitBranch: 4 },
        // #3
        { duration: 1200, images: [[496, 744]] },
        // #4
        { duration: 100, images: [[620, 744]] },
        // #5
        { duration: 100, images: [[744, 744]] },
        // #6
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleSideToSide: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        {
          duration: 100,
          images: [[2108, 744]],
          exitBranch: 2,
          branching: { branches: [{ frameIndex: 1, weight: 95 }] },
        },
        // #2
        { duration: 100, images: [[2232, 744]], exitBranch: 16 },
        // #3
        { duration: 100, images: [[2356, 744]] },
        // #4
        {
          duration: 300,
          images: [[2480, 744]],
          exitBranch: 5,
          branching: { branches: [{ frameIndex: 4, weight: 95 }] },
        },
        // #5
        {
          duration: 100,
          images: [[2604, 744]],
          exitBranch: 16,
          branching: {
            branches: [
              { frameIndex: 9, weight: 25 },
              { frameIndex: 12, weight: 25 },
              { frameIndex: 15, weight: 25 },
            ],
          },
        },
        // #6
        { duration: 100, images: [[2728, 744]] },
        // #7
        {
          duration: 300,
          images: [[2852, 744]],
          exitBranch: 8,
          branching: {
            branches: [
              { frameIndex: 7, weight: 92 },
              { frameIndex: 5, weight: 5 },
            ],
          },
        },
        // #8
        { duration: 100, images: [[2976, 744]], exitBranch: 16 },
        // #9
        { duration: 100, images: [[3100, 744]] },
        // #10
        {
          duration: 300,
          images: [[3224, 744]],
          exitBranch: 11,
          branching: {
            branches: [
              { frameIndex: 10, weight: 91 },
              { frameIndex: 8, weight: 5 },
              { frameIndex: 5, weight: 2 },
            ],
          },
        },
        // #11
        { duration: 100, images: [[0, 837]], exitBranch: 16 },
        // #12
        { duration: 100, images: [[124, 837]] },
        // #13
        {
          duration: 300,
          images: [[248, 837]],
          exitBranch: 14,
          branching: {
            branches: [
              { frameIndex: 13, weight: 91 },
              { frameIndex: 11, weight: 3 },
              { frameIndex: 5, weight: 2 },
            ],
          },
        },
        // #14
        { duration: 100, images: [[372, 837]], exitBranch: 16 },
        // #15
        { duration: 100, images: [[496, 837]] },
        // #16
        {
          duration: 300,
          images: [[620, 837]],
          exitBranch: 17,
          branching: { branches: [{ frameIndex: 16, weight: 75 }] },
        },
        // #17
        {
          duration: 100,
          images: [[744, 837]],
          exitBranch: 36,
          branching: { branches: [{ frameIndex: 36, weight: 90 }] },
        },
        // #18
        { duration: 100, images: [[868, 837]] },
        // #19
        { duration: 300, images: [[992, 837]], exitBranch: 35 },
        // #20
        { duration: 100, images: [[1116, 837]] },
        // #21
        { duration: 100, images: [[1240, 837]], exitBranch: 35 },
        // #22
        {
          duration: 300,
          images: [[1364, 837]],
          exitBranch: 23,
          branching: {
            branches: [
              { frameIndex: 22, weight: 91 },
              { frameIndex: 23, weight: 5 },
            ],
          },
        },
        // #23
        {
          duration: 100,
          images: [[1488, 837]],
          exitBranch: 35,
          branching: {
            branches: [
              { frameIndex: 24, weight: 25 },
              { frameIndex: 27, weight: 25 },
              { frameIndex: 30, weight: 25 },
            ],
          },
        },
        // #24
        { duration: 100, images: [[1612, 837]] },
        // #25
        {
          duration: 0,
          images: [[1736, 837]],
          exitBranch: 26,
          branching: {
            branches: [
              { frameIndex: 25, weight: 91 },
              { frameIndex: 23, weight: 5 },
            ],
          },
        },
        // #26
        { duration: 100, images: [[1860, 837]], exitBranch: 35 },
        // #27
        { duration: 100, images: [[1984, 837]] },
        // #28
        {
          duration: 300,
          images: [[2108, 837]],
          exitBranch: 29,
          branching: {
            branches: [
              { frameIndex: 28, weight: 91 },
              { frameIndex: 23, weight: 5 },
            ],
          },
        },
        // #29
        { duration: 100, images: [[2232, 837]], exitBranch: 35 },
        // #30
        { duration: 100, images: [[2356, 837]] },
        // #31
        {
          duration: 300,
          images: [[2480, 837]],
          exitBranch: 32,
          branching: {
            branches: [
              { frameIndex: 31, weight: 91 },
              { frameIndex: 23, weight: 5 },
            ],
          },
        },
        // #32
        { duration: 100, images: [[2604, 837]], exitBranch: 35 },
        // #33
        { duration: 100, images: [[2728, 837]] },
        // #34
        {
          duration: 300,
          images: [[2852, 837]],
          exitBranch: 35,
          branching: { branches: [{ frameIndex: 34, weight: 80 }] },
        },
        // #35
        { duration: 100, images: [[2976, 837]] },
        // #36
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GoodBye: {
      frames: [
        // #0
        {
          duration: 100,
          images: [[0, 0]],
          exitBranch: 34,
          sound: "15",
          branching: { branches: [{ frameIndex: 34, weight: 50 }] },
        },
        // #1
        { duration: 100, images: [[2356, 2883]] },
        // #2
        { duration: 250, images: [[2480, 2883]] },
        // #3
        { duration: 100, images: [[2604, 2883]], sound: "13" },
        // #4
        { duration: 100, images: [[2728, 2883]] },
        // #5
        { duration: 100, images: [[2852, 2883]] },
        // #6
        { duration: 100, images: [[2976, 2883]] },
        // #7
        { duration: 100, images: [[3100, 2883]], sound: "12" },
        // #8
        { duration: 100, images: [[3224, 2883]] },
        // #9
        { duration: 100, images: [[0, 2976]] },
        // #10
        { duration: 100, images: [[124, 2976]] },
        // #11
        { duration: 100, images: [[248, 2976]] },
        // #12
        { duration: 100, images: [[372, 2976]] },
        // #13
        { duration: 100, images: [[496, 2976]] },
        // #14
        { duration: 200, images: [[620, 2976]] },
        // #15
        { duration: 200, images: [[744, 2976]], sound: "10" },
        // #16
        { duration: 200, images: [[620, 2976]] },
        // #17
        { duration: 200, images: [[868, 2976]] },
        // #18
        { duration: 100, images: [[992, 2976]] },
        // #19
        { duration: 100, images: [[1116, 2976]] },
        // #20
        { duration: 200, images: [[1240, 2976]] },
        // #21
        { duration: 100, images: [[1364, 2976]], sound: "14" },
        // #22
        { duration: 100, images: [[1488, 2976]] },
        // #23
        { duration: 100, images: [[1612, 2976]] },
        // #24
        { duration: 100, images: [[1736, 2976]] },
        // #25
        { duration: 100, images: [[1860, 2976]] },
        // #26
        { duration: 100, images: [[1984, 2976]] },
        // #27
        { duration: 100, images: [[2108, 2976]] },
        // #28
        { duration: 100, images: [[2232, 2976]] },
        // #29
        { duration: 100, images: [[2356, 2976]] },
        // #30
        { duration: 100, images: [[2480, 2976]], sound: "11" },
        // #31
        { duration: 100, images: [[2604, 2976]] },
        // #32
        { duration: 100, images: [[2728, 2976]] },
        // #33
        {
          duration: 100,
          images: [[2852, 2976]],
          exitBranch: 37,
          branching: { branches: [{ frameIndex: 37, weight: 100 }] },
        },
        // #34
        { duration: 100, images: [[1240, 1395]] },
        // #35
        { duration: 100, images: [[1116, 1395]] },
        // #36
        { duration: 100, images: [[992, 1395]] },
        // #37
        { duration: 100 },
      ],
    },
    LookLeft: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 6 },
        // #1
        { duration: 100, images: [[248, 1488]], exitBranch: 5 },
        // #2
        { duration: 100, images: [[372, 1488]], exitBranch: 4 },
        // #3
        { duration: 1200, images: [[496, 1488]] },
        // #4
        { duration: 100, images: [[620, 1488]] },
        // #5
        { duration: 100, images: [[744, 1488]] },
        // #6
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleHeadScratch: {
      frames: [
        // #0
        {
          duration: 100,
          images: [[1984, 2418]],
          branching: { branches: [{ frameIndex: 18, weight: 85 }] },
        },
        // #1
        { duration: 100, images: [[2108, 2418]] },
        // #2
        { duration: 100, images: [[2232, 2418]], exitBranch: 16 },
        // #3
        { duration: 100, images: [[2356, 2418]] },
        // #4
        { duration: 100, images: [[2480, 2418]] },
        // #5
        { duration: 100, images: [[2604, 2418]] },
        // #6
        { duration: 100, images: [[2728, 2418]], exitBranch: 16 },
        // #7
        { duration: 100, images: [[2852, 2418]] },
        // #8
        { duration: 100, images: [[2976, 2418]] },
        // #9
        {
          duration: 100,
          images: [[3100, 2418]],
          exitBranch: 16,
          branching: { branches: [{ frameIndex: 6, weight: 80 }] },
        },
        // #10
        { duration: 100, images: [[3224, 2418]], exitBranch: 16 },
        // #11
        { duration: 100, images: [[0, 2511]] },
        // #12
        { duration: 100, images: [[124, 2511]], exitBranch: 16 },
        // #13
        { duration: 100, images: [[248, 2511]] },
        // #14
        { duration: 100, images: [[372, 2511]] },
        // #15
        {
          duration: 100,
          images: [[496, 2511]],
          exitBranch: 16,
          branching: { branches: [{ frameIndex: 12, weight: 80 }] },
        },
        // #16
        { duration: 100, images: [[620, 2511]] },
        // #17
        { duration: 100, images: [[744, 2511]] },
        // #18
        { duration: 100, images: [[868, 2511]] },
      ],
    },
    LookUpLeft: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 6 },
        // #1
        { duration: 100, images: [[868, 1488]], exitBranch: 5 },
        // #2
        { duration: 100, images: [[992, 1488]], exitBranch: 4 },
        // #3
        { duration: 1200, images: [[1116, 1488]] },
        // #4
        { duration: 100, images: [[1240, 1488]] },
        // #5
        { duration: 100, images: [[1364, 1488]] },
        // #6
        { duration: 100, images: [[0, 0]] },
      ],
    },
    CheckingSomething: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[1488, 1488]], sound: "13" },
        // #2
        { duration: 100, images: [[1612, 1488]] },
        // #3
        { duration: 100, images: [[1736, 1488]] },
        // #4
        { duration: 100, images: [[1860, 1488]] },
        // #5
        { duration: 100, images: [[1984, 1488]] },
        // #6
        { duration: 100, images: [[2108, 1488]] },
        // #7
        { duration: 100, images: [[2232, 1488]] },
        // #8
        { duration: 200, images: [[2356, 1488]] },
        // #9
        { duration: 200, images: [[2480, 1488]] },
        // #10
        { duration: 200, images: [[2604, 1488]] },
        // #11
        { duration: 100, images: [[2728, 1488]], sound: "10" },
        // #12
        { duration: 100, images: [[2852, 1488]], exitBranch: 52 },
        // #13
        { duration: 140, images: [[2976, 1488]] },
        // #14
        { duration: 100, images: [[3100, 1488]] },
        // #15
        { duration: 100, images: [[3224, 1488]] },
        // #16
        { duration: 100, images: [[0, 1581]] },
        // #17
        { duration: 200, images: [[124, 1581]] },
        // #18
        { duration: 100, images: [[248, 1581]] },
        // #19
        { duration: 100, images: [[372, 1581]] },
        // #20
        { duration: 100, images: [[496, 1581]] },
        // #21
        {
          duration: 200,
          images: [[620, 1581]],
          exitBranch: 22,
          branching: { branches: [{ frameIndex: 21, weight: 50 }] },
        },
        // #22
        { duration: 100, images: [[744, 1581]] },
        // #23
        { duration: 100, images: [[868, 1581]] },
        // #24
        {
          duration: 200,
          images: [[992, 1581]],
          exitBranch: 25,
          branching: { branches: [{ frameIndex: 24, weight: 50 }] },
        },
        // #25
        { duration: 100, images: [[1116, 1581]] },
        // #26
        { duration: 100, images: [[1240, 1581]] },
        // #27
        { duration: 100, images: [[1364, 1581]] },
        // #28
        {
          duration: 200,
          images: [[1488, 1581]],
          exitBranch: 29,
          branching: { branches: [{ frameIndex: 28, weight: 50 }] },
        },
        // #29
        { duration: 100, images: [[1612, 1581]] },
        // #30
        { duration: 100, images: [[1736, 1581]] },
        // #31
        {
          duration: 200,
          images: [[1860, 1581]],
          exitBranch: 32,
          branching: { branches: [{ frameIndex: 31, weight: 50 }] },
        },
        // #32
        { duration: 100, images: [[1984, 1581]] },
        // #33
        { duration: 100, images: [[2108, 1581]] },
        // #34
        { duration: 100, images: [[2232, 1581]] },
        // #35
        { duration: 100, images: [[2356, 1581]] },
        // #36
        {
          duration: 200,
          images: [[2480, 1581]],
          exitBranch: 37,
          branching: { branches: [{ frameIndex: 36, weight: 50 }] },
        },
        // #37
        { duration: 100, images: [[2604, 1581]] },
        // #38
        { duration: 100, images: [[2728, 1581]] },
        // #39
        {
          duration: 200,
          images: [[2852, 1581]],
          exitBranch: 40,
          branching: { branches: [{ frameIndex: 39, weight: 50 }] },
        },
        // #40
        { duration: 100, images: [[2976, 1581]] },
        // #41
        { duration: 100, images: [[3100, 1581]], exitBranch: 50 },
        // #42
        {
          duration: 100,
          images: [[3224, 1581]],
          branching: { branches: [{ frameIndex: 14, weight: 75 }] },
        },
        // #43
        { duration: 100, images: [[0, 1674]] },
        // #44
        {
          duration: 200,
          images: [[124, 1674]],
          exitBranch: 51,
          branching: { branches: [{ frameIndex: 44, weight: 50 }] },
        },
        // #45
        { duration: 100, images: [[248, 1674]] },
        // #46
        { duration: 100, images: [[372, 1674]] },
        // #47
        { duration: 100, images: [[496, 1674]] },
        // #48
        {
          duration: 100,
          images: [[620, 1674]],
          exitBranch: 49,
          branching: { branches: [{ frameIndex: 48, weight: 85 }] },
        },
        // #49
        { duration: 100, images: [[744, 1674]], sound: "10" },
        // #50
        {
          duration: 100,
          images: [[868, 1674]],
          exitBranch: 52,
          branching: { branches: [{ frameIndex: 10, weight: 100 }] },
        },
        // #51
        { duration: 100, images: [[992, 1674]] },
        // #52
        { duration: 100, images: [[1116, 1674]], sound: "14" },
        // #53
        { duration: 100, images: [[1240, 1674]] },
        // #54
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Hearing_1: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[2356, 1116]] },
        // #2
        { duration: 100, images: [[2480, 1116]] },
        // #3
        { duration: 100, images: [[2604, 1116]] },
        // #4
        { duration: 100, images: [[2728, 1116]] },
        // #5
        { duration: 100, images: [[2852, 1116]] },
        // #6
        { duration: 100, images: [[2976, 1116]], sound: "6" },
        // #7
        { duration: 100, images: [[3100, 1116]] },
        // #8
        { duration: 100, images: [[3224, 1116]] },
        // #9
        { duration: 100, images: [[0, 1209]] },
        // #10
        { duration: 500, images: [[124, 1209]], exitBranch: 32 },
        // #11
        {
          duration: 100,
          images: [[1364, 1674]],
          branching: { branches: [{ frameIndex: 6, weight: 60 }] },
        },
        // #12
        { duration: 100, images: [[2976, 1116]] },
        // #13
        { duration: 100, images: [[3100, 1116]], exitBranch: 32 },
        // #14
        { duration: 100, images: [[3224, 1116]] },
        // #15
        { duration: 100, images: [[0, 1209]], exitBranch: 32 },
        // #16
        {
          duration: 500,
          images: [[1364, 1674]],
          branching: { branches: [{ frameIndex: 12, weight: 50 }] },
        },
        // #17
        { duration: 100, images: [[1488, 1674]], exitBranch: 32 },
        // #18
        { duration: 100, images: [[1612, 1674]] },
        // #19
        { duration: 100, images: [[1736, 1674]], exitBranch: 32 },
        // #20
        { duration: 100, images: [[1860, 1674]] },
        // #21
        { duration: 400, images: [[1984, 1674]], exitBranch: 32 },
        // #22
        {
          duration: 100,
          images: [[2108, 1674]],
          branching: { branches: [{ frameIndex: 18, weight: 50 }] },
        },
        // #23
        { duration: 100, images: [[2232, 1674]], exitBranch: 32 },
        // #24
        { duration: 100, images: [[2356, 1674]] },
        // #25
        { duration: 100, images: [[2480, 1674]], exitBranch: 32 },
        // #26
        { duration: 500, images: [[2604, 1674]], exitBranch: 32 },
        // #27
        {
          duration: 100,
          images: [[2728, 1674]],
          branching: { branches: [{ frameIndex: 17, weight: 50 }] },
        },
        // #28
        { duration: 100, images: [[2852, 1674]], exitBranch: 32 },
        // #29
        { duration: 100, images: [[2976, 1674]] },
        // #30
        {
          duration: 100,
          images: [[248, 1209]],
          exitBranch: 32,
          branching: { branches: [{ frameIndex: 12, weight: 100 }] },
        },
        // #31
        { duration: 100, images: [[372, 1209]] },
        // #32
        { duration: 100, images: [[496, 1209]] },
        // #33
        { duration: 100, images: [[620, 1209]] },
        // #34
        { duration: 100, images: [[744, 1209]] },
        // #35
        { duration: 100, images: [[868, 1209]] },
        // #36
        { duration: 100, images: [[992, 1209]] },
        // #37
        { duration: 100, images: [[1116, 1209]] },
        // #38
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GetWizardy: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 10, images: [[124, 0]] },
        // #2
        { duration: 10, images: [[248, 0]] },
        // #3
        { duration: 10, images: [[372, 0]], sound: "14" },
        // #4
        { duration: 10, images: [[496, 0]] },
        // #5
        { duration: 10, images: [[620, 0]] },
        // #6
        { duration: 10, images: [[744, 0]] },
        // #7
        { duration: 10, images: [[868, 0]] },
        // #8
        { duration: 10, images: [[992, 0]], sound: "1" },
        // #9
        { duration: 100, images: [[1116, 0]] },
        // #10
        { duration: 100, images: [[1240, 0]] },
        // #11
        { duration: 100, images: [[1364, 0]] },
        // #12
        { duration: 1200, images: [[1488, 0]] },
        // #13
        { duration: 100, images: [[1612, 0]], sound: "10" },
        // #14
        { duration: 100, images: [[1736, 0]] },
        // #15
        { duration: 1200, images: [[1488, 0]] },
        // #16
        { duration: 100, images: [[1860, 0]] },
        // #17
        { duration: 100, images: [[1984, 0]] },
        // #18
        { duration: 100, images: [[2108, 0]] },
        // #19
        { duration: 100, images: [[2232, 0]] },
        // #20
        { duration: 100, images: [[2356, 0]], exitBranch: 21 },
        // #21
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleFingerTap: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[2976, 2976]] },
        // #2
        { duration: 100, images: [[3100, 2976]] },
        // #3
        { duration: 100, images: [[3224, 2976]], exitBranch: 8 },
        // #4
        { duration: 100, images: [[0, 3069]], exitBranch: 8 },
        // #5
        {
          duration: 100,
          images: [[124, 3069]],
          branching: { branches: [{ frameIndex: 7, weight: 3 }] },
        },
        // #6
        {
          duration: 150,
          images: [[248, 3069]],
          exitBranch: 7,
          branching: {
            branches: [
              { frameIndex: 6, weight: 98 },
              { frameIndex: 5, weight: 2 },
            ],
          },
        },
        // #7
        { duration: 100, images: [[372, 3069]], exitBranch: 8 },
        // #8
        { duration: 100, images: [[496, 3069]] },
        // #9
        { duration: 100, images: [[620, 3069]] },
        // #10
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GestureLeft: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[3100, 1674]] },
        // #2
        { duration: 100, images: [[3224, 1674]] },
        // #3
        { duration: 100, images: [[0, 1767]] },
        // #4
        { duration: 100, images: [[124, 1767]], exitBranch: 12 },
        // #5
        { duration: 100, images: [[248, 1767]] },
        // #6
        {
          duration: 100,
          images: [[372, 1767]],
          branching: { branches: [{ frameIndex: 4, weight: 60 }] },
        },
        // #7
        { duration: 100, images: [[496, 1767]] },
        // #8
        { duration: 100, images: [[620, 1767]] },
        // #9
        { duration: 1200, images: [[744, 1767]] },
        // #10
        { duration: 100, images: [[868, 1767]] },
        // #11
        { duration: 450, images: [[992, 1767]] },
        // #12
        { duration: 100, images: [[0, 1767]] },
        // #13
        { duration: 100, images: [[3224, 1674]] },
        // #14
        { duration: 100, images: [[3100, 1674]] },
        // #15
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Wave: {
      frames: [
        // #0
        {
          duration: 100,
          images: [[0, 0]],
          sound: "15",
          branching: { branches: [{ frameIndex: 15, weight: 33 }] },
        },
        // #1
        { duration: 100, images: [[1116, 1767]] },
        // #2
        { duration: 100, images: [[1240, 1767]] },
        // #3
        { duration: 100, images: [[1364, 1767]], exitBranch: 13 },
        // #4
        { duration: 100, images: [[1488, 1767]], exitBranch: 13 },
        // #5
        { duration: 100, images: [[1612, 1767]], exitBranch: 13 },
        // #6
        {
          duration: 100,
          images: [[1736, 1767]],
          branching: { branches: [{ frameIndex: 9, weight: 100 }] },
        },
        // #7
        { duration: 100, images: [[1860, 1767]], exitBranch: 11, sound: "10" },
        // #8
        { duration: 100, images: [[1984, 1767]] },
        // #9
        { duration: 100, images: [[2108, 1767]], exitBranch: 11, sound: "10" },
        // #10
        { duration: 100, images: [[2232, 1767]] },
        // #11
        { duration: 100, images: [[2356, 1767]], sound: "10" },
        // #12
        { duration: 100, images: [[2480, 1767]] },
        // #13
        { duration: 100, images: [[2604, 1767]] },
        // #14
        {
          duration: 100,
          images: [[2728, 1767]],
          exitBranch: 26,
          branching: { branches: [{ frameIndex: 26, weight: 100 }] },
        },
        // #15
        { duration: 100, images: [[2852, 1767]] },
        // #16
        { duration: 100, images: [[2976, 1767]] },
        // #17
        { duration: 100, images: [[3100, 1767]], sound: "12" },
        // #18
        { duration: 100, images: [[3224, 1767]] },
        // #19
        { duration: 100, images: [[0, 1860]] },
        // #20
        { duration: 100, images: [[124, 1860]], exitBranch: 24, sound: "10" },
        // #21
        { duration: 1200, images: [[248, 1860]] },
        // #22
        { duration: 100, images: [[372, 1860]], exitBranch: 24, sound: "10" },
        // #23
        { duration: 1300, images: [[248, 1860]] },
        // #24
        { duration: 50, images: [[496, 1860]] },
        // #25
        { duration: 50, images: [[2976, 1767]] },
        // #26
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GestureRight: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[620, 1860]] },
        // #2
        { duration: 100, images: [[744, 1860]] },
        // #3
        { duration: 100, images: [[868, 1860]] },
        // #4
        { duration: 100, images: [[992, 1860]] },
        // #5
        { duration: 100, images: [[1116, 1860]], exitBranch: 11 },
        // #6
        { duration: 100, images: [[1240, 1860]] },
        // #7
        {
          duration: 100,
          images: [[1364, 1860]],
          branching: { branches: [{ frameIndex: 5, weight: 50 }] },
        },
        // #8
        { duration: 100, images: [[1488, 1860]] },
        // #9
        { duration: 1200, images: [[1612, 1860]] },
        // #10
        { duration: 100, images: [[1736, 1860]] },
        // #11
        { duration: 550, images: [[1116, 1860]] },
        // #12
        { duration: 100, images: [[992, 1860]] },
        // #13
        { duration: 100, images: [[868, 1860]] },
        // #14
        { duration: 100, images: [[744, 1860]] },
        // #15
        { duration: 100, images: [[620, 1860]] },
        // #16
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Writing: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[1860, 1860]] },
        // #2
        { duration: 100, images: [[1984, 1860]] },
        // #3
        { duration: 100, images: [[2108, 1860]] },
        // #4
        { duration: 100, images: [[2232, 1860]] },
        // #5
        { duration: 100, images: [[2356, 1860]] },
        // #6
        { duration: 100, images: [[2480, 1860]] },
        // #7
        { duration: 100, images: [[2604, 1860]] },
        // #8
        { duration: 100, images: [[2728, 1860]], sound: "11" },
        // #9
        { duration: 100, images: [[2852, 1860]] },
        // #10
        { duration: 100, images: [[2976, 1860]] },
        // #11
        { duration: 100, images: [[3100, 1860]] },
        // #12
        {
          duration: 100,
          images: [[3224, 1860]],
          branching: {
            branches: [
              { frameIndex: 26, weight: 45 },
              { frameIndex: 32, weight: 25 },
              { frameIndex: 42, weight: 15 },
            ],
          },
        },
        // #13
        { duration: 100, images: [[0, 1953]], exitBranch: 55 },
        // #14
        { duration: 100, images: [[124, 1953]], exitBranch: 55 },
        // #15
        { duration: 100, images: [[248, 1953]] },
        // #16
        { duration: 200, images: [[372, 1953]] },
        // #17
        { duration: 200, images: [[496, 1953]], exitBranch: 55 },
        // #18
        { duration: 200, images: [[620, 1953]] },
        // #19
        { duration: 200, images: [[744, 1953]] },
        // #20
        { duration: 200, images: [[868, 1953]], exitBranch: 55 },
        // #21
        { duration: 200, images: [[992, 1953]] },
        // #22
        { duration: 200, images: [[1116, 1953]] },
        // #23
        { duration: 200, images: [[1240, 1953]], exitBranch: 55 },
        // #24
        { duration: 200, images: [[1364, 1953]] },
        // #25
        {
          duration: 200,
          images: [[1488, 1953]],
          branching: {
            branches: [
              { frameIndex: 32, weight: 20 },
              { frameIndex: 42, weight: 15 },
            ],
          },
        },
        // #26
        { duration: 100, images: [[1612, 1953]], exitBranch: 56 },
        // #27
        { duration: 100, images: [[1736, 1953]] },
        // #28
        {
          duration: 400,
          images: [[1860, 1953]],
          branching: { branches: [{ frameIndex: 28, weight: 80 }] },
        },
        // #29
        { duration: 100, images: [[1984, 1953]], exitBranch: 30 },
        // #30
        {
          duration: 400,
          images: [[2108, 1953]],
          exitBranch: 55,
          branching: { branches: [{ frameIndex: 30, weight: 75 }] },
        },
        // #31
        {
          duration: 100,
          images: [[2232, 1953]],
          exitBranch: 55,
          branching: {
            branches: [
              { frameIndex: 13, weight: 25 },
              { frameIndex: 42, weight: 20 },
            ],
          },
        },
        // #32
        { duration: 100, images: [[2356, 1953]] },
        // #33
        { duration: 100, images: [[2480, 1953]] },
        // #34
        { duration: 200, images: [[2604, 1953]] },
        // #35
        { duration: 200, images: [[2728, 1953]], exitBranch: 54 },
        // #36
        { duration: 200, images: [[2852, 1953]] },
        // #37
        { duration: 200, images: [[2976, 1953]], exitBranch: 54 },
        // #38
        { duration: 100, images: [[3100, 1953]] },
        // #39
        { duration: 200, images: [[3224, 1953]] },
        // #40
        { duration: 200, images: [[0, 2046]], exitBranch: 55 },
        // #41
        {
          duration: 200,
          images: [[124, 2046]],
          branching: {
            branches: [
              { frameIndex: 13, weight: 25 },
              { frameIndex: 26, weight: 25 },
              { frameIndex: 32, weight: 25 },
            ],
          },
        },
        // #42
        { duration: 100, images: [[248, 2046]] },
        // #43
        { duration: 100, images: [[372, 2046]], exitBranch: 55 },
        // #44
        { duration: 100, images: [[496, 2046]] },
        // #45
        { duration: 100, images: [[620, 2046]] },
        // #46
        { duration: 100, images: [[744, 2046]] },
        // #47
        { duration: 100, images: [[868, 2046]] },
        // #48
        { duration: 100, images: [[992, 2046]] },
        // #49
        { duration: 100, images: [[1116, 2046]] },
        // #50
        { duration: 100, images: [[1240, 2046]] },
        // #51
        { duration: 100, images: [[1364, 2046]] },
        // #52
        { duration: 100, images: [[1488, 2046]], exitBranch: 57 },
        // #53
        {
          duration: 100,
          images: [[1612, 2046]],
          branching: {
            branches: [
              { frameIndex: 26, weight: 33 },
              { frameIndex: 32, weight: 33 },
              { frameIndex: 13, weight: 34 },
            ],
          },
        },
        // #54
        { duration: 100, images: [[1736, 2046]] },
        // #55
        { duration: 100, images: [[1860, 2046]] },
        // #56
        { duration: 100, images: [[1984, 2046]], sound: "11" },
        // #57
        { duration: 100, images: [[2108, 2046]] },
        // #58
        { duration: 100, images: [[2232, 2046]] },
        // #59
        { duration: 100, images: [[2356, 2046]] },
        // #60
        { duration: 100, images: [[0, 0]], sound: "15" },
      ],
    },
    IdleSnooze: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[2480, 2046]] },
        // #2
        { duration: 100, images: [[2604, 2046]] },
        // #3
        { duration: 100, images: [[2728, 2046]] },
        // #4
        { duration: 100, images: [[2852, 2046]] },
        // #5
        { duration: 100, images: [[2976, 2046]] },
        // #6
        { duration: 100, images: [[3100, 2046]] },
        // #7
        { duration: 100, images: [[3224, 2046]] },
        // #8
        { duration: 400, images: [[0, 2139]] },
        // #9
        { duration: 100, images: [[124, 2139]] },
        // #10
        { duration: 100, images: [[248, 2139]] },
        // #11
        { duration: 100, images: [[372, 2139]] },
        // #12
        { duration: 100, images: [[496, 2139]] },
        // #13
        { duration: 100, images: [[620, 2139]] },
        // #14
        { duration: 100, images: [[744, 2139]] },
        // #15
        { duration: 100, images: [[868, 2139]] },
        // #16
        { duration: 100, images: [[992, 2139]] },
        // #17
        { duration: 100, images: [[1116, 2139]], exitBranch: 20 },
        // #18
        { duration: 100, images: [[1240, 2139]] },
        // #19
        { duration: 100, images: [[1364, 2139]] },
        // #20
        { duration: 100, images: [[1488, 2139]], exitBranch: 23 },
        // #21
        { duration: 100, images: [[1612, 2139]] },
        // #22
        { duration: 100, images: [[1736, 2139]] },
        // #23
        { duration: 100, images: [[1860, 2139]], exitBranch: 26 },
        // #24
        { duration: 100, images: [[1984, 2139]] },
        // #25
        { duration: 100, images: [[2108, 2139]] },
        // #26
        { duration: 100, images: [[2232, 2139]], exitBranch: 83 },
        // #27
        { duration: 200, images: [[2356, 2139]] },
        // #28
        { duration: 200, images: [[2480, 2139]], exitBranch: 83 },
        // #29
        { duration: 200, images: [[2604, 2139]], exitBranch: 83 },
        // #30
        { duration: 200, images: [[2728, 2139]], exitBranch: 83 },
        // #31
        { duration: 200, images: [[2852, 2139]] },
        // #32
        { duration: 200, images: [[2976, 2139]], exitBranch: 83 },
        // #33
        { duration: 200, images: [[3100, 2139]] },
        // #34
        { duration: 200, images: [[3224, 2139]], exitBranch: 83 },
        // #35
        { duration: 200, images: [[0, 2232]] },
        // #36
        { duration: 200, images: [[124, 2232]] },
        // #37
        {
          duration: 200,
          images: [[248, 2232]],
          exitBranch: 83,
          branching: {
            branches: [
              { frameIndex: 27, weight: 90 },
              { frameIndex: 46, weight: 5 },
              { frameIndex: 52, weight: 5 },
            ],
          },
        },
        // #38
        { duration: 100, images: [[372, 2232]] },
        // #39
        { duration: 100, images: [[496, 2232]], exitBranch: 83 },
        // #40
        { duration: 100, images: [[620, 2232]] },
        // #41
        { duration: 1200, images: [[744, 2232]] },
        // #42
        { duration: 100, images: [[868, 2232]] },
        // #43
        { duration: 100, images: [[992, 2232]], exitBranch: 83 },
        // #44
        { duration: 100, images: [[1116, 2232]] },
        // #45
        { duration: 100, images: [[1240, 2232]], exitBranch: 83 },
        // #46
        { duration: 100, images: [[1364, 2232]], exitBranch: 83 },
        // #47
        { duration: 100, images: [[1488, 2232]], exitBranch: 83 },
        // #48
        { duration: 400, images: [[1612, 2232]] },
        // #49
        { duration: 100, images: [[1736, 2232]], exitBranch: 83 },
        // #50
        { duration: 100, images: [[1860, 2232]] },
        // #51
        { duration: 100, images: [[1984, 2232]], exitBranch: 83 },
        // #52
        { duration: 100, images: [[2108, 2232]] },
        // #53
        { duration: 100, images: [[2232, 2232]], exitBranch: 83 },
        // #54
        { duration: 100, images: [[2356, 2232]], exitBranch: 83 },
        // #55
        { duration: 100, images: [[2480, 2232]], exitBranch: 83 },
        // #56
        { duration: 600, images: [[2604, 2232]] },
        // #57
        { duration: 300, images: [[2728, 2232]], exitBranch: 83 },
        // #58
        { duration: 300, images: [[2852, 2232]], exitBranch: 83 },
        // #59
        { duration: 300, images: [[2976, 2232]], exitBranch: 60 },
        // #60
        { duration: 100, images: [[3100, 2232]] },
        // #61
        { duration: 100, images: [[3224, 2232]], exitBranch: 83 },
        // #62
        { duration: 100, images: [[0, 2325]] },
        // #63
        { duration: 100, images: [[124, 2325]], exitBranch: 83 },
        // #64
        { duration: 100, images: [[248, 2325]], exitBranch: 83 },
        // #65
        { duration: 100, images: [[372, 2325]], exitBranch: 83 },
        // #66
        { duration: 100, images: [[496, 2325]] },
        // #67
        { duration: 100, images: [[620, 2325]], exitBranch: 83 },
        // #68
        { duration: 200, images: [[744, 2325]] },
        // #69
        { duration: 200, images: [[868, 2325]], exitBranch: 83 },
        // #70
        { duration: 200, images: [[992, 2325]], exitBranch: 83 },
        // #71
        { duration: 200, images: [[1116, 2325]], exitBranch: 83 },
        // #72
        { duration: 200, images: [[1240, 2325]] },
        // #73
        { duration: 200, images: [[1364, 2325]], exitBranch: 83 },
        // #74
        {
          duration: 200,
          images: [[1488, 2325]],
          exitBranch: 75,
          branching: { branches: [{ frameIndex: 69, weight: 20 }] },
        },
        // #75
        { duration: 100, images: [[1612, 2325]], exitBranch: 83 },
        // #76
        { duration: 100, images: [[1736, 2325]], exitBranch: 83 },
        // #77
        { duration: 100, images: [[1860, 2325]], exitBranch: 83 },
        // #78
        { duration: 100, images: [[1984, 2325]] },
        // #79
        { duration: 100, images: [[2108, 2325]], exitBranch: 83 },
        // #80
        { duration: 100, images: [[2232, 2325]] },
        // #81
        { duration: 100, images: [[2356, 2325]] },
        // #82
        { duration: 300, images: [[2480, 2325]] },
        // #83
        { duration: 100, images: [[2604, 2325]] },
        // #84
        { duration: 100, images: [[2728, 2325]] },
        // #85
        { duration: 100, images: [[2852, 2325]] },
        // #86
        { duration: 100, images: [[2976, 2325]] },
        // #87
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookDownRight: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 6 },
        // #1
        { duration: 100, images: [[3100, 2325]], exitBranch: 5 },
        // #2
        { duration: 100, images: [[3224, 2325]], exitBranch: 4 },
        // #3
        { duration: 1200, images: [[0, 2418]] },
        // #4
        { duration: 100, images: [[124, 2418]] },
        // #5
        { duration: 100, images: [[248, 2418]] },
        // #6
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GetArtsy: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[372, 2418]] },
        // #2
        { duration: 100, images: [[496, 2418]] },
        // #3
        { duration: 100, images: [[620, 2418]] },
        // #4
        { duration: 100, images: [[744, 2418]] },
        // #5
        { duration: 100, images: [[868, 2418]] },
        // #6
        { duration: 100, images: [[992, 2418]] },
        // #7
        { duration: 100, images: [[1116, 2418]] },
        // #8
        { duration: 100, images: [[1240, 2418]] },
        // #9
        { duration: 100, images: [[1364, 2418]] },
        // #10
        { duration: 100, images: [[1488, 2418]] },
        // #11
        { duration: 400, images: [[1612, 2418]] },
        // #12
        { duration: 100, images: [[1736, 2418]] },
        // #13
        { duration: 100, images: [[1860, 2418]], sound: "10" },
        // #14
        { duration: 100, images: [[1612, 2418]] },
        // #15
        { duration: 100, images: [[1736, 2418]] },
        // #16
        { duration: 100, images: [[1860, 2418]], sound: "10" },
        // #17
        { duration: 2400, images: [[1612, 2418]] },
        // #18
        { duration: 100, images: [[744, 2418]] },
        // #19
        { duration: 100, images: [[620, 2418]] },
        // #20
        { duration: 100, images: [[496, 2418]] },
        // #21
        { duration: 100, images: [[372, 2418]], exitBranch: 22 },
        // #22
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Show: {
      frames: [
        // #0
        { duration: 10 },
        // #1
        { duration: 10, images: [[2728, 0]] },
        // #2
        { duration: 10, images: [[2604, 0]] },
        // #3
        { duration: 10, images: [[2480, 0]] },
        // #4
        { duration: 10, images: [[0, 0]] },
      ],
    },
    LookDown: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 6 },
        // #1
        { duration: 100, images: [[2852, 0]], exitBranch: 5 },
        // #2
        { duration: 100, images: [[2976, 0]], exitBranch: 4 },
        // #3
        { duration: 1200, images: [[3100, 0]] },
        // #4
        { duration: 100, images: [[3224, 0]] },
        // #5
        { duration: 100, images: [[0, 93]] },
        // #6
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Searching: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[992, 2511]] },
        // #2
        { duration: 100, images: [[1116, 2511]] },
        // #3
        { duration: 100, images: [[1240, 2511]] },
        // #4
        { duration: 100, images: [[1364, 2511]] },
        // #5
        { duration: 100, images: [[1488, 2511]], sound: "11" },
        // #6
        { duration: 100, images: [[1612, 2511]] },
        // #7
        { duration: 100, images: [[1736, 2511]] },
        // #8
        { duration: 100, images: [[1860, 2511]] },
        // #9
        { duration: 100, images: [[1984, 2511]] },
        // #10
        { duration: 100, images: [[2108, 2511]] },
        // #11
        { duration: 100, images: [[2232, 2511]] },
        // #12
        { duration: 100, images: [[2356, 2511]] },
        // #13
        { duration: 100, images: [[2480, 2511]] },
        // #14
        { duration: 100, images: [[2604, 2511]] },
        // #15
        { duration: 100, images: [[2728, 2511]] },
        // #16
        { duration: 100, images: [[2852, 2511]] },
        // #17
        { duration: 100, images: [[2976, 2511]] },
        // #18
        { duration: 100, images: [[3100, 2511]] },
        // #19
        {
          duration: 800,
          images: [[3224, 2511]],
          exitBranch: 55,
          branching: { branches: [{ frameIndex: 19, weight: 40 }] },
        },
        // #20
        { duration: 100, images: [[0, 2604]], exitBranch: 55 },
        // #21
        { duration: 100, images: [[3224, 2511]] },
        // #22
        { duration: 100, images: [[124, 2604]] },
        // #23
        { duration: 100, images: [[248, 2604]] },
        // #24
        { duration: 100, images: [[372, 2604]] },
        // #25
        { duration: 100, images: [[496, 2604]] },
        // #26
        { duration: 100, images: [[620, 2604]] },
        // #27
        {
          duration: 1000,
          images: [[744, 2604]],
          exitBranch: 54,
          branching: { branches: [{ frameIndex: 27, weight: 65 }] },
        },
        // #28
        { duration: 100, images: [[868, 2604]] },
        // #29
        { duration: 100, images: [[992, 2604]] },
        // #30
        { duration: 100, images: [[1116, 2604]] },
        // #31
        { duration: 100, images: [[1240, 2604]] },
        // #32
        {
          duration: 500,
          images: [[1364, 2604]],
          exitBranch: 33,
          branching: { branches: [{ frameIndex: 32, weight: 75 }] },
        },
        // #33
        {
          duration: 100,
          images: [[1488, 2604]],
          exitBranch: 34,
          branching: { branches: [{ frameIndex: 32, weight: 50 }] },
        },
        // #34
        { duration: 100, images: [[1364, 2604]] },
        // #35
        { duration: 100, images: [[1612, 2604]] },
        // #36
        { duration: 100, images: [[1736, 2604]] },
        // #37
        { duration: 100, images: [[1860, 2604]] },
        // #38
        { duration: 100, images: [[1984, 2604]], exitBranch: 55 },
        // #39
        { duration: 100, images: [[2108, 2604]] },
        // #40
        {
          duration: 100,
          images: [[2232, 2604]],
          exitBranch: 55,
          branching: {
            branches: [
              { frameIndex: 19, weight: 20 },
              { frameIndex: 40, weight: 80 },
            ],
          },
        },
        // #41
        { duration: 100, images: [[2356, 2604]] },
        // #42
        { duration: 100, images: [[2480, 2604]] },
        // #43
        { duration: 100, images: [[2604, 2604]] },
        // #44
        { duration: 100, images: [[2728, 2604]] },
        // #45
        { duration: 100, images: [[2852, 2604]] },
        // #46
        { duration: 100, images: [[2976, 2604]] },
        // #47
        { duration: 100, images: [[3100, 2604]] },
        // #48
        {
          duration: 100,
          images: [[3224, 2604]],
          exitBranch: 55,
          branching: { branches: [{ frameIndex: 48, weight: 75 }] },
        },
        // #49
        { duration: 100, images: [[0, 2697]] },
        // #50
        { duration: 100, images: [[124, 2697]] },
        // #51
        { duration: 100, images: [[0, 2697]] },
        // #52
        { duration: 100, images: [[3224, 2604]] },
        // #53
        {
          duration: 100,
          images: [[248, 2697]],
          exitBranch: 55,
          branching: { branches: [{ frameIndex: 49, weight: 50 }] },
        },
        // #54
        {
          duration: 100,
          images: [[372, 2697]],
          branching: { branches: [{ frameIndex: 28, weight: 100 }] },
        },
        // #55
        { duration: 100, images: [[496, 2697]] },
        // #56
        { duration: 100, images: [[620, 2697]] },
        // #57
        { duration: 100, images: [[744, 2697]] },
        // #58
        { duration: 100, images: [[868, 2697]] },
        // #59
        { duration: 100, images: [[992, 2697]] },
        // #60
        { duration: 100, images: [[0, 0]] },
      ],
    },
    EmptyTrash: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "15" },
        // #1
        { duration: 100, images: [[1116, 2697]] },
        // #2
        { duration: 100, images: [[1240, 2697]], sound: "14" },
        // #3
        { duration: 100, images: [[1364, 2697]] },
        // #4
        { duration: 100, images: [[1488, 2697]] },
        // #5
        { duration: 100, images: [[1612, 2697]] },
        // #6
        { duration: 100, images: [[1736, 2697]], exitBranch: 16 },
        // #7
        { duration: 100, images: [[1860, 2697]], sound: "3" },
        // #8
        { duration: 100, images: [[1984, 2697]] },
        // #9
        { duration: 100, images: [[2108, 2697]] },
        // #10
        { duration: 100, images: [[2232, 2697]] },
        // #11
        { duration: 100, images: [[2356, 2697]] },
        // #12
        { duration: 100, images: [[2480, 2697]], exitBranch: 16 },
        // #13
        { duration: 100, images: [[2604, 2697]], sound: "3" },
        // #14
        { duration: 100, images: [[2728, 2697]] },
        // #15
        { duration: 100, images: [[2852, 2697]] },
        // #16
        { duration: 100, images: [[2976, 2697]], exitBranch: 23 },
        // #17
        { duration: 100, images: [[3100, 2697]] },
        // #18
        { duration: 100, images: [[3224, 2697]] },
        // #19
        { duration: 100, images: [[0, 2790]], sound: "3" },
        // #20
        { duration: 100, images: [[124, 2790]] },
        // #21
        { duration: 100, images: [[248, 2790]] },
        // #22
        { duration: 100, images: [[372, 2790]] },
        // #23
        { duration: 100, images: [[496, 2790]], exitBranch: 29 },
        // #24
        { duration: 100, images: [[620, 2790]], sound: "3" },
        // #25
        { duration: 100, images: [[744, 2790]] },
        // #26
        { duration: 100, images: [[868, 2790]] },
        // #27
        { duration: 100, images: [[992, 2790]] },
        // #28
        { duration: 100, images: [[1116, 2790]] },
        // #29
        { duration: 100, images: [[1240, 2790]], exitBranch: 31, sound: "3" },
        // #30
        { duration: 100, images: [[1364, 2790]] },
        // #31
        { duration: 100, images: [[1488, 2790]] },
        // #32
        { duration: 900 },
        // #33
        { duration: 100, images: [[992, 1395]] },
        // #34
        { duration: 100, images: [[1116, 1395]] },
        // #35
        { duration: 100, images: [[1240, 1395]] },
        // #36
        { duration: 100, images: [[1364, 1395]] },
        // #37
        { duration: 100, images: [[1488, 1395]] },
        // #38
        { duration: 100, images: [[1612, 1395]] },
        // #39
        { duration: 100, images: [[1736, 1395]] },
        // #40
        { duration: 100, images: [[1860, 1395]] },
        // #41
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Greeting: {
      frames: [
        // #0
        {
          duration: 100,
          branching: { branches: [{ frameIndex: 30, weight: 40 }] },
          sound: "15",
        },
        // #1
        { duration: 100, images: [[1612, 2790]] },
        // #2
        { duration: 100, images: [[1736, 2790]], sound: "11" },
        // #3
        { duration: 100, images: [[1860, 2790]] },
        // #4
        { duration: 100, images: [[1984, 2790]] },
        // #5
        { duration: 100, images: [[2108, 2790]] },
        // #6
        { duration: 100, images: [[2232, 2790]] },
        // #7
        { duration: 100, images: [[2356, 2790]] },
        // #8
        { duration: 100, images: [[2480, 2790]] },
        // #9
        { duration: 100, images: [[2604, 2790]] },
        // #10
        { duration: 100, images: [[2728, 2790]] },
        // #11
        { duration: 100, images: [[2852, 2790]] },
        // #12
        { duration: 100, images: [[2976, 2790]] },
        // #13
        { duration: 100, images: [[3100, 2790]], sound: "14" },
        // #14
        { duration: 100, images: [[3224, 2790]] },
        // #15
        { duration: 100, images: [[0, 2883]] },
        // #16
        { duration: 100, images: [[124, 2883]] },
        // #17
        { duration: 100, images: [[248, 2883]] },
        // #18
        { duration: 300, images: [[372, 2883]] },
        // #19
        { duration: 100, images: [[496, 2883]], sound: "10" },
        // #20
        { duration: 450, images: [[372, 2883]] },
        // #21
        { duration: 100, images: [[620, 2883]] },
        // #22
        { duration: 100, images: [[744, 2883]] },
        // #23
        { duration: 100, images: [[868, 2883]], sound: "12" },
        // #24
        { duration: 100, images: [[992, 2883]] },
        // #25
        { duration: 100, images: [[1116, 2883]] },
        // #26
        { duration: 100, images: [[1240, 2883]], sound: "4" },
        // #27
        { duration: 100, images: [[1364, 2883]] },
        // #28
        { duration: 100, images: [[1488, 2883]] },
        // #29
        {
          duration: 100,
          images: [[1612, 2883]],
          branching: { branches: [{ frameIndex: 38, weight: 100 }] },
        },
        // #30
        { duration: 100, images: [[992, 1395]], sound: "11" },
        // #31
        { duration: 100, images: [[1116, 1395]] },
        // #32
        { duration: 100, images: [[1240, 1395]] },
        // #33
        { duration: 100, images: [[1364, 1395]] },
        // #34
        { duration: 100, images: [[1488, 1395]] },
        // #35
        { duration: 100, images: [[1612, 1395]] },
        // #36
        { duration: 100, images: [[1736, 1395]] },
        // #37
        { duration: 100, images: [[1860, 1395]], exitBranch: 38 },
        // #38
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookUp: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 6 },
        // #1
        { duration: 100, images: [[1736, 2883]], exitBranch: 5 },
        // #2
        { duration: 100, images: [[1860, 2883]], exitBranch: 4 },
        // #3
        { duration: 1200, images: [[1984, 2883]] },
        // #4
        { duration: 100, images: [[2108, 2883]] },
        // #5
        { duration: 100, images: [[2232, 2883]] },
        // #6
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GestureDown: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[1984, 1395]] },
        // #2
        { duration: 100, images: [[2108, 1395]] },
        // #3
        { duration: 100, images: [[2232, 1395]] },
        // #4
        { duration: 100, images: [[2356, 1395]] },
        // #5
        { duration: 100, images: [[2480, 1395]], exitBranch: 14 },
        // #6
        { duration: 100, images: [[2604, 1395]] },
        // #7
        {
          duration: 100,
          images: [[2728, 1395]],
          branching: { branches: [{ frameIndex: 5, weight: 50 }] },
        },
        // #8
        { duration: 100, images: [[2852, 1395]] },
        // #9
        { duration: 100, images: [[2976, 1395]] },
        // #10
        { duration: 100, images: [[3100, 1395]], exitBranch: 14 },
        // #11
        { duration: 100, images: [[3224, 1395]] },
        // #12
        { duration: 100, images: [[0, 1488]] },
        // #13
        { duration: 450, images: [[124, 1488]] },
        // #14
        { duration: 100, images: [[2356, 1395]] },
        // #15
        { duration: 100, images: [[2232, 1395]] },
        // #16
        { duration: 100, images: [[2108, 1395]] },
        // #17
        { duration: 100, images: [[1984, 1395]] },
        // #18
        { duration: 100, images: [[0, 0]] },
      ],
    },
    RestPose: { frames: [{ duration: 100, images: [[0, 0]] }] },
    IdleEyeBrowRaise: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 6 },
        // #1
        { duration: 100, images: [[1116, 186]] },
        // #2
        { duration: 100, images: [[1240, 186]] },
        // #3
        { duration: 900, images: [[1364, 186]] },
        // #4
        { duration: 100, images: [[1240, 186]] },
        // #5
        { duration: 100, images: [[1116, 186]] },
        // #6
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookDownLeft: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 6 },
        // #1
        { duration: 100, images: [[744, 3069]], exitBranch: 5 },
        // #2
        { duration: 100, images: [[868, 3069]], exitBranch: 4 },
        // #3
        { duration: 1200, images: [[992, 3069]] },
        // #4
        { duration: 100, images: [[1116, 3069]] },
        // #5
        { duration: 100, images: [[1240, 3069]] },
        // #6
        { duration: 100, images: [[0, 0]] },
      ],
    },
  },
});
