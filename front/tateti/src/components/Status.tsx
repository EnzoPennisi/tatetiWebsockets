interface StatusProps {
    game: Game;
}

export function Status({ game }: StatusProps) {
    return (
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {game?.gameOver ? (
                game.winner === 'Empate' ? (
                    <h2>¡Es un empate!</h2>
                ) : (
                    <h2>¡El jugador {game.winner} ha ganado!</h2>
                )
            ) : (
                <h2>Turno del jugador {game?.currentPlayer}</h2>
            )}
        </div>
    );
}
