// File: src/ui/web/types.ts

export enum Block {
    I = 'I',
    J = 'J',
    L = 'L',
    O = 'O',
    S = 'S',
    T = 'T',
    Z = 'Z',
  }
  
  export enum EmptyCell {
    Empty = 'empty',
  }
  
  // Allow an empty cell to be either the explicit empty value or null.
  export type CellOptions = Block | EmptyCell | null;
  
  // The board is a 2D array of CellOptions.
  export type BoardShape = CellOptions[][];
  
  // A tetromino's shape is represented as a 2D boolean array.
  export type BlockShape = boolean[][];
  
  // Example canonical shapes (using boolean arrays).
  export const SHAPES: Record<Block, { shape: BlockShape }> = {
    I: {
      shape: [
        [false, false, false, false],
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false],
      ],
    },
    J: {
      shape: [
        [false, false, false],
        [true, false, false],
        [true, true, true],
      ],
    },
    L: {
      shape: [
        [false, false, false],
        [false, false, true],
        [true, true, true],
      ],
    },
    O: {
      shape: [
        [true, true],
        [true, true],
      ],
    },
    S: {
      shape: [
        [false, false, false],
        [false, true, true],
        [true, true, false],
      ],
    },
    T: {
      shape: [
        [false, false, false],
        [false, true, false],
        [true, true, true],
      ],
    },
    Z: {
      shape: [
        [false, false, false],
        [true, true, false],
        [false, true, true],
      ],
    },
  };
  