import React from 'react';

type ScoreboardProps = {
  wins: number;
  losses: number;
  draws: number;
};

export const Scoreboard: React.FC<ScoreboardProps> = ({ wins, losses, draws }) => {
  return (
    <div className="panel scoreboard">
      <div className="score-item">
        <span className="control-label">Wins</span>
        <span className="score-value" style={{color: '#34c759'}}>{wins}</span>
      </div>
      <div className="score-item">
        <span className="control-label">Draws</span>
        <span className="score-value" style={{color: '#8e8e93'}}>{draws}</span>
      </div>
      <div className="score-item">
        <span className="control-label">Losses</span>
        <span className="score-value" style={{color: '#ff3b30'}}>{losses}</span>
      </div>
    </div>
  );
};
