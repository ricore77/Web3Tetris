import mongoose from 'mongoose';

const GameStateSchema = new mongoose.Schema({
    gameId: String,
    state: Object,
    lastUpdated: { type: Date, default: Date.now }
});

export const GameState = mongoose.model('GameState', GameStateSchema);

export async function saveGameState(gameId: string, state: any) {
    await GameState.findOneAndUpdate({ gameId }, { state, lastUpdated: new Date() }, { upsert: true });
}

export async function loadGameState(gameId: string) {
    const game = await GameState.findOne({ gameId });
    return game ? game.state : null;
}
