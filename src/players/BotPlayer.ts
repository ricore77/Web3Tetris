export class BotPlayer {
    constructor(public difficulty: string) {}

    makeMove() {
        const moves = ["left", "right", "down", "rotate"];
        return moves[Math.floor(Math.random() * moves.length)];
    }
}
