"use client";

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Scoreboard } from '../../components/Scoreboard';
import { Controls } from '../../components/Controls';
import { Board } from '../../components/Board';

type Player = 'X' | 'O' | null;
type Difficulty = 'easy' | 'medium' | 'hard';
type BoardType = Player[];

const AI_WIN_MESSAGES = [
  "I calculated your defeat 3 moves ago 🤖",
  "You never had a chance 😌",
  "I saw that coming from the first move",
  "Humans are still learning… keep trying 👀",
  "Minimax > Your max 😏"
];

export default function PlayGame() {
  const [board, setBoard] = useState<BoardType>(Array(9).fill(null));
  const [player, setPlayer] = useState<Player>('X');
  const [humanSymbol, setHumanSymbol] = useState<Player>('X');
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [gameStatus, setGameStatus] = useState<'ongoing' | 'won' | 'draw'>('ongoing');
  const [winnerSymbol, setWinnerSymbol] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  
  const [scores, setScores] = useState({ wins: 0, losses: 0, draws: 0 });
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiCalculations, setAiCalculations] = useState<number | null>(null);
  const [showLoseEffect, setShowLoseEffect] = useState(false);
  const [aiWinMessage, setAiWinMessage] = useState("");

  // Check win condition locally
  const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkGameEnd = (currentBoard: BoardType) => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        setWinningLine([a, b, c]);
        setWinnerSymbol(currentBoard[a]);
        setGameStatus('won');
        if (currentBoard[a] === humanSymbol) {
          setScores(s => ({ ...s, wins: s.wins + 1 }));
          fireConfetti();
        } else {
          setScores(s => ({ ...s, losses: s.losses + 1 }));
          const randomMsg = AI_WIN_MESSAGES[Math.floor(Math.random() * AI_WIN_MESSAGES.length)];
          setAiWinMessage(randomMsg);
          setShowLoseEffect(true);
          setTimeout(() => setShowLoseEffect(false), 3000);
        }
        return true;
      }
    }
    
    if (!currentBoard.includes(null)) {
      setGameStatus('draw');
      setScores(s => ({ ...s, draws: s.draws + 1 }));
      return true;
    }

    return false;
  };

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#40c057', '#228be6']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#40c057', '#228be6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleCellClick = async (index: number) => {
    if (board[index] || gameStatus !== 'ongoing' || isAiThinking || player !== humanSymbol) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = humanSymbol;
    setBoard(newBoard);
    
    if (checkGameEnd(newBoard)) return;

    const nextPlayer = humanSymbol === 'X' ? 'O' : 'X';
    setPlayer(nextPlayer);
  };

  useEffect(() => {
    const aiSymbol = humanSymbol === 'X' ? 'O' : 'X';
    if (player === aiSymbol && gameStatus === 'ongoing') {
      makeAiMove(aiSymbol);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, gameStatus, humanSymbol]);

  const makeAiMove = async (aiSymbol: Player) => {
    setIsAiThinking(true);
    setAiCalculations(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${apiUrl}/api/game/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board,
          player: aiSymbol,
          difficulty
        })
      });

      const data = await response.json();
      
      // Snappier AI response (reduced from 500ms)
      setTimeout(() => {
        if (data.move !== -1) {
          const newBoard = [...board];
          newBoard[data.move] = aiSymbol;
          setBoard(newBoard);
          setAiCalculations(data.calculations);

          if (!checkGameEnd(newBoard)) {
            setPlayer(humanSymbol);
          }
        }
        setIsAiThinking(false);
      }, 300);

    } catch (error) {
      console.error('Error fetching AI move', error);
      setIsAiThinking(false);
      alert('Could not connect to AI Backend. Ensure NestJS is running on port 3001.');
    }
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value as Difficulty);
    resetGame();
  };

  const handleFirstPlayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isHumanFirst = e.target.value === 'human';
    setHumanSymbol(isHumanFirst ? 'X' : 'O');
    resetGame();
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameStatus('ongoing');
    setWinnerSymbol(null);
    setWinningLine([]);
    setAiCalculations(null);
    setShowLoseEffect(false);
    setAiWinMessage("");
    setPlayer('X');
  };

  const isLoss = gameStatus === 'won' && winnerSymbol !== humanSymbol;

  // --- Main Game View ---
  return (
    <>
      {showLoseEffect && <div className="lose-overlay" />}
      <div className={`game-wrapper ${showLoseEffect ? 'lose-crazy-mode' : ''}`}>
        
        <div className="game-header">
          <div className="header-top">
            <h2 className="minimal-title">Game Score</h2>
            <button className="restart-btn" onClick={resetGame}>
              Restart
            </button>
          </div>
          <Scoreboard 
            wins={scores.wins} 
            losses={scores.losses} 
            draws={scores.draws} 
          />
        </div>

        <div className="game-layout">
          
          <aside className="game-sidebar">
            <Controls 
              difficulty={difficulty}
              humanSymbol={humanSymbol}
              onDifficultyChange={handleDifficultyChange}
              onFirstPlayerChange={handleFirstPlayerChange}
            />
            


            <div className="status-box">
              <div className="status-main">
                {gameStatus === 'won' && 
                  <span style={{color: winnerSymbol === humanSymbol ? '#40c057' : '#fa5252'}}>
                    {winnerSymbol === humanSymbol ? 'You Won!' : aiWinMessage}
                  </span>
                }
                {gameStatus === 'draw' && <span>It's a Draw!</span>}
                {gameStatus === 'ongoing' && isAiThinking && <span className="ai-thinking">Calculating...</span>}
                {gameStatus === 'ongoing' && !isAiThinking && <span>Your Turn ({humanSymbol})</span>}
              </div>
              
              {aiCalculations !== null && gameStatus === 'ongoing' && 
                <div className="calc-info">Analyzed {aiCalculations} game states</div>
              }
            </div>
          </aside>

          <section className="game-board-area">
            <Board 
              board={board}
              winningLine={winningLine}
              gameStatus={gameStatus}
              isAiThinking={isAiThinking}
              isLoss={isLoss}
              onCellClick={handleCellClick}
            />
          </section>

        </div>
      </div>
    </>
  );
}
