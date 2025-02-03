# Tetris Bet Game

## Overview
The Tetris Bet game is an exciting project that combines the classic Tetris game with blockchain elements, allowing for player-bettor interaction in a decentralized manner. Players engage in the game, and bettors can place predictions on the player’s performance. Rewards are distributed based on the game outcomes and bettors’ predictions.

In the future, the game state will be saved on-chain, creating a permanent, immutable record of each game, bet, and player performance, enhancing transparency and security.

## Architecture
### Technical Architecture
The architecture of the Tetris Bet game is designed with scalability and modularity in mind. It separates the core game logic from blockchain interactions, creating a seamless experience for both players and bettors.

Key components:

- **Frontend (Web/CLI):**  
  The user interface for both the player and the bettor is built using React and Next.js for the web version, and a command-line interface (CLI) for the console version. The frontend interacts with the backend to manage the game state and user inputs.

- **Game Engine:**  
  The Game Engine handles the core game mechanics, including spawning pieces, moving them, and checking for game-over conditions. It simulates the classic Tetris gameplay and provides the game state (grid, active piece, score) to the frontend.

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

graph LR
    A[Player] -- playGame() --> B[AbstractTetrisBet Contract]
    A -- endGame() --> B
    A -- claimReward() --> B
    B -- placeBet() --> C[Bettor]
    B -- endGame() --> C
    B -- calculateReward() --> C
    C -- placeBet() --> B
    C -- getReward() --> A
    B -- Controls game state --> D[Game Engine]
    B -- Tracks score --> D


## Conclusion
The Tetris Bet project merges the classic Tetris experience with blockchain technology, creating a decentralized game where players and bettors can interact transparently and securely. With future enhancements to save the game state on-chain, this project will continue to evolve and innovate.
