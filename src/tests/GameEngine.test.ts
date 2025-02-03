// File: GameEngine.test.ts
import { GameEngine, Piece } from "../game-engine/GameEngine";
import { Tetrominoes } from "../game-engine/Tetrominoes";

// If Direction isn't exported, you can define it here:
type Direction = "left" | "right" | "down";

describe("GameEngine", () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine(10, 20);
  });

  beforeAll(() => {
    // Prevent process.exit from terminating Jest.
    jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit() was called");
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("Piece Spawning", () => {
    test("should spawn a valid T-piece using Tetrominoes", () => {
      const piece: Piece = {
        type: "T",
        shape: Tetrominoes["T"][0],
        x: 4,
        y: 0, // Provided y so the piece spawns in the visible grid.
        rotation: 0,
      };

      engine.spawnPiece(piece);
      const state = engine.getState();
      expect(state.activePiece).toBeTruthy();
      expect(state.activePiece?.type).toBe("T");
    });

    test("should mark gameOver when spawn is invalid", () => {
      // Fill the top row (row index 0) so that any piece spawned at y=0 will overlap.
      for (let x = 0; x < engine.width; x++) {
        engine.grid[0][x] = "X"; // Use a generic occupied marker.
      }

      const piece: Piece = {
        type: "I",
        shape: Tetrominoes["I"][0],
        x: 3,
        y: 0,
        rotation: 0,
      };

      engine.spawnPiece(piece);
      expect(engine.gameOver).toBe(true);
    });
  });

  describe("Movement", () => {
    test("should move a piece left and right correctly", () => {
      const piece: Piece = {
        type: "I",
        shape: Tetrominoes["I"][0],
        x: 3,
        y: 5,
        rotation: 0,
      };

      engine.spawnPiece(piece);
      engine.movePiece("right" as Direction);
      expect(engine.getState().activePiece?.x).toBe(4);
      engine.movePiece("left" as Direction);
      expect(engine.getState().activePiece?.x).toBe(3);
    });

    test("should perform a soft drop and increase score", () => {
      const piece: Piece = {
        type: "O",
        shape: Tetrominoes["O"][0],
        x: 4,
        y: 0,
        rotation: 0,
      };

      engine.spawnPiece(piece);
      engine.movePiece("down" as Direction);
      const state = engine.getState();
      expect(state.score).toBe(1);
    });
  });

  describe("Rotation", () => {
    test("should rotate a T-piece correctly", () => {
      const piece: Piece = {
        type: "T",
        shape: Tetrominoes["T"][0],
        x: 4,
        y: 5,
        rotation: 0,
      };

      engine.spawnPiece(piece);
      engine.rotatePiece();
      const activePiece = engine.getState().activePiece;
      // Assuming Tetrominoes["T"][1] represents the 90° rotated shape.
      expect(activePiece?.shape).toEqual(Tetrominoes["T"][1]);
    });
  });

  describe("Hard Drop", () => {
    test("should hard drop a piece, lock it, and award bonus points", () => {
      const piece: Piece = {
        type: "O",
        shape: Tetrominoes["O"][0],
        x: 4,
        y: 0,
        rotation: 0,
      };

      engine.spawnPiece(piece);
      engine.hardDrop();
      const state = engine.getState();
      expect(state.activePiece).toBeNull(); // The piece should be locked after hard drop.
      expect(state.score).toBeGreaterThan(0); // Bonus points should have been awarded.
    });
  });

  describe("Line Clearing", () => {
    test("should clear a full row and increase score by 100", () => {
      // Pre-fill the bottom row (row index 19) except for columns 4 and 5.
      for (let x = 0; x < engine.width; x++) {
        if (x !== 4 && x !== 5) {
          engine.grid[19][x] = "X";
        }
      }
      
      // Spawn an O-piece (2x2) that, when placed, completes the bottom row.
      const piece: Piece = {
        type: "O",
        shape: Tetrominoes["O"][0],
        x: 4,
        y: 18, // Set y to 18 so the piece occupies rows 18 and 19.
        rotation: 0,
      };
      
      engine.spawnPiece(piece);
      engine.placePiece();
      const state = engine.getState();
      expect(state.score).toBe(100); // Expect 100 points for clearing 1 row.
      // Cleared rows are inserted at the top, so expect the top row to be empty.
      expect(state.grid[0].every(cell => cell === null)).toBe(true);
    });

    test("should award 800 points for clearing four rows at once", () => {
      // Fill four consecutive rows completely (rows 16 to 19) with a generic marker.
      for (let y = 16; y < 20; y++) {
        for (let x = 0; x < engine.width; x++) {
          engine.grid[y][x] = "X";
        }
      }
      
      // Spawn an I-piece (1 row high) at row 15.
      const piece: Piece = {
        type: "I",
        shape: Tetrominoes["I"][0],
        x: 3,
        y: 15,
        rotation: 0,
      };
      
      engine.spawnPiece(piece);
      engine.placePiece();
      const state = engine.getState();
      expect(state.score).toBe(800); // Expect 800 points for clearing 4 rows.
    });
  });

  describe("State Consistency", () => {
    test("getState should return correct grid, score, activePiece, and gameOver", () => {
      const piece: Piece = {
        type: "I",
        shape: Tetrominoes["I"][0],
        x: 3,
        y: 5,
        rotation: 0,
      };

      engine.spawnPiece(piece);
      engine.movePiece("down");
      const state = engine.getState();
      expect(state.grid.length).toBe(20);
      expect(typeof state.score).toBe("number");
      expect(state.gameOver).toBe(false);
      expect(state.activePiece).not.toBeNull();
    });
  });
});
