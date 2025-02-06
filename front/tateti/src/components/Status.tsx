interface StatusProps {
    game: Game;
    playerSymbol: string;
    canPlay: boolean;
}

export function Status({ game, playerSymbol, canPlay }: StatusProps) {
    return (
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>

            {!canPlay ?
                <h2>Esperando a que se una el segundo jugador...</h2>
                :
                game?.gameOver ? (
                    game.winner === 'Empate' ? (
                        <h2>¡Es un empate!</h2>
                    ) : (
                        <h2>¡El jugador {game.winner} ha ganado!</h2>
                    )
                ) : playerSymbol === game.currentPlayer ? (
                    <h2>Turno del jugador ({playerSymbol})</h2>
                ) : (
                    <h2>Esperando al otro jugador...</h2>
                )}
        </div>
    );
}
