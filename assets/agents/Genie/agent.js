clippy.ready("Genie", {
  overlayCount: 3,
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
    "14"
  ],
  framesize: [
    128,
    128
  ],
  animations: {
    MoveLeft: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              0
            ]
          ],
          sound: "10"
        },
        {
          duration: 100,
          images: [
            [
              256,
              0
            ]
          ]
        },
        {
          duration: 150,
          images: [
            [
              384,
              0
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              512,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              0
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              768,
              0
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 10,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 50,
          images: [
            [
              896,
              0
            ]
          ],
          sound: "6"
        },
        {
          duration: 100,
          images: [
            [
              1024,
              0
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              1152,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Congratulate: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1664,
              0
            ]
          ],
          sound: "14"
        },
        {
          duration: 60,
          images: [
            [
              1792,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1536,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1664,
              0
            ]
          ],
          sound: "2"
        },
        {
          duration: 60,
          images: [
            [
              1792,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1536,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1664,
              0
            ]
          ],
          sound: "9"
        },
        {
          duration: 60,
          images: [
            [
              1792,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1536,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1664,
              0
            ]
          ],
          sound: "1"
        },
        {
          duration: 60,
          images: [
            [
              1792,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1536,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1664,
              0
            ]
          ],
          sound: "9"
        },
        {
          duration: 60,
          images: [
            [
              1792,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1536,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1664,
              0
            ]
          ],
          sound: "14"
        },
        {
          duration: 60,
          images: [
            [
              1792,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1536,
              0
            ]
          ]
        },
        {
          duration: 60,
          images: [
            [
              1664,
              0
            ]
          ],
          sound: "2"
        },
        {
          duration: 0
        }
      ]
    },
    Hide: {
      frames: [
        {
          duration: 50,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              0
            ]
          ],
          sound: "7"
        },
        {
          duration: 100,
          images: [
            [
              2048,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              128
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              512,
              128
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    Pleased: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              2432
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 6,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Acknowledge: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              128
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              1024,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    Thinking: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              128
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 12,
                weight: 30
              },
              {
                frameIndex: 9,
                weight: 40
              }
            ]
          }
        },
        {
          duration: 1400,
          images: [
            [
              1920,
              128
            ],
            [
              2048,
              128
            ]
          ]
        },
        {
          duration: 1400,
          images: [
            [
              1920,
              128
            ],
            [
              2176,
              128
            ]
          ]
        },
        {
          duration: 1000,
          images: [
            [
              1920,
              128
            ]
          ]
        },
        {
          duration: 1200,
          images: [
            [
              1792,
              128
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 6,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 150,
          images: [
            [
              1920,
              128
            ],
            [
              2304,
              128
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              2432,
              128
            ],
            [
              1920,
              128
            ]
          ]
        },
        {
          duration: 150,
          images: [
            [
              2304,
              128
            ],
            [
              1920,
              128
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 7,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Suggest: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              256
            ]
          ]
        },
        {
          duration: 400,
          images: [
            [
              640,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              256
            ],
            [
              1664,
              256
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              1920,
              256
            ],
            [
              1792,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              256
            ],
            [
              2048,
              256
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              256
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 19,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Explain: {
      frames: [
        {
          duration: 80,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              2176,
              256
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              2304,
              256
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              2432,
              256
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              2560,
              256
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              0,
              384
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Decline: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              384
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              640,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              384
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    DontRecognize: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              768
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Writing: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              768
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              2560,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              896
            ]
          ],
          sound: "11"
        },
        {
          duration: 100,
          images: [
            [
              0,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              896
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              896,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              896
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 18,
                weight: 50
              },
              {
                frameIndex: 19,
                weight: 50
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1152,
              896
            ]
          ],
          sound: "12",
          branching: {
            branches: [
              {
                frameIndex: 20,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1152,
              896
            ]
          ],
          sound: "13",
          branching: {
            branches: [
              {
                frameIndex: 20,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1280,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              896
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              1792,
              896
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              1920,
              896
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 18,
                weight: 60
              },
              {
                frameIndex: 26,
                weight: 20
              },
              {
                frameIndex: 16,
                weight: 20
              }
            ]
          }
        },
        {
          duration: 300,
          images: [
            [
              896,
              896
            ]
          ]
        },
        {
          duration: 3000,
          images: [
            [
              768,
              896
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 16,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Write: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              768
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              2560,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              896
            ]
          ],
          sound: "11",
          branching: {
            branches: [
              {
                frameIndex: 10,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              0,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              896
            ]
          ],
          sound: "12"
        },
        {
          duration: 60,
          images: [
            [
              1280,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              1792
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              1792
            ],
            [
              2304,
              1792
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              1792
            ],
            [
              2432,
              1792
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 30,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ]
    },
    Idle3_2: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ],
            [
              2560,
              512
            ]
          ]
        },
        {
          duration: 400,
          images: [
            [
              0,
              0
            ],
            [
              0,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ],
            [
              2560,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ],
            [
              2560,
              512
            ]
          ]
        },
        {
          duration: 660,
          images: [
            [
              0,
              0
            ],
            [
              0,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ],
            [
              2560,
              512
            ]
          ]
        },
        {
          duration: 830,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              640
            ]
          ]
        },
        {
          duration: 400,
          images: [
            [
              768,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              640
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              384,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              640
            ]
          ]
        },
        {
          duration: 2000,
          images: [
            [
              1024,
              640
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              1152,
              640
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              1280,
              640
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 24,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 900,
          images: [
            [
              1408,
              640
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 25,
                weight: 50
              },
              {
                frameIndex: 26,
                weight: 50
              }
            ]
          }
        },
        {
          duration: 300,
          images: [
            [
              1152,
              640
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 21,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 300,
          images: [
            [
              1152,
              640
            ]
          ],
          sound: "8",
          branching: {
            branches: [
              {
                frameIndex: 21,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Idle3_1: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1536,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              640
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 3,
                weight: 50
              },
              {
                frameIndex: 4,
                weight: 50
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1920,
              640
            ]
          ],
          sound: "3",
          branching: {
            branches: [
              {
                frameIndex: 5,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1920,
              640
            ]
          ]
        },
        {
          duration: 160,
          images: [
            [
              2048,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              640
            ]
          ]
        },
        {
          duration: 660,
          images: [
            [
              2048,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    Congratulate_2: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              768
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              256,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              768
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 12,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 50,
          images: [
            [
              640,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              768
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    StartListening: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              768
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 6,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Idle2_3: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1792,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              896
            ]
          ]
        },
        {
          duration: 400,
          images: [
            [
              512,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              896
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              1024,
              896
            ]
          ]
        },
        {
          duration: 400,
          images: [
            [
              1152,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              896
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              1408,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              896
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 25,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Idle2_2: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1792,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              896
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              2176,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              1024
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              256,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1024
            ],
            [
              384,
              1024
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              256,
              1024
            ],
            [
              512,
              1024
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              256,
              1024
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              256,
              1024
            ],
            [
              384,
              1024
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              256,
              1024
            ],
            [
              512,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1024
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              256,
              1024
            ],
            [
              384,
              1024
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              256,
              1024
            ],
            [
              512,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              1024
            ]
          ]
        },
        {
          duration: 800,
          images: [
            [
              256,
              1024
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 24,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Announce: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              1024
            ]
          ]
        },
        {
          duration: 700,
          images: [
            [
              1152,
              1024
            ]
          ]
        }
      ],
      useExitBranching: true
    },
    GetAttention: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1024
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    Idle2_1: {
      frames: [
        {
          duration: 100,
          images: [
            [
              2304,
              1024
            ],
            [
              2176,
              1024
            ],
            [
              2560,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              1024
            ],
            [
              2176,
              1024
            ],
            [
              0,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              1024
            ],
            [
              2176,
              1024
            ],
            [
              2560,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1152
            ],
            [
              2176,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 0,
                weight: 15
              }
            ]
          }
        }
      ]
    },
    GestureLeft: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1152
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              1152
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              1152
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              1152
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              1152
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Surprised: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              1152
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              0,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              1280
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 9,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 50,
          images: [
            [
              512,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1280
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    GestureRight: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              2304
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Idle1_5: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1152,
              512
            ]
          ]
        },
        {
          duration: 120,
          images: [
            [
              1280,
              512
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              1408,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              512
            ],
            [
              896,
              1280
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              1408,
              512
            ],
            [
              1024,
              1280
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              1408,
              512
            ],
            [
              896,
              1280
            ]
          ]
        },
        {
          duration: 750,
          images: [
            [
              1408,
              512
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 10,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1280,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Idle1_4: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1152,
              1280
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 1,
                weight: 50
              },
              {
                frameIndex: 9,
                weight: 50
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1280
            ]
          ]
        },
        {
          duration: 750,
          images: [
            [
              1408,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1280
            ],
            [
              1536,
              1280
            ]
          ]
        },
        {
          duration: 400,
          images: [
            [
              1408,
              1280
            ],
            [
              1664,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1280
            ],
            [
              1536,
              1280
            ]
          ]
        },
        {
          duration: 2000,
          images: [
            [
              1408,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1280
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 20,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              1280
            ]
          ]
        },
        {
          duration: 1330,
          images: [
            [
              2176,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              1280
            ],
            [
              2304,
              1280
            ]
          ]
        },
        {
          duration: 400,
          images: [
            [
              2176,
              1280
            ],
            [
              2432,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              1280
            ],
            [
              2304,
              1280
            ]
          ]
        },
        {
          duration: 1500,
          images: [
            [
              2176,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    LookLeftReturn: {
      frames: [
        {
          duration: 100,
          images: [
            [
              2560,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    GestureUp: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              1408
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Idle1_1: {
      frames: [
        {
          duration: 100,
          images: [
            [
              768,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              1408
            ]
          ]
        },
        {
          duration: 1500,
          images: [
            [
              1024,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1408
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              0,
              0
            ],
            [
              2560,
              512
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              0,
              0
            ],
            [
              0,
              640
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              0,
              0
            ],
            [
              2560,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    Idle1_3: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1152,
              1408
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              1280,
              1408
            ]
          ]
        },
        {
          duration: 1830,
          images: [
            [
              0,
              1408
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 10,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              0,
              1408
            ],
            [
              1408,
              1408
            ]
          ]
        },
        {
          duration: 400,
          images: [
            [
              0,
              1408
            ],
            [
              1536,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              1408
            ],
            [
              1408,
              1408
            ]
          ]
        },
        {
          duration: 1500,
          images: [
            [
              0,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1408
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Idle1_2: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1664,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1408
            ]
          ]
        },
        {
          duration: 1000,
          images: [
            [
              1920,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1408
            ],
            [
              2048,
              1408
            ]
          ]
        },
        {
          duration: 400,
          images: [
            [
              1920,
              1408
            ],
            [
              2176,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1408
            ],
            [
              2048,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              1408
            ]
          ]
        }
      ]
    },
    Read: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              896
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              2176,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              896
            ]
          ],
          sound: "11",
          branching: {
            branches: [
              {
                frameIndex: 10,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              2304,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              1024
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              256,
              1024
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              256,
              1024
            ],
            [
              384,
              1024
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              256,
              1024
            ],
            [
              512,
              1024
            ]
          ]
        },
        {
          duration: 150,
          images: [
            [
              2432,
              1408
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              2560,
              1408
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 19,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ]
    },
    Processing: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              0,
              1536
            ]
          ]
        },
        {
          duration: 150,
          images: [
            [
              128,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1536
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 10,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              768,
              1536
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 10,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              768,
              1536
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 10,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              896,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1536
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 7,
                weight: 33
              },
              {
                frameIndex: 8,
                weight: 33
              },
              {
                frameIndex: 9,
                weight: 34
              }
            ]
          }
        },
        {
          duration: 50,
          images: [
            [
              1536,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              1536
            ]
          ]
        },
        {
          duration: 150,
          images: [
            [
              1792,
              1536
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              1920,
              1536
            ]
          ]
        },
        {
          duration: 250,
          images: [
            [
              2048,
              1536
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              2176,
              1536
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Wave: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              512
            ]
          ]
        },
        {
          duration: 500,
          images: [
            [
              2176,
              512
            ],
            [
              2048,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              512
            ],
            [
              2304,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              512
            ],
            [
              2048,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              512
            ],
            [
              2432,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              512
            ],
            [
              2048,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              512
            ],
            [
              2304,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              512
            ],
            [
              2048,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              512
            ],
            [
              2432,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              512
            ],
            [
              2048,
              512
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 14,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    DoMagic1: {
      frames: [
        {
          duration: 50,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              1664
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    DoMagic2: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1024,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              1664
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 21,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1664,
              1664
            ]
          ],
          sound: "5"
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              1664
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1664
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    LookRight: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              1792
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              1792
            ]
          ]
        }
      ]
    },
    Alert: {
      frames: [
        {
          duration: 30,
          images: [
            [
              0,
              1664
            ]
          ]
        },
        {
          duration: 30,
          images: [
            [
              128,
              1664
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 3,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 30,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    MoveRight: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1792
            ]
          ],
          sound: "10"
        },
        {
          duration: 100,
          images: [
            [
              384,
              1792
            ]
          ]
        },
        {
          duration: 150,
          images: [
            [
              512,
              1792
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              640,
              1792
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1792
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              896,
              1792
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 10,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 50,
          images: [
            [
              1024,
              1792
            ]
          ],
          sound: "6"
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1792
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1792
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Reading: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              896
            ]
          ],
          sound: "11",
          branching: {
            branches: [
              {
                frameIndex: 10,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              2304,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1024
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              256,
              1024
            ],
            [
              384,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1024
            ],
            [
              512,
              1024
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              256,
              1024
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 15,
                weight: 70
              },
              {
                frameIndex: 18,
                weight: 30
              }
            ]
          }
        },
        {
          duration: 600,
          images: [
            [
              2432,
              1408
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 14,
                weight: 50
              },
              {
                frameIndex: 15,
                weight: 50
              }
            ]
          }
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    GetAttentionContinued: {
      frames: [
        {
          duration: 100,
          images: [
            [
              2048,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1024
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 12,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1536,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1024
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    WriteContinued: {
      frames: [
        {
          duration: 100,
          images: [
            [
              512,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              896
            ]
          ],
          sound: "12"
        },
        {
          duration: 100,
          images: [
            [
              1280,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              896
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              1792,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1792
            ]
          ],
          sound: "13"
        },
        {
          duration: 100,
          images: [
            [
              1536,
              1792
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              1792
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1792
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1792
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              2048,
              1792
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 11,
                weight: 10
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              896,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              1792
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 23,
                weight: 50
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              2176,
              1792
            ],
            [
              2304,
              1792
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              1792
            ],
            [
              2432,
              1792
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 35,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              384,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              896
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              2560,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              768
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    Confused: {
      frames: [
        {
          duration: 80,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              128,
              2304
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              256,
              2304
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              384,
              2304
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              512,
              2304
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              640,
              2304
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              640,
              2304
            ],
            [
              768,
              2304
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              640,
              2304
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              640,
              2304
            ],
            [
              768,
              2304
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              640,
              2304
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              640,
              2304
            ],
            [
              768,
              2304
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              640,
              2304
            ]
          ]
        },
        {
          duration: 80,
          images: [
            [
              640,
              2304
            ],
            [
              768,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              2304
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    LookRightBlink: {
      frames: [
        {
          duration: 100,
          images: [
            [
              128,
              1792
            ],
            [
              1408,
              2048
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              128,
              1792
            ],
            [
              1536,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              1792
            ],
            [
              1408,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              1792
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 7,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              0,
              1792
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    Search: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              384
            ]
          ]
        },
        {
          duration: 500,
          images: [
            [
              1536,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              384
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              2176,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              384
            ],
            [
              2304,
              384
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              2176,
              384
            ],
            [
              2432,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              384
            ],
            [
              2304,
              384
            ]
          ]
        },
        {
          duration: 400,
          images: [
            [
              2176,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              384
            ]
          ]
        },
        {
          duration: 500,
          images: [
            [
              1536,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    Uncertain: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              1792
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              1920
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 8,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    LookLeft: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              1280
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    LookDownReturn: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1280,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    Hearing_4: {
      frames: [
        {
          duration: 30,
          images: [
            [
              768,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              1920
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 1,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    LookUpReturn: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1024,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    Hearing_1: {
      frames: [
        {
          duration: 50,
          images: [
            [
              1664,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              1920
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 1,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ],
      useExitBranching: true
    },
    Greet: {
      frames: [
        {
          duration: 80,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              1920,
              1920
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              2048,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              1920
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              2304,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              1920
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              0,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              2048
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 14,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 50,
          images: [
            [
              384,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              2048
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Hearing_3: {
      frames: [
        {
          duration: 30,
          images: [
            [
              896,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              2048
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 1,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ],
      useExitBranching: true
    },
    Idle1_6: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1152,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              1920
            ]
          ]
        },
        {
          duration: 750,
          images: [
            [
              1408,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1920
            ],
            [
              1280,
              1920
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              1408,
              1920
            ],
            [
              1536,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1920
            ],
            [
              1280,
              1920
            ]
          ]
        },
        {
          duration: 500,
          images: [
            [
              1408,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1920
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    WriteReturn: {
      frames: [
        {
          duration: 100,
          images: [
            [
              384,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              896
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              2560,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    Hearing_2: {
      frames: [
        {
          duration: 50,
          images: [
            [
              1152,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              2048
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 1,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 50,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ],
      useExitBranching: true
    },
    GetAttentionReturn: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1664,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    RestPose: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    LookDownBlink: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1408,
              512
            ],
            [
              896,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              512
            ],
            [
              1024,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              512
            ],
            [
              896,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              512
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 7,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1280,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    LookUpBlink: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1408,
              1920
            ],
            [
              1280,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1920
            ],
            [
              1536,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1920
            ],
            [
              1280,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1920
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 7,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1024,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    Think: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1536,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              128
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              128
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 8,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    Blink: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ],
            [
              2560,
              512
            ]
          ]
        },
        {
          duration: 400,
          images: [
            [
              0,
              0
            ],
            [
              0,
              640
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ],
            [
              2560,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    Show: {
      frames: [
        {
          duration: 50,
          images: [
            [
              1664,
              2048
            ]
          ],
          sound: "4"
        },
        {
          duration: 100,
          images: [
            [
              1792,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              2048
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              2176
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              2176
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    LookRightReturn: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              1792
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ]
    },
    StopListening: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              2176
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              2176
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              2176
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              2176
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              2176
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 6,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    MoveDown: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              896,
              2176
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              2176
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              2176
            ]
          ],
          sound: "10"
        },
        {
          duration: 100,
          images: [
            [
              1280,
              2176
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              1408,
              2176
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              1536,
              2176
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              1664,
              2176
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              1792,
              2176
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              1920,
              2176
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 16,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 50,
          images: [
            [
              2048,
              2176
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              2176
            ]
          ]
        },
        {
          duration: 150,
          images: [
            [
              2304,
              2176
            ]
          ],
          sound: "6"
        },
        {
          duration: 200,
          images: [
            [
              2432,
              2176
            ]
          ]
        },
        {
          duration: 150,
          images: [
            [
              2560,
              2176
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              2304
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    ReadContinued: {
      frames: [
        {
          duration: 100,
          images: [
            [
              2432,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1024
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              256,
              1024
            ],
            [
              384,
              1024
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              256,
              1024
            ],
            [
              512,
              1024
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              256,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              1408
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 18,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              0,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              896
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              2176,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              768
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    LookDown: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              512
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    Sad: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              1536
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 4,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ]
    },
    Process: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              0,
              1536
            ]
          ]
        },
        {
          duration: 150,
          images: [
            [
              128,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              1536
            ]
          ]
        },
        {
          duration: 120,
          images: [
            [
              512,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1536
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              1536,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              1536
            ]
          ]
        },
        {
          duration: 150,
          images: [
            [
              1792,
              1536
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              1920,
              1536
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              2048,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              1536
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    LookUp: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              1920
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              1920
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    },
    GestureDown: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1152,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              2304
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              2304
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    ReadReturn: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              1024
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2432,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              896
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              2176,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              896
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2304,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              768
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        }
      ],
      useExitBranching: true
    },
    Searching: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1408,
              384
            ]
          ]
        },
        {
          duration: 500,
          images: [
            [
              1536,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1664,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1792,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1920,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2048,
              384
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              2176,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              384
            ],
            [
              2304,
              384
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              2176,
              384
            ],
            [
              2432,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              384
            ],
            [
              2304,
              384
            ]
          ]
        },
        {
          duration: 400,
          images: [
            [
              2176,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2560,
              384
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              128,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              256,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              384,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              512,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              640,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              768,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              896,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              2176,
              384
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 11,
                weight: 30
              },
              {
                frameIndex: 26,
                weight: 35
              },
              {
                frameIndex: 15,
                weight: 35
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              1024,
              512
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              896,
              512
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              768,
              512
            ]
          ]
        },
        {
          duration: 800,
          images: [
            [
              640,
              512
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              768,
              512
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              896,
              512
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1024,
              512
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 14,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    MoveUp: {
      frames: [
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 150,
          images: [
            [
              128,
              2432
            ]
          ],
          sound: "10"
        },
        {
          duration: 200,
          images: [
            [
              256,
              2432
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              384,
              2432
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              512,
              2432
            ]
          ]
        },
        {
          duration: 50,
          images: [
            [
              640,
              2432
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 9,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 50,
          images: [
            [
              768,
              2432
            ]
          ],
          sound: "6"
        },
        {
          duration: 100,
          images: [
            [
              896,
              2432
            ]
          ]
        },
        {
          duration: 200,
          images: [
            [
              1024,
              2432
            ]
          ]
        },
        {
          duration: 0
        }
      ],
      useExitBranching: true
    },
    LookLeftBlink: {
      frames: [
        {
          duration: 100,
          images: [
            [
              1280,
              2432
            ],
            [
              1152,
              2432
            ]
          ]
        },
        {
          duration: 300,
          images: [
            [
              1280,
              2432
            ],
            [
              1408,
              2432
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              2432
            ],
            [
              1152,
              2432
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              1280,
              2432
            ]
          ],
          branching: {
            branches: [
              {
                frameIndex: 7,
                weight: 100
              }
            ]
          }
        },
        {
          duration: 100,
          images: [
            [
              2560,
              1280
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              1408
            ]
          ]
        },
        {
          duration: 100,
          images: [
            [
              0,
              0
            ]
          ]
        },
        {
          duration: 0
        }
      ]
    }
  }
});
