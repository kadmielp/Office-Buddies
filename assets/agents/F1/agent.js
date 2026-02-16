clippy.ready("F1", {
  overlayCount: 2,
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
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ],
  framesize: [124, 93],
  animations: {
    Congratulate: {
      frames: [
        // #0
        {
          duration: 100,
          images: [[0, 0]],
          exitBranch: 46,
          sound: "29",
          branching: { branches: [
            { frameIndex: 1, weight: 33 },
            { frameIndex: 23, weight: 33 },
            { frameIndex: 28, weight: 33 }]
           },
        },
        // #1
        { duration: 100, images: [[124, 0]] },
        // #2
        { duration: 100, images: [[248, 0]] },
        // #3
        { duration: 100, images: [[372, 0]] },
        // #4
        { duration: 100, images: [[496, 0]] },
        // #5
        { duration: 100, images: [[620, 0]] },
        // #6
        { duration: 100, images: [[744, 0]] },
        // #7
        { duration: 100, images: [[868, 0]], sound: "15" },
        // #8
        { duration: 100, images: [[992, 0]] },
        // #9
        { duration: 1000, images: [[1116, 0]], exitBranch: 20 },
        // #10
        { duration: 330, images: [[1240, 0]] },
        // #11
        { duration: 500, images: [[1116, 0]], exitBranch: 20 },
        // #12
        { duration: 100, images: [[1240, 0]] },
        // #13
        { duration: 300, images: [[1116, 0]], exitBranch: 20 },
        // #14
        { duration: 100, images: [[1240, 0]] },
        // #15
        { duration: 600, images: [[1116, 0]], exitBranch: 20 },
        // #16
        { duration: 100, images: [[1240, 0]] },
        // #17
        { duration: 1000, images: [[1116, 0]], exitBranch: 20 },
        // #18
        { duration: 330, images: [[1240, 0]] },
        // #19
        { duration: 660, images: [[1364, 0]] },
        // #20
        { duration: 200, images: [[1488, 0]], sound: "22" },
        // #21
        { duration: 130, images: [[1612, 0]], exitBranch: 46 },
        // #22
        {
          duration: 100,
          images: [[124, 0]],
          exitBranch: 46,
          branching: { branches: [{ frameIndex: 46, weight: 100 }] },
        },
        // #23
        { duration: 100, images: [[1736, 0]] },
        // #24
        { duration: 100, images: [[1860, 0]] },
        // #25
        { duration: 100, images: [[1984, 0]] },
        // #26
        { duration: 100, images: [[2108, 0]] },
        // #27
        { duration: 100, images: [[2232, 0]], sound: "11" },
        // #28
        { duration: 100, images: [[2356, 0]] },
        // #29
        { duration: 100, images: [[2480, 0]] },
        // #30
        { duration: 100, images: [[2604, 0]], exitBranch: 34 },
        // #31
        { duration: 160, images: [[2728, 0]] },
        // #32
        { duration: 200, images: [[2852, 0]], exitBranch: 35 },
        // #33
        { duration: 300, images: [[2976, 0]] },
        // #34
        { duration: 200, images: [[3100, 0]], sound: "19" },
        // #35
        { duration: 160, images: [[0, 93]] },
        // #36
        {
          duration: 100,
          images: [[124, 93]],
          exitBranch: 46,
          branching: { branches: [{ frameIndex: 46, weight: 80 }] },
        },
        // #37
        { duration: 130, images: [[248, 93]] },
        // #38
        { duration: 100, images: [[372, 93]], sound: "12" },
        // #39
        { duration: 100, images: [[496, 93]] },
        // #40
        { duration: 100, images: [[620, 93]] },
        // #41
        { duration: 100, images: [[744, 93]] },
        // #42
        { duration: 100, images: [[868, 93]] },
        // #43
        { duration: 100, images: [[992, 93]], sound: "8" },
        // #44
        { duration: 130, images: [[1116, 93]] },
        // #45
        { duration: 130, images: [[1240, 93]], exitBranch: 46 },
        // #46
        { duration: 100, images: [[1364, 93]] },
      ],
    },
    LookRight: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[620, 744]] },
        // #2
        { duration: 100, images: [[744, 744]] },
        // #3
        { duration: 100, images: [[868, 744]] },
        // #4
        { duration: 400, images: [[992, 744]] },
        // #5
        { duration: 100, images: [[1116, 744]] },
        // #6
        { duration: 100, images: [[1240, 744]], exitBranch: 7 },
        // #7
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleLookDown: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        {
          duration: 330,
          images: [[1860, 93]],
          exitBranch: 10,
          branching: { branches: [{ frameIndex: 1, weight: 75 }] },
        },
        // #2
        { duration: 100, images: [[1984, 93]] },
        // #3
        {
          duration: 330,
          images: [[2108, 93]],
          exitBranch: 10,
          branching: { branches: [{ frameIndex: 3, weight: 75 }] },
        },
        // #4
        { duration: 100, images: [[2232, 93]] },
        // #5
        { duration: 100, images: [[2356, 93]], exitBranch: 10 },
        // #6
        {
          duration: 100,
          images: [[2480, 93]],
          exitBranch: 7,
          branching: { branches: [{ frameIndex: 3, weight: 30 }] },
        },
        // #7
        { duration: 400, images: [[2604, 93]], exitBranch: 10 },
        // #8
        { duration: 100, images: [[2728, 93]] },
        // #9
        { duration: 100, images: [[2852, 93]], exitBranch: 10 },
        // #10
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Thinking: {
      frames: [
        // #0
        {
          duration: 100,
          images: [[0, 0]],
          exitBranch: 27,
          sound: "29",
          branching: { branches: [{ frameIndex: 22, weight: 50 }] },
        },
        // #1
        { duration: 100, images: [[2976, 93]] },
        // #2
        { duration: 100, images: [[3100, 93]] },
        // #3
        { duration: 100, images: [[0, 186]] },
        // #4
        { duration: 100, images: [[124, 186]] },
        // #5
        { duration: 100, images: [[248, 186]], sound: "15" },
        // #6
        { duration: 100, images: [[372, 186]], exitBranch: 14 },
        // #7
        { duration: 100, images: [[496, 186]] },
        // #8
        { duration: 100, images: [[620, 186]] },
        // #9
        { duration: 100, images: [[744, 186]], sound: "22" },
        // #10
        {
          duration: 100,
          images: [[868, 186]],
          exitBranch: 19,
          branching: { branches: [{ frameIndex: 19, weight: 100 }] },
        },
        // #11
        { duration: 100, images: [[992, 186]] },
        // #12
        { duration: 100, images: [[1116, 186]] },
        // #13
        { duration: 100, images: [[1240, 186]], sound: "15" },
        // #14
        { duration: 100, images: [[1364, 186]] },
        // #15
        { duration: 100, images: [[1488, 186]] },
        // #16
        { duration: 100, images: [[1612, 186]] },
        // #17
        { duration: 100, images: [[1736, 186]] },
        // #18
        { duration: 100, images: [[1860, 186]], sound: "22" },
        // #19
        { duration: 100, images: [[1984, 186]] },
        // #20
        { duration: 100, images: [[2108, 186]] },
        // #21
        {
          duration: 100,
          images: [[2232, 186]],
          exitBranch: 27,
          branching: { branches: [{ frameIndex: 27, weight: 100 }] },
        },
        // #22
        { duration: 100, images: [[2356, 186]] },
        // #23
        { duration: 100, images: [[2480, 186]] },
        // #24
        { duration: 100, images: [[2604, 186]] },
        // #25
        { duration: 100, images: [[2728, 186]] },
        // #26
        { duration: 100, images: [[2604, 186]], exitBranch: 27 },
        // #27
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Explain: {
      frames: [
        // #0
        {
          duration: 100,
          images: [[1364, 93]],
          exitBranch: 38,
          branching: {
            branches: [
              { frameIndex: 18, weight: 33 },
              { frameIndex: 32, weight: 33 },
            ],
          },
        },
        // #1
        { duration: 100, images: [[1736, 0]], exitBranch: 38 },
        // #2
        { duration: 100, images: [[1860, 0]] },
        // #3
        { duration: 100, images: [[1984, 0]] },
        // #4
        { duration: 100, images: [[2108, 0]] },
        // #5
        { duration: 100, images: [[2232, 0]] },
        // #6
        { duration: 100, images: [[2356, 0]] },
        // #7
        { duration: 100, images: [[2480, 0]] },
        // #8
        { duration: 100, images: [[2604, 0]] },
        // #9
        { duration: 100, images: [[2728, 0]] },
        // #10
        { duration: 100, images: [[2852, 0]] },
        // #11
        { duration: 300, images: [[2976, 0]] },
        // #12
        { duration: 100, images: [[3100, 0]] },
        // #13
        { duration: 100, images: [[0, 93]] },
        // #14
        { duration: 100, images: [[2852, 186]] },
        // #15
        { duration: 100, images: [[2976, 186]] },
        // #16
        { duration: 100, images: [[3100, 186]] },
        // #17
        {
          duration: 100,
          images: [[124, 93]],
          exitBranch: 38,
          branching: { branches: [{ frameIndex: 38, weight: 100 }] },
        },
        // #18
        { duration: 100, images: [[0, 279]] },
        // #19
        { duration: 100, images: [[124, 279]] },
        // #20
        { duration: 100, images: [[248, 279]] },
        // #21
        { duration: 100, images: [[372, 279]] },
        // #22
        { duration: 100, images: [[496, 279]] },
        // #23
        { duration: 100, images: [[620, 279]] },
        // #24
        { duration: 100, images: [[744, 279]] },
        // #25
        { duration: 100, images: [[868, 279]] },
        // #26
        { duration: 500, images: [[992, 279]] },
        // #27
        { duration: 100, images: [[1116, 279]] },
        // #28
        { duration: 100, images: [[1240, 279]] },
        // #29
        { duration: 100, images: [[1364, 279]] },
        // #30
        { duration: 100, images: [[1488, 279]] },
        // #31
        {
          duration: 100,
          images: [[1612, 279]],
          exitBranch: 38,
          branching: { branches: [{ frameIndex: 38, weight: 100 }] },
        },
        // #32
        { duration: 100, images: [[2356, 186]] },
        // #33
        { duration: 100, images: [[2480, 186]] },
        // #34
        { duration: 100, images: [[2604, 186]] },
        // #35
        { duration: 100, images: [[2728, 186]] },
        // #36
        { duration: 100, images: [[2604, 186]] },
        // #37
        { duration: 100, images: [[2480, 186]], exitBranch: 38 },
        // #38
        { duration: 50, images: [[0, 0]] },
      ],
    },
    IdleCuteToeTwist: {
      frames: [
        // #0
        {
          duration: 500,
          images: [[0, 0]],
          exitBranch: 18,
          branching: { branches: [{ frameIndex: 0, weight: 85 }] },
        },
        // #1
        { duration: 100, images: [[1736, 279]] },
        // #2
        {
          duration: 100,
          images: [[1860, 279]],
          exitBranch: 18,
          branching: { branches: [{ frameIndex: 0, weight: 50 }] },
        },
        // #3
        {
          duration: 500,
          images: [[0, 0]],
          exitBranch: 18,
          branching: { branches: [{ frameIndex: 3, weight: 50 }] },
        },
        // #4
        { duration: 100, images: [[1736, 279]] },
        // #5
        {
          duration: 100,
          images: [[1860, 279]],
          exitBranch: 18,
          branching: { branches: [{ frameIndex: 3, weight: 50 }] },
        },
        // #6
        { duration: 100, images: [[1984, 279]], exitBranch: 18 },
        // #7
        { duration: 100, images: [[2108, 279]] },
        // #8
        { duration: 100, images: [[2232, 279]] },
        // #9
        { duration: 100, images: [[2356, 279]] },
        // #10
        { duration: 100, images: [[2480, 279]] },
        // #11
        { duration: 100, images: [[2604, 279]] },
        // #12
        { duration: 100, images: [[2728, 279]] },
        // #13
        { duration: 100, images: [[2852, 279]] },
        // #14
        { duration: 100, images: [[2976, 279]] },
        // #15
        { duration: 100, images: [[3100, 279]] },
        // #16
        { duration: 100, images: [[0, 372]] },
        // #17
        { duration: 330, images: [[124, 0]], exitBranch: 18 },
        // #18
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Writing: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "29" },
        // #1
        { duration: 100, images: [[2852, 1395]] },
        // #2
        { duration: 100, images: [[2976, 1395]] },
        // #3
        { duration: 100, images: [[3100, 1395]] },
        // #4
        { duration: 100, images: [[0, 1488]] },
        // #5
        { duration: 100, images: [[124, 1488]], sound: "5" },
        // #6
        { duration: 100, images: [[248, 1488]] },
        // #7
        { duration: 100, images: [[372, 1488]] },
        // #8
        { duration: 100, images: [[496, 1488]] },
        // #9
        { duration: 100, images: [[620, 1488]] },
        // #10
        { duration: 100, images: [[744, 1488]] },
        // #11
        { duration: 100, images: [[868, 1488]] },
        // #12
        { duration: 100, images: [[992, 1488]] },
        // #13
        { duration: 100, images: [[1116, 1488]], exitBranch: 66 },
        // #14
        { duration: 100, images: [[1240, 1488]] },
        // #15
        { duration: 100, images: [[1364, 1488]] },
        // #16
        { duration: 100, images: [[1488, 1488]] },
        // #17
        { duration: 100, images: [[1612, 1488]] },
        // #18
        { duration: 100, images: [[1736, 1488]], exitBranch: 66 },
        // #19
        { duration: 100, images: [[1860, 1488]] },
        // #20
        { duration: 100, images: [[1984, 1488]] },
        // #21
        { duration: 100, images: [[2108, 1488]] },
        // #22
        { duration: 100, images: [[2232, 1488]] },
        // #23
        { duration: 100, images: [[2356, 1488]] },
        // #24
        { duration: 100, images: [[2480, 1488]] },
        // #25
        { duration: 100, images: [[2604, 1488]] },
        // #26
        { duration: 100, images: [[2728, 1488]], exitBranch: 66 },
        // #27
        { duration: 100, images: [[2852, 1488]] },
        // #28
        { duration: 100, images: [[2976, 1488]] },
        // #29
        { duration: 100, images: [[3100, 1488]] },
        // #30
        { duration: 100, images: [[0, 1581]] },
        // #31
        { duration: 100, images: [[124, 1581]], exitBranch: 66 },
        // #32
        { duration: 100, images: [[248, 1581]] },
        // #33
        { duration: 100, images: [[372, 1581]] },
        // #34
        { duration: 100, images: [[496, 1581]] },
        // #35
        { duration: 100, images: [[620, 1581]] },
        // #36
        { duration: 100, images: [[744, 1581]] },
        // #37
        { duration: 100, images: [[868, 1581]], exitBranch: 66 },
        // #38
        { duration: 100, images: [[992, 1581]] },
        // #39
        { duration: 100, images: [[1116, 1581]] },
        // #40
        {
          duration: 100,
          images: [[1240, 1581]],
          branching: { branches: [{ frameIndex: 16, weight: 100 }] },
        },
        // #41
        { duration: 100, images: [[1364, 1581]] },
        // #42
        { duration: 100, images: [[1488, 1581]] },
        // #43
        { duration: 100, images: [[1612, 1581]] },
        // #44
        { duration: 100, images: [[1736, 1581]] },
        // #45
        { duration: 330, images: [[1860, 1581]] },
        // #46
        { duration: 100, images: [[1984, 1581]], exitBranch: 66 },
        // #47
        { duration: 100, images: [[2108, 1581]] },
        // #48
        { duration: 100, images: [[2232, 1581]], sound: "27" },
        // #49
        { duration: 100, images: [[2356, 1581]] },
        // #50
        { duration: 100, images: [[2480, 1581]] },
        // #51
        { duration: 100, images: [[2604, 1581]] },
        // #52
        { duration: 100, images: [[2728, 1581]] },
        // #53
        { duration: 100, images: [[2852, 1581]] },
        // #54
        { duration: 100, images: [[2976, 1581]] },
        // #55
        { duration: 100, images: [[3100, 1581]] },
        // #56
        { duration: 100, images: [[0, 1674]] },
        // #57
        { duration: 100, images: [[124, 1674]] },
        // #58
        { duration: 100, images: [[248, 1674]], sound: "17" },
        // #59
        { duration: 100, images: [[372, 1674]] },
        // #60
        { duration: 100, images: [[496, 1674]] },
        // #61
        { duration: 100, images: [[620, 1674]], sound: "24" },
        // #62
        { duration: 100, images: [[744, 1674]] },
        // #63
        { duration: 100, images: [[868, 1674]] },
        // #64
        { duration: 100, images: [[992, 1674]] },
        // #65
        { duration: 100, images: [[1116, 1674]] },
        // #66
        {
          duration: 100,
          images: [
            [248, 465],
            [1240, 1674],
          ],
        },
        // #67
        {
          duration: 100,
          images: [
            [372, 465],
            [1240, 1674],
          ],
          sound: "7",
        },
        // #68
        {
          duration: 100,
          images: [
            [496, 465],
            [1240, 1674],
          ],
        },
        // #69
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 1674],
          ],
        },
        // #70
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 1674],
          ],
        },
        // #71
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 1674],
          ],
        },
        // #72
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 1674],
          ],
        },
        // #73
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 1674],
          ],
          sound: "13",
        },
        // #74
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 1674],
          ],
        },
        // #75
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 1674],
          ],
        },
        // #76
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 1674],
          ],
        },
        // #77
        {
          duration: 100,
          images: [
            [620, 465],
            [2108, 1674],
          ],
        },
        // #78
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 1674],
          ],
        },
        // #79
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 1674],
          ],
        },
        // #80
        {
          duration: 100,
          images: [
            [496, 465],
            [2480, 1674],
          ],
        },
        // #81
        {
          duration: 100,
          images: [
            [372, 465],
            [2604, 1674],
          ],
          sound: "28",
        },
        // #82
        {
          duration: 100,
          images: [
            [248, 465],
            [2728, 1674],
          ],
        },
        // #83
        { duration: 100, images: [[2852, 1674]] },
        // #84
        { duration: 100, images: [[2976, 1674]] },
        // #85
        { duration: 100, images: [[3100, 1674]], exitBranch: 86 },
        // #86
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleLowersBrows: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 330, images: [[1860, 93]], exitBranch: 10 },
        // #2
        { duration: 100, images: [[1984, 93]] },
        // #3
        {
          duration: 330,
          images: [[2108, 93]],
          exitBranch: 4,
          branching: { branches: [{ frameIndex: 3, weight: 75 }] },
        },
        // #4
        { duration: 100, images: [[2232, 93]] },
        // #5
        { duration: 100, images: [[2356, 93]], exitBranch: 10 },
        // #6
        {
          duration: 100,
          images: [[2480, 93]],
          exitBranch: 10,
          branching: { branches: [{ frameIndex: 3, weight: 100 }] },
        },
        // #7
        { duration: 400, images: [[2604, 93]] },
        // #8
        { duration: 100, images: [[2728, 93]] },
        // #9
        { duration: 100, images: [[2852, 93]], exitBranch: 10 },
        // #10
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleBlink: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        {
          duration: 500,
          images: [[0, 0]],
          exitBranch: 2,
          branching: { branches: [{ frameIndex: 1, weight: 50 }] },
        },
        // #2
        { duration: 100, images: [[1736, 279]] },
        // #3
        {
          duration: 100,
          images: [[1860, 279]],
          exitBranch: 4,
          branching: { branches: [{ frameIndex: 1, weight: 85 }] },
        },
        // #4
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Print: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "29" },
        // #1
        { duration: 100, images: [[2852, 372]] },
        // #2
        { duration: 100, images: [[2976, 372]] },
        // #3
        { duration: 100, images: [[3100, 372]] },
        // #4
        { duration: 100, images: [[0, 465]] },
        // #5
        {
          duration: 100,
          images: [
            [248, 465],
            [124, 465],
          ],
          sound: "5",
        },
        // #6
        {
          duration: 100,
          images: [
            [372, 465],
            [124, 465],
          ],
        },
        // #7
        {
          duration: 100,
          images: [
            [496, 465],
            [124, 465],
          ],
        },
        // #8
        {
          duration: 100,
          images: [
            [620, 465],
            [124, 465],
          ],
        },
        // #9
        {
          duration: 100,
          images: [
            [620, 465],
            [744, 465],
          ],
        },
        // #10
        {
          duration: 100,
          images: [
            [620, 465],
            [868, 465],
          ],
          sound: "31",
        },
        // #11
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 465],
          ],
        },
        // #12
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 465],
          ],
        },
        // #13
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 465],
          ],
        },
        // #14
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 465],
          ],
        },
        // #15
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 465],
          ],
        },
        // #16
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 465],
          ],
        },
        // #17
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 465],
          ],
        },
        // #18
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 465],
          ],
        },
        // #19
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 465],
          ],
        },
        // #20
        {
          duration: 300,
          images: [
            [620, 465],
            [2108, 465],
          ],
        },
        // #21
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 465],
          ],
        },
        // #22
        {
          duration: 200,
          images: [
            [620, 465],
            [2356, 465],
          ],
          exitBranch: 57,
        },
        // #23
        {
          duration: 100,
          images: [
            [620, 465],
            [2480, 465],
          ],
          sound: "27",
        },
        // #24
        {
          duration: 100,
          images: [
            [620, 465],
            [2604, 465],
          ],
        },
        // #25
        {
          duration: 100,
          images: [
            [620, 465],
            [2728, 465],
          ],
        },
        // #26
        {
          duration: 100,
          images: [
            [620, 465],
            [2852, 465],
          ],
        },
        // #27
        {
          duration: 100,
          images: [
            [620, 465],
            [2976, 465],
          ],
        },
        // #28
        {
          duration: 100,
          images: [
            [620, 465],
            [3100, 465],
          ],
        },
        // #29
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 558],
          ],
          exitBranch: 57,
        },
        // #30
        {
          duration: 100,
          images: [
            [620, 465],
            [124, 558],
          ],
        },
        // #31
        {
          duration: 100,
          images: [
            [620, 465],
            [248, 558],
          ],
        },
        // #32
        {
          duration: 100,
          images: [
            [620, 465],
            [372, 558],
          ],
        },
        // #33
        {
          duration: 100,
          images: [
            [620, 465],
            [496, 558],
          ],
          exitBranch: 57,
        },
        // #34
        {
          duration: 100,
          images: [
            [620, 465],
            [620, 558],
          ],
          sound: "24",
        },
        // #35
        {
          duration: 100,
          images: [
            [620, 465],
            [744, 558],
          ],
        },
        // #36
        {
          duration: 100,
          images: [
            [620, 465],
            [868, 558],
          ],
        },
        // #37
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 558],
          ],
          sound: "17",
        },
        // #38
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 558],
          ],
        },
        // #39
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 558],
          ],
        },
        // #40
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 465],
          ],
          exitBranch: 57,
        },
        // #41
        {
          duration: 100,
          images: [
            [620, 465],
            [2480, 465],
          ],
          sound: "27",
        },
        // #42
        {
          duration: 100,
          images: [
            [620, 465],
            [2604, 465],
          ],
        },
        // #43
        {
          duration: 100,
          images: [
            [620, 465],
            [2728, 465],
          ],
        },
        // #44
        {
          duration: 100,
          images: [
            [620, 465],
            [2852, 465],
          ],
        },
        // #45
        {
          duration: 100,
          images: [
            [620, 465],
            [2976, 465],
          ],
        },
        // #46
        {
          duration: 100,
          images: [
            [620, 465],
            [3100, 465],
          ],
        },
        // #47
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 558],
          ],
          exitBranch: 57,
        },
        // #48
        {
          duration: 100,
          images: [
            [620, 465],
            [124, 558],
          ],
        },
        // #49
        {
          duration: 100,
          images: [
            [620, 465],
            [248, 558],
          ],
        },
        // #50
        {
          duration: 100,
          images: [
            [620, 465],
            [372, 558],
          ],
        },
        // #51
        {
          duration: 100,
          images: [
            [620, 465],
            [496, 558],
          ],
        },
        // #52
        {
          duration: 100,
          images: [
            [620, 465],
            [620, 558],
          ],
        },
        // #53
        {
          duration: 200,
          images: [
            [620, 465],
            [1364, 558],
          ],
        },
        // #54
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 558],
          ],
        },
        // #55
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 558],
          ],
          exitBranch: 57,
        },
        // #56
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 558],
          ],
        },
        // #57
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 558],
          ],
        },
        // #58
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 558],
          ],
          sound: "13",
        },
        // #59
        {
          duration: 100,
          images: [
            [620, 465],
            [2108, 558],
          ],
        },
        // #60
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 558],
          ],
        },
        // #61
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 558],
          ],
        },
        // #62
        {
          duration: 100,
          images: [
            [620, 465],
            [2480, 558],
          ],
        },
        // #63
        {
          duration: 100,
          images: [
            [620, 465],
            [2604, 558],
          ],
        },
        // #64
        {
          duration: 100,
          images: [
            [620, 465],
            [2728, 558],
          ],
        },
        // #65
        {
          duration: 100,
          images: [
            [620, 465],
            [2852, 558],
          ],
        },
        // #66
        {
          duration: 100,
          images: [
            [620, 465],
            [2976, 558],
          ],
          sound: "6",
        },
        // #67
        {
          duration: 100,
          images: [
            [620, 465],
            [3100, 558],
          ],
        },
        // #68
        {
          duration: 200,
          images: [
            [620, 465],
            [0, 651],
          ],
        },
        // #69
        {
          duration: 200,
          images: [
            [496, 465],
            [124, 651],
          ],
        },
        // #70
        {
          duration: 200,
          images: [
            [372, 465],
            [248, 651],
          ],
          sound: "26",
        },
        // #71
        {
          duration: 100,
          images: [
            [248, 465],
            [0, 0],
          ],
          exitBranch: 72,
        },
        // #72
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Hide: {
      frames: [
        // #0
        { duration: 10, images: [[0, 0]] },
        // #1
        { duration: 10, images: [[1488, 93]] },
        // #2
        { duration: 10, images: [[1612, 93]] },
        // #3
        { duration: 10, images: [[1736, 93]] },
        // #4
        { duration: 10 },
      ],
    },
    GetAttention: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "29" },
        // #1
        { duration: 100, images: [[372, 651]] },
        // #2
        { duration: 100, images: [[496, 651]] },
        // #3
        { duration: 100, images: [[620, 651]] },
        // #4
        { duration: 100, images: [[744, 651]] },
        // #5
        { duration: 100, images: [[868, 651]] },
        // #6
        { duration: 100, images: [[992, 651]] },
        // #7
        { duration: 100, images: [[1116, 651]] },
        // #8
        { duration: 100, images: [[1240, 651]], sound: "12" },
        // #9
        { duration: 100, images: [[1364, 651]] },
        // #10
        { duration: 200, images: [[1488, 651]] },
        // #11
        { duration: 100, images: [[1612, 651]], exitBranch: 23 },
        // #12
        { duration: 100, images: [[1736, 651]] },
        // #13
        { duration: 100, images: [[1860, 651]] },
        // #14
        { duration: 100, images: [[1984, 651]] },
        // #15
        { duration: 100, images: [[2108, 651]], sound: "21" },
        // #16
        { duration: 100, images: [[2232, 651]] },
        // #17
        { duration: 100, images: [[2356, 651]] },
        // #18
        { duration: 100, images: [[2480, 651]] },
        // #19
        { duration: 100, images: [[2604, 651]] },
        // #20
        { duration: 100, images: [[2728, 651]] },
        // #21
        { duration: 100, images: [[2852, 651]] },
        // #22
        { duration: 200, images: [[1488, 651]], sound: "2" },
        // #23
        { duration: 100, images: [[2976, 651]] },
        // #24
        { duration: 100, images: [[3100, 651]] },
        // #25
        { duration: 100, images: [[0, 744]], sound: "16" },
        // #26
        { duration: 100, images: [[124, 744]] },
        // #27
        { duration: 100, images: [[248, 744]] },
        // #28
        { duration: 100, images: [[372, 744]] },
        // #29
        { duration: 100, images: [[496, 744]], exitBranch: 30 },
        // #30
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Alert: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 15 },
        // #1
        { duration: 100, images: [[0, 279]] },
        // #2
        { duration: 100, images: [[124, 279]] },
        // #3
        { duration: 100, images: [[248, 279]] },
        // #4
        { duration: 100, images: [[372, 279]] },
        // #5
        { duration: 100, images: [[496, 279]] },
        // #6
        { duration: 100, images: [[620, 279]] },
        // #7
        { duration: 100, images: [[744, 279]] },
        // #8
        { duration: 100, images: [[868, 279]] },
        // #9
        { duration: 500, images: [[992, 279]] },
        // #10
        { duration: 100, images: [[1116, 279]], exitBranch: 11 },
        // #11
        { duration: 100, images: [[1240, 279]] },
        // #12
        { duration: 100, images: [[1364, 279]] },
        // #13
        { duration: 100, images: [[1488, 279]] },
        // #14
        { duration: 100, images: [[1612, 279]], exitBranch: 15 },
        // #15
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleHeadPatting: {
      frames: [
        // #0
        {
          duration: 500,
          images: [[0, 0]],
          exitBranch: 42,
          branching: { branches: [{ frameIndex: 0, weight: 80 }] },
        },
        // #1
        { duration: 100, images: [[1736, 279]] },
        // #2
        {
          duration: 100,
          images: [[1860, 279]],
          exitBranch: 42,
          branching: { branches: [{ frameIndex: 0, weight: 80 }] },
        },
        // #3
        { duration: 100, images: [[1364, 744]] },
        // #4
        { duration: 100, images: [[1488, 744]] },
        // #5
        { duration: 100, images: [[1612, 744]] },
        // #6
        { duration: 100, images: [[1736, 744]] },
        // #7
        { duration: 100, images: [[1860, 744]] },
        // #8
        { duration: 100, images: [[1984, 744]], exitBranch: 42 },
        // #9
        { duration: 100, images: [[2108, 744]] },
        // #10
        { duration: 100, images: [[2232, 744]] },
        // #11
        { duration: 100, images: [[2356, 744]] },
        // #12
        { duration: 100, images: [[2480, 744]] },
        // #13
        { duration: 300, images: [[2604, 744]], exitBranch: 34 },
        // #14
        { duration: 100, images: [[2728, 744]] },
        // #15
        { duration: 100, images: [[2852, 744]] },
        // #16
        { duration: 100, images: [[2976, 744]] },
        // #17
        {
          duration: 300,
          images: [[3100, 744]],
          exitBranch: 34,
          branching: { branches: [{ frameIndex: 13, weight: 85 }] },
        },
        // #18
        { duration: 100, images: [[0, 837]] },
        // #19
        { duration: 100, images: [[124, 837]] },
        // #20
        { duration: 100, images: [[248, 837]] },
        // #21
        { duration: 300, images: [[372, 837]], exitBranch: 34 },
        // #22
        { duration: 100, images: [[496, 837]] },
        // #23
        { duration: 100, images: [[620, 837]] },
        // #24
        { duration: 100, images: [[744, 837]] },
        // #25
        {
          duration: 300,
          images: [[868, 837]],
          exitBranch: 34,
          branching: { branches: [{ frameIndex: 21, weight: 85 }] },
        },
        // #26
        { duration: 100, images: [[992, 837]] },
        // #27
        { duration: 100, images: [[1116, 837]] },
        // #28
        { duration: 100, images: [[1240, 837]] },
        // #29
        { duration: 100, images: [[1364, 837]] },
        // #30
        { duration: 300, images: [[1488, 837]], exitBranch: 34 },
        // #31
        { duration: 100, images: [[1612, 837]] },
        // #32
        { duration: 100, images: [[1736, 837]] },
        // #33
        {
          duration: 300,
          images: [[1860, 837]],
          exitBranch: 34,
          branching: {
            branches: [
              { frameIndex: 13, weight: 80 },
              { frameIndex: 17, weight: 10 },
            ],
          },
        },
        // #34
        { duration: 100, images: [[1984, 837]] },
        // #35
        { duration: 100, images: [[2108, 837]] },
        // #36
        { duration: 100, images: [[2232, 837]] },
        // #37
        { duration: 100, images: [[2356, 837]] },
        // #38
        { duration: 100, images: [[2480, 837]] },
        // #39
        { duration: 100, images: [[2604, 837]] },
        // #40
        { duration: 100, images: [[2728, 837]] },
        // #41
        { duration: 100, images: [[2852, 837]], exitBranch: 42 },
        // #42
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GetTechy: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "29" },
        // #1
        { duration: 60, images: [[2976, 837]] },
        // #2
        { duration: 60, images: [[3100, 837]] },
        // #3
        { duration: 60, images: [[0, 930]] },
        // #4
        { duration: 60, images: [[124, 930]], sound: "8" },
        // #5
        { duration: 60, images: [[248, 930]] },
        // #6
        { duration: 60, images: [[372, 930]], exitBranch: 17 },
        // #7
        { duration: 60, images: [[496, 930]] },
        // #8
        { duration: 60, images: [[620, 930]], exitBranch: 17 },
        // #9
        { duration: 60, images: [[744, 930]] },
        // #10
        { duration: 60, images: [[868, 930]], exitBranch: 17 },
        // #11
        { duration: 60, images: [[992, 930]] },
        // #12
        { duration: 60, images: [[1116, 930]], exitBranch: 17 },
        // #13
        { duration: 60, images: [[1240, 930]] },
        // #14
        { duration: 60, images: [[1364, 930]], exitBranch: 17 },
        // #15
        { duration: 60, images: [[1488, 930]], exitBranch: 17 },
        // #16
        { duration: 60, images: [[1612, 930]] },
        // #17
        { duration: 100, images: [[1736, 930]] },
        // #18
        { duration: 100, images: [[1860, 930]] },
        // #19
        { duration: 100, images: [[1984, 930]] },
        // #20
        { duration: 100, images: [[2108, 930]], sound: "28" },
        // #21
        { duration: 100, images: [[2232, 930]] },
        // #22
        { duration: 100, images: [[2356, 930]] },
        // #23
        { duration: 100, images: [[2480, 930]], sound: "28" },
        // #24
        { duration: 100, images: [[2604, 930]], exitBranch: 28 },
        // #25
        { duration: 100, images: [[2728, 930]] },
        // #26
        {
          duration: 500,
          images: [[2852, 930]],
          exitBranch: 27,
          branching: { branches: [{ frameIndex: 26, weight: 85 }] },
        },
        // #27
        {
          duration: 500,
          images: [[2976, 930]],
          exitBranch: 28,
          branching: {
            branches: [
              { frameIndex: 27, weight: 65 },
              { frameIndex: 26, weight: 35 },
            ],
          },
        },
        // #28
        { duration: 100, images: [[3100, 930]], sound: "4" },
        // #29
        { duration: 100, images: [[0, 1023]] },
        // #30
        { duration: 100, images: [[124, 1023]] },
        // #31
        { duration: 100, images: [[248, 1023]] },
        // #32
        { duration: 100, images: [[372, 1023]] },
        // #33
        { duration: 100, images: [[496, 1023]] },
        // #34
        { duration: 100, images: [[620, 1023]] },
        // #35
        { duration: 100, images: [[744, 1023]] },
        // #36
        { duration: 100, images: [[868, 1023]] },
        // #37
        { duration: 60, images: [[992, 1023]] },
        // #38
        { duration: 60, images: [[1116, 1023]] },
        // #39
        { duration: 60, images: [[1240, 1023]] },
        // #40
        { duration: 60, images: [[1364, 1023]] },
        // #41
        { duration: 60, images: [[1488, 1023]], sound: "28" },
        // #42
        { duration: 330, images: [[124, 0]], exitBranch: 43 },
        // #43
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GestureUp: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[620, 744]] },
        // #2
        { duration: 100, images: [[744, 744]] },
        // #3
        { duration: 100, images: [[868, 744]] },
        // #4
        { duration: 400, images: [[992, 744]] },
        // #5
        { duration: 100, images: [[1116, 744]] },
        // #6
        { duration: 100, images: [[1240, 744]], exitBranch: 7 },
        // #7
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Idle1_1: {
      frames: [
        // #0
        {
          duration: 500,
          images: [[0, 0]],
          exitBranch: 118,
          branching: { branches: [{ frameIndex: 0, weight: 80 }] },
        },
        // #1
        { duration: 100, images: [[1736, 279]] },
        // #2
        {
          duration: 100,
          images: [[1860, 279]],
          exitBranch: 118,
          branching: { branches: [{ frameIndex: 0, weight: 80 }] },
        },
        // #3
        {
          duration: 0,
          branching: {
            branches: [
              { frameIndex: 44, weight: 30 },
              { frameIndex: 52, weight: 30 },
              { frameIndex: 59, weight: 30 },
            ],
          },
          exitBranch: 118,
        },
        // #4
        {
          duration: 0,
          branching: { branches: [{ frameIndex: 75, weight: 50 }] },
          exitBranch: 118,
        },
        // #5
        {
          duration: 100,
          images: [[1364, 744]],
          branching: { branches: [{ frameIndex: 118, weight: 50 }] },
        },
        // #6
        { duration: 100, images: [[1488, 744]] },
        // #7
        { duration: 100, images: [[1612, 744]] },
        // #8
        { duration: 100, images: [[1736, 744]] },
        // #9
        { duration: 100, images: [[1860, 744]] },
        // #10
        { duration: 100, images: [[1984, 744]], exitBranch: 118 },
        // #11
        { duration: 100, images: [[2108, 744]] },
        // #12
        { duration: 100, images: [[2232, 744]] },
        // #13
        { duration: 100, images: [[2356, 744]] },
        // #14
        { duration: 100, images: [[2480, 744]] },
        // #15
        { duration: 250, images: [[2604, 744]], exitBranch: 36 },
        // #16
        { duration: 100, images: [[2728, 744]] },
        // #17
        { duration: 100, images: [[2852, 744]] },
        // #18
        { duration: 100, images: [[2976, 744]] },
        // #19
        {
          duration: 250,
          images: [[3100, 744]],
          exitBranch: 36,
          branching: { branches: [{ frameIndex: 16, weight: 85 }] },
        },
        // #20
        { duration: 100, images: [[0, 837]] },
        // #21
        { duration: 100, images: [[124, 837]] },
        // #22
        { duration: 100, images: [[248, 837]] },
        // #23
        { duration: 250, images: [[372, 837]], exitBranch: 36 },
        // #24
        { duration: 100, images: [[496, 837]] },
        // #25
        { duration: 100, images: [[620, 837]] },
        // #26
        { duration: 100, images: [[744, 837]] },
        // #27
        {
          duration: 250,
          images: [[868, 837]],
          exitBranch: 36,
          branching: { branches: [{ frameIndex: 24, weight: 85 }] },
        },
        // #28
        { duration: 100, images: [[992, 837]] },
        // #29
        { duration: 100, images: [[1116, 837]] },
        // #30
        { duration: 100, images: [[1240, 837]] },
        // #31
        { duration: 100, images: [[1364, 837]] },
        // #32
        { duration: 250, images: [[1488, 837]], exitBranch: 36 },
        // #33
        { duration: 100, images: [[1612, 837]] },
        // #34
        { duration: 100, images: [[1736, 837]] },
        // #35
        {
          duration: 250,
          images: [[1860, 837]],
          exitBranch: 36,
          branching: {
            branches: [
              { frameIndex: 16, weight: 80 },
              { frameIndex: 20, weight: 10 },
            ],
          },
        },
        // #36
        { duration: 100, images: [[1984, 837]] },
        // #37
        { duration: 100, images: [[2108, 837]] },
        // #38
        { duration: 100, images: [[2232, 837]] },
        // #39
        { duration: 100, images: [[2356, 837]] },
        // #40
        { duration: 100, images: [[2480, 837]] },
        // #41
        { duration: 100, images: [[2604, 837]] },
        // #42
        { duration: 100, images: [[2728, 837]] },
        // #43
        {
          duration: 100,
          images: [[2852, 837]],
          exitBranch: 118,
          branching: { branches: [{ frameIndex: 118, weight: 100 }] },
        },
        // #44
        {
          duration: 0,
          branching: { branches: [{ frameIndex: 118, weight: 30 }] },
          exitBranch: 118,
        },
        // #45
        { duration: 100, images: [[0, 0]] },
        // #46
        { duration: 330, images: [[620, 744]], exitBranch: 118 },
        // #47
        { duration: 100, images: [[744, 744]] },
        // #48
        {
          duration: 450,
          images: [[868, 744]],
          exitBranch: 49,
          branching: { branches: [{ frameIndex: 48, weight: 75 }] },
        },
        // #49
        { duration: 100, images: [[992, 744]] },
        // #50
        {
          duration: 100,
          images: [[1116, 744]],
          exitBranch: 118,
          branching: { branches: [{ frameIndex: 48, weight: 65 }] },
        },
        // #51
        {
          duration: 100,
          images: [[1240, 744]],
          exitBranch: 118,
          branching: {
            branches: [
              { frameIndex: 48, weight: 30 },
              { frameIndex: 0, weight: 50 },
              { frameIndex: 118, weight: 20 },
            ],
          },
        },
        // #52
        {
          duration: 0,
          branching: { branches: [{ frameIndex: 118, weight: 10 }] },
          exitBranch: 118,
        },
        // #53
        {
          duration: 100,
          images: [[0, 0]],
          exitBranch: 118,
          branching: { branches: [{ frameIndex: 53, weight: 50 }] },
        },
        // #54
        { duration: 100, images: [[1612, 1023]] },
        // #55
        { duration: 100, images: [[1736, 1023]] },
        // #56
        {
          duration: 330,
          images: [[1860, 1023]],
          exitBranch: 118,
          branching: { branches: [{ frameIndex: 56, weight: 90 }] },
        },
        // #57
        { duration: 100, images: [[1984, 1023]] },
        // #58
        { duration: 100, images: [[2108, 1023]] },
        // #59
        {
          duration: 100,
          images: [[2232, 1023]],
          exitBranch: 118,
          branching: {
            branches: [
              { frameIndex: 56, weight: 85 },
              { frameIndex: 0, weight: 10 },
              { frameIndex: 118, weight: 5 },
            ],
          },
        },
        // #60
        {
          duration: 0,
          branching: { branches: [{ frameIndex: 118, weight: 80 }] },
          exitBranch: 118,
        },
        // #61
        {
          duration: 500,
          images: [[0, 0]],
          exitBranch: 118,
          branching: { branches: [{ frameIndex: 61, weight: 50 }] },
        },
        // #62
        { duration: 100, images: [[1736, 279]] },
        // #63
        {
          duration: 100,
          images: [[1860, 279]],
          exitBranch: 118,
          branching: { branches: [{ frameIndex: 61, weight: 50 }] },
        },
        // #64
        { duration: 100, images: [[1984, 279]], exitBranch: 74 },
        // #65
        { duration: 100, images: [[2108, 279]] },
        // #66
        { duration: 100, images: [[2232, 279]] },
        // #67
        { duration: 100, images: [[2356, 279]] },
        // #68
        { duration: 100, images: [[2480, 279]] },
        // #69
        { duration: 100, images: [[2604, 279]] },
        // #70
        { duration: 100, images: [[2728, 279]] },
        // #71
        { duration: 100, images: [[2852, 279]] },
        // #72
        { duration: 100, images: [[2976, 279]] },
        // #73
        { duration: 100, images: [[3100, 279]] },
        // #74
        { duration: 100, images: [[0, 372]] },
        // #75
        {
          duration: 330,
          images: [[124, 0]],
          exitBranch: 118,
          branching: { branches: [{ frameIndex: 118, weight: 100 }] },
        },
        // #76
        {
          duration: 0,
          branching: { branches: [{ frameIndex: 118, weight: 85 }] },
          exitBranch: 118,
        },
        // #77
        { duration: 100, images: [[2356, 1023]] },
        // #78
        { duration: 100, images: [[2480, 1023]] },
        // #79
        { duration: 100, images: [[2604, 1023]] },
        // #80
        { duration: 100, images: [[2728, 1023]] },
        // #81
        { duration: 100, images: [[2852, 1023]] },
        // #82
        { duration: 100, images: [[2976, 1023]] },
        // #83
        { duration: 100, images: [[3100, 1023]] },
        // #84
        { duration: 100, images: [[0, 1116]] },
        // #85
        { duration: 100, images: [[124, 1116]], exitBranch: 109 },
        // #86
        { duration: 100, images: [[248, 1116]] },
        // #87
        { duration: 100, images: [[372, 1116]], exitBranch: 109 },
        // #88
        { duration: 100, images: [[496, 1116]] },
        // #89
        { duration: 500, images: [[124, 1116]], exitBranch: 109 },
        // #90
        { duration: 100, images: [[248, 1116]] },
        // #91
        { duration: 100, images: [[372, 1116]], exitBranch: 109 },
        // #92
        { duration: 100, images: [[496, 1116]] },
        // #93
        {
          duration: 500,
          images: [[124, 1116]],
          exitBranch: 109,
          branching: { branches: [{ frameIndex: 90, weight: 80 }] },
        },
        // #94
        { duration: 100, images: [[620, 1116]] },
        // #95
        { duration: 100, images: [[744, 1116]], exitBranch: 109 },
        // #96
        { duration: 100, images: [[868, 1116]] },
        // #97
        { duration: 100, images: [[992, 1116]], exitBranch: 109 },
        // #98
        { duration: 400, images: [[1116, 1116]] },
        // #99
        { duration: 100, images: [[1240, 1116]], exitBranch: 109 },
        // #100
        { duration: 100, images: [[1364, 1116]] },
        // #101
        { duration: 100, images: [[1488, 1116]], exitBranch: 109 },
        // #102
        {
          duration: 500,
          images: [[1116, 1116]],
          exitBranch: 109,
          branching: { branches: [{ frameIndex: 99, weight: 80 }] },
        },
        // #103
        { duration: 100, images: [[1612, 1116]], exitBranch: 109 },
        // #104
        { duration: 100, images: [[1736, 1116]] },
        // #105
        { duration: 100, images: [[1860, 1116]], exitBranch: 109 },
        // #106
        { duration: 100, images: [[1984, 1116]] },
        // #107
        {
          duration: 200,
          images: [[2108, 1116]],
          exitBranch: 108,
          branching: { branches: [{ frameIndex: 93, weight: 85 }] },
        },
        // #108
        { duration: 100, images: [[2232, 1116]] },
        // #109
        { duration: 100, images: [[2356, 1116]] },
        // #110
        { duration: 100, images: [[2480, 1116]] },
        // #111
        { duration: 300, images: [[2604, 1116]] },
        // #112
        { duration: 100, images: [[2728, 1116]] },
        // #113
        { duration: 100, images: [[2852, 1116]] },
        // #114
        { duration: 100, images: [[2976, 1116]] },
        // #115
        { duration: 100, images: [[3100, 1116]] },
        // #116
        { duration: 100, images: [[0, 1209]] },
        // #117
        {
          duration: 100,
          images: [[124, 1209]],
          exitBranch: 118,
          branching: { branches: [{ frameIndex: 118, weight: 100 }] },
        },
        // #118
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Processing: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "29" },
        // #1
        { duration: 80, images: [[248, 1209]] },
        // #2
        { duration: 80, images: [[372, 1209]], sound: "25" },
        // #3
        { duration: 80, images: [[496, 1209]] },
        // #4
        { duration: 80, images: [[620, 1209]] },
        // #5
        { duration: 330, images: [[744, 1209]] },
        // #6
        { duration: 80, images: [[868, 1209]] },
        // #7
        { duration: 80, images: [[992, 1209]] },
        // #8
        { duration: 80, images: [[1116, 1209]] },
        // #9
        { duration: 80, images: [[1240, 1209]] },
        // #10
        { duration: 400, images: [[1364, 1209]] },
        // #11
        { duration: 80, images: [[1488, 1209]] },
        // #12
        { duration: 80, images: [[1612, 1209]] },
        // #13
        { duration: 80, images: [[1736, 1209]] },
        // #14
        { duration: 80, images: [[1860, 1209]] },
        // #15
        {
          duration: 400,
          images: [[1984, 1209]],
          exitBranch: 34,
          branching: {
            branches: [
              { frameIndex: 10, weight: 33 },
              { frameIndex: 5, weight: 33 },
            ],
          },
        },
        // #16
        { duration: 80, images: [[2108, 1209]], exitBranch: 34 },
        // #17
        { duration: 80, images: [[2232, 1209]] },
        // #18
        { duration: 80, images: [[2356, 1209]], exitBranch: 34 },
        // #19
        { duration: 80, images: [[2480, 1209]] },
        // #20
        { duration: 80, images: [[2604, 1209]], exitBranch: 34 },
        // #21
        { duration: 80, images: [[2728, 1209]] },
        // #22
        { duration: 80, images: [[2852, 1209]], exitBranch: 34 },
        // #23
        { duration: 80, images: [[2976, 1209]] },
        // #24
        { duration: 80, images: [[3100, 1209]], exitBranch: 34 },
        // #25
        { duration: 80, images: [[2108, 1209]] },
        // #26
        { duration: 80, images: [[2232, 1209]], exitBranch: 34 },
        // #27
        { duration: 80, images: [[2356, 1209]] },
        // #28
        { duration: 80, images: [[2480, 1209]], exitBranch: 34 },
        // #29
        { duration: 80, images: [[2604, 1209]] },
        // #30
        { duration: 80, images: [[2728, 1209]], exitBranch: 34 },
        // #31
        { duration: 80, images: [[2852, 1209]] },
        // #32
        { duration: 80, images: [[2976, 1209]], exitBranch: 34 },
        // #33
        { duration: 80, images: [[3100, 1209]] },
        // #34
        {
          duration: 80,
          images: [[0, 1302]],
          exitBranch: 35,
          branching: {
            branches: [
              { frameIndex: 5, weight: 33 },
              { frameIndex: 10, weight: 33 },
              { frameIndex: 15, weight: 34 },
            ],
          },
        },
        // #35
        { duration: 80, images: [[124, 0]], exitBranch: 36 },
        // #36
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Hearing_1: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], exitBranch: 15 },
        // #1
        { duration: 100, images: [[0, 279]] },
        // #2
        { duration: 100, images: [[124, 279]] },
        // #3
        { duration: 100, images: [[248, 279]] },
        // #4
        { duration: 100, images: [[372, 279]] },
        // #5
        { duration: 100, images: [[496, 279]] },
        // #6
        { duration: 100, images: [[620, 279]] },
        // #7
        { duration: 100, images: [[744, 279]] },
        // #8
        { duration: 100, images: [[868, 279]] },
        // #9
        { duration: 500, images: [[992, 279]] },
        // #10
        {
          duration: 100,
          images: [[1116, 279]],
          exitBranch: 11,
          branching: { branches: [{ frameIndex: 10, weight: 100 }] },
        },
        // #11
        { duration: 100, images: [[1240, 279]] },
        // #12
        { duration: 100, images: [[1364, 279]] },
        // #13
        { duration: 100, images: [[1488, 279]] },
        // #14
        { duration: 100, images: [[1612, 279]], exitBranch: 15 },
        // #15
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookUpRight: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[620, 744]] },
        // #2
        { duration: 100, images: [[744, 744]] },
        // #3
        { duration: 100, images: [[868, 744]] },
        // #4
        { duration: 400, images: [[992, 744]] },
        // #5
        { duration: 100, images: [[1116, 744]] },
        // #6
        { duration: 100, images: [[1240, 744]], exitBranch: 7 },
        // #7
        { duration: 100, images: [[0, 0]] },
      ],
    },
    SendMail: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "29" },
        // #1
        { duration: 100, images: [[124, 1302]] },
        // #2
        { duration: 100, images: [[248, 1302]] },
        // #3
        { duration: 100, images: [[372, 1302]] },
        // #4
        { duration: 100, images: [[496, 1302]] },
        // #5
        { duration: 100, images: [[620, 1302]], sound: "8" },
        // #6
        {
          duration: 100,
          images: [
            [248, 465],
            [744, 1302],
          ],
        },
        // #7
        {
          duration: 100,
          images: [
            [372, 465],
            [744, 1302],
          ],
        },
        // #8
        {
          duration: 100,
          images: [
            [496, 465],
            [744, 1302],
          ],
        },
        // #9
        {
          duration: 100,
          images: [
            [620, 465],
            [744, 1302],
          ],
        },
        // #10
        {
          duration: 100,
          images: [
            [620, 465],
            [868, 1302],
          ],
        },
        // #11
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 1302],
          ],
        },
        // #12
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 1302],
          ],
        },
        // #13
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 1302],
          ],
        },
        // #14
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 1302],
          ],
          sound: "6",
        },
        // #15
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 1302],
          ],
        },
        // #16
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 1302],
          ],
        },
        // #17
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 1302],
          ],
        },
        // #18
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 1302],
          ],
          exitBranch: 40,
          sound: "18",
        },
        // #19
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 1302],
          ],
        },
        // #20
        {
          duration: 100,
          images: [
            [620, 465],
            [2108, 1302],
          ],
          exitBranch: 40,
        },
        // #21
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 1302],
          ],
        },
        // #22
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 1302],
          ],
          exitBranch: 40,
        },
        // #23
        {
          duration: 100,
          images: [
            [620, 465],
            [2480, 1302],
          ],
        },
        // #24
        {
          duration: 100,
          images: [
            [620, 465],
            [2604, 1302],
          ],
          exitBranch: 40,
        },
        // #25
        {
          duration: 100,
          images: [
            [620, 465],
            [2728, 1302],
          ],
        },
        // #26
        {
          duration: 100,
          images: [
            [620, 465],
            [2852, 1302],
          ],
          exitBranch: 40,
        },
        // #27
        {
          duration: 100,
          images: [
            [620, 465],
            [2976, 1302],
          ],
        },
        // #28
        {
          duration: 100,
          images: [
            [620, 465],
            [3100, 1302],
          ],
          exitBranch: 40,
        },
        // #29
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 1395],
          ],
        },
        // #30
        {
          duration: 100,
          images: [
            [620, 465],
            [124, 1395],
          ],
          exitBranch: 40,
        },
        // #31
        {
          duration: 100,
          images: [
            [620, 465],
            [248, 1395],
          ],
        },
        // #32
        {
          duration: 100,
          images: [
            [620, 465],
            [372, 1395],
          ],
          exitBranch: 40,
        },
        // #33
        {
          duration: 100,
          images: [
            [620, 465],
            [496, 1395],
          ],
        },
        // #34
        {
          duration: 100,
          images: [
            [620, 465],
            [620, 1395],
          ],
          exitBranch: 40,
        },
        // #35
        {
          duration: 100,
          images: [
            [620, 465],
            [744, 1395],
          ],
        },
        // #36
        {
          duration: 100,
          images: [
            [620, 465],
            [868, 1395],
          ],
          exitBranch: 40,
        },
        // #37
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 1395],
          ],
        },
        // #38
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 1395],
          ],
          exitBranch: 40,
        },
        // #39
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 1395],
          ],
        },
        // #40
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 1395],
          ],
        },
        // #41
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 1395],
          ],
        },
        // #42
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 1395],
          ],
        },
        // #43
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 1395],
          ],
          sound: "1",
        },
        // #44
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 1395],
          ],
        },
        // #45
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 1395],
          ],
        },
        // #46
        {
          duration: 100,
          images: [
            [620, 465],
            [2108, 1395],
          ],
        },
        // #47
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 1395],
          ],
        },
        // #48
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 1395],
          ],
        },
        // #49
        {
          duration: 100,
          images: [
            [496, 465],
            [2480, 1395],
          ],
        },
        // #50
        {
          duration: 100,
          images: [
            [372, 465],
            [2604, 1395],
          ],
        },
        // #51
        {
          duration: 100,
          images: [
            [248, 465],
            [2728, 1395],
          ],
          exitBranch: 52,
        },
        // #52
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookLeft: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[0, 1767]] },
        // #2
        { duration: 100, images: [[124, 1767]] },
        // #3
        { duration: 100, images: [[248, 1767]] },
        // #4
        { duration: 100, images: [[372, 1767]] },
        // #5
        { duration: 100, images: [[496, 1767]] },
        // #6
        { duration: 400, images: [[620, 1767]] },
        // #7
        { duration: 100, images: [[744, 1767]] },
        // #8
        { duration: 100, images: [[868, 1767]], exitBranch: 9 },
        // #9
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookUpLeft: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[0, 1767]] },
        // #2
        { duration: 100, images: [[124, 1767]] },
        // #3
        { duration: 100, images: [[248, 1767]] },
        // #4
        { duration: 100, images: [[372, 1767]] },
        // #5
        { duration: 100, images: [[496, 1767]] },
        // #6
        { duration: 400, images: [[620, 1767]] },
        // #7
        { duration: 100, images: [[744, 1767]] },
        // #8
        { duration: 100, images: [[868, 1767]], exitBranch: 9 },
        // #9
        { duration: 100, images: [[0, 0]] },
      ],
    },
    CheckingSomething: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "29" },
        // #1
        { duration: 100, images: [[2852, 1395]] },
        // #2
        { duration: 100, images: [[2976, 1395]] },
        // #3
        { duration: 100, images: [[3100, 1395]] },
        // #4
        { duration: 100, images: [[0, 1488]] },
        // #5
        { duration: 100, images: [[124, 1488]], sound: "5" },
        // #6
        { duration: 100, images: [[248, 1488]] },
        // #7
        { duration: 100, images: [[372, 1488]] },
        // #8
        { duration: 100, images: [[496, 1488]] },
        // #9
        { duration: 100, images: [[620, 1488]] },
        // #10
        { duration: 100, images: [[744, 1488]] },
        // #11
        { duration: 100, images: [[868, 1488]] },
        // #12
        { duration: 100, images: [[992, 1488]] },
        // #13
        { duration: 100, images: [[1116, 1488]], exitBranch: 66 },
        // #14
        { duration: 100, images: [[1240, 1488]] },
        // #15
        { duration: 100, images: [[1364, 1488]] },
        // #16
        { duration: 100, images: [[1488, 1488]] },
        // #17
        { duration: 100, images: [[1612, 1488]] },
        // #18
        { duration: 100, images: [[1736, 1488]], exitBranch: 66 },
        // #19
        { duration: 100, images: [[1860, 1488]] },
        // #20
        { duration: 100, images: [[1984, 1488]] },
        // #21
        { duration: 100, images: [[2108, 1488]] },
        // #22
        { duration: 100, images: [[2232, 1488]] },
        // #23
        { duration: 100, images: [[2356, 1488]] },
        // #24
        { duration: 100, images: [[2480, 1488]] },
        // #25
        { duration: 100, images: [[2604, 1488]] },
        // #26
        { duration: 100, images: [[2728, 1488]], exitBranch: 66 },
        // #27
        { duration: 100, images: [[2852, 1488]] },
        // #28
        { duration: 100, images: [[2976, 1488]] },
        // #29
        { duration: 100, images: [[3100, 1488]] },
        // #30
        { duration: 100, images: [[0, 1581]] },
        // #31
        { duration: 100, images: [[124, 1581]], exitBranch: 66 },
        // #32
        { duration: 100, images: [[248, 1581]] },
        // #33
        { duration: 100, images: [[372, 1581]] },
        // #34
        { duration: 100, images: [[496, 1581]] },
        // #35
        { duration: 100, images: [[620, 1581]] },
        // #36
        { duration: 100, images: [[744, 1581]] },
        // #37
        { duration: 100, images: [[868, 1581]], exitBranch: 66 },
        // #38
        { duration: 100, images: [[992, 1581]] },
        // #39
        { duration: 100, images: [[1116, 1581]] },
        // #40
        {
          duration: 100,
          images: [[1240, 1581]],
          branching: { branches: [{ frameIndex: 16, weight: 100 }] },
        },
        // #41
        { duration: 100, images: [[1364, 1581]] },
        // #42
        { duration: 100, images: [[1488, 1581]] },
        // #43
        { duration: 100, images: [[1612, 1581]] },
        // #44
        { duration: 100, images: [[1736, 1581]] },
        // #45
        { duration: 330, images: [[1860, 1581]] },
        // #46
        { duration: 100, images: [[1984, 1581]], exitBranch: 66 },
        // #47
        { duration: 100, images: [[2108, 1581]] },
        // #48
        { duration: 100, images: [[2232, 1581]], sound: "27" },
        // #49
        { duration: 100, images: [[2356, 1581]] },
        // #50
        { duration: 100, images: [[2480, 1581]] },
        // #51
        { duration: 100, images: [[2604, 1581]] },
        // #52
        { duration: 100, images: [[2728, 1581]] },
        // #53
        { duration: 100, images: [[2852, 1581]] },
        // #54
        { duration: 100, images: [[2976, 1581]] },
        // #55
        { duration: 100, images: [[3100, 1581]] },
        // #56
        { duration: 100, images: [[0, 1674]] },
        // #57
        { duration: 100, images: [[124, 1674]] },
        // #58
        { duration: 100, images: [[248, 1674]], sound: "17" },
        // #59
        { duration: 100, images: [[372, 1674]] },
        // #60
        { duration: 100, images: [[496, 1674]] },
        // #61
        { duration: 100, images: [[620, 1674]], sound: "24" },
        // #62
        { duration: 100, images: [[744, 1674]] },
        // #63
        { duration: 100, images: [[868, 1674]] },
        // #64
        { duration: 100, images: [[992, 1674]] },
        // #65
        { duration: 100, images: [[1116, 1674]] },
        // #66
        {
          duration: 100,
          images: [
            [248, 465],
            [1240, 1674],
          ],
        },
        // #67
        {
          duration: 100,
          images: [
            [372, 465],
            [1240, 1674],
          ],
          sound: "7",
        },
        // #68
        {
          duration: 100,
          images: [
            [496, 465],
            [1240, 1674],
          ],
        },
        // #69
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 1674],
          ],
        },
        // #70
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 1674],
          ],
        },
        // #71
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 1674],
          ],
        },
        // #72
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 1674],
          ],
        },
        // #73
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 1674],
          ],
          sound: "13",
        },
        // #74
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 1674],
          ],
        },
        // #75
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 1674],
          ],
        },
        // #76
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 1674],
          ],
        },
        // #77
        {
          duration: 100,
          images: [
            [620, 465],
            [2108, 1674],
          ],
        },
        // #78
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 1674],
          ],
        },
        // #79
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 1674],
          ],
        },
        // #80
        {
          duration: 100,
          images: [
            [496, 465],
            [2480, 1674],
          ],
        },
        // #81
        {
          duration: 100,
          images: [
            [372, 465],
            [2604, 1674],
          ],
          sound: "28",
        },
        // #82
        {
          duration: 100,
          images: [
            [248, 465],
            [2728, 1674],
          ],
        },
        // #83
        { duration: 100, images: [[2852, 1674]] },
        // #84
        { duration: 100, images: [[2976, 1674]] },
        // #85
        { duration: 100, images: [[3100, 1674]], exitBranch: 86 },
        // #86
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Save: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "29" },
        // #1
        { duration: 100, images: [[124, 372]], sound: "31" },
        // #2
        { duration: 100, images: [[248, 372]] },
        // #3
        { duration: 100, images: [[372, 372]] },
        // #4
        { duration: 100, images: [[496, 372]] },
        // #5
        { duration: 100, images: [[620, 372]], exitBranch: 11, sound: "3" },
        // #6
        { duration: 100, images: [[744, 372]] },
        // #7
        { duration: 100, images: [[868, 372]], exitBranch: 11, sound: "9" },
        // #8
        { duration: 100, images: [[992, 372]] },
        // #9
        { duration: 100, images: [[1116, 372]], exitBranch: 11 },
        // #10
        { duration: 100, images: [[1240, 372]], sound: "9" },
        // #11
        { duration: 100, images: [[1364, 372]] },
        // #12
        { duration: 100, images: [[1488, 372]] },
        // #13
        { duration: 100, images: [[1612, 372]] },
        // #14
        { duration: 100, images: [[1736, 372]] },
        // #15
        { duration: 100, images: [[1860, 372]] },
        // #16
        { duration: 100, images: [[1984, 372]] },
        // #17
        { duration: 100, images: [[2108, 372]] },
        // #18
        { duration: 1000, images: [[2232, 372]] },
        // #19
        { duration: 100, images: [[2356, 372]], sound: "15" },
        // #20
        { duration: 100, images: [[2480, 372]] },
        // #21
        { duration: 100, images: [[2604, 372]] },
        // #22
        { duration: 100, images: [[2728, 372]], exitBranch: 23 },
        // #23
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GetWizardy: {
      frames: [
        // #0
        {
          duration: 100,
          images: [[0, 0]],
          exitBranch: 39,
          sound: "29",
          branching: { branches: [{ frameIndex: 19, weight: 50 }] },
        },
        // #1
        { duration: 100, images: [[992, 1767]], sound: "22" },
        // #2
        { duration: 100, images: [[1116, 1767]] },
        // #3
        { duration: 100, images: [[1240, 1767]] },
        // #4
        { duration: 100, images: [[1364, 1767]], exitBranch: 15 },
        // #5
        { duration: 100, images: [[1488, 1767]], sound: "15" },
        // #6
        { duration: 100, images: [[1612, 1767]], exitBranch: 15 },
        // #7
        { duration: 100, images: [[1736, 1767]] },
        // #8
        { duration: 100, images: [[1860, 1767]], exitBranch: 15 },
        // #9
        { duration: 100, images: [[1984, 1767]] },
        // #10
        { duration: 100, images: [[2108, 1767]], exitBranch: 15 },
        // #11
        { duration: 100, images: [[2232, 1767]] },
        // #12
        {
          duration: 100,
          images: [[2356, 1767]],
          exitBranch: 15,
          branching: { branches: [{ frameIndex: 4, weight: 30 }] },
        },
        // #13
        { duration: 100, images: [[2480, 1767]] },
        // #14
        { duration: 100, images: [[2604, 1767]] },
        // #15
        { duration: 100, images: [[2728, 1767]] },
        // #16
        { duration: 100, images: [[2852, 1767]] },
        // #17
        { duration: 100, images: [[2976, 1767]] },
        // #18
        {
          duration: 100,
          images: [[3100, 1767]],
          exitBranch: 39,
          branching: { branches: [{ frameIndex: 39, weight: 100 }] },
        },
        // #19
        { duration: 100, images: [[0, 1860]] },
        // #20
        { duration: 100, images: [[124, 1860]] },
        // #21
        { duration: 100, images: [[248, 1860]] },
        // #22
        { duration: 100, images: [[372, 1860]], sound: "20" },
        // #23
        { duration: 100, images: [[496, 1860]] },
        // #24
        { duration: 100, images: [[620, 1860]] },
        // #25
        { duration: 100, images: [[744, 1860]] },
        // #26
        { duration: 100, images: [[868, 1860]] },
        // #27
        { duration: 100, images: [[992, 1860]] },
        // #28
        { duration: 100, images: [[1116, 1860]] },
        // #29
        { duration: 100, images: [[1240, 1860]] },
        // #30
        { duration: 100, images: [[1364, 1860]] },
        // #31
        { duration: 100, images: [[1488, 1860]] },
        // #32
        { duration: 100, images: [[1612, 1860]] },
        // #33
        { duration: 100, images: [[1736, 1860]] },
        // #34
        { duration: 100, images: [[1860, 1860]] },
        // #35
        { duration: 100, images: [[1984, 1860]] },
        // #36
        { duration: 100, images: [[2108, 1860]] },
        // #37
        { duration: 100, images: [[2232, 1860]] },
        // #38
        { duration: 100, images: [[2356, 1860]], exitBranch: 39 },
        // #39
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleBlinkWithBrows: {
      frames: [
        // #0
        {
          duration: 500,
          images: [[0, 0]],
          exitBranch: 6,
          branching: { branches: [{ frameIndex: 0, weight: 90 }] },
        },
        // #1
        { duration: 100, images: [[2356, 186]] },
        // #2
        { duration: 100, images: [[2480, 186]] },
        // #3
        { duration: 100, images: [[2604, 186]] },
        // #4
        { duration: 100, images: [[2728, 186]] },
        // #5
        { duration: 100, images: [[2604, 186]], exitBranch: 7 },
        // #6
        {
          duration: 100,
          images: [[2480, 186]],
          exitBranch: 7,
          branching: { branches: [{ frameIndex: 0, weight: 85 }] },
        },
        // #7
        { duration: 500, images: [[0, 0]] },
      ],
    },
    GestureLeft: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        {
          duration: 330,
          images: [[0, 1767]],
          exitBranch: 2,
          branching: { branches: [{ frameIndex: 1, weight: 60 }] },
        },
        // #2
        { duration: 100, images: [[124, 1767]] },
        // #3
        { duration: 100, images: [[248, 1767]] },
        // #4
        {
          duration: 500,
          images: [[372, 1767]],
          exitBranch: 5,
          branching: { branches: [{ frameIndex: 4, weight: 60 }] },
        },
        // #5
        {
          duration: 100,
          images: [[496, 1767]],
          exitBranch: 6,
          branching: { branches: [{ frameIndex: 4, weight: 70 }] },
        },
        // #6
        { duration: 400, images: [[620, 1767]] },
        // #7
        { duration: 100, images: [[744, 1767]] },
        // #8
        {
          duration: 100,
          images: [[868, 1767]],
          exitBranch: 9,
          branching: { branches: [{ frameIndex: 1, weight: 40 }] },
        },
        // #9
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Wave: {
      frames: [
        // #0
        {
          duration: 100,
          images: [[0, 0]],
          exitBranch: 47,
          sound: "29",
          branching: { branches: [{ frameIndex: 29, weight: 50 }] },
        },
        // #1
        { duration: 100, images: [[2480, 1860]] },
        // #2
        { duration: 100, images: [[2604, 1860]] },
        // #3
        { duration: 100, images: [[2728, 1860]], exitBranch: 8 },
        // #4
        { duration: 100, images: [[2852, 1860]] },
        // #5
        { duration: 100, images: [[2976, 1860]], exitBranch: 8 },
        // #6
        { duration: 100, images: [[3100, 1860]] },
        // #7
        { duration: 100, images: [[0, 1953]] },
        // #8
        { duration: 100, images: [[124, 1953]] },
        // #9
        { duration: 100, images: [[248, 1953]] },
        // #10
        { duration: 100, images: [[372, 1953]] },
        // #11
        { duration: 100, images: [[496, 1953]] },
        // #12
        { duration: 100, images: [[620, 1953]] },
        // #13
        { duration: 100, images: [[744, 1953]], sound: "20" },
        // #14
        { duration: 100, images: [[868, 1953]] },
        // #15
        { duration: 100, images: [[992, 1953]] },
        // #16
        { duration: 100, images: [[1116, 1953]] },
        // #17
        { duration: 100, images: [[1240, 1953]] },
        // #18
        { duration: 100, images: [[1364, 1953]] },
        // #19
        { duration: 100, images: [[1488, 1953]] },
        // #20
        { duration: 100, images: [[1612, 1953]] },
        // #21
        { duration: 100, images: [[1736, 1953]] },
        // #22
        { duration: 100, images: [[1860, 1953]] },
        // #23
        { duration: 100, images: [[1984, 1953]] },
        // #24
        { duration: 100, images: [[2108, 1953]] },
        // #25
        { duration: 100, images: [[2232, 1953]] },
        // #26
        { duration: 100, images: [[2356, 1953]] },
        // #27
        { duration: 100, images: [[2480, 1953]] },
        // #28
        {
          duration: 100,
          images: [[2604, 1953]],
          exitBranch: 47,
          branching: { branches: [{ frameIndex: 47, weight: 100 }] },
        },
        // #29
        { duration: 100, images: [[992, 1767]], sound: "22" },
        // #30
        { duration: 100, images: [[1116, 1767]] },
        // #31
        { duration: 100, images: [[1240, 1767]] },
        // #32
        { duration: 100, images: [[1364, 1767]] },
        // #33
        { duration: 100, images: [[1488, 1767]], sound: "15" },
        // #34
        { duration: 100, images: [[1612, 1767]] },
        // #35
        { duration: 100, images: [[1736, 1767]] },
        // #36
        { duration: 100, images: [[1860, 1767]] },
        // #37
        { duration: 100, images: [[1984, 1767]] },
        // #38
        { duration: 100, images: [[2108, 1767]] },
        // #39
        { duration: 100, images: [[2232, 1767]] },
        // #40
        {
          duration: 100,
          images: [[2356, 1767]],
          exitBranch: 41,
          branching: { branches: [{ frameIndex: 3, weight: 30 }] },
        },
        // #41
        { duration: 100, images: [[2480, 1767]] },
        // #42
        { duration: 100, images: [[2604, 1767]] },
        // #43
        { duration: 100, images: [[2728, 1767]] },
        // #44
        { duration: 100, images: [[2852, 1767]] },
        // #45
        { duration: 100, images: [[2976, 1767]] },
        // #46
        { duration: 100, images: [[3100, 1767]], exitBranch: 47 },
        // #47
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Goodbye: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "29" },
        // #1
        {
          duration: 100,
          images: [
            [2728, 1953],
            [248, 465],
          ],
        },
        // #2
        {
          duration: 100,
          images: [
            [2728, 1953],
            [372, 465],
          ],
          sound: "7",
        },
        // #3
        {
          duration: 100,
          images: [
            [2728, 1953],
            [496, 465],
          ],
        },
        // #4
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 0],
          ],
          exitBranch: 60,
          branching: {
            branches: [
              { frameIndex: 20, weight: 33 },
              { frameIndex: 60, weight: 33 },
            ],
          },
        },
        // #5
        {
          duration: 100,
          images: [
            [620, 465],
            [2852, 1953],
          ],
        },
        // #6
        {
          duration: 100,
          images: [
            [620, 465],
            [2976, 1953],
          ],
        },
        // #7
        {
          duration: 100,
          images: [
            [620, 465],
            [3100, 1953],
          ],
        },
        // #8
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 2046],
          ],
          sound: "5",
        },
        // #9
        {
          duration: 100,
          images: [
            [620, 465],
            [124, 2046],
          ],
        },
        // #10
        {
          duration: 100,
          images: [
            [620, 465],
            [248, 2046],
          ],
        },
        // #11
        {
          duration: 100,
          images: [
            [620, 465],
            [372, 2046],
          ],
          sound: "23",
        },
        // #12
        {
          duration: 100,
          images: [
            [620, 465],
            [496, 2046],
          ],
        },
        // #13
        {
          duration: 100,
          images: [
            [620, 465],
            [620, 2046],
          ],
        },
        // #14
        {
          duration: 100,
          images: [
            [620, 465],
            [744, 2046],
          ],
          sound: "5",
        },
        // #15
        {
          duration: 100,
          images: [
            [620, 465],
            [868, 2046],
          ],
        },
        // #16
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 2046],
          ],
        },
        // #17
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 2046],
          ],
          sound: "26",
        },
        // #18
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 2046],
          ],
          exitBranch: 129,
          branching: { branches: [{ frameIndex: 129, weight: 100 }] },
        },
        // #19
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 2046],
          ],
        },
        // #20
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 2046],
          ],
        },
        // #21
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 2046],
          ],
        },
        // #22
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 2046],
          ],
        },
        // #23
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 2046],
          ],
        },
        // #24
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 2046],
          ],
        },
        // #25
        {
          duration: 100,
          images: [
            [620, 465],
            [2108, 2046],
          ],
        },
        // #26
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 2046],
          ],
          sound: "31",
        },
        // #27
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 2046],
          ],
        },
        // #28
        {
          duration: 100,
          images: [
            [620, 465],
            [2480, 2046],
          ],
        },
        // #29
        {
          duration: 100,
          images: [
            [620, 465],
            [2604, 2046],
          ],
        },
        // #30
        {
          duration: 100,
          images: [
            [620, 465],
            [2728, 2046],
          ],
        },
        // #31
        {
          duration: 100,
          images: [
            [620, 465],
            [2852, 2046],
          ],
          sound: "16",
        },
        // #32
        {
          duration: 100,
          images: [
            [620, 465],
            [2976, 2046],
          ],
        },
        // #33
        {
          duration: 100,
          images: [
            [620, 465],
            [3100, 2046],
          ],
        },
        // #34
        {
          duration: 100,
          images: [
            [496, 465],
            [0, 2139],
          ],
          sound: "15",
        },
        // #35
        {
          duration: 100,
          images: [
            [372, 465],
            [124, 2139],
          ],
          sound: "8",
        },
        // #36
        {
          duration: 100,
          images: [
            [248, 465],
            [248, 2139],
          ],
        },
        // #37
        { duration: 100, images: [[372, 2139]] },
        // #38
        { duration: 100, images: [[496, 2139]] },
        // #39
        { duration: 100, images: [[620, 2139]], sound: "25" },
        // #40
        { duration: 100, images: [[744, 2139]] },
        // #41
        { duration: 100, images: [[868, 2139]] },
        // #42
        { duration: 100, images: [[992, 2139]] },
        // #43
        { duration: 100, images: [[1116, 2139]] },
        // #44
        { duration: 100, images: [[1240, 2139]] },
        // #45
        { duration: 100, images: [[1364, 2139]] },
        // #46
        { duration: 100, images: [[1488, 2139]] },
        // #47
        { duration: 100, images: [[1612, 2139]], sound: "14" },
        // #48
        { duration: 100, images: [[1736, 2139]] },
        // #49
        { duration: 100, images: [[1860, 2139]] },
        // #50
        { duration: 100, images: [[1984, 2139]] },
        // #51
        { duration: 100, images: [[2108, 2139]] },
        // #52
        { duration: 100, images: [[2232, 2139]] },
        // #53
        { duration: 100, images: [[2356, 2139]] },
        // #54
        { duration: 100, images: [[2480, 2139]] },
        // #55
        { duration: 100, images: [[2604, 2139]] },
        // #56
        { duration: 100, images: [[2728, 2139]] },
        // #57
        { duration: 100, images: [[2852, 2139]] },
        // #58
        { duration: 100, images: [[2976, 2139]] },
        // #59
        {
          duration: 100,
          images: [[3100, 2139]],
          exitBranch: 129,
          branching: { branches: [{ frameIndex: 129, weight: 100 }] },
        },
        // #60
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 2232],
          ],
        },
        // #61
        {
          duration: 100,
          images: [
            [620, 465],
            [124, 2232],
          ],
        },
        // #62
        {
          duration: 100,
          images: [
            [620, 465],
            [248, 2232],
          ],
        },
        // #63
        {
          duration: 100,
          images: [
            [620, 465],
            [372, 2232],
          ],
        },
        // #64
        {
          duration: 100,
          images: [
            [620, 465],
            [496, 2232],
          ],
        },
        // #65
        {
          duration: 100,
          images: [
            [620, 465],
            [620, 2232],
          ],
        },
        // #66
        {
          duration: 100,
          images: [
            [620, 465],
            [744, 2232],
          ],
        },
        // #67
        {
          duration: 100,
          images: [
            [620, 465],
            [868, 2232],
          ],
        },
        // #68
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 2232],
          ],
        },
        // #69
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 2232],
          ],
        },
        // #70
        {
          duration: 200,
          images: [
            [620, 465],
            [1240, 2232],
          ],
        },
        // #71
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 2232],
          ],
        },
        // #72
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 2232],
          ],
        },
        // #73
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 2232],
          ],
        },
        // #74
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 2232],
          ],
        },
        // #75
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 2232],
          ],
        },
        // #76
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 2232],
          ],
        },
        // #77
        {
          duration: 100,
          images: [
            [620, 465],
            [2108, 2232],
          ],
        },
        // #78
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 2232],
          ],
        },
        // #79
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 2232],
          ],
        },
        // #80
        {
          duration: 100,
          images: [
            [620, 465],
            [2480, 2232],
          ],
        },
        // #81
        {
          duration: 100,
          images: [
            [620, 465],
            [2604, 2232],
          ],
          sound: "5",
        },
        // #82
        {
          duration: 100,
          images: [
            [620, 465],
            [2728, 2232],
          ],
        },
        // #83
        {
          duration: 100,
          images: [
            [620, 465],
            [2852, 2232],
          ],
        },
        // #84
        {
          duration: 100,
          images: [
            [620, 465],
            [2976, 2232],
          ],
        },
        // #85
        {
          duration: 100,
          images: [
            [620, 465],
            [3100, 2232],
          ],
        },
        // #86
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 2325],
          ],
        },
        // #87
        {
          duration: 100,
          images: [
            [620, 465],
            [124, 2325],
          ],
        },
        // #88
        {
          duration: 100,
          images: [
            [620, 465],
            [248, 2325],
          ],
        },
        // #89
        {
          duration: 100,
          images: [
            [620, 465],
            [372, 2325],
          ],
        },
        // #90
        {
          duration: 100,
          images: [
            [620, 465],
            [496, 2325],
          ],
        },
        // #91
        {
          duration: 100,
          images: [
            [620, 465],
            [620, 2325],
          ],
          sound: "23",
        },
        // #92
        {
          duration: 100,
          images: [
            [620, 465],
            [744, 2325],
          ],
        },
        // #93
        {
          duration: 100,
          images: [
            [620, 465],
            [868, 2325],
          ],
        },
        // #94
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 2325],
          ],
        },
        // #95
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 2325],
          ],
        },
        // #96
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 2325],
          ],
        },
        // #97
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 2325],
          ],
        },
        // #98
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 2325],
          ],
        },
        // #99
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 2325],
          ],
        },
        // #100
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 2325],
          ],
          sound: "10",
        },
        // #101
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 2325],
          ],
        },
        // #102
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 2325],
          ],
        },
        // #103
        {
          duration: 100,
          images: [
            [620, 465],
            [2108, 2325],
          ],
        },
        // #104
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 2325],
          ],
        },
        // #105
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 2325],
          ],
        },
        // #106
        {
          duration: 100,
          images: [
            [620, 465],
            [2480, 2325],
          ],
        },
        // #107
        {
          duration: 100,
          images: [
            [620, 465],
            [2604, 2325],
          ],
        },
        // #108
        {
          duration: 100,
          images: [
            [620, 465],
            [2728, 2325],
          ],
          sound: "10",
        },
        // #109
        {
          duration: 100,
          images: [
            [620, 465],
            [2852, 2325],
          ],
        },
        // #110
        {
          duration: 100,
          images: [
            [620, 465],
            [2976, 2325],
          ],
        },
        // #111
        {
          duration: 100,
          images: [
            [620, 465],
            [3100, 2325],
          ],
        },
        // #112
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 2418],
          ],
        },
        // #113
        {
          duration: 100,
          images: [
            [620, 465],
            [124, 2418],
          ],
        },
        // #114
        {
          duration: 100,
          images: [
            [620, 465],
            [248, 2418],
          ],
          sound: "11",
        },
        // #115
        {
          duration: 100,
          images: [
            [620, 465],
            [372, 2418],
          ],
        },
        // #116
        {
          duration: 100,
          images: [
            [620, 465],
            [496, 2418],
          ],
        },
        // #117
        {
          duration: 100,
          images: [
            [620, 465],
            [620, 2418],
          ],
        },
        // #118
        {
          duration: 100,
          images: [
            [620, 465],
            [744, 2418],
          ],
        },
        // #119
        {
          duration: 100,
          images: [
            [620, 465],
            [868, 2418],
          ],
        },
        // #120
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 2418],
          ],
          sound: "22",
        },
        // #121
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 2418],
          ],
        },
        // #122
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 2418],
          ],
        },
        // #123
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 2418],
          ],
        },
        // #124
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 2418],
          ],
        },
        // #125
        { duration: 100, images: [[620, 465]] },
        // #126
        { duration: 100, images: [[496, 465]] },
        // #127
        { duration: 100, images: [[372, 465]], sound: "7" },
        // #128
        { duration: 100, images: [[248, 465]], exitBranch: 129 },
        // #129
        { duration: 50 },
      ],
    },
    GestureRight: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        {
          duration: 330,
          images: [[620, 744]],
          exitBranch: 2,
          branching: { branches: [{ frameIndex: 1, weight: 85 }] },
        },
        // #2
        { duration: 100, images: [[744, 744]] },
        // #3
        {
          duration: 330,
          images: [[868, 744]],
          exitBranch: 4,
          branching: { branches: [{ frameIndex: 3, weight: 75 }] },
        },
        // #4
        { duration: 100, images: [[992, 744]] },
        // #5
        {
          duration: 100,
          images: [[1116, 744]],
          exitBranch: 6,
          branching: { branches: [{ frameIndex: 4, weight: 65 }] },
        },
        // #6
        {
          duration: 100,
          images: [[1240, 744]],
          exitBranch: 7,
          branching: { branches: [{ frameIndex: 1, weight: 40 }] },
        },
        // #7
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleLeansAgainstWall: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[1612, 2418]] },
        // #2
        {
          duration: 500,
          images: [[0, 0]],
          exitBranch: 46,
          branching: { branches: [{ frameIndex: 2, weight: 80 }] },
        },
        // #3
        { duration: 100, images: [[1736, 279]] },
        // #4
        {
          duration: 100,
          images: [[1860, 279]],
          exitBranch: 46,
          branching: { branches: [{ frameIndex: 2, weight: 80 }] },
        },
        // #5
        { duration: 100, images: [[2356, 1023]] },
        // #6
        { duration: 100, images: [[2480, 1023]] },
        // #7
        { duration: 100, images: [[2604, 1023]] },
        // #8
        { duration: 100, images: [[2728, 1023]] },
        // #9
        { duration: 100, images: [[2852, 1023]] },
        // #10
        { duration: 100, images: [[2976, 1023]] },
        // #11
        { duration: 100, images: [[3100, 1023]] },
        // #12
        { duration: 100, images: [[0, 1116]] },
        // #13
        { duration: 100, images: [[124, 1116]], exitBranch: 37 },
        // #14
        { duration: 100, images: [[248, 1116]] },
        // #15
        { duration: 100, images: [[372, 1116]], exitBranch: 37 },
        // #16
        { duration: 100, images: [[496, 1116]] },
        // #17
        { duration: 500, images: [[124, 1116]], exitBranch: 37 },
        // #18
        { duration: 100, images: [[248, 1116]] },
        // #19
        { duration: 100, images: [[372, 1116]], exitBranch: 37 },
        // #20
        { duration: 100, images: [[496, 1116]] },
        // #21
        {
          duration: 500,
          images: [[124, 1116]],
          exitBranch: 37,
          branching: { branches: [{ frameIndex: 13, weight: 80 }] },
        },
        // #22
        { duration: 100, images: [[620, 1116]] },
        // #23
        { duration: 100, images: [[744, 1116]], exitBranch: 37 },
        // #24
        { duration: 100, images: [[868, 1116]] },
        // #25
        { duration: 100, images: [[992, 1116]], exitBranch: 37 },
        // #26
        { duration: 400, images: [[1116, 1116]] },
        // #27
        { duration: 100, images: [[1240, 1116]], exitBranch: 37 },
        // #28
        { duration: 100, images: [[1364, 1116]] },
        // #29
        { duration: 100, images: [[1488, 1116]], exitBranch: 37 },
        // #30
        {
          duration: 500,
          images: [[1116, 1116]],
          exitBranch: 31,
          branching: { branches: [{ frameIndex: 27, weight: 80 }] },
        },
        // #31
        { duration: 100, images: [[1612, 1116]], exitBranch: 37 },
        // #32
        { duration: 100, images: [[1736, 1116]] },
        // #33
        { duration: 100, images: [[1860, 1116]], exitBranch: 37 },
        // #34
        { duration: 100, images: [[1984, 1116]] },
        // #35
        {
          duration: 200,
          images: [[2108, 1116]],
          exitBranch: 37,
          branching: { branches: [{ frameIndex: 13, weight: 85 }] },
        },
        // #36
        { duration: 100, images: [[2232, 1116]] },
        // #37
        { duration: 100, images: [[2356, 1116]] },
        // #38
        { duration: 100, images: [[2480, 1116]] },
        // #39
        { duration: 300, images: [[2604, 1116]] },
        // #40
        { duration: 100, images: [[2728, 1116]] },
        // #41
        { duration: 100, images: [[2852, 1116]] },
        // #42
        { duration: 100, images: [[2976, 1116]] },
        // #43
        { duration: 100, images: [[3100, 1116]] },
        // #44
        { duration: 100, images: [[0, 1209]] },
        // #45
        { duration: 100, images: [[124, 1209]], exitBranch: 46 },
        // #46
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleLooksAtUser: {
      frames: [
        // #0
        {
          duration: 100,
          images: [[0, 0]],
          exitBranch: 7,
          branching: { branches: [{ frameIndex: 0, weight: 50 }] },
        },
        // #1
        { duration: 100, images: [[1612, 1023]] },
        // #2
        { duration: 100, images: [[1736, 1023]] },
        // #3
        {
          duration: 330,
          images: [[1860, 1023]],
          exitBranch: 7,
          branching: { branches: [{ frameIndex: 3, weight: 90 }] },
        },
        // #4
        { duration: 100, images: [[1984, 1023]] },
        // #5
        { duration: 100, images: [[2108, 1023]] },
        // #6
        { duration: 100, images: [[2232, 1023]], exitBranch: 7 },
        // #7
        {
          duration: 500,
          images: [[1736, 2418]],
          branching: {
            branches: [
              { frameIndex: 7, weight: 85 },
              { frameIndex: 3, weight: 14 },
            ],
          },
        },
      ],
    },
    IdleLookRight: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        {
          duration: 330,
          images: [[620, 744]],
          exitBranch: 7,
          branching: { branches: [{ frameIndex: 1, weight: 85 }] },
        },
        // #2
        { duration: 100, images: [[744, 744]] },
        // #3
        {
          duration: 330,
          images: [[868, 744]],
          exitBranch: 4,
          branching: { branches: [{ frameIndex: 3, weight: 75 }] },
        },
        // #4
        { duration: 100, images: [[992, 744]] },
        // #5
        {
          duration: 100,
          images: [[1116, 744]],
          exitBranch: 7,
          branching: { branches: [{ frameIndex: 4, weight: 65 }] },
        },
        // #6
        {
          duration: 100,
          images: [[1240, 744]],
          exitBranch: 7,
          branching: { branches: [{ frameIndex: 1, weight: 40 }] },
        },
        // #7
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleFallsAsleep: {
      frames: [
        // #0
        {
          duration: 500,
          images: [[0, 0]],
          exitBranch: 58,
          branching: { branches: [{ frameIndex: 0, weight: 80 }] },
        },
        // #1
        { duration: 100, images: [[1736, 279]] },
        // #2
        {
          duration: 100,
          images: [[1860, 279]],
          exitBranch: 58,
          branching: { branches: [{ frameIndex: 0, weight: 80 }] },
        },
        // #3
        { duration: 100, images: [[1860, 2418]] },
        // #4
        { duration: 100, images: [[1984, 2418]], exitBranch: 58 },
        // #5
        { duration: 100, images: [[2108, 2418]] },
        // #6
        { duration: 100, images: [[2232, 2418]], exitBranch: 58 },
        // #7
        { duration: 100, images: [[2356, 2418]] },
        // #8
        { duration: 100, images: [[2480, 2418]], exitBranch: 58 },
        // #9
        { duration: 100, images: [[2604, 2418]] },
        // #10
        { duration: 100, images: [[2728, 372]], exitBranch: 58 },
        // #11
        { duration: 100, images: [[2728, 2418]] },
        // #12
        { duration: 100, images: [[2604, 372]], exitBranch: 58 },
        // #13
        { duration: 100, images: [[2480, 372]] },
        // #14
        { duration: 100, images: [[2852, 2418]], exitBranch: 58 },
        // #15
        { duration: 100, images: [[2976, 2418]] },
        // #16
        { duration: 100, images: [[3100, 2418]], exitBranch: 28 },
        // #17
        { duration: 100, images: [[0, 2511]] },
        // #18
        { duration: 100, images: [[124, 2511]], exitBranch: 28 },
        // #19
        { duration: 100, images: [[248, 2511]] },
        // #20
        { duration: 100, images: [[372, 2511]], exitBranch: 28 },
        // #21
        { duration: 100, images: [[496, 2511]] },
        // #22
        { duration: 100, images: [[620, 2511]], exitBranch: 28 },
        // #23
        { duration: 100, images: [[744, 2511]] },
        // #24
        {
          duration: 500,
          images: [[868, 2511]],
          exitBranch: 28,
          branching: { branches: [{ frameIndex: 24, weight: 65 }] },
        },
        // #25
        {
          duration: 500,
          images: [[2356, 372]],
          exitBranch: 28,
          branching: { branches: [{ frameIndex: 25, weight: 50 }] },
        },
        // #26
        { duration: 100, images: [[992, 2511]], exitBranch: 28 },
        // #27
        {
          duration: 500,
          images: [[1116, 2511]],
          exitBranch: 28,
          branching: {
            branches: [
              { frameIndex: 24, weight: 50 },
              { frameIndex: 27, weight: 25 },
            ],
          },
        },
        // #28
        { duration: 100, images: [[1240, 2511]] },
        // #29
        { duration: 100, images: [[1364, 2511]] },
        // #30
        { duration: 100, images: [[1488, 2511]] },
        // #31
        { duration: 100, images: [[1612, 2511]] },
        // #32
        { duration: 500, images: [[1736, 2511]] },
        // #33
        { duration: 100, images: [[1860, 2511]] },
        // #34
        { duration: 100, images: [[1984, 2511]] },
        // #35
        { duration: 100, images: [[2108, 2511]] },
        // #36
        { duration: 100, images: [[2232, 2511]], exitBranch: 48 },
        // #37
        { duration: 100, images: [[2356, 2511]] },
        // #38
        { duration: 100, images: [[2480, 2511]] },
        // #39
        { duration: 100, images: [[2604, 2511]] },
        // #40
        { duration: 100, images: [[2728, 2511]] },
        // #41
        { duration: 100, images: [[2852, 2511]] },
        // #42
        { duration: 100, images: [[2976, 2511]] },
        // #43
        { duration: 100, images: [[3100, 2511]] },
        // #44
        { duration: 100, images: [[0, 2604]] },
        // #45
        { duration: 100, images: [[124, 2604]] },
        // #46
        { duration: 100, images: [[248, 2604]] },
        // #47
        { duration: 100, images: [[372, 2604]] },
        // #48
        { duration: 100, images: [[496, 2604]] },
        // #49
        { duration: 100, images: [[620, 2604]] },
        // #50
        { duration: 100, images: [[744, 2604]] },
        // #51
        { duration: 100, images: [[868, 2604]] },
        // #52
        { duration: 100, images: [[992, 2604]] },
        // #53
        { duration: 100, images: [[1116, 2604]] },
        // #54
        { duration: 100, images: [[1240, 2604]] },
        // #55
        { duration: 100, images: [[1364, 2604]] },
        // #56
        { duration: 100, images: [[1488, 2604]] },
        // #57
        { duration: 100, images: [[1612, 2604]], exitBranch: 58 },
        // #58
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookDownRight: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[1860, 93]] },
        // #2
        { duration: 100, images: [[1984, 93]] },
        // #3
        { duration: 100, images: [[2108, 93]] },
        // #4
        { duration: 100, images: [[2232, 93]] },
        // #5
        { duration: 100, images: [[2356, 93]] },
        // #6
        { duration: 100, images: [[2480, 93]] },
        // #7
        { duration: 400, images: [[2604, 93]] },
        // #8
        { duration: 100, images: [[2728, 93]] },
        // #9
        { duration: 100, images: [[2852, 93]], exitBranch: 10 },
        // #10
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GetArtsy: {
      frames: [
        // #0
        {
          duration: 100,
          images: [[0, 0]],
          exitBranch: 49,
          sound: "29",
          branching: { branches: [{ frameIndex: 29, weight: 50 }] },
        },
        // #1
        { duration: 100, images: [[2480, 1860]] },
        // #2
        { duration: 100, images: [[2604, 1860]] },
        // #3
        { duration: 100, images: [[2728, 1860]] },
        // #4
        { duration: 100, images: [[2852, 1860]] },
        // #5
        { duration: 100, images: [[2976, 1860]] },
        // #6
        { duration: 100, images: [[3100, 1860]] },
        // #7
        { duration: 100, images: [[0, 1953]] },
        // #8
        { duration: 100, images: [[124, 1953]] },
        // #9
        { duration: 100, images: [[248, 1953]] },
        // #10
        { duration: 100, images: [[372, 1953]] },
        // #11
        { duration: 100, images: [[496, 1953]] },
        // #12
        { duration: 100, images: [[620, 1953]] },
        // #13
        { duration: 100, images: [[744, 1953]], sound: "20" },
        // #14
        { duration: 100, images: [[868, 1953]] },
        // #15
        { duration: 100, images: [[992, 1953]] },
        // #16
        { duration: 100, images: [[1116, 1953]] },
        // #17
        { duration: 100, images: [[1240, 1953]] },
        // #18
        { duration: 100, images: [[1364, 1953]] },
        // #19
        { duration: 100, images: [[1488, 1953]] },
        // #20
        { duration: 100, images: [[1612, 1953]] },
        // #21
        { duration: 100, images: [[1736, 1953]] },
        // #22
        { duration: 100, images: [[1860, 1953]] },
        // #23
        { duration: 100, images: [[1984, 1953]] },
        // #24
        { duration: 100, images: [[2108, 1953]] },
        // #25
        { duration: 100, images: [[2232, 1953]] },
        // #26
        { duration: 100, images: [[2356, 1953]] },
        // #27
        { duration: 100, images: [[2480, 1953]] },
        // #28
        {
          duration: 100,
          images: [[2604, 1953]],
          exitBranch: 49,
          branching: { branches: [{ frameIndex: 49, weight: 100 }] },
        },
        // #29
        { duration: 100, images: [[0, 1860]] },
        // #30
        { duration: 100, images: [[124, 1860]] },
        // #31
        { duration: 100, images: [[248, 1860]] },
        // #32
        { duration: 100, images: [[372, 1860]], sound: "20" },
        // #33
        { duration: 100, images: [[496, 1860]] },
        // #34
        { duration: 100, images: [[620, 1860]] },
        // #35
        { duration: 100, images: [[744, 1860]] },
        // #36
        { duration: 100, images: [[868, 1860]] },
        // #37
        { duration: 100, images: [[992, 1860]] },
        // #38
        { duration: 100, images: [[1116, 1860]] },
        // #39
        { duration: 100, images: [[1240, 1860]] },
        // #40
        { duration: 100, images: [[1364, 1860]] },
        // #41
        { duration: 100, images: [[1488, 1860]] },
        // #42
        { duration: 100, images: [[1612, 1860]] },
        // #43
        { duration: 100, images: [[1736, 1860]] },
        // #44
        { duration: 100, images: [[1860, 1860]] },
        // #45
        { duration: 100, images: [[1984, 1860]] },
        // #46
        { duration: 100, images: [[2108, 1860]] },
        // #47
        { duration: 100, images: [[2232, 1860]] },
        // #48
        { duration: 100, images: [[2356, 1860]], exitBranch: 49 },
        // #49
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Show: {
      frames: [
        // #0
        { duration: 10 },
        // #1
        { duration: 10, images: [[1736, 93]] },
        // #2
        { duration: 10, images: [[1612, 93]] },
        // #3
        { duration: 10, images: [[1488, 93]] },
        // #4
        { duration: 10, images: [[0, 0]] },
      ],
    },
    IdleLowersToGround: {
      frames: [
        // #0
        {
          duration: 500,
          images: [[0, 0]],
          exitBranch: 20,
          branching: { branches: [{ frameIndex: 0, weight: 85 }] },
        },
        // #1
        { duration: 100, images: [[1736, 279]] },
        // #2
        {
          duration: 100,
          images: [[1860, 279]],
          exitBranch: 20,
          branching: { branches: [{ frameIndex: 0, weight: 80 }] },
        },
        // #3
        { duration: 100, images: [[1736, 2604]] },
        // #4
        { duration: 100, images: [[1860, 2604]] },
        // #5
        { duration: 100, images: [[1984, 2604]] },
        // #6
        { duration: 100, images: [[2108, 2604]] },
        // #7
        { duration: 130, images: [[2232, 2604]] },
        // #8
        { duration: 160, images: [[2356, 2604]] },
        // #9
        { duration: 200, images: [[2480, 2604]] },
        // #10
        {
          duration: 750,
          images: [[2604, 2604]],
          exitBranch: 11,
          branching: { branches: [{ frameIndex: 10, weight: 85 }] },
        },
        // #11
        { duration: 200, images: [[2728, 2604]] },
        // #12
        { duration: 200, images: [[2852, 2604]] },
        // #13
        { duration: 100, images: [[2976, 2604]] },
        // #14
        { duration: 100, images: [[3100, 2604]] },
        // #15
        { duration: 100, images: [[0, 2697]] },
        // #16
        { duration: 100, images: [[124, 2697]] },
        // #17
        { duration: 100, images: [[248, 2697]] },
        // #18
        { duration: 100, images: [[372, 2697]] },
        // #19
        { duration: 100, images: [[496, 2697]], exitBranch: 20 },
        // #20
        { duration: 100, images: [[0, 0]] },
      ],
    },
    LookDown: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[1860, 93]] },
        // #2
        { duration: 100, images: [[1984, 93]] },
        // #3
        { duration: 100, images: [[2108, 93]] },
        // #4
        { duration: 100, images: [[2232, 93]] },
        // #5
        { duration: 100, images: [[2356, 93]] },
        // #6
        { duration: 100, images: [[2480, 93]] },
        // #7
        { duration: 400, images: [[2604, 93]] },
        // #8
        { duration: 100, images: [[2728, 93]] },
        // #9
        { duration: 100, images: [[2852, 93]], exitBranch: 10 },
        // #10
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Searching: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "29" },
        // #1
        { duration: 100, images: [[2852, 1395]] },
        // #2
        { duration: 100, images: [[2976, 1395]] },
        // #3
        { duration: 100, images: [[3100, 1395]] },
        // #4
        { duration: 100, images: [[620, 2697]], exitBranch: 42, sound: "5" },
        // #5
        { duration: 600, images: [[744, 2697]] },
        // #6
        { duration: 100, images: [[868, 2697]] },
        // #7
        { duration: 100, images: [[992, 2697]] },
        // #8
        { duration: 100, images: [[1116, 2697]] },
        // #9
        { duration: 100, images: [[1240, 2697]] },
        // #10
        { duration: 330, images: [[1364, 2697]] },
        // #11
        {
          duration: 330,
          images: [[1488, 2697]],
          exitBranch: 12,
          branching: {
            branches: [
              { frameIndex: 11, weight: 65 },
              { frameIndex: 15, weight: 10 },
            ],
          },
        },
        // #12
        { duration: 100, images: [[1612, 2697]] },
        // #13
        {
          duration: 330,
          images: [[1736, 2697]],
          exitBranch: 14,
          branching: {
            branches: [
              { frameIndex: 13, weight: 65 },
              { frameIndex: 11, weight: 8 },
            ],
          },
        },
        // #14
        { duration: 100, images: [[1612, 2697]] },
        // #15
        { duration: 100, images: [[1860, 2697]] },
        // #16
        { duration: 100, images: [[1984, 2697]] },
        // #17
        { duration: 100, images: [[2108, 2697]] },
        // #18
        {
          duration: 100,
          images: [[2232, 2697]],
          exitBranch: 42,
          sound: "26",
          branching: { branches: [{ frameIndex: 19, weight: 50 }] },
        },
        // #19
        { duration: 100, images: [[2356, 2697]] },
        // #20
        { duration: 100, images: [[2480, 2697]] },
        // #21
        { duration: 100, images: [[2604, 2697]] },
        // #22
        { duration: 100, images: [[2728, 2697]] },
        // #23
        { duration: 100, images: [[2852, 2697]] },
        // #24
        {
          duration: 300,
          images: [[2976, 2697]],
          exitBranch: 25,
          branching: { branches: [{ frameIndex: 24, weight: 70 }] },
        },
        // #25
        { duration: 100, images: [[3100, 2697]] },
        // #26
        { duration: 100, images: [[0, 2790]] },
        // #27
        {
          duration: 100,
          images: [[124, 2790]],
          exitBranch: 42,
          sound: "5",
          branching: { branches: [{ frameIndex: 33, weight: 50 }] },
        },
        // #28
        { duration: 100, images: [[248, 2790]], exitBranch: 42 },
        // #29
        { duration: 160, images: [[372, 2790]] },
        // #30
        {
          duration: 660,
          images: [[496, 2790]],
          exitBranch: 31,
          branching: { branches: [{ frameIndex: 30, weight: 40 }] },
        },
        // #31
        { duration: 160, images: [[372, 2790]], exitBranch: 42 },
        // #32
        {
          duration: 600,
          images: [[248, 2790]],
          exitBranch: 33,
          branching: { branches: [{ frameIndex: 32, weight: 70 }] },
        },
        // #33
        { duration: 100, images: [[620, 2790]] },
        // #34
        { duration: 100, images: [[744, 2790]] },
        // #35
        {
          duration: 400,
          images: [[868, 2790]],
          exitBranch: 36,
          branching: {
            branches: [
              { frameIndex: 35, weight: 65 },
              { frameIndex: 15, weight: 35 },
            ],
          },
        },
        // #36
        { duration: 100, images: [[1240, 2697]] },
        // #37
        { duration: 100, images: [[1116, 2697]] },
        // #38
        { duration: 100, images: [[992, 2697]] },
        // #39
        { duration: 100, images: [[868, 2697]], exitBranch: 42, sound: "23" },
        // #40
        { duration: 100, images: [[744, 2697]] },
        // #41
        { duration: 100, images: [[620, 2697]] },
        // #42
        { duration: 100, images: [[3100, 1395]] },
        // #43
        { duration: 100, images: [[2976, 1395]] },
        // #44
        { duration: 100, images: [[2852, 1395]], exitBranch: 45 },
        // #45
        { duration: 100, images: [[0, 0]] },
      ],
    },
    EmptyTrash: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]], sound: "29" },
        // #1
        { duration: 100, images: [[992, 2790]], sound: "31" },
        // #2
        { duration: 100, images: [[1488, 2046]] },
        // #3
        { duration: 100, images: [[1612, 2046]] },
        // #4
        { duration: 100, images: [[1736, 2046]] },
        // #5
        { duration: 100, images: [[1860, 2046]] },
        // #6
        { duration: 100, images: [[1984, 2046]] },
        // #7
        { duration: 100, images: [[2108, 2046]] },
        // #8
        { duration: 100, images: [[2232, 2046]] },
        // #9
        { duration: 100, images: [[2356, 2046]] },
        // #10
        { duration: 100, images: [[2480, 2046]] },
        // #11
        { duration: 100, images: [[2604, 2046]] },
        // #12
        { duration: 100, images: [[2728, 2046]] },
        // #13
        { duration: 100, images: [[2852, 2046]], sound: "16" },
        // #14
        { duration: 100, images: [[2976, 2046]] },
        // #15
        { duration: 100, images: [[3100, 2046]] },
        // #16
        { duration: 100, images: [[0, 2139]] },
        // #17
        { duration: 100, images: [[124, 2139]], sound: "8" },
        // #18
        { duration: 100, images: [[248, 2139]] },
        // #19
        { duration: 100, images: [[372, 2139]] },
        // #20
        { duration: 100, images: [[496, 2139]], exitBranch: 29, sound: "25" },
        // #21
        { duration: 100, images: [[620, 2139]] },
        // #22
        { duration: 100, images: [[744, 2139]], exitBranch: 29 },
        // #23
        { duration: 100, images: [[868, 2139]] },
        // #24
        { duration: 100, images: [[992, 2139]], exitBranch: 29 },
        // #25
        { duration: 100, images: [[1116, 2139]] },
        // #26
        { duration: 100, images: [[1240, 2139]], exitBranch: 29 },
        // #27
        { duration: 100, images: [[1364, 2139]] },
        // #28
        { duration: 100, images: [[1488, 2139]] },
        // #29
        { duration: 100, images: [[1612, 2139]], sound: "14" },
        // #30
        { duration: 100, images: [[1736, 2139]] },
        // #31
        { duration: 100, images: [[1860, 2139]] },
        // #32
        { duration: 100, images: [[1984, 2139]] },
        // #33
        { duration: 100, images: [[2108, 2139]] },
        // #34
        { duration: 100, images: [[2232, 2139]] },
        // #35
        { duration: 100, images: [[2356, 2139]] },
        // #36
        { duration: 100, images: [[2480, 2139]] },
        // #37
        { duration: 100, images: [[2604, 2139]] },
        // #38
        { duration: 100, images: [[2728, 2139]] },
        // #39
        { duration: 100, images: [[2852, 2139]] },
        // #40
        { duration: 100, images: [[2976, 2139]] },
        // #41
        { duration: 100, images: [[3100, 2139]] },
        // #42
        { duration: 500 },
        // #43
        { duration: 100, images: [[248, 465]] },
        // #44
        { duration: 100, images: [[372, 465]], sound: "7" },
        // #45
        { duration: 100, images: [[496, 465]] },
        // #46
        { duration: 100, images: [[620, 465]] },
        // #47
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 2790],
          ],
          sound: "12",
        },
        // #48
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 2790],
          ],
        },
        // #49
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 2790],
          ],
        },
        // #50
        {
          duration: 100,
          images: [
            [496, 465],
            [1488, 2790],
          ],
        },
        // #51
        {
          duration: 100,
          images: [
            [372, 465],
            [1612, 2790],
          ],
          sound: "7",
        },
        // #52
        {
          duration: 100,
          images: [
            [248, 465],
            [1736, 2790],
          ],
          exitBranch: 53,
        },
        // #53
        { duration: 100, images: [[0, 0]] },
      ],
    },
    Greeting: {
      frames: [
        // #0
        { duration: 0, sound: "29" },
        // #1
        { duration: 100, images: [[248, 465]] },
        // #2
        { duration: 100, images: [[372, 465]], sound: "7" },
        // #3
        {
          duration: 100,
          images: [[496, 465]],
          exitBranch: 4,
          branching: {
            branches: [
              { frameIndex: 64, weight: 25 },
              { frameIndex: 25, weight: 25 },
              { frameIndex: 10, weight: 25 },
            ],
          },
        },
        // #4
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 2790],
          ],
          sound: "31",
        },
        // #5
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 2790],
          ],
        },
        // #6
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 2790],
          ],
        },
        // #7
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 2790],
          ],
        },
        // #8
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 2790],
          ],
        },
        // #9
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 2790],
          ],
          exitBranch: 112,
          branching: { branches: [{ frameIndex: 112, weight: 100 }] },
        },
        // #10
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 2790],
          ],
        },
        // #11
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 2790],
          ],
          sound: "5",
        },
        // #12
        {
          duration: 100,
          images: [
            [620, 465],
            [2108, 2790],
          ],
        },
        // #13
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 2790],
          ],
        },
        // #14
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 2790],
          ],
        },
        // #15
        {
          duration: 100,
          images: [
            [620, 465],
            [2480, 2790],
          ],
          sound: "23",
        },
        // #16
        {
          duration: 100,
          images: [
            [620, 465],
            [2604, 2790],
          ],
        },
        // #17
        {
          duration: 100,
          images: [
            [620, 465],
            [2728, 2790],
          ],
        },
        // #18
        {
          duration: 100,
          images: [
            [620, 465],
            [2852, 2790],
          ],
        },
        // #19
        {
          duration: 100,
          images: [
            [620, 465],
            [2976, 2790],
          ],
        },
        // #20
        {
          duration: 100,
          images: [
            [620, 465],
            [3100, 2790],
          ],
        },
        // #21
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 2883],
          ],
        },
        // #22
        {
          duration: 100,
          images: [
            [620, 465],
            [124, 2883],
          ],
          sound: "5",
        },
        // #23
        {
          duration: 100,
          images: [
            [620, 465],
            [248, 2883],
          ],
        },
        // #24
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 0],
          ],
          exitBranch: 112,
          branching: { branches: [{ frameIndex: 112, weight: 100 }] },
        },
        // #25
        {
          duration: 100,
          images: [
            [620, 465],
            [372, 2883],
          ],
        },
        // #26
        {
          duration: 100,
          images: [
            [620, 465],
            [496, 2883],
          ],
        },
        // #27
        {
          duration: 100,
          images: [
            [620, 465],
            [620, 2883],
          ],
        },
        // #28
        {
          duration: 100,
          images: [
            [620, 465],
            [744, 2883],
          ],
          sound: "8",
        },
        // #29
        {
          duration: 100,
          images: [
            [620, 465],
            [868, 2883],
          ],
        },
        // #30
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 2883],
          ],
          exitBranch: 112,
          branching: { branches: [{ frameIndex: 112, weight: 100 }] },
        },
        // #31
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 2883],
          ],
        },
        // #32
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 2883],
          ],
          sound: "30",
        },
        // #33
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 2883],
          ],
        },
        // #34
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 2883],
          ],
        },
        // #35
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 2883],
          ],
        },
        // #36
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 2883],
          ],
        },
        // #37
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 2883],
          ],
        },
        // #38
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 2883],
          ],
        },
        // #39
        {
          duration: 100,
          images: [
            [620, 465],
            [2108, 2883],
          ],
        },
        // #40
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 2883],
          ],
        },
        // #41
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 2883],
          ],
        },
        // #42
        {
          duration: 100,
          images: [
            [620, 465],
            [2480, 2883],
          ],
        },
        // #43
        {
          duration: 100,
          images: [
            [620, 465],
            [2604, 2883],
          ],
        },
        // #44
        {
          duration: 100,
          images: [
            [620, 465],
            [2728, 2883],
          ],
        },
        // #45
        {
          duration: 100,
          images: [
            [620, 465],
            [2852, 2883],
          ],
          sound: "31",
        },
        // #46
        {
          duration: 100,
          images: [
            [620, 465],
            [2976, 2883],
          ],
        },
        // #47
        {
          duration: 100,
          images: [
            [620, 465],
            [3100, 2883],
          ],
        },
        // #48
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 2976],
          ],
        },
        // #49
        {
          duration: 100,
          images: [
            [620, 465],
            [124, 2976],
          ],
        },
        // #50
        {
          duration: 100,
          images: [
            [620, 465],
            [248, 2976],
          ],
        },
        // #51
        {
          duration: 100,
          images: [
            [620, 465],
            [372, 2976],
          ],
        },
        // #52
        {
          duration: 100,
          images: [
            [620, 465],
            [496, 2976],
          ],
        },
        // #53
        {
          duration: 100,
          images: [
            [620, 465],
            [620, 2976],
          ],
        },
        // #54
        {
          duration: 100,
          images: [
            [620, 465],
            [744, 2976],
          ],
        },
        // #55
        {
          duration: 100,
          images: [
            [620, 465],
            [868, 2976],
          ],
        },
        // #56
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 2976],
          ],
        },
        // #57
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 2976],
          ],
        },
        // #58
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 2976],
          ],
        },
        // #59
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 2976],
          ],
        },
        // #60
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 2976],
          ],
        },
        // #61
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 2976],
          ],
        },
        // #62
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 2976],
          ],
        },
        // #63
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 2976],
          ],
          exitBranch: 112,
          branching: { branches: [{ frameIndex: 112, weight: 100 }] },
        },
        // #64
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 2976],
          ],
        },
        // #65
        {
          duration: 100,
          images: [
            [620, 465],
            [2108, 2976],
          ],
          sound: "31",
        },
        // #66
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 2976],
          ],
        },
        // #67
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 2976],
          ],
        },
        // #68
        {
          duration: 100,
          images: [
            [620, 465],
            [2480, 2976],
          ],
        },
        // #69
        {
          duration: 100,
          images: [
            [620, 465],
            [2604, 2976],
          ],
        },
        // #70
        {
          duration: 100,
          images: [
            [620, 465],
            [2728, 2976],
          ],
        },
        // #71
        {
          duration: 100,
          images: [
            [620, 465],
            [2852, 2976],
          ],
        },
        // #72
        {
          duration: 100,
          images: [
            [620, 465],
            [2976, 2976],
          ],
        },
        // #73
        {
          duration: 100,
          images: [
            [620, 465],
            [3100, 2976],
          ],
        },
        // #74
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 3069],
          ],
        },
        // #75
        {
          duration: 100,
          images: [
            [620, 465],
            [124, 3069],
          ],
        },
        // #76
        {
          duration: 100,
          images: [
            [620, 465],
            [248, 3069],
          ],
        },
        // #77
        {
          duration: 100,
          images: [
            [620, 465],
            [372, 3069],
          ],
        },
        // #78
        {
          duration: 100,
          images: [
            [620, 465],
            [496, 3069],
          ],
        },
        // #79
        {
          duration: 100,
          images: [
            [620, 465],
            [620, 3069],
          ],
        },
        // #80
        {
          duration: 100,
          images: [
            [620, 465],
            [744, 3069],
          ],
        },
        // #81
        {
          duration: 100,
          images: [
            [620, 465],
            [868, 3069],
          ],
        },
        // #82
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 3069],
          ],
        },
        // #83
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 3069],
          ],
        },
        // #84
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 3069],
          ],
        },
        // #85
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 3069],
          ],
        },
        // #86
        {
          duration: 100,
          images: [
            [620, 465],
            [1488, 3069],
          ],
        },
        // #87
        {
          duration: 100,
          images: [
            [620, 465],
            [1612, 3069],
          ],
        },
        // #88
        {
          duration: 100,
          images: [
            [620, 465],
            [1736, 3069],
          ],
          sound: "21",
        },
        // #89
        {
          duration: 100,
          images: [
            [620, 465],
            [1860, 3069],
          ],
        },
        // #90
        {
          duration: 100,
          images: [
            [620, 465],
            [1984, 3069],
          ],
        },
        // #91
        {
          duration: 100,
          images: [
            [620, 465],
            [2108, 3069],
          ],
        },
        // #92
        {
          duration: 100,
          images: [
            [620, 465],
            [2232, 3069],
          ],
        },
        // #93
        {
          duration: 100,
          images: [
            [620, 465],
            [2356, 3069],
          ],
        },
        // #94
        {
          duration: 100,
          images: [
            [620, 465],
            [2480, 3069],
          ],
        },
        // #95
        {
          duration: 100,
          images: [
            [620, 465],
            [2604, 3069],
          ],
          sound: "8",
        },
        // #96
        {
          duration: 100,
          images: [
            [620, 465],
            [2728, 3069],
          ],
        },
        // #97
        {
          duration: 100,
          images: [
            [620, 465],
            [2852, 3069],
          ],
        },
        // #98
        {
          duration: 100,
          images: [
            [620, 465],
            [2976, 3069],
          ],
        },
        // #99
        {
          duration: 100,
          images: [
            [620, 465],
            [3100, 3069],
          ],
        },
        // #100
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 3162],
          ],
        },
        // #101
        {
          duration: 100,
          images: [
            [620, 465],
            [124, 3162],
          ],
        },
        // #102
        {
          duration: 100,
          images: [
            [620, 465],
            [248, 3162],
          ],
        },
        // #103
        {
          duration: 100,
          images: [
            [620, 465],
            [372, 3162],
          ],
        },
        // #104
        {
          duration: 100,
          images: [
            [620, 465],
            [496, 3162],
          ],
        },
        // #105
        {
          duration: 100,
          images: [
            [620, 465],
            [620, 3162],
          ],
        },
        // #106
        {
          duration: 100,
          images: [
            [620, 465],
            [744, 3162],
          ],
        },
        // #107
        {
          duration: 100,
          images: [
            [620, 465],
            [868, 3162],
          ],
        },
        // #108
        {
          duration: 100,
          images: [
            [620, 465],
            [992, 3162],
          ],
        },
        // #109
        {
          duration: 100,
          images: [
            [620, 465],
            [1116, 3162],
          ],
          sound: "31",
        },
        // #110
        {
          duration: 100,
          images: [
            [620, 465],
            [1240, 3162],
          ],
        },
        // #111
        {
          duration: 100,
          images: [
            [620, 465],
            [1364, 3162],
          ],
        },
        // #112
        {
          duration: 100,
          images: [
            [620, 465],
            [0, 0],
          ],
        },
        // #113
        {
          duration: 100,
          images: [
            [1488, 3162],
            [496, 465],
          ],
        },
        // #114
        {
          duration: 100,
          images: [
            [1488, 3162],
            [372, 465],
          ],
          sound: "7",
        },
        // #115
        {
          duration: 100,
          images: [
            [1488, 3162],
            [248, 465],
          ],
          exitBranch: 116,
        },
        // #116
        { duration: 20, images: [[0, 0]] },
      ],
    },
    LookUp: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[620, 744]] },
        // #2
        { duration: 100, images: [[744, 744]] },
        // #3
        { duration: 100, images: [[868, 744]] },
        // #4
        { duration: 400, images: [[992, 744]] },
        // #5
        { duration: 100, images: [[1116, 744]] },
        // #6
        { duration: 100, images: [[1240, 744]], exitBranch: 7 },
        // #7
        { duration: 100, images: [[0, 0]] },
      ],
    },
    GestureDown: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        {
          duration: 330,
          images: [[1860, 93]],
          exitBranch: 2,
          branching: { branches: [{ frameIndex: 1, weight: 75 }] },
        },
        // #2
        { duration: 100, images: [[1984, 93]] },
        // #3
        {
          duration: 330,
          images: [[2108, 93]],
          exitBranch: 4,
          branching: { branches: [{ frameIndex: 3, weight: 75 }] },
        },
        // #4
        { duration: 100, images: [[2232, 93]] },
        // #5
        { duration: 100, images: [[2356, 93]] },
        // #6
        {
          duration: 100,
          images: [[2480, 93]],
          exitBranch: 7,
          branching: { branches: [{ frameIndex: 3, weight: 30 }] },
        },
        // #7
        { duration: 400, images: [[2604, 93]] },
        // #8
        { duration: 100, images: [[2728, 93]] },
        // #9
        { duration: 100, images: [[2852, 93]], exitBranch: 10 },
        // #10
        { duration: 100, images: [[0, 0]] },
      ],
    },
    IdleLookLeft: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        {
          duration: 330,
          images: [[0, 1767]],
          exitBranch: 9,
          branching: { branches: [{ frameIndex: 1, weight: 60 }] },
        },
        // #2
        { duration: 100, images: [[124, 1767]] },
        // #3
        { duration: 100, images: [[248, 1767]] },
        // #4
        {
          duration: 500,
          images: [[372, 1767]],
          exitBranch: 5,
          branching: { branches: [{ frameIndex: 4, weight: 60 }] },
        },
        // #5
        {
          duration: 100,
          images: [[496, 1767]],
          exitBranch: 9,
          branching: { branches: [{ frameIndex: 4, weight: 70 }] },
        },
        // #6
        { duration: 400, images: [[620, 1767]] },
        // #7
        { duration: 100, images: [[744, 1767]] },
        // #8
        {
          duration: 100,
          images: [[868, 1767]],
          exitBranch: 9,
          branching: { branches: [{ frameIndex: 1, weight: 40 }] },
        },
        // #9
        { duration: 100, images: [[0, 0]] },
      ],
    },
    RestPose: { frames: [{ duration: 100, images: [[0, 0]] }] },
    LookDownLeft: {
      frames: [
        // #0
        { duration: 100, images: [[0, 0]] },
        // #1
        { duration: 100, images: [[1860, 93]] },
        // #2
        { duration: 100, images: [[1984, 93]] },
        // #3
        { duration: 100, images: [[2108, 93]] },
        // #4
        { duration: 100, images: [[2232, 93]] },
        // #5
        { duration: 100, images: [[2356, 93]] },
        // #6
        { duration: 100, images: [[2480, 93]] },
        // #7
        { duration: 400, images: [[2604, 93]] },
        // #8
        { duration: 100, images: [[2728, 93]], exitBranch: 9 },
        // #9
        { duration: 100, images: [[2852, 93]] },
      ],
    },
  },
});
