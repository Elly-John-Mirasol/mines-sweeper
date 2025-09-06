// Cell represents a single cell in the Minesweeper grid
export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  // Optional question mark state (cycle: none -> flag -> question -> none)
  hasQuestionMark?: boolean;
}

// Board is a 2D array of Cells
export type Board = Cell[][];

// Game difficulty configurations
export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

// Game difficulty levels
export type DifficultyLevel = 'beginner' | 'intermediate' | 'expert';

// Game status
export type GameStatus = 'waiting' | 'playing' | 'won' | 'lost';

// High scores for each difficulty level
export interface HighScores {
  beginner: number;
  intermediate: number;
  expert: number;
} 
