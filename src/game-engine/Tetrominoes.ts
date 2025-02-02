// File: Tetrominoes.ts
export const Tetrominoes: Record<string, number[][][]> = { 
    I: [
      [[1, 1, 1, 1]],         // 0° rotation
      [[1], [1], [1], [1]],    // 90° rotation
      [[1, 1, 1, 1]],         // 180° rotation (same as 0°)
      [[1], [1], [1], [1]]     // 270° rotation (same as 90°)
    ],
    O: [
      [[1, 1], [1, 1]],       // All rotations are the same for O-piece.
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]]
    ],
    T: [
      [[0, 1, 0], [1, 1, 1]], // 0° rotation
      [[1, 0], [1, 1], [1, 0]], // 90° rotation
      [[1, 1, 1], [0, 1, 0]], // 180° rotation
      [[0, 1], [1, 1], [0, 1]]  // 270° rotation
    ],
    S: [
      [[0, 1, 1], [1, 1, 0]],  // 0° rotation
      [[1, 0], [1, 1], [0, 1]], // 90° rotation
      [[0, 1, 1], [1, 1, 0]],   // 180° rotation (same as 0°)
      [[1, 0], [1, 1], [0, 1]]  // 270° rotation (same as 90°)
    ],
    Z: [
      [[1, 1, 0], [0, 1, 1]],  // 0° rotation
      [[0, 1], [1, 1], [1, 0]], // 90° rotation
      [[1, 1, 0], [0, 1, 1]],   // 180° rotation (same as 0°)
      [[0, 1], [1, 1], [1, 0]]  // 270° rotation (same as 90°)
    ],
    J: [
      [[1, 0, 0], [1, 1, 1]],  // 0° rotation
      [[1, 1], [1, 0], [1, 0]], // 90° rotation
      [[1, 1, 1], [0, 0, 1]],   // 180° rotation
      [[0, 1], [0, 1], [1, 1]]  // 270° rotation
    ],
    L: [
      [[0, 0, 1], [1, 1, 1]],  // 0° rotation
      [[1, 0], [1, 0], [1, 1]], // 90° rotation
      [[1, 1, 1], [1, 0, 0]],   // 180° rotation
      [[1, 1], [0, 1], [0, 1]]  // 270° rotation
    ]
  };
   