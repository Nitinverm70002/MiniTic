import React from 'react';

type Player = 'X' | 'O' | null;

type BoardProps = {
  board: Player[];
  winningLine: number[];
  gameStatus: 'ongoing' | 'won' | 'draw';
  isAiThinking: boolean;
  isLoss?: boolean;
  onCellClick: (index: number) => void;
};

export const Board: React.FC<BoardProps> = ({ board, winningLine, gameStatus, isAiThinking, isLoss, onCellClick }) => {
  return (
    <div className="board">
      {board.map((cell, index) => {
        let additionalClass = '';
        if (cell) additionalClass += ` ${cell.toLowerCase()}`;
        if (winningLine.includes(index)) {
          additionalClass += isLoss ? ' losing' : ' winning';
        }
        
        return (
          <button
            key={index}
            className={`cell${additionalClass}`}
            onClick={() => onCellClick(index)}
            disabled={cell !== null || gameStatus !== 'ongoing' || isAiThinking}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
};
