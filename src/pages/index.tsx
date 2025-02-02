// File: pages/index.tsx
import React, { useEffect, useState, useCallback } from 'react';
import Board from '../components/Board';
import HighScores from '../components/HighScores';
import UpcomingBlocks from '../components/UpcomingBlocks';
import { GameEngine, Piece } from '../game-engine/GameEngine';
import { Tetrominoes } from '../game-engine/Tetrominoes';
import { Block, BoardShape } from '../components/types';

interface GameState {
  grid: (string | null)[][];
  activePiece: Piece | null;
  score: number;
  gameOver: boolean;
}

/**
 * Merges the active piece into the grid.
 */
function mergeActivePiece(
  grid: (string | null)[][],
  activePiece: Piece
): (string | null)[][] {
  const newGrid = grid.map(row => [...row]);
  const { shape, x, y, type } = activePiece;
  shape.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      if (cell) {
        const posY = y + dy;
        const posX = x + dx;
        if (
          posY >= 0 &&
          posY < newGrid.length &&
          posX >= 0 &&
          posX < newGrid[0].length
        ) {
          newGrid[posY][posX] = type;
        }
      }
    });
  });
  return newGrid;
}

const TetrisPage: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [upcoming, setUpcoming] = useState<Block[]>([]);

  // Initialize engine and game loop when the game is started.
  useEffect(() => {
    if (!isStarted) return;
    // Decrease height by 30%: originally 30, now 21 rows.
    const newEngine = new GameEngine(15, 21);
    setEngine(newEngine);

    // Spawn the first piece (e.g., a T-piece).
    newEngine.spawnPiece({
      type: "T",
      shape: Tetrominoes["T"][0],
      x: Math.floor(newEngine.width / 2) - 1,
      y: 0,
      rotation: 0,
    });
    setGameState({ ...newEngine.getState() });
    setUpcoming([]);

    const interval = setInterval(() => {
      if (newEngine.getState().gameOver) {
        clearInterval(interval);
        return;
      }
      newEngine.movePiece("down");
      if (!newEngine.getState().activePiece && !newEngine.getState().gameOver) {
        const keys = Object.keys(Tetrominoes) as Block[];
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        newEngine.spawnPiece({
          type: randomKey,
          shape: Tetrominoes[randomKey][0],
          x: Math.floor(newEngine.width / 2) - 1,
          y: 0,
          rotation: 0,
        });
        setUpcoming(prev => [...prev, randomKey].slice(-3));
      }
      setGameState({ ...newEngine.getState() });
    }, 800);

    return () => clearInterval(interval);
  }, [isStarted]);

  // Keyboard input handling using arrow keys.
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!engine) return;
    if (engine.getState().gameOver) return;
    switch (e.key) {
      case "ArrowLeft":
        engine.movePiece("left");
        break;
      case "ArrowRight":
        engine.movePiece("right");
        break;
      case "ArrowUp":
        engine.rotatePiece();
        break;
      case "ArrowDown":
        engine.movePiece("down");
        break;
      default:
        break;
    }
    setGameState({ ...engine.getState() });
  }, [engine]);

  useEffect(() => {
    if (isStarted) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown, isStarted]);

  // If the game hasn't started, show a welcome screen with a Start button.
  if (!isStarted) {
    return (
      <div className="start-screen" style={{ textAlign: 'center', fontFamily: 'monospace', padding: '20px' }}>
        <h1>Welcome to Tetris!</h1>
        <button onClick={() => setIsStarted(true)}>Start Game</button>
        <style jsx>{`
          button {
            padding: 10px 20px;
            font-size: 16px;
            margin-top: 20px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  if (!gameState) return <div>Loading...</div>;
  if (gameState.gameOver) {
    return (
      <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
        <h1>Game Over!</h1>
        <h2>Final Score: {gameState.score}</h2>
      </div>
    );
  }

  // Merge the active piece into the grid for display.
  const displayGrid = gameState.activePiece
    ? mergeActivePiece(gameState.grid, gameState.activePiece)
    : gameState.grid;

  return (
    <div className="tetris-container">
      <div className="tetris-game">
        <h2>Score: {gameState.score}</h2>
        <Board currentBoard={displayGrid as BoardShape} />
      </div>
      <div className="tetris-sidebar">
        <HighScores />
        <UpcomingBlocks upcomingBlocks={upcoming} />
      </div>
      <footer className="controls-footer">
        <p>
          Use <strong>Arrow Left</strong> / <strong>Arrow Right</strong> to move,{' '}
          <strong>Arrow Up</strong> to rotate, and <strong>Arrow Down</strong> for soft drop (or
          auto drop is active).
        </p>
      </footer>
      <style jsx>{`
        .tetris-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          font-family: monospace;
        }
        .tetris-game {
          margin-right: 20px;
          margin-bottom: 20px;
        }
        .tetris-sidebar {
          width: 200px;
        }
        footer.controls-footer {
          margin-top: 20px;
          font-size: 14px;
          text-align: center;
          color: #666;
        }
        @media (min-width: 768px) {
          .tetris-container {
            flex-direction: row;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default TetrisPage;
