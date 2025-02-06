interface Game {
    board: string[];
    currentPlayer: string;
    gameOver: boolean;
    winner: string;
}

interface Move {
    position: number;
    player: string;
}