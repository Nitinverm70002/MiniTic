export type Player = 'X' | 'O' | null;
export type Board = Player[];

// Define win conditions (indices of rows, columns, diagonals)
export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diags
];

export function checkWinner(board: Board): Player {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return !board.includes(null) && checkWinner(board) === null;
}

export function getAvailableMoves(board: Board): number[] {
  const moves: number[] = [];
  board.forEach((cell, index) => {
    if (cell === null) moves.push(index);
  });
  return moves;
}
