import React from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';
type Player = 'X' | 'O' | null;

type ControlsProps = {
  difficulty: Difficulty;
  humanSymbol: Player;
  onDifficultyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFirstPlayerChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const Controls: React.FC<ControlsProps> = ({ 
  difficulty, 
  humanSymbol, 
  onDifficultyChange, 
  onFirstPlayerChange 
}) => {
  return (
    <div className="panel controls-row">
      <div className="control-group">
        <label className="control-label">Difficulty</label>
        <select value={difficulty} onChange={onDifficultyChange}>
          <option value="easy">Easy (Random)</option>
          <option value="medium">Medium (Limited Depth)</option>
          <option value="hard">Hard (Unbeatable)</option>
        </select>
      </div>

      <div className="control-group">
        <label className="control-label">Who plays first?</label>
        <select value={humanSymbol === 'X' ? 'human' : 'ai'} onChange={onFirstPlayerChange}>
          <option value="human">Human (X)</option>
          <option value="ai">AI (X)</option>
        </select>
      </div>
    </div>
  );
};
