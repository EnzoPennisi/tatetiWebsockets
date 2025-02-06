import { Cell } from "./Cell";

interface BoardProps {
    game: Game;
    makeMove: (index: number) => void;
}

export function Board({ game, makeMove }: BoardProps) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {game.board && game.board.map((value, index) => (
                <Cell key={index} value={value} index={index} makeMove={makeMove} />
            ))}
        </div>
    );
}
