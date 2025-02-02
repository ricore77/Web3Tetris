// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AbstractTetrisBet
 * @dev A smart contract for betting on Tetris game outcomes
 */
contract AbstractTetrisBet is ReentrancyGuard, Ownable {
    struct Bet {
        address bettor;
        uint128 amount;
        uint128 predictedScore;
    }

    struct Game {
        address player;
        uint128 score;
        uint256 startTime;
        uint256 lastMoveTime;
        uint128 targetScore;
        bool isActive;
        Bet[] bets;
    }

    mapping(address => Game) public activeGames;
    mapping(address => uint256) public winnings;

    uint256 public constant BONUS_PERCENTAGE = 5;
    uint256 public constant MAX_GAME_TIME = 600; // 10 minutes
    uint256 public constant MAX_IDLE_TIME = 60; // 1 minute
    uint256 public constant MIN_BET_AMOUNT = 0.01 ether;
    uint256 public constant MAX_BET_AMOUNT = 1 ether;
    uint256 public constant MAX_BETS_PER_GAME = 50;
    uint128 public constant MAX_TARGET_SCORE = 999999;

    uint256 public constant AVERAGE_POINTS_PER_MOVE = 4500; // Based on historical analysis
    uint256 public constant BET_MULTIPLIER = 3; // Multiplier for minimum bet score calculation

    event BetPlaced(address indexed bettor, address indexed player, uint256 amount, uint256 predictedScore);
    event GameStarted(address indexed player, uint256 targetScore, uint256 timestamp);
    event GameEnded(address indexed player, uint256 finalScore, bool reachedTarget, uint256 timestamp);
    event BonusPaid(address indexed player, uint256 amount);
    event WinningsWithdrawn(address indexed player, uint256 amount);
    event ScoreUpdated(address indexed player, uint256 newScore, uint256 timestamp);

    /**
     * @notice Starts a new Tetris game
     * @param targetScore The score the player aims to achieve
     */
    function startGame(uint128 targetScore) external {
        require(!activeGames[msg.sender].isActive, "You already have an active game");
        require(targetScore > 0 && targetScore <= MAX_TARGET_SCORE, "Invalid target score");

        activeGames[msg.sender] = Game({
            player: msg.sender,
            score: 0,
            startTime: block.timestamp,
            lastMoveTime: block.timestamp,
            targetScore: targetScore,
            isActive: true,
            bets: new Bet     });
        
        emit GameStarted(msg.sender, targetScore, block.timestamp);
    }

    /**
     * @notice Updates the player's current score
     * @param newScore The new score achieved by the player
     */
    function updateScore(uint128 newScore) external {
        Game storage game = activeGames[msg.sender];
        require(game.isActive, "No active game found");
        require(block.timestamp - game.startTime <= MAX_GAME_TIME, "Game time exceeded");
        require(block.timestamp - game.lastMoveTime <= MAX_IDLE_TIME, "Too long between moves");
        require(newScore >= game.score, "Score can only increase");

        game.score = newScore;
        game.lastMoveTime = block.timestamp;
        
        emit ScoreUpdated(msg.sender, newScore, block.timestamp);
    }

    /**
     * @notice Ends the current game and settles all bets
     */
    function endGame() external nonReentrant {
        Game storage game = activeGames[msg.sender];
        require(game.isActive, "No active game found");
        require(block.timestamp - game.startTime <= MAX_GAME_TIME, "Game time exceeded");

        uint128 finalScore = game.score;
        bool reachedTarget = finalScore >= game.targetScore;

        // Update state before external calls
        game.isActive = false;

        if (reachedTarget) {
            uint256 totalBets = getTotalBets(game.bets);
            uint256 bonus = (totalBets * BONUS_PERCENTAGE) / 100;
            winnings[msg.sender] += bonus;
            emit BonusPaid(msg.sender, bonus);
        }

        _settleBets(game, finalScore);
        emit GameEnded(msg.sender, finalScore, reachedTarget, block.timestamp);
    }

    /**
     * @notice Places a bet on a player's game
     * @param player The address of the player to bet on
     * @param predictedScore The score the bettor predicts the player will achieve
     */
    function placeBet(address player, uint128 predictedScore) external payable {
        uint256 minBetScore = AVERAGE_POINTS_PER_MOVE * BET_MULTIPLIER; // Dynamic minimum bet score

        require(msg.value >= MIN_BET_AMOUNT, "Bet amount too low");
        require(msg.value <= MAX_BET_AMOUNT, "Bet amount too high");
        require(predictedScore >= minBetScore, "Bet prediction too close to current score");
        
        Game storage game = activeGames[player];
        require(game.isActive, "Game is not active");
        require(game.bets.length < MAX_BETS_PER_GAME, "Maximum bets reached");
        require(predictedScore <= MAX_TARGET_SCORE, "Invalid predicted score");
        require(msg.sender != player, "Cannot bet on own game");

        game.bets.push(Bet(msg.sender, uint128(msg.value), predictedScore));
        emit BetPlaced(msg.sender, player, msg.value, predictedScore);
    }

    /**
     * @notice Allows users to withdraw their winnings
     */
    function withdrawWinnings() external nonReentrant {
        uint256 amount = winnings[msg.sender];
        require(amount > 0, "No winnings to withdraw");

        winnings[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        emit WinningsWithdrawn(msg.sender, amount);
    }

    /**
     * @notice Calculates total bets placed on a game
     * @param bets Array of bets to sum
     * @return total The sum of all bet amounts
     */
    function getTotalBets(Bet[] storage bets) internal view returns (uint256 total) {
        for (uint i = 0; i < bets.length; i++) {
            total += bets[i].amount;
        }
    }

    /**
     * @notice Settles all bets for a completed game
     * @param game The completed game
     * @param finalScore The final score achieved
     */
    function _settleBets(Game storage game, uint128 finalScore) private {
        for (uint i = 0; i < game.bets.length; i++) {
            Bet memory bet = game.bets[i];
            if (bet.predictedScore == finalScore) {
                // Winners get 2x their bet
                winnings[bet.bettor] += uint256(bet.amount) * 2;
            }
        }
    }

    /**
     * @notice Emergency function to cancel a game if it's stuck
     * @param player The address of the player whose game needs to be cancelled
     */
    function emergencyCancelGame(address player) external onlyOwner {
        Game storage game = activeGames[player];
        require(game.isActive, "No active game found");
        require(block.timestamp - game.lastMoveTime > MAX_IDLE_TIME, "Game still active");

        game.isActive = false;
        
        // Return all bets
        for (uint i = 0; i < game.bets.length; i++) {
            Bet memory bet = game.bets[i];
            winnings[bet.bettor] += bet.amount;
        }

        emit GameEnded(player, game.score, false, block.timestamp);
    }
}
