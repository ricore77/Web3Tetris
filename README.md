TetrisBet

## Overview
The Tetris Bet game is an exciting project that combines the classic Tetris game with blockchain elements, allowing for player-bettor interaction in a decentralized manner. Players engage in the game, and bettors can place predictions on the player’s performance. Rewards are distributed based on the game outcomes and bettors’ predictions.

In the future, the game state will be saved on-chain, creating a permanent, immutable record of each game, bet, and player performance, enhancing transparency and security.

## Architecture
### Technical Architecture
The architecture of the Tetris Bet game is designed with scalability and modularity in mind. It separates the core game logic from blockchain interactions, creating a seamless experience for both players and bettors.

Key components:

- **Frontend (Web/CLI):**  
  The user interface for both the player and the bettor is built using React and Next.js for the web version, and a command-line interface (CLI) for the console version. The frontend interacts with the backend to manage the game state and user inputs.

![image](https://github.com/user-attachments/assets/065b590f-d9dd-4bb5-83e8-c1f4b702b694)


### 1. Game Engine (Core Tetris Logic)
The **GameEngine** class is the heart of the Tetris game. It is responsible for managing the grid, the active piece, piece movement, rotation, line clearing, and scoring. It doesn't have any concept of the player or the user interface.

**Responsibilities**:
- Spawn and move pieces on the grid.
- Detect and handle collisions.
- Track the score and game-over state.
- Handle piece rotation and hard drops.
- Clear full lines and update the grid.

**Benefits**:
- Purely logic-based: The game engine is decoupled from user input, UI, and player behavior.
- Easily testable: Unit tests can focus on the core game mechanics without worrying about rendering or player decisions.

### 2. Board (Rendering the Game State)
The **Board** is responsible for rendering the current game state. This can be done in various ways, such as via a **CLI** (console) or a **React**/graphical user interface.

**Responsibilities**:
- Render the game grid and active pieces.
- Display the score and game-over status.
- Update the UI whenever the game state changes.

![image](https://github.com/user-attachments/assets/a620eed4-e58a-4e52-9de3-04d462d9e28c)

## How to Install
### Prerequisites
- Node.js: Ensure you have Node.js v16 or later installed on your machine.

### Installation Steps
1. Clone the Repository:
\`\`\`
git clone https://github.com/yourusername/tetris-bet-game.git
cd tetris-bet-game
\`\`\`
2. Install Dependencies:
\`\`\`
npm install
\`\`\`

### How to Run the Game (CLI Version)
To run the game in CLI Mode:
1. Navigate to the project’s root directory.
2. Run the following command to start the CLI version:
\`\`\`
npm run start:cli
\`\`\`

### How to Run the Game (Web Version)
To run the game in Web Mode:
Run the following command to start the web version:
\`\`\`
npm run start:web
\`\`\`
This will start a local development server at http://localhost:3000. Open this URL in your browser to interact with the Tetris game via a web interface.

## Game Overview
The Tetris Bet game is a twist on the classic Tetris game. The game is played just like regular Tetris, but there’s an added layer of interaction: bettors can predict the player’s performance, and rewards are distributed based on the outcome.

Once the game ends, the system calculates the rewards based on the bettor’s prediction and the player’s score. The game outcome and reward distribution are managed by the AbstractTetrisBet smart contract, ensuring fairness and transparency.

## Game Rules:
- **Player’s Role:** The player controls the Tetris game and aims to achieve the highest possible score. They can use the arrow keys to move and rotate pieces.
- **Bettor’s Role:** Bettors place predictions on the player’s performance. They can predict whether the player will achieve a certain score or win the game.
- **Smart Contract:** The contract records the game outcomes and calculates rewards based on the bettors' predictions.

## Current Features:
- CLI Mode: Play the Tetris game directly in your terminal.
- Web Mode: A fully interactive web interface for playing the game and viewing the game grid, scores, and upcoming blocks.
- Game Mechanics: Players control falling Tetrominoes, rotate them, and stack them to form complete lines.

## Future Work
In the near future, the game will integrate on-chain game state saving, allowing each game’s progress to be stored permanently on the blockchain. This will ensure the immutability and traceability of each player’s game, performance, and bet.

## Diagram
This diagram represents the roles and interactions between different components of the game:
---
config:
  theme: forest
---
sequenceDiagram
    participant P as Player
    participant B as Bettor
    participant T as AbstractTetrisBet Contract
    participant G as Game Engine
    participant GB as Game Board
    P->>T: playGame()
    T->>G: startGame()
    G->>P: sendGameState()
    G->>GB: updateBoard()
    P->>T: endGame()
    T->>G: calculateScore()
    G->>T: returnScore()
    G->>GB: finalizeBoard()
    B->>T: placeBet()
    T->>B: confirmBet()
    T->>B: calculateReward()
    B->>P: receiveReward()



## Conclusion
The Tetris Bet project merges the classic Tetris experience with blockchain technology, creating a decentralized game where players and bettors can interact transparently and securely. With future enhancements to save the game state on-chain, this project will continue to evolve and innovate.
