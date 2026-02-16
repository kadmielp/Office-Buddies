clippy.ready("Bonzi", {
  overlayCount: 2,
  sounds: ["1", "2", "3", "4", "5", "6", "7"],
  framesize: [200, 160],
  animations: {
    MoveLeft: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[200, 0]] },
        // #2
        { duration: 100, images: [[400, 0]] },
        // #3
        { duration: 100, images: [[600, 0]] },
        // #4
        { duration: 100, images: [[800, 0]] },
        // #5
        { duration: 100, images: [[1000, 0]], sound: "3" },
        // #6
        { duration: 100, images: [[1200, 0]] },
        // #7
        { duration: 100, images: [[1400, 0]] },
        // #8
        { duration: 100, images: [[1600, 0]] },
        // #9
        { duration: 100, images: [[1800, 0]] },
      ],
    },
    Congratulate: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 12 },
        // #1
        { duration: 100, images: [[2000, 0]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[2200, 0]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[2400, 0]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[2600, 0]], exitBranch: 3, sound: "6" },
        // #5
        { duration: 100, images: [[2800, 0]] },
        // #6
        { duration: 100, images: [[2600, 0]] },
        // #7
        { duration: 100, images: [[2800, 0]] },
        // #8
        { duration: 100, images: [[2600, 0]] },
        // #9
        { duration: 100, images: [[3000, 0]] },
        // #10
        { duration: 100, images: [[2600, 0]] },
        // #11
        { duration: 100, images: [[3000, 0]], exitBranch: 4 },
        // #12
        { duration: 0 },
      ],
    },
    Hide: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[3200, 0]] },
        // #2
        { duration: 100, images: [[0, 160]] },
        // #3
        { duration: 100, images: [[200, 160]] },
        // #4
        { duration: 100, images: [[400, 160]] },
        // #5
        { duration: 100, images: [[600, 160]] },
        // #6
        { duration: 100, images: [[800, 160]] },
        // #7
        { duration: 100, images: [[1000, 160]] },
        // #8
        { duration: 100, images: [[1200, 160]], sound: "1" },
        // #9
        { duration: 100, images: [[1400, 160]] },
        // #10
        { duration: 100, images: [[1600, 160]] },
        // #11
        { duration: 100, images: [[1800, 160]] },
        // #12
        { duration: 100, images: [[2000, 160]] },
        // #13
        { duration: 100, images: [[2200, 160]] },
        // #14
        { duration: 100, images: [[2400, 160]] },
        // #15
        { duration: 100, images: [[2600, 160]] },
        // #16
        { duration: 100, images: [[2800, 160]] },
        // #17
        { duration: 100, images: [[3000, 160]] },
        // #18
        { duration: 100, images: [[3200, 160]] },
        // #19
        { duration: 100, images: [[0, 320]] },
        // #20
        { duration: 100, images: [[200, 320]] },
        // #21
        { duration: 100, images: [[400, 320]] },
        // #22
        { duration: 100, images: [[600, 320]] },
        // #23
        { duration: 100, images: [[800, 320]] },
        // #24
        { duration: 100, images: [[1000, 320]] },
      ],
    },
    Acknowledge: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[1200, 320]] },
        // #2
        { duration: 100, images: [[1400, 320]] },
        // #3
        { duration: 100, images: [[1600, 320]] },
        // #4
        { duration: 100, images: [[1800, 320]] },
        // #5
        { duration: 100, images: [[2000, 320]] },
        // #6
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Suggest: { frames: [{ duration: 100, images: [[0, 0]] }] },
    Explain: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 7 },
        // #1
        { duration: 100, images: [[2200, 320]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[2400, 320]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[2600, 320]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[2800, 320]], exitBranch: 3 },
        // #5
        { duration: 100, images: [[3000, 320]], exitBranch: 3 },
        // #6
        { duration: 100, images: [[3200, 320]], exitBranch: 3 },
        // #7
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    Decline: { frames: [{ duration: 100, images: [[0, 0]] }] },
    DontRecognize: { frames: [{ duration: 100, images: [[0, 0]] }] },
    Writing: { frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }] },
    Idle3_3: { frames: [{ duration: 100, images: [[0, 0]] }] },
    Idle3_2: { frames: [{ duration: 100, images: [[0, 0]] }] },
    Idle3_1: { frames: [{ duration: 100, images: [[0, 0]] }] },
    ReadReturn: { frames: [{ duration: 100, images: [[0, 0]] }] },
    StartListening: {
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
    },
    Idle2_2: { frames: [{ duration: 100, images: [[0, 0]] }] },
    Announce: { frames: [{ duration: 100, images: [[0, 0]] }] },
    GetAttention: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[3200, 800]] },
        // #2
        { duration: 100, images: [[0, 960]] },
        // #3
        { duration: 100, images: [[200, 960]] },
        // #4
        { duration: 100, images: [[400, 960]] },
        // #5
        { duration: 100, images: [[600, 960]] },
        // #6
        { duration: 100, images: [[800, 960]], sound: "4" },
        // #7
        { duration: 100, images: [[1000, 960]] },
        // #8
        { duration: 100, images: [[400, 960]] },
        // #9
        { duration: 100, images: [[600, 960]] },
        // #10
        { duration: 100, images: [[800, 960]] },
        // #11
        { duration: 100, images: [[1000, 960]] },
        // #12
        { duration: 100, images: [[0, 960]] },
        // #13
        { duration: 100, images: [[3200, 800]] },
        // #14
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Idle2_1: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 71 },
        // #1
        { duration: 100, images: [[1200, 960]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[1400, 960]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[1600, 960]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[1800, 960]], exitBranch: 3 },
        // #5
        { duration: 100, images: [[2000, 960]], exitBranch: 4 },
        // #6
        { duration: 100, images: [[2200, 960]], exitBranch: 5 },
        // #7
        { duration: 100, images: [[2400, 960]], exitBranch: 6 },
        // #8
        { duration: 100, images: [[2600, 960]], exitBranch: 7 },
        // #9
        { duration: 100, images: [[2800, 960]], exitBranch: 8 },
        // #10
        { duration: 100, images: [[3000, 960]], exitBranch: 9 },
        // #11
        { duration: 100, images: [[3200, 960]], exitBranch: 10 },
        // #12
        { duration: 100, images: [[0, 1120]], exitBranch: 11 },
        // #13
        { duration: 100, images: [[200, 1120]], exitBranch: 12 },
        // #14
        { duration: 100, images: [[400, 1120]], exitBranch: 13 },
        // #15
        { duration: 100, images: [[600, 1120]], exitBranch: 14 },
        // #16
        { duration: 100, images: [[800, 1120]], exitBranch: 15 },
        // #17
        { duration: 100, images: [[1000, 1120]], exitBranch: 16 },
        // #18
        { duration: 100, images: [[1200, 1120]], exitBranch: 17 },
        // #19
        {
          duration: 3000,
          images: [[1400, 1120]],
          exitBranch: 18,
          branching: {
            branches: [
              { frameIndex: 52, weight: 25 },
              { frameIndex: 26, weight: 25 },
              { frameIndex: 33, weight: 25 },
            ],
          },
        },
        // #20
        { duration: 100, images: [[1600, 1120]], exitBranch: 18 },
        // #21
        { duration: 100, images: [[1800, 1120]], exitBranch: 20 },
        // #22
        { duration: 2000, images: [[2000, 1120]], exitBranch: 21 },
        // #23
        { duration: 100, images: [[2200, 1120]], exitBranch: 21 },
        // #24
        { duration: 100, images: [[1800, 1120]], exitBranch: 20 },
        // #25
        {
          duration: 100,
          images: [[1600, 1120]],
          exitBranch: 18,
          branching: { branches: [{ frameIndex: 19, weight: 100 }] },
        },
        // #26
        { duration: 100, images: [[2400, 1120]], exitBranch: 25 },
        // #27
        { duration: 100, images: [[2600, 1120]], exitBranch: 26 },
        // #28
        { duration: 100, images: [[2800, 1120]], exitBranch: 27 },
        // #29
        { duration: 2500, images: [[3000, 1120]], exitBranch: 28 },
        // #30
        { duration: 100, images: [[2800, 1120]], exitBranch: 27 },
        // #31
        { duration: 100, images: [[2600, 1120]], exitBranch: 26 },
        // #32
        {
          duration: 100,
          images: [[2400, 1120]],
          exitBranch: 18,
          branching: { branches: [{ frameIndex: 19, weight: 100 }] },
        },
        // #33
        { duration: 100, images: [[1200, 1120]], exitBranch: 18 },
        // #34
        { duration: 100, images: [[1000, 1120]], exitBranch: 33 },
        // #35
        { duration: 100, images: [[800, 1120]], exitBranch: 34 },
        // #36
        { duration: 100, images: [[600, 1120]], exitBranch: 35 },
        // #37
        { duration: 100, images: [[400, 1120]], exitBranch: 12 },
        // #38
        { duration: 100, images: [[200, 1120]], exitBranch: 12 },
        // #39
        { duration: 100, images: [[3200, 1120]], exitBranch: 12 },
        // #40
        { duration: 100, images: [[0, 1280]], exitBranch: 12 },
        // #41
        { duration: 100, images: [[3200, 1120]], exitBranch: 12 },
        // #42
        { duration: 100, images: [[200, 1120]], exitBranch: 12 },
        // #43
        { duration: 100, images: [[3200, 1120]], exitBranch: 12 },
        // #44
        { duration: 100, images: [[0, 1280]], exitBranch: 12 },
        // #45
        { duration: 100, images: [[3200, 1120]], exitBranch: 12 },
        // #46
        { duration: 300, images: [[200, 1120]], exitBranch: 12 },
        // #47
        { duration: 100, images: [[400, 1120]], exitBranch: 13 },
        // #48
        { duration: 100, images: [[600, 1120]], exitBranch: 14 },
        // #49
        { duration: 100, images: [[800, 1120]], exitBranch: 15 },
        // #50
        { duration: 100, images: [[1000, 1120]], exitBranch: 16 },
        // #51
        {
          duration: 100,
          images: [[1200, 1120]],
          exitBranch: 17,
          branching: { branches: [{ frameIndex: 19, weight: 100 }] },
        },
        // #52
        { duration: 100, images: [[1200, 1120]], exitBranch: 17 },
        // #53
        { duration: 100, images: [[1000, 1120]], exitBranch: 54 },
        // #54
        { duration: 100, images: [[800, 1120]], exitBranch: 55 },
        // #55
        { duration: 100, images: [[600, 1120]], exitBranch: 56 },
        // #56
        { duration: 100, images: [[400, 1120]], exitBranch: 57 },
        // #57
        { duration: 100, images: [[200, 1120]], exitBranch: 58 },
        // #58
        { duration: 100, images: [[0, 1120]], exitBranch: 59 },
        // #59
        { duration: 100, images: [[3200, 960]], exitBranch: 60 },
        // #60
        { duration: 100, images: [[3000, 960]], exitBranch: 61 },
        // #61
        { duration: 100, images: [[2800, 960]], exitBranch: 62 },
        // #62
        { duration: 100, images: [[2600, 960]], exitBranch: 63 },
        // #63
        { duration: 100, images: [[2400, 960]], exitBranch: 64 },
        // #64
        { duration: 100, images: [[2200, 960]], exitBranch: 65 },
        // #65
        { duration: 100, images: [[2000, 960]], exitBranch: 66 },
        // #66
        { duration: 100, images: [[1800, 960]], exitBranch: 67 },
        // #67
        { duration: 100, images: [[1600, 960]], exitBranch: 68 },
        // #68
        { duration: 100, images: [[1400, 960]], exitBranch: 69 },
        // #69
        { duration: 100, images: [[1200, 960]], exitBranch: 70 },
        // #70
        { duration: 100, images: [[0, 0]], exitBranch: 0 },
        // #71
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    GestureLeft: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 7 },
        // #1
        { duration: 100, images: [[200, 1280]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[400, 1280]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[600, 1280]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[800, 1280]], exitBranch: 3 },
        // #5
        { duration: 100, images: [[1000, 1280]], exitBranch: 4 },
        // #6
        { duration: 100, images: [[1200, 1280]], exitBranch: 5 },
        // #7
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    Surprised: { frames: [{ duration: 100, images: [[0, 0]] }] },
    Idle1_5: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[1400, 1280]] },
        // #2
        { duration: 100, images: [[1600, 1280]] },
        // #3
        { duration: 100, images: [[1800, 1280]] },
        // #4
        {
          duration: 900,
          images: [[2000, 1280]],
          branching: {
            branches: [
              { frameIndex: 5, weight: 70 },
              { frameIndex: 8, weight: 21 },
            ],
          },
        },
        // #5
        {
          duration: 100,
          images: [
            [2000, 1280],
            [2200, 1280],
          ],
        },
        // #6
        {
          duration: 100,
          images: [
            [2000, 1280],
            [2400, 1280],
          ],
        },
        // #7
        {
          duration: 100,
          images: [
            [2000, 1280],
            [2200, 1280],
          ],
        },
        // #8
        { duration: 1000, images: [[2000, 1280]] },
        // #9
        { duration: 100, images: [[1800, 1280]] },
        // #10
        { duration: 100, images: [[1600, 1280]] },
        // #11
        { duration: 100, images: [[1400, 1280]] },
        // #12
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Idle1_4: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[2600, 1280]] },
        // #2
        { duration: 100, images: [[2800, 1280]] },
        // #3
        { duration: 100, images: [[3000, 1280]] },
        // #4
        {
          duration: 900,
          images: [[3200, 1280]],
          branching: {
            branches: [
              { frameIndex: 5, weight: 60 },
              { frameIndex: 8, weight: 40 },
            ],
          },
        },
        // #5
        {
          duration: 100,
          images: [
            [3200, 1280],
            [0, 1440],
          ],
        },
        // #6
        {
          duration: 100,
          images: [
            [3200, 1280],
            [200, 1440],
          ],
        },
        // #7
        {
          duration: 100,
          images: [
            [3200, 1280],
            [0, 1440],
          ],
        },
        // #8
        { duration: 900, images: [[3200, 1280]] },
        // #9
        { duration: 100, images: [[3000, 1280]] },
        // #10
        { duration: 100, images: [[2800, 1280]] },
        // #11
        { duration: 100, images: [[2600, 1280]] },
        // #12
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookRight: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 12 },
        // #1
        { duration: 100, images: [[1800, 800]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[2000, 800]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[2200, 800]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[2400, 800]], exitBranch: 3 },
        // #5
        {
          duration: 400,
          images: [[2600, 800]],
          exitBranch: 4,
          branching: {
            branches: [
              { frameIndex: 6, weight: 33 },
              { frameIndex: 7, weight: 33 },
              { frameIndex: 8, weight: 34 },
            ],
          },
        },
        // #6
        {
          duration: 1400,
          images: [[2600, 800]],
          exitBranch: 4,
          branching: { branches: [{ frameIndex: 8, weight: 100 }] },
        },
        // #7
        { duration: 3500, images: [[2600, 800]], exitBranch: 4 },
        // #8
        {
          duration: 100,
          images: [
            [2600, 800],
            [2800, 800],
          ],
          exitBranch: 4,
        },
        // #9
        {
          duration: 100,
          images: [
            [2600, 800],
            [3000, 800],
          ],
          exitBranch: 8,
        },
        // #10
        {
          duration: 100,
          images: [
            [2600, 800],
            [2800, 800],
          ],
          exitBranch: 4,
        },
        // #11
        {
          duration: 1200,
          images: [[2600, 800]],
          exitBranch: 4,
          branching: { branches: [{ frameIndex: 5, weight: 100 }] },
        },
        // #12
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    GestureUp: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 7 },
        // #1
        { duration: 100, images: [[1200, 1440]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[1400, 1440]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[1600, 1440]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[1800, 1440]], exitBranch: 3 },
        // #5
        { duration: 100, images: [[2000, 1440]], exitBranch: 4 },
        // #6
        { duration: 100, images: [[2200, 1440]], exitBranch: 5 },
        // #7
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    Idle1_1: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[2400, 1440]] },
        // #2
        { duration: 100, images: [[2600, 1440]] },
        // #3
        { duration: 100, images: [[2800, 1440]] },
        // #4
        { duration: 100, images: [[3000, 1440]] },
        // #5
        { duration: 100, images: [[3200, 1440]] },
        // #6
        { duration: 1100, images: [[0, 1600]] },
        // #7
        { duration: 100, images: [[3200, 1440]] },
        // #8
        { duration: 100, images: [[3000, 1440]] },
        // #9
        { duration: 100, images: [[2800, 1440]] },
        // #10
        { duration: 100, images: [[2600, 1440]] },
        // #11
        { duration: 100, images: [[2400, 1440]] },
        // #12
        {
          duration: 1300,
          images: [[0, 0]],
          branching: { branches: [{ frameIndex: 0, weight: 70 }] },
        },
      ],
    },
    Idle1_3: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[200, 1600]] },
        // #2
        { duration: 100, images: [[400, 1600]] },
        // #3
        { duration: 100, images: [[600, 1600]] },
        // #4
        {
          duration: 500,
          images: [[800, 1600]],
          branching: {
            branches: [
              { frameIndex: 5, weight: 50 },
              { frameIndex: 8, weight: 50 },
            ],
          },
        },
        // #5
        {
          duration: 100,
          images: [
            [800, 1600],
            [1000, 1600],
          ],
        },
        // #6
        {
          duration: 100,
          images: [
            [800, 1600],
            [1200, 1600],
          ],
        },
        // #7
        {
          duration: 100,
          images: [
            [800, 1600],
            [1000, 1600],
          ],
        },
        // #8
        { duration: 1000, images: [[800, 1600]] },
        // #9
        { duration: 100, images: [[600, 1600]] },
        // #10
        { duration: 100, images: [[400, 1600]] },
        // #11
        { duration: 100, images: [[200, 1600]] },
        // #12
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Idle1_2: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[1400, 1600]] },
        // #2
        { duration: 100, images: [[1600, 1600]] },
        // #3
        { duration: 100, images: [[1800, 1600]] },
        // #4
        { duration: 100, images: [[2000, 1600]] },
        // #5
        { duration: 100, images: [[2200, 1600]] },
        // #6
        { duration: 100, images: [[1400, 1600]] },
        // #7
        { duration: 100, images: [[1600, 1600]] },
        // #8
        { duration: 100, images: [[1800, 1600]] },
        // #9
        { duration: 100, images: [[2000, 1600]] },
        // #10
        { duration: 100, images: [[2200, 1600]] },
        // #11
        { duration: 100, images: [[1400, 1600]] },
        // #12
        { duration: 100, images: [[1600, 1600]] },
        // #13
        { duration: 100, images: [[1800, 1600]] },
        // #14
        { duration: 100, images: [[2000, 1600]] },
        // #15
        { duration: 100, images: [[2200, 1600]] },
        // #16
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Read: { frames: [{ duration: 100, images: [[0, 0]] }] },
    Processing: {
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
    },
    Alert: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[600, 1760]], exitBranch: 0 },
      ],
    },
    DoMagic1: { frames: [{ duration: 100, images: [[0, 0]] }] },
    DoMagic2: { frames: [{ duration: 100, images: [[0, 0]] }] },
    Confused: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 13 },
        // #1
        { duration: 100, images: [[200, 2880]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[400, 2880]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[600, 2880]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[800, 2880]], exitBranch: 3 },
        // #5
        { duration: 100, images: [[1000, 2880]], exitBranch: 4 },
        // #6
        {
          duration: 300,
          images: [
            [1400, 2880],
            [1200, 2880],
          ],
          exitBranch: 5,
        },
        // #7
        {
          duration: 100,
          images: [
            [1400, 2880],
            [1600, 2880],
          ],
          exitBranch: 5,
        },
        // #8
        {
          duration: 100,
          images: [
            [1400, 2880],
            [1800, 2880],
          ],
          exitBranch: 5,
        },
        // #9
        {
          duration: 100,
          images: [
            [1400, 2880],
            [1600, 2880],
          ],
          exitBranch: 5,
        },
        // #10
        {
          duration: 100,
          images: [
            [1400, 2880],
            [1200, 2880],
          ],
          exitBranch: 5,
        },
        // #11
        {
          duration: 100,
          images: [
            [1400, 2880],
            [1600, 2880],
          ],
          exitBranch: 5,
        },
        // #12
        {
          duration: 100,
          images: [
            [1400, 2880],
            [1800, 2880],
          ],
          exitBranch: 5,
        },
        // #13
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    GetAttention2: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "2" },
        // #1
        { duration: 100, images: [[1600, 3040]] },
        // #2
        { duration: 100, images: [[1800, 3040]] },
        // #3
        { duration: 100, images: [[2000, 3040]] },
        // #4
        { duration: 100, images: [[2200, 3040]] },
        // #5
        { duration: 100, images: [[2400, 3040]] },
        // #6
        { duration: 100, images: [[2600, 3040]] },
        // #7
        { duration: 100, images: [[2800, 3040]] },
        // #8
        { duration: 100, images: [[3000, 3040]] },
        // #9
        { duration: 100, images: [[3200, 3040]] },
        // #10
        { duration: 100, images: [[0, 3200]] },
        // #11
        { duration: 100, images: [[200, 3200]] },
        // #12
        { duration: 100, images: [[400, 3200]] },
        // #13
        { duration: 100, images: [[600, 3200]] },
        // #14
        { duration: 100, images: [[0, 0]] },
      ],
    },
    MoveRight: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[800, 1760]] },
        // #2
        { duration: 100, images: [[1000, 1760]] },
        // #3
        { duration: 100, images: [[1200, 1760]] },
        // #4
        { duration: 100, images: [[1400, 1760]] },
        // #5
        { duration: 100, images: [[1600, 1760]], sound: "3" },
        // #6
        { duration: 100, images: [[1800, 1760]] },
        // #7
        { duration: 100, images: [[2000, 1760]] },
        // #8
        { duration: 100, images: [[2200, 1760]] },
        // #9
        { duration: 100, images: [[2400, 1760]] },
        // #10
        { duration: 100, images: [[2600, 1760]] },
      ],
    },
    Reading: { frames: [{ duration: 100, images: [[0, 0]] }] },
    LookUp: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 11 },
        // #1
        { duration: 100, images: [[400, 2080]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[200, 2080]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[0, 2080]], exitBranch: 2 },
        // #4
        {
          duration: 400,
          images: [[2400, 2080]],
          exitBranch: 3,
          branching: {
            branches: [
              { frameIndex: 7, weight: 33 },
              { frameIndex: 6, weight: 33 },
              { frameIndex: 5, weight: 34 },
            ],
          },
        },
        // #5
        {
          duration: 1400,
          images: [[2400, 2080]],
          exitBranch: 3,
          branching: { branches: [{ frameIndex: 7, weight: 100 }] },
        },
        // #6
        { duration: 3500, images: [[2400, 2080]], exitBranch: 3 },
        // #7
        {
          duration: 100,
          images: [
            [2400, 2080],
            [2600, 2080],
          ],
          exitBranch: 4,
        },
        // #8
        {
          duration: 180,
          images: [
            [2400, 2080],
            [2800, 2080],
          ],
          exitBranch: 7,
        },
        // #9
        {
          duration: 100,
          images: [
            [2400, 2080],
            [2600, 2080],
          ],
          exitBranch: 4,
        },
        // #10
        {
          duration: 1200,
          images: [[2400, 2080]],
          exitBranch: 3,
          branching: { branches: [{ frameIndex: 4, weight: 100 }] },
        },
        // #11
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    GetAttentionContinued: {
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
    },
    WriteContinued: {
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
    },
    Search: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 44 },
        // #1
        { duration: 100, images: [[0, 480]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[200, 480]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[400, 480]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[600, 480]], exitBranch: 37 },
        // #5
        { duration: 100, images: [[800, 480]], exitBranch: 37 },
        // #6
        { duration: 100, images: [[1000, 480]], exitBranch: 37 },
        // #7
        { duration: 100, images: [[1200, 480]], exitBranch: 37 },
        // #8
        { duration: 100, images: [[1400, 480]], exitBranch: 37 },
        // #9
        { duration: 100, images: [[1600, 480]], exitBranch: 37 },
        // #10
        { duration: 100, images: [[1800, 480]], exitBranch: 37 },
        // #11
        { duration: 100, images: [[2000, 480]], exitBranch: 37 },
        // #12
        { duration: 100, images: [[2200, 480]], exitBranch: 37 },
        // #13
        { duration: 100, images: [[2400, 480]], exitBranch: 37 },
        // #14
        { duration: 100, images: [[2600, 480]], exitBranch: 37 },
        // #15
        { duration: 100, images: [[2800, 480]], exitBranch: 37 },
        // #16
        { duration: 100, images: [[3000, 480]], exitBranch: 37 },
        // #17
        { duration: 100, images: [[3200, 480]], exitBranch: 37 },
        // #18
        { duration: 100, images: [[0, 640]], exitBranch: 37 },
        // #19
        { duration: 100, images: [[200, 640]], exitBranch: 37 },
        // #20
        { duration: 100, images: [[400, 640]], exitBranch: 37 },
        // #21
        { duration: 100, images: [[600, 640]], exitBranch: 37 },
        // #22
        { duration: 100, images: [[800, 640]], exitBranch: 37 },
        // #23
        { duration: 100, images: [[1000, 640]], exitBranch: 37 },
        // #24
        { duration: 100, images: [[1200, 640]], exitBranch: 37 },
        // #25
        { duration: 100, images: [[1400, 640]], exitBranch: 37 },
        // #26
        { duration: 100, images: [[1600, 640]], exitBranch: 37 },
        // #27
        { duration: 100, images: [[1800, 640]], exitBranch: 37 },
        // #28
        { duration: 100, images: [[2000, 640]], exitBranch: 37 },
        // #29
        { duration: 100, images: [[2200, 640]], exitBranch: 37 },
        // #30
        { duration: 100, images: [[2400, 640]], exitBranch: 37 },
        // #31
        { duration: 100, images: [[1600, 480]], exitBranch: 37 },
        // #32
        { duration: 100, images: [[1800, 480]], exitBranch: 37 },
        // #33
        { duration: 100, images: [[2000, 480]], exitBranch: 37 },
        // #34
        { duration: 100, images: [[2200, 480]], exitBranch: 37 },
        // #35
        { duration: 100, images: [[2400, 480]], exitBranch: 37 },
        // #36
        { duration: 100, images: [[0, 640]], exitBranch: 37 },
        // #37
        { duration: 100, images: [[2600, 640]], exitBranch: 38 },
        // #38
        { duration: 100, images: [[2800, 640]], exitBranch: 39 },
        // #39
        { duration: 100, images: [[3000, 640]], exitBranch: 40 },
        // #40
        { duration: 100, images: [[3200, 640]], exitBranch: 41 },
        // #41
        { duration: 100, images: [[0, 800]], exitBranch: 42 },
        // #42
        { duration: 100, images: [[200, 800]], exitBranch: 0 },
        // #43
        { duration: 100, images: [[0, 0]], exitBranch: 0 },
        // #44
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    Uncertain: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 11 },
        // #1
        { duration: 100, images: [[800, 1920]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[1000, 1920]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[1200, 1920]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[1400, 1920]], exitBranch: 8 },
        // #5
        { duration: 100, images: [[1600, 1920]], exitBranch: 7 },
        // #6
        {
          duration: 100,
          images: [[1800, 1920]],
          exitBranch: 7,
          branching: { branches: [{ frameIndex: 11, weight: 100 }] },
        },
        // #7
        { duration: 100, images: [[2000, 1920]], exitBranch: 8 },
        // #8
        { duration: 100, images: [[2200, 1920]], exitBranch: 9 },
        // #9
        { duration: 100, images: [[2400, 1920]], exitBranch: 10 },
        // #10
        { duration: 100, images: [[2600, 1920]], exitBranch: 11 },
        // #11
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    LookLeft: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 12 },
        // #1
        { duration: 100, images: [[1000, 1440]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[800, 1440]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[600, 1440]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[400, 1440]], exitBranch: 3 },
        // #5
        {
          duration: 400,
          images: [[2800, 1920]],
          exitBranch: 4,
          branching: {
            branches: [
              { frameIndex: 6, weight: 33 },
              { frameIndex: 7, weight: 33 },
              { frameIndex: 8, weight: 34 },
            ],
          },
        },
        // #6
        {
          duration: 1400,
          images: [[2800, 1920]],
          exitBranch: 4,
          branching: { branches: [{ frameIndex: 8, weight: 100 }] },
        },
        // #7
        { duration: 3500, images: [[2800, 1920]], exitBranch: 4 },
        // #8
        {
          duration: 100,
          images: [
            [2800, 1920],
            [3000, 1920],
          ],
          exitBranch: 4,
        },
        // #9
        {
          duration: 100,
          images: [
            [2800, 1920],
            [3200, 1920],
          ],
          exitBranch: 8,
        },
        // #10
        {
          duration: 100,
          images: [
            [2800, 1920],
            [3000, 1920],
          ],
          exitBranch: 4,
        },
        // #11
        {
          duration: 1200,
          images: [[2800, 1920]],
          exitBranch: 4,
          branching: { branches: [{ frameIndex: 5, weight: 100 }] },
        },
        // #12
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    LookDownReturn: {
      frames: [
        // #0
        { duration: 100, images: [[800, 800]] },
        // #1
        { duration: 100, images: [[600, 800]] },
        // #2
        { duration: 100, images: [[400, 800]] },
        // #3
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookUpReturn: {
      frames: [
        // #0
        { duration: 100, images: [[0, 2080]] },
        // #1
        { duration: 100, images: [[200, 2080]] },
        // #2
        { duration: 100, images: [[400, 2080]] },
        // #3
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookLeftReturn: {
      frames: [
        // #0
        { duration: 100, images: [[400, 1440]] },
        // #1
        { duration: 100, images: [[600, 1440]] },
        // #2
        { duration: 100, images: [[800, 1440]] },
        // #3
        { duration: 100, images: [[1000, 1440]] },
        // #4
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Greet: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 10 },
        // #1
        { duration: 100, images: [[600, 2080]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[800, 2080]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[1000, 2080]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[1200, 2080]], exitBranch: 3 },
        // #5
        { duration: 100, images: [[1400, 2080]], exitBranch: 4 },
        // #6
        { duration: 100, images: [[1600, 2080]], exitBranch: 5 },
        // #7
        { duration: 100, images: [[1800, 2080]], exitBranch: 6 },
        // #8
        { duration: 100, images: [[2000, 2080]], exitBranch: 7 },
        // #9
        { duration: 200, images: [[2200, 2080]], exitBranch: 8 },
        // #10
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    Hearing_1: { frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }] },
    Idle1_6: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[400, 2080]] },
        // #2
        { duration: 100, images: [[200, 2080]] },
        // #3
        { duration: 100, images: [[0, 2080]] },
        // #4
        {
          duration: 900,
          images: [[2400, 2080]],
          branching: {
            branches: [
              { frameIndex: 5, weight: 60 },
              { frameIndex: 8, weight: 40 },
            ],
          },
        },
        // #5
        {
          duration: 100,
          images: [
            [2400, 2080],
            [2600, 2080],
          ],
        },
        // #6
        {
          duration: 180,
          images: [
            [2400, 2080],
            [2800, 2080],
          ],
        },
        // #7
        {
          duration: 100,
          images: [
            [2400, 2080],
            [2600, 2080],
          ],
        },
        // #8
        { duration: 1200, images: [[2400, 2080]] },
        // #9
        { duration: 100, images: [[0, 2080]] },
        // #10
        { duration: 100, images: [[200, 2080]] },
        // #11
        { duration: 100, images: [[400, 2080]] },
        // #12
        { duration: 100, images: [[0, 0]] },
      ],
    },
    WriteReturn: { frames: [{ duration: 100, images: [[0, 0]] }] },
    Hearing_2: { frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }] },
    GetAttentionReturn: {
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
    },
    GestureRight: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 7 },
        // #1
        { duration: 100, images: [[400, 3040]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[600, 3040]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[800, 3040]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[1000, 3040]], exitBranch: 3 },
        // #5
        { duration: 100, images: [[1200, 3040]], exitBranch: 4 },
        // #6
        { duration: 100, images: [[1400, 3040]], exitBranch: 5 },
        // #7
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    Think: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 7 },
        // #1
        { duration: 100, images: [[800, 2240]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[1000, 2240]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[1200, 2240]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[1400, 2240]], exitBranch: 3 },
        // #5
        { duration: 100, images: [[1600, 2240]], exitBranch: 4 },
        // #6
        { duration: 100, images: [[1800, 2240]], exitBranch: 5 },
        // #7
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    Blink: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        {
          duration: 100,
          images: [
            [0, 0],
            [2000, 2880],
          ],
        },
        // #2
        {
          duration: 200,
          images: [
            [0, 0],
            [2200, 2880],
          ],
        },
        // #3
        {
          duration: 100,
          images: [
            [0, 0],
            [2000, 2880],
          ],
        },
        // #4
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Write: { frames: [{ duration: 100, images: [[0, 0]] }] },
    MoveRightReturn: {
      frames: [
        // #0
        { duration: 100, images: [[2600, 1760]] },
        // #1
        { duration: 100, images: [[1600, 2400]] },
        // #2
        { duration: 100, images: [[1800, 2400]] },
        // #3
        { duration: 100, images: [[2000, 2400]] },
        // #4
        { duration: 100, images: [[2200, 2400]] },
        // #5
        { duration: 100, images: [[2400, 2400]] },
        // #6
        { duration: 100, images: [[2600, 2400]], sound: "5" },
        // #7
        { duration: 100, images: [[2800, 2400]] },
        // #8
        { duration: 100, images: [[3000, 2400]] },
        // #9
        { duration: 100, images: [[0, 0]] },
      ],
    },
    MoveUpReturn: {
      frames: [
        // #0
        { duration: 100, images: [[3200, 2400]] },
        // #1
        { duration: 100, images: [[0, 2560]] },
        // #2
        { duration: 100, images: [[200, 2560]] },
        // #3
        { duration: 100, images: [[400, 2560]], sound: "5" },
        // #4
        { duration: 100, images: [[600, 2560]] },
        // #5
        { duration: 100, images: [[800, 2560]] },
        // #6
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Show: {
      frames: [
        // #0
        { duration: 100, images: [[1000, 320]] },
        // #1
        { duration: 100, images: [[1000, 2560]] },
        // #2
        { duration: 100, images: [[1200, 2560]] },
        // #3
        { duration: 100, images: [[1400, 2560]] },
        // #4
        { duration: 100, images: [[1600, 2560]] },
        // #5
        { duration: 100, images: [[1800, 2560]] },
        // #6
        { duration: 100, images: [[2000, 2560]] },
        // #7
        { duration: 100, images: [[2200, 2560]] },
        // #8
        { duration: 100, images: [[2400, 2560]] },
        // #9
        { duration: 100, images: [[2600, 2560]] },
        // #10
        { duration: 100, images: [[2800, 2560]] },
        // #11
        { duration: 100, images: [[3000, 2560]] },
        // #12
        { duration: 100, images: [[3200, 2560]] },
        // #13
        { duration: 100, images: [[0, 2720]] },
        // #14
        { duration: 100, images: [[200, 2720]] },
        // #15
        { duration: 100, images: [[400, 2720]] },
        // #16
        { duration: 100, images: [[600, 2720]] },
        // #17
        { duration: 100, images: [[800, 2720]] },
        // #18
        { duration: 100, images: [[1000, 2720]] },
        // #19
        { duration: 100, images: [[1200, 2720]] },
        // #20
        { duration: 100, images: [[1400, 2720]], sound: "7" },
        // #21
        { duration: 100, images: [[1600, 2720]] },
        // #22
        { duration: 100, images: [[1800, 2720]] },
        // #23
        { duration: 100, images: [[2000, 2720]] },
        // #24
        { duration: 100, images: [[2200, 2720]] },
        // #25
        { duration: 100, images: [[2400, 2720]] },
        // #26
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Wave: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 29 },
        // #1
        { duration: 100, images: [[2000, 2240]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[2200, 2240]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[2400, 2240]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[2600, 2240]], exitBranch: 3 },
        // #5
        { duration: 100, images: [[2800, 2240]], exitBranch: 25 },
        // #6
        { duration: 100, images: [[3000, 2240]], exitBranch: 5 },
        // #7
        { duration: 100, images: [[3200, 2240]], exitBranch: 6 },
        // #8
        { duration: 100, images: [[0, 2400]], exitBranch: 7 },
        // #9
        { duration: 100, images: [[200, 2400]], exitBranch: 8 },
        // #10
        { duration: 100, images: [[400, 2400]], exitBranch: 9 },
        // #11
        { duration: 100, images: [[600, 2400]], exitBranch: 10 },
        // #12
        { duration: 100, images: [[400, 2400]], exitBranch: 11 },
        // #13
        { duration: 100, images: [[200, 2400]], exitBranch: 14 },
        // #14
        { duration: 100, images: [[0, 2400]], exitBranch: 15 },
        // #15
        { duration: 100, images: [[3200, 2240]], exitBranch: 24 },
        // #16
        { duration: 100, images: [[0, 2400]], exitBranch: 15 },
        // #17
        { duration: 100, images: [[200, 2400]], exitBranch: 16 },
        // #18
        { duration: 100, images: [[400, 2400]], exitBranch: 17 },
        // #19
        { duration: 100, images: [[600, 2400]], exitBranch: 20 },
        // #20
        { duration: 100, images: [[400, 2400]], exitBranch: 21 },
        // #21
        { duration: 100, images: [[200, 2400]], exitBranch: 22 },
        // #22
        { duration: 100, images: [[0, 2400]], exitBranch: 23 },
        // #23
        { duration: 100, images: [[3200, 2240]], exitBranch: 24 },
        // #24
        { duration: 100, images: [[800, 2400]], exitBranch: 25 },
        // #25
        { duration: 100, images: [[1000, 2400]], exitBranch: 26 },
        // #26
        { duration: 100, images: [[1200, 2400]], exitBranch: 27 },
        // #27
        { duration: 100, images: [[1400, 2400]], exitBranch: 28 },
        // #28
        { duration: 100, images: [[0, 0]], exitBranch: 0 },
        // #29
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    Searching: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 37 },
        // #1
        { duration: 100, images: [[0, 480]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[200, 480]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[400, 480]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[600, 480]], exitBranch: 31 },
        // #5
        { duration: 100, images: [[800, 480]], exitBranch: 31 },
        // #6
        { duration: 100, images: [[1000, 480]], exitBranch: 31 },
        // #7
        { duration: 100, images: [[1200, 480]], exitBranch: 31 },
        // #8
        { duration: 100, images: [[1400, 480]], exitBranch: 31 },
        // #9
        { duration: 100, images: [[1600, 480]], exitBranch: 31 },
        // #10
        { duration: 100, images: [[1800, 480]], exitBranch: 31 },
        // #11
        { duration: 100, images: [[2000, 480]], exitBranch: 31 },
        // #12
        { duration: 100, images: [[2200, 480]], exitBranch: 31 },
        // #13
        { duration: 100, images: [[2400, 480]], exitBranch: 31 },
        // #14
        { duration: 100, images: [[2600, 480]], exitBranch: 31 },
        // #15
        { duration: 100, images: [[2800, 480]], exitBranch: 31 },
        // #16
        { duration: 100, images: [[3000, 480]], exitBranch: 31 },
        // #17
        { duration: 100, images: [[3200, 480]], exitBranch: 31 },
        // #18
        { duration: 100, images: [[0, 640]], exitBranch: 31 },
        // #19
        { duration: 100, images: [[200, 640]], exitBranch: 31 },
        // #20
        { duration: 100, images: [[400, 640]], exitBranch: 31 },
        // #21
        { duration: 100, images: [[600, 640]], exitBranch: 31 },
        // #22
        { duration: 100, images: [[800, 640]], exitBranch: 31 },
        // #23
        { duration: 100, images: [[1000, 640]], exitBranch: 31 },
        // #24
        { duration: 100, images: [[1200, 640]], exitBranch: 31 },
        // #25
        { duration: 100, images: [[1400, 640]], exitBranch: 31 },
        // #26
        { duration: 100, images: [[1600, 640]], exitBranch: 31 },
        // #27
        { duration: 100, images: [[1800, 640]], exitBranch: 31 },
        // #28
        { duration: 100, images: [[2000, 640]], exitBranch: 31 },
        // #29
        { duration: 100, images: [[2200, 640]], exitBranch: 31 },
        // #30
        {
          duration: 100,
          images: [[2400, 640]],
          exitBranch: 31,
          branching: { branches: [{ frameIndex: 8, weight: 100 }] },
        },
        // #31
        { duration: 100, images: [[2600, 640]], exitBranch: 32 },
        // #32
        { duration: 100, images: [[2800, 640]], exitBranch: 33 },
        // #33
        { duration: 100, images: [[3000, 640]], exitBranch: 34 },
        // #34
        { duration: 100, images: [[3200, 640]], exitBranch: 35 },
        // #35
        { duration: 100, images: [[0, 800]], exitBranch: 36 },
        // #36
        { duration: 0, images: [[200, 800]], exitBranch: 0 },
        // #37
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    StopListening: {
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
      frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }],
    },
    MoveDown: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[2600, 2720]] },
        // #2
        { duration: 100, images: [[2800, 2720]] },
        // #3
        { duration: 100, images: [[3000, 2720]] },
        // #4
        { duration: 100, images: [[3200, 2720]], sound: "3" },
        // #5
        { duration: 100, images: [[0, 2880]] },
      ],
    },
    ReadContinued: { frames: [{ duration: 100, images: [[0, 0]] }] },
    LookDown: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 12 },
        // #1
        { duration: 100, images: [[400, 800]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[600, 800]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[800, 800]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[1000, 800]], exitBranch: 3 },
        // #5
        {
          duration: 400,
          images: [[1200, 800]],
          exitBranch: 4,
          branching: {
            branches: [
              { frameIndex: 6, weight: 33 },
              { frameIndex: 7, weight: 33 },
              { frameIndex: 8, weight: 34 },
            ],
          },
        },
        // #6
        {
          duration: 1400,
          images: [[1200, 800]],
          exitBranch: 4,
          branching: { branches: [{ frameIndex: 8, weight: 100 }] },
        },
        // #7
        { duration: 3500, images: [[1200, 800]], exitBranch: 4 },
        // #8
        {
          duration: 100,
          images: [
            [1200, 800],
            [1400, 800],
          ],
          exitBranch: 4,
        },
        // #9
        {
          duration: 100,
          images: [
            [1200, 800],
            [1600, 800],
          ],
          exitBranch: 8,
        },
        // #10
        {
          duration: 100,
          images: [
            [1200, 800],
            [1400, 800],
          ],
          exitBranch: 4,
        },
        // #11
        {
          duration: 1200,
          images: [[1200, 800]],
          exitBranch: 4,
          branching: { branches: [{ frameIndex: 5, weight: 100 }] },
        },
        // #12
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    Sad: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 7 },
        // #1
        { duration: 100, images: [[3000, 2080]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[3200, 2080]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[0, 2240]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[200, 2240]], exitBranch: 3 },
        // #5
        { duration: 100, images: [[400, 2240]], exitBranch: 4 },
        // #6
        { duration: 100, images: [[600, 2240]], exitBranch: 5 },
        // #7
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    LookRightReturn: {
      frames: [
        // #0
        { duration: 100, images: [[2400, 800]] },
        // #1
        { duration: 100, images: [[2200, 800]] },
        // #2
        { duration: 100, images: [[2000, 800]] },
        // #3
        { duration: 100, images: [[1800, 800]] },
        // #4
        { duration: 100, images: [[0, 0]], exitBranch: 4 },
      ],
    },
    MoveDownReturn: {
      frames: [
        // #0
        { duration: 100, images: [[2400, 2880]] },
        // #1
        { duration: 100, images: [[3200, 2720]] },
        // #2
        { duration: 100, images: [[3000, 2720]], sound: "5" },
        // #3
        { duration: 100, images: [[2800, 2720]] },
        // #4
        { duration: 100, images: [[2600, 2720]] },
        // #5
        { duration: 100, images: [[0, 0]] },
      ],
    },
    MoveLeftReturn: {
      frames: [
        // #0
        { duration: 100, images: [[2800, 1760]] },
        // #1
        { duration: 100, images: [[3000, 1760]] },
        // #2
        { duration: 100, images: [[3200, 1760]] },
        // #3
        { duration: 100, images: [[0, 1920]] },
        // #4
        { duration: 100, images: [[200, 1920]], sound: "5" },
        // #5
        { duration: 100, images: [[400, 1920]] },
        // #6
        { duration: 100, images: [[600, 1920]] },
        // #7
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GestureDown: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 7 },
        // #1
        { duration: 100, images: [[2600, 2880]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[2800, 2880]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[3000, 2880]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[3200, 2880]], exitBranch: 3 },
        // #5
        { duration: 100, images: [[0, 3040]], exitBranch: 4 },
        // #6
        { duration: 100, images: [[200, 3040]], exitBranch: 5 },
        // #7
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    Process: { frames: [{ duration: 100, images: [[0, 0]], exitBranch: 0 }] },
    RestPose: { frames: [{ duration: 100, images: [[0, 0]] }] },
    Pleased: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 13 },
        // #1
        { duration: 100, images: [[2400, 1600]], exitBranch: 0 },
        // #2
        { duration: 100, images: [[2600, 1600]], exitBranch: 1 },
        // #3
        { duration: 100, images: [[2800, 1600]], exitBranch: 2 },
        // #4
        { duration: 100, images: [[3000, 1600]], exitBranch: 2 },
        // #5
        { duration: 100, images: [[3200, 1600]], exitBranch: 4 },
        // #6
        { duration: 100, images: [[0, 1760]], exitBranch: 4 },
        // #7
        { duration: 100, images: [[200, 1760]], exitBranch: 4 },
        // #8
        { duration: 100, images: [[400, 1760]], exitBranch: 2 },
        // #9
        { duration: 1000, images: [[2800, 1600]], exitBranch: 2 },
        // #10
        { duration: 100, images: [[2600, 1600]], exitBranch: 1 },
        // #11
        { duration: 100, images: [[2400, 1600]], exitBranch: 0 },
        // #12
        { duration: 100, images: [[0, 0]], exitBranch: 13 },
        // #13
        { duration: 0 },
      ],
      useExitBranching: true,
    },
    MoveUp: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[800, 2560]] },
        // #2
        { duration: 100, images: [[600, 2560]] },
        // #3
        { duration: 100, images: [[400, 2560]] },
        // #4
        { duration: 100, images: [[200, 2560]], sound: "3" },
        // #5
        { duration: 100, images: [[0, 2560]] },
      ],
    },
  },
});
