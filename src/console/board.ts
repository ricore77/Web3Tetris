// File: Board.ts
import readline from "readline";
import { GameEngine, Piece } from "../game-engine/GameEngine";
import { Tetrominoes } from "../game-engine/Tetrominoes";

export class Board {
  private game: GameEngine;
  private rl: readline.Interface;
  private gameLoop: NodeJS.Timeout | null = null;
  private autoDropping: boolean = false;
  private headerLines: number = 3; // Number of header lines printed at startup

  constructor() {
    this.game = new GameEngine(16, 16);
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.startGame();
  }

  private getRandomTetromino(): Piece {
    try {
      const keys = Object.keys(Tetrominoes);
      if (keys.length === 0) {
        throw new Error("No tetrominoes available");
      }
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      return {
        type: randomKey,
        shape: Tetrominoes[randomKey][0],
        x: Math.floor(this.game.width / 2) - 1,
        y: 0,
        rotation: 0,
      };
    } catch (error) {
      console.error("Error generating tetromino:", error);
      throw error; // Re-throw to be handled by caller
    }
  }

  private spawnNewPiece() {
    try {
      this.game.spawnPiece(this.getRandomTetromino());
    } catch (error) {
      this.clearEntireScreen();
      console.log("❌ GAME OVER ❌ Final Score:", this.game.getState().score);
      this.rl.close();
      process.exit(0);
    }
  }

  // Clears the entire screen and resets cursor to top-left.
  private clearEntireScreen() {
    process.stdout.write("\x1B[2J\x1B[H");
  }

  // Clears only the dynamic part (grid and score) below the header.
  private clearDynamicArea() {
    // Move the cursor to the beginning of the dynamic area.
    readline.cursorTo(process.stdout, 0, this.headerLines);
    // Clear everything from this point down.
    readline.clearScreenDown(process.stdout);
  }

  private render() {
    try {
      const state = this.game.getState();
      // Clone the grid so we can overlay the active piece without modifying the engine state.
      let displayGrid = state.grid.map(row => [...row]);

      if (state.activePiece) {
        const { shape, x, y } = state.activePiece;
        shape.forEach((row, dy) => {
          row.forEach((cell, dx) => {
            if (cell && y + dy >= 0 && y + dy < this.game.height) {
              displayGrid[y + dy][x + dx] = "█";
            }
          });
        });
      }

      // Clear only the dynamic area (keeping header intact).
      this.clearDynamicArea();

      // Print dynamic info: Score and grid.
      console.log(`Score: ${state.score}\n`);
      const gridString = displayGrid
        .map(row => row.map(cell => (cell ? "█" : "·")).join(" "))
        .join("\n");
      console.log(gridString);

      if (state.gameOver) {
        console.log("❌ GAME OVER ❌ Final Score:", state.score);
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.rl.close();
        process.exit(0);
      }
    } catch (error) {
      console.error("Error rendering game state:", error);
      this.handleGameError(error);
    }
  }

  private handleInput(input: string) {
    try {
      if (input === "a") this.game.movePiece("left");
      if (input === "d") this.game.movePiece("right");
      if (input === "w") this.game.rotatePiece();
      if (input === "x") this.game.hardDrop();

      if (input === "s" && !this.autoDropping) {
        this.autoDropping = true;
        this.startGameLoop();
      }

      // Only spawn a new piece if there's no active piece and game is not over.
      if (!this.game.getState().activePiece && !this.game.getState().gameOver) {
        this.spawnNewPiece();
      }

      this.render();
    } catch (error) {
      console.error("Error handling input:", error);
      this.handleGameError(error);
    }
  }

  private startGameLoop() {
    if (this.gameLoop) return;
    this.gameLoop = setInterval(() => {
      this.game.movePiece("down");
      if (!this.game.getState().activePiece && !this.game.getState().gameOver) {
        this.spawnNewPiece();
      }
      this.render();
    }, 800);
  }

  private startGame() {
    try {
      // Clear the screen and print the header.
      this.clearEntireScreen();
      // Print header once.
      console.log("🎮 Tetris Console 🎮");
      console.log("Controls: [A] Move Left | [D] Move Right | [S] Start Auto Drop | [W] Rotate | [X] Hard Drop");
      // Set headerLines to number of lines printed above the dynamic area (header + controls).
      this.headerLines = 2;
      this.spawnNewPiece();
      this.render();
      this.rl.on("line", (input) => {
        this.handleInput(input.toLowerCase());
      });
    } catch (error) {
      console.error("Error starting game:", error);
      this.handleGameError(error);
    }
  }

  private handleGameError(error: unknown) {
    console.error("Fatal game error occurred:", error);
    if (this.gameLoop) clearInterval(this.gameLoop);
    this.clearEntireScreen();
    console.log("❌ Game crashed! Please restart the game.");
    this.rl.close();
    process.exit(1);
  }
}

// Start the game
new Board();
