# AI Game Agent using Minimax Algorithm

This is a complete full-stack project built for a college AI curriculum featuring a Tic-Tac-Toe game where a human plays against an AI agent. The AI utilizes the **Minimax Algorithm** paired with **Alpha-Beta Pruning** to guarantee perfect play on its "Hard" difficulty level.

## Architecture

- **Frontend**: Next.js (React)
  - Designed using modern "Apple-style" aesthetics (San Francisco system font, glassmorphism, soft drop shadows), using vanilla CSS.
  - Keeps track of game board, turns, win statistics, and user configurable difficulty settings.
- **Backend**: NestJS (Node.js)
  - Exposes an API endpoint (`/api/game/move`).
  - Processes the board state and runs the Minimax recursion to find the absolute best move.

## Setup Instructions

### 1. Backend (NestJS)

1. Open a terminal.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend development server:
   ```bash
   npm run start:dev
   ```
   > The backend starts on `http://localhost:3001` with CORS enabled to allow the frontend to communicate with it.

### 2. Frontend (Next.js)

1. Open a new terminal.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   > Next.js will typically run on `http://localhost:3000`. Navigate to this URL in your browser to play the game!

---

## AI Concepts Explanation

### Minimax Algorithm

The Minimax algorithm is a decision rule used in artificial intelligence, decision theory, game theory, and statistics for minimizing the possible loss for a worst-case scenario. When dealing with gains, it is referred to as "maximin"—to maximize the minimum gain.

In our Tic-Tac-Toe agent, the algorithm simulates playing out **all possible future moves** until a terminal state is reached (a win, loss, or draw). 
- It assigns a positive score `+10` if the AI wins.
- It assigns a negative score `-10` if the human wins.
- It assigns a neutral score `0` if it's a draw.

Because Tic-Tac-Toe is a "zero-sum, perfect information game", the AI assumes that:
1. It will always make the move that **MAXIMIZES** its score (The Maximizer).
2. The human player will always make the move that **MINIMIZES** the AI's score (The Minimizer).

By navigating up from the terminal branches to the current board state, the AI can select the exact path that guarantees you cannot win against it. To optimize time, the score is multiplied/subtracted by the tree `depth` to prefer quicker wins and slower losses!

### Alpha-Beta Pruning

While Minimax works flawlessly for Tic-Tac-Toe (since a 3x3 board only has at most 362,880 terminal states), for more complex games like Chess or Go, traversing the entire game tree is computationally impossible.

**Alpha-Beta pruning** is an optimization technique for the minimax algorithm. It reduces the number of nodes evaluated in the search tree.

It does this by keeping track of two values:
- **Alpha**: The best (highest) score that the Maximizer (AI) is guaranteed to get along the current path.
- **Beta**: The best (lowest) score that the Minimizer (Human) is guaranteed to get along the current path.

If at any point the AI discovers a branch that leads to a situation worse than a previously evaluated branch (i.e., `Beta <= Alpha`), it immediately stops exploring that branch ("prunes" it). Why? Because the opponent will never let the AI reach that branch—they'd have already chosen the better alternative available to them earlier.

Pruning drastically reduces the "calculations" counter you see in the game UI when the AI makes its decision, making the engine vastly more efficient.
