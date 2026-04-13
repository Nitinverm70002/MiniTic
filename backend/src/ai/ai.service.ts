import { Injectable } from '@nestjs/common';
import { Board, Player, checkWinner, isDraw, getAvailableMoves } from './game.util';

export type Difficulty = 'easy' | 'medium' | 'hard';

@Injectable()
export class AiService {
  private countTotalCalculations = 0;

  getBestMove(board: Board, aiPlayer: Player, difficulty: Difficulty): { move: number; calculations: number } {
    this.countTotalCalculations = 0;
    let bestMove = -1;
    const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';

    const availableMoves = getAvailableMoves(board);
    if (availableMoves.length === 0) {
        return { move: -1, calculations: 0 };
    }

    // Optimization: If board is empty, pick a corner or center instantly
    if (availableMoves.length === 9) {
      const bestStartingMoves = [0, 2, 4, 6, 8]; // Corners and Center
      const randomBestMove = bestStartingMoves[Math.floor(Math.random() * bestStartingMoves.length)];
      return { move: randomBestMove, calculations: 1 };
    }

    if (difficulty === 'easy') {
      // Pick randomly
      bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      return { move: bestMove, calculations: 1 };
    }

    // Minimax setup
    let bestScore = -Infinity;
    
    // Depth limit for medium (e.g., depth 2, not full tree)
    const maxDepth = difficulty === 'medium' ? 2 : Infinity;
    
    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const score = this.minimax(board, 0, false, aiPlayer, humanPlayer, -Infinity, Infinity, maxDepth);
      board[move] = null; // undo

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    // Fallback if no best move found (e.g., in medium if all lead to bad state within depth limit)
    if (bestMove === -1) {
        bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    return { move: bestMove, calculations: this.countTotalCalculations };
  }

  /**
   * Minimax Algorithm with Alpha-Beta Pruning.
   * 
   * Minimax builds a "game tree" of all possible future moves to see who will win.
   * It assumes both players are playing perfectly.
   * - It MAXIMIZES the AI score.
   * - It MINIMIZES the Human score.
   * 
   * Alpha-Beta Pruning is an optimization that stops evaluating a move 
   * when it finds out that giving a move to the opponent is worse than a previously examined move.
   * 
   * @param board The current state of the board
   * @param depth Current depth in the game tree
   * @param isMaximizing Is it the AI's turn to play perfectly?
   * @param aiPlayer The AI's symbol
   * @param humanPlayer The Human's symbol
   * @param alpha Best already explored option along path to root for maximizer
   * @param beta Best already explored option along path to root for minimizer
   * @param maxDepth Max depth for medium difficulty to constrain perfection
   */
  private minimax(
    board: Board, 
    depth: number, 
    isMaximizing: boolean, 
    aiPlayer: Player, 
    humanPlayer: Player, 
    alpha: number, 
    beta: number,
    maxDepth: number
  ): number {
    this.countTotalCalculations++;

    const winner = checkWinner(board);
    if (winner === aiPlayer) return 10 - depth; // Prefer winning sooner
    if (winner === humanPlayer) return -10 + depth; // Prefer losing later
    if (isDraw(board) || depth >= maxDepth) return 0; // Draw or reached depth limit represents neutral score

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of getAvailableMoves(board)) {
        board[move] = aiPlayer;
        const ev = this.minimax(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta, maxDepth);
        board[move] = null;
        maxEval = Math.max(maxEval, ev);
        alpha = Math.max(alpha, ev);
        // Alpha-Beta Pruning 
        // If the beta (what the minimizer is guaranteed so far) is less than alpha 
        // (what max has guaranteed), stop exploring.
        if (beta <= alpha) break; 
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of getAvailableMoves(board)) {
        board[move] = humanPlayer;
        const ev = this.minimax(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta, maxDepth);
        board[move] = null;
        minEval = Math.min(minEval, ev);
        beta = Math.min(beta, ev);
        // Alpha-Beta Pruning
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }
}
