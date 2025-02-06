interface CellProps {
    value: string;
    index: number
    makeMove: (index: number) => void;
}

export function Cell({ value, index, makeMove }: CellProps) {
    return (
        <button
            onClick={() => makeMove(index)}
            className={`w-full aspect-square text-4xl font-bold flex items-center justify-center border rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer bg-gray-50 hover:bg-gray-300
                ${value ? "bg-background text-primary" : "bg-muted hover:bg-muted/80"}
                ${value === "X" ? "text-blue-500" : value === "O" ? "text-red-500" : ""}`}
        >
            {value}
        </button>
    );
}
