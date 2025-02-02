export class HumanPlayer {
    constructor(public name: string) {}

    makeMove(move: string) {
        console.log(`${this.name} moved ${move}`);
    }
}
