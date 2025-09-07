import { GameConfig, DifficultyLevel } from '../types'

export const GAME_CONFIG: Record<DifficultyLevel, GameConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
}

export const HINTS_PER_DIFFICULTY: Record<DifficultyLevel, number> = {
  beginner: 3,
  intermediate: 2,
  expert: 1
}

export const DEFAULT_CELL_SIZE = 40
export const MIN_CELL_SIZE = 22
export const CELL_BORDER_WIDTH = 2
export const LONG_PRESS_DURATION = 450

export const STORAGE_KEYS = {
  DIFFICULTY: 'minesweeper_difficulty',
  DARK_MODE: 'minesweeper_darkMode',
  HIGH_SCORE_BEGINNER: 'highScore_beginner',
  HIGH_SCORE_INTERMEDIATE: 'highScore_intermediate',
  HIGH_SCORE_EXPERT: 'highScore_expert'
} as const

export const DEFAULT_HIGH_SCORE = 999