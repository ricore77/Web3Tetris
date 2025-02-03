### **Smart Contract Rules**

#### 1. **Betting**
   - **`placeBet(address bettor, uint256 amount, uint256 prediction)`**
     - **Rule**: Bettors can place a bet by specifying their address, the amount they wish to bet, and their prediction on the player’s score (or game outcome).
     - **Condition**: The bet amount must be greater than zero.
     - **Action**: The bettor's bet is recorded on-chain, and the amount is transferred from the bettor to the contract.
     - **Important**: The bettor must be in the correct state (e.g., the game must be active and not over) for placing a bet.

#### 2. **Game End**
   - **`endGame(address player, uint256 finalScore)`**
     - **Rule**: The game ends when the player either achieves a certain score or meets the game-over condition (e.g., no valid moves).
     - **Action**: The player's final score is provided to the contract when they end the game.
     - **Effect**: This triggers the reward calculation and distribution to the bettors who made predictions based on the outcome of the game.
     - **Condition**: Only the player can call this function once the game ends.

#### 3. **Reward Calculation**
   - **`calculateReward(uint256 finalScore, uint256 prediction)`**
     - **Rule**: The reward for each bettor is calculated based on how close their prediction was to the player’s final score.
     - **Condition**: This function is executed once the game has ended, and the final score is available.
     - **Action**: If the bettor’s prediction is accurate, they receive a reward based on their bet amount. The closer the prediction to the final score, the higher the reward.
     - **Formula**: The reward may be calculated based on a fixed multiplier, the accuracy of the prediction, or any other criteria defined in the contract.
     - **Important**: This function could be updated in the future to support different reward mechanisms (e.g., reward scaling, bonuses for exact predictions).

#### 4. **Claiming Rewards**
   - **`claimReward(address bettor)`**
     - **Rule**: Bettors can claim their rewards after the game has concluded and the rewards have been distributed.
     - **Action**: The contract checks if the bettor is eligible for rewards and sends the appropriate amount to their wallet.
     - **Condition**: The bettor must not have already claimed their reward, and the contract must have sufficient balance to fulfill the payout.

#### 5. **Game State Management**
   - **`startGame(address player)`**
     - **Rule**: The game can only start once a player has been initialized. The contract tracks whether the game has started, is in progress, or is over.
     - **Action**: This function is invoked to initialize the game and allow the player to start the game session.
     - **Important**: Only the designated player can start the game.

#### 6. **Bet Closure (Cancel Bet)**
   - **`cancelBet(address bettor)`**
     - **Rule**: Bettors can cancel their bet before the game has ended, forfeiting the bet amount.
     - **Action**: When a bet is canceled, the bettor’s funds are returned, and the bet is removed from the contract’s state.
     - **Condition**: This action must occur before the game ends (the contract checks that the game is not over before allowing cancellation).

#### 7. **Security Mechanisms**
   - **`onlyPlayer` Modifier**
     - **Rule**: Functions like `endGame()` and `startGame()` can only be called by the designated player.
     - **Condition**: The player’s address is validated before executing these actions.

   - **`nonReentrant` Modifier**
     - **Rule**: This modifier prevents reentrancy attacks, ensuring that a function (such as `claimReward()`) cannot be called recursively, preventing certain types of attacks.

#### 8. **Bet Refund**
   - **`refundBettor(address bettor)`**
     - **Rule**: If the game is canceled or disrupted before it ends, bettors may be eligible for a refund of their bet amount.
     - **Condition**: This is triggered by certain conditions (e.g., if the game is halted before completion or the player's score is invalidated).
     - **Action**: The contract returns the bet amount to the bettor's address.
Bet Refund - refundBettor
In case the game is canceled or the player fails to finish, bettors can be refunded.

```solidity

// Refund function in case the game is disrupted
function refundBettor(address bettor) external {
    require(gameIsCanceled, "Game not canceled");
    require(bets[bettor].amount > 0, "No bet found for bettor");

    uint256 refundAmount = bets[bettor].amount;
    bets[bettor].amount = 0;  // Set bet amount to 0 to prevent double refund

    // Refund the bet amount to the bettor
    payable(bettor).transfer(refundAmount);
    
    emit BetRefunded(bettor, refundAmount);
}
```
#### 9. **Bet Tracking**
   - **`bets` Mapping**
     - **Rule**: The contract keeps track of all bets placed using a mapping of bettor addresses to bet information (amount and prediction).
     - **Action**: Each bettor’s prediction and bet amount are stored securely in the contract, accessible for reward calculation after the game ends.

---

### Example Flow

1. **Bettor places a bet**:
   - A bettor places a bet by calling `placeBet(address bettor, uint256 amount, uint256 prediction)`. The contract records the bet.

2. **Player starts the game**:
   - The player starts the game by calling `startGame(address player)`. The game state is initialized.

3. **Game is played**:
   - The player plays the game, controlling the Tetris pieces. The game state is tracked off-chain in the game engine, but key actions (like game start and end) are recorded on-chain.

4. **Game ends**:
   - The player ends the game by calling `endGame(address player, uint256 finalScore)`. The final score is recorded on-chain.

5. **Reward calculation**:
   - The contract calculates the rewards for each bettor based on their prediction and the actual final score using the `calculateReward(uint256 finalScore, uint256 prediction)` function.

6. **Bettor claims reward**:
   - Bettors can claim their rewards by calling `claimReward(address bettor)` if they are eligible.

---

These rules ensure that the game operates fairly, the bet placements and rewards are handled securely, and bettors and players alike can trust that the outcome is determined by both gameplay and the smart contract’s logic.

If you need further clarification on the rules or any additional functionality in the contract, feel free to ask!