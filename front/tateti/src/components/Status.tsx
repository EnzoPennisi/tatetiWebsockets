interface StatusProps {
    game: Game;
    playerSymbol: string;
    canPlay: boolean;
}

export function Status({ game, playerSymbol, canPlay }: StatusProps) {
    const renderGameOverMessage = () => {
        if (game.winner === 'TIE') {
            return <h2>¡Es un empate!</h2>;
        } else {
            return <h2>¡El jugador {game.winner} ha ganado!</h2>;
        }
    };

    const renderPlayerTurnMessage = () => {
        if (playerSymbol === game.currentPlayer) {
            return <h2>Turno del jugador ({playerSymbol})</h2>;
        } else {
            return <h2>Esperando al otro jugador...</h2>;
        }
    };

    const renderStatusMessage = () => {
        if (!canPlay) {
            return <h2>Esperando a que se una el segundo jugador...</h2>;
        } else if (game?.gameOver) {
            return renderGameOverMessage();
        } else {
            return renderPlayerTurnMessage();
        }
    };

    return (
        <div className="text-2xl font-bold text-center mb-6">
            {renderStatusMessage()}
        </div>
    );
}