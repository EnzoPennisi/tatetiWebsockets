import { Cell } from "./Cell";

interface BoardProps {
    game: Game;
    makeMove: (index: number) => void;
}

export function Board({ game, makeMove }: BoardProps) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 100px)',
            gap: '10px',
            justifyContent: 'center',
            marginTop: '20px'
        }}>
            {game.board && game.board.map((value, index) => (
                <Cell key={index} value={value} index={index} makeMove={makeMove} />
            ))}
        </div>
    );
}
