// File: src/ui/web/UpcomingBlocks.tsx
import React from 'react';
import { Block, SHAPES } from './types';

interface Props {
  upcomingBlocks: Block[];
}

const UpcomingBlocks: React.FC<Props> = ({ upcomingBlocks }) => {
  return (
    <div className="upcoming">
      <h2>Upcoming</h2>
      {upcomingBlocks.map((block, blockIndex) => {
        const shape = SHAPES[block].shape.filter(row => row.some(cell => cell));
        return (
          <div key={blockIndex} className="upcoming-block">
            {shape.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((isSet, cellIndex) => {
                  const cellClass = isSet ? block : 'hidden';
                  return (
                    <div
                      key={`${blockIndex}-${rowIndex}-${cellIndex}`}
                      className={`cell ${cellClass}`}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
      <style jsx>{`
        .upcoming {
          text-align: center;
          margin-top: 20px;
        }
        .upcoming-block {
          margin-bottom: 10px;
        }
        .row {
          display: flex;
          justify-content: center;
        }
        .cell {
          width: 20px;
          height: 20px;
          border: 1px solid #ccc;
          margin: 1px;
        }
        .hidden {
          visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default UpcomingBlocks;
