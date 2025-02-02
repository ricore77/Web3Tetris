// File: src/ui/web/Board.tsx
import React from 'react';
import Cell from './Cell';
import { BoardShape } from './types';

interface Props {
  currentBoard: BoardShape;
}

const Board: React.FC<Props> = ({ currentBoard }) => {
  return (
    <div className="board" role="grid">
      {currentBoard.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
          ))}
        </div>
      ))}
      <style jsx>{`
        .board {
          display: grid;
          grid-template-rows: repeat(${currentBoard.length}, 1fr);
          gap: 1px;
          background: #444;
        }
        .row {
          display: grid;
          grid-template-columns: repeat(${currentBoard[0].length}, 1fr);
          gap: 1px;
        }
      `}</style>
    </div>
  );
};

export default Board;
