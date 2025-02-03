// File: GameEngine.ts
export interface Piece {
  type: string;
  shape: number[][];
  x: number;
  y: number;
  rotation: number;
}

export type Direction = "left" | "right" | "down";

export class GameEngine {
  public grid: (string | null)[][];
  private activePiece: Piece | null;
  private score: number;
  public gameOver: boolean = false;

  constructor(public width: number, public height: number) {
    this.grid = Array.from({ length: height }, () => Array(width).fill(null));
    this.activePiece = null;
    this.score = 0;
  }

  // Spawns a new piece. If piece.y is provided, it will be used.
  spawnPiece(piece: Piece) {
    const spawnY = piece.y !== undefined ? piece.y : -piece.shape.length + 1;
    this.activePiece = { ...piece, y: spawnY };

    const valid = this.isValidSpawn(this.activePiece);
  
    if (!valid) {
      this.placePiece();
      this.gameOver = true;
    }
  }

  isValidSpawn(piece: Piece): boolean {
    return piece.shape.every((row, dy) =>
      row.every((cell, dx) => {
        if (!cell) return true;
        const x = piece.x + dx;
        const y = piece.y + dy;
        if (y < 0) return true; // Ignore cells above the visible grid.
        return x >= 0 && x < this.width && y < this.height && this.grid[y][x] === null;
      })
    );
  }

  public movePiece(direction: Direction): boolean {
    if (!this.activePiece || this.gameOver) return false;
    const newPosition = { ...this.activePiece };

    if (direction === "left") newPosition.x--;
    if (direction === "right") newPosition.x++;
    if (direction === "down") newPosition.y++;

    if (this.canPlace(newPosition)) {
      this.activePiece = newPosition;
      if (direction === "down") this.score += 1; // Soft drop: +1 per row.
      return true;
    } else if (direction === "down") {
      this.placePiece();
      return true;
    }
    return false;
  }

  rotatePiece() {
    if (!this.activePiece?.shape || this.gameOver) return;

    // Standard 90° clockwise rotation (matrix transpose and reverse).
    const rotatedShape = Array(this.activePiece.shape[0].length)
      .fill(0)
      .map(() => Array(this.activePiece!.shape.length).fill(0));

    for (let y = 0; y < this.activePiece.shape.length; y++) {
      for (let x = 0; x < this.activePiece.shape[y].length; x++) {
        rotatedShape[x][this.activePiece.shape.length - 1 - y] = this.activePiece.shape[y][x];
      }
    }

    const rotatedPiece: Piece = {
      ...this.activePiece,
      shape: rotatedShape,
    };

    if (this.canPlace(rotatedPiece)) {
      this.activePiece = rotatedPiece;
    }
  }

  hardDrop() {
    if (!this.activePiece || this.gameOver) return;

    let newY = this.activePiece.y;
    let dropDistance = 0;

    while (this.canPlace({ ...this.activePiece, y: newY + 1 })) {
      newY++;
      dropDistance++;
    }

    if (dropDistance > 0) {
      this.activePiece.y = newY;
      this.score += dropDistance * 2; // Hard drop bonus.
      this.placePiece();
    }
  }

  canPlace(piece: Piece): boolean {
    return piece.shape.every((row, dy) =>
      row.every((cell, dx) => {
        if (!cell) return true;
        const x = piece.x + dx;
        const y = piece.y + dy;
        if (x < 0 || x >= this.width || y >= this.height) return false;
        return this.grid[y]?.[x] === null;
      })
    );
  }
  public placePiece() {
    if (!this.activePiece) return;
  
    // Check if any cell of the active piece is above the visible grid.
    let pieceHasAbove = false;
    this.activePiece.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const y = this.activePiece!.y + dy;
          if (y < 0) {
            pieceHasAbove = true;
          }
        }
      });
    });
  
    // Mark the grid with the active piece's type.
    this.activePiece.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const x = this.activePiece!.x + dx;
          const y = this.activePiece!.y + dy;
          if (y >= 0 && y < this.height) {
            this.grid[y][x] = this.activePiece!.type;
          }
        }
      });
    });
  
    // Clear any full lines.
    this.clearLines();
  
    // If any cell was placed above the visible grid, mark game over.
    if (pieceHasAbove) {
      this.gameOver = true;
    }
  
    // Clear the active piece regardless.
    this.activePiece = null;
  }
  

  public clearLines() {
    if (this.gameOver) return;

    let clearedLines = 0;

    // Remove full rows.
    this.grid = this.grid.filter(row => {
      if (row.every(cell => cell !== null)) {
        clearedLines++;
        return false;
      }
      return true;
    });

    // Prepend empty rows at the top until the grid has the proper height.
    while (this.grid.length < this.height) {
      this.grid.unshift(Array(this.width).fill(null));
    }

    const lineScores = [0, 100, 300, 500, 800];
    const oldScore = this.score;
    this.score += lineScores[clearedLines] || 0;
  }

  getState() {
    const state = {
      grid: this.grid,
      activePiece: this.activePiece,
      score: this.score,
      gameOver: this.gameOver,
    };
    return state;
  }
}
