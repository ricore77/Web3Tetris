// File: src/game-engine/util.ts
import { Block, EmptyCell, CellOptions } from '../components/types';

/**
 * Converts a boolean-based shape (BlockShape) into a 2D array of CellOptions.
 * For each cell:
 *  - If the cell is true, it returns the given block (e.g. Block.I).
 *  - If the cell is false, it returns EmptyCell.Empty.
 *
 * @param block - The block type (e.g. Block.I, Block.T, etc.)
 * @param shape - The 2D boolean array representing the tetromino shape.
 * @returns A 2D array of CellOptions.
 */
export function convertShape(block: Block, shape: boolean[][]): CellOptions[][] {
  return shape.map(row =>
    row.map(cell => (cell ? block : EmptyCell.Empty))
  );
}
