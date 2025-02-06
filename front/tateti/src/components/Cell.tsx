interface CellProps {
    value: string;
    index: number
    makeMove: (index: number) => void;
}

export function Cell({ value, index, makeMove }: CellProps) {
    return (
        <button
            onClick={() => makeMove(index)}
            style={{
                width: '100px',
                height: '100px',
                fontSize: '2rem',
                cursor: 'pointer',
                backgroundColor: '#f0f0f0',
                border: '2px solid #555',
                borderRadius: '5px',
                outline: 'none'
            }}
        >
            {value}
        </button>
    );
}
