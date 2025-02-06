interface Game {
    board: string[];
    currentPlayer: string;
    gameOver: boolean;
    winner: string;
    playerXSessionId: string;
    playerOSessionId: string;
}

interface Move {
    position: number;
    player: string;
    clientId: string;
}