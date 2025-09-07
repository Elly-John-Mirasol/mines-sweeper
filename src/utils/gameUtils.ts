import { Board, DifficultyLevel } from '../types'
import { GAME_CONFIG } from '../constants/gameConfig'

/**
 * Calculate neighbor mines for all cells in the board
 */
export const calculateNeighborMines = (boardState: Board, difficulty: DifficultyLevel): void => {
  const { rows, cols } = GAME_CONFIG[difficulty]
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (boardState[row][col].isMine) continue
      
      let count = 0
      // Check all 8 neighbors
      for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
          if (r === row && c === col) continue
          if (boardState[r][c].isMine) count++
        }
      }
      
      boardState[row][col].neighborMines = count
    }
  }
}

/**
 * Create an empty game board
 */
export const createEmptyBoard = (difficulty: DifficultyLevel): Board => {
  const { rows, cols } = GAME_CONFIG[difficulty]
  
  return Array(rows).fill(null).map(() => 
    Array(cols).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
      hasQuestionMark: false,
    }))
  )
}

/**
 * Place mines randomly on the board
 */
export const placeMines = (board: Board, difficulty: DifficultyLevel): void => {
  const { rows, cols, mines } = GAME_CONFIG[difficulty]
  
  let minesPlaced = 0
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)
    
    if (!board[row][col].isMine) {
      board[row][col].isMine = true
      minesPlaced++
    }
  }
}

/**
 * Move a mine from the first clicked cell to another location
 */
export const moveFirstClickMine = (boardState: Board, row: number, col: number, difficulty: DifficultyLevel): void => {
  const { rows, cols } = GAME_CONFIG[difficulty]
  
  // Remove the mine from the clicked cell
  boardState[row][col].isMine = false
  
  // Find a new spot for the mine
  let minePlaced = false
  while (!minePlaced) {
    const newRow = Math.floor(Math.random() * rows)
    const newCol = Math.floor(Math.random() * cols)
    
    // Make sure we don't place it on the clicked cell or another mine
    if ((newRow !== row || newCol !== col) && !boardState[newRow][newCol].isMine) {
      boardState[newRow][newCol].isMine = true
      minePlaced = true
    }
  }
  
  // Recalculate neighbor mines
  calculateNeighborMines(boardState, difficulty)
}

/**
 * Flood fill algorithm to reveal empty cells
 */
export const floodFill = (boardState: Board, row: number, col: number, difficulty: DifficultyLevel): void => {
  const { rows, cols } = GAME_CONFIG[difficulty]
  const queue: Array<{row: number, col: number}> = [{row, col}]
  
  while (queue.length > 0) {
    const {row: r, col: c} = queue.shift()!
    
    // Check all 8 neighbors
    for (let nr = Math.max(0, r - 1); nr <= Math.min(rows - 1, r + 1); nr++) {
      for (let nc = Math.max(0, c - 1); nc <= Math.min(cols - 1, c + 1); nc++) {
        // Skip the cell itself
        if (nr === r && nc === c) continue
        
        const cell = boardState[nr][nc]
        // Skip revealed or flagged cells
        if (cell.isRevealed || cell.isFlagged) continue
        
        // Reveal this cell
        cell.isRevealed = true
        
        // If this is also an empty cell, add it to the queue
        if (cell.neighborMines === 0) {
          queue.push({row: nr, col: nc})
        }
      }
    }
  }
}

/**
 * Reveal all mines when game is lost
 */
export const revealAllMines = (boardState: Board, difficulty: DifficultyLevel): void => {
  const { rows, cols } = GAME_CONFIG[difficulty]
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (boardState[r][c].isMine) {
        boardState[r][c].isRevealed = true
      }
    }
  }
}

/**
 * Check if the game is won
 */
export const checkWinCondition = (boardState: Board, difficulty: DifficultyLevel): boolean => {
  const { rows, cols, mines } = GAME_CONFIG[difficulty]
  let revealedCount = 0
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (boardState[r][c].isRevealed && !boardState[r][c].isMine) {
        revealedCount++
      }
    }
  }
  
  // If all non-mine cells are revealed, the game is won
  return revealedCount === rows * cols - mines
}

/**
 * Format time display (e.g., 0:01, 0:23, 16:39 for 999)
 */
export const formatTime = (time: number): string => {
  if (time >= 999) {
    return '--:--'
  }
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Calculate responsive cell size
 */
export const calculateCellSize = (
  containerWidth: number, 
  cols: number, 
  minSize: number, 
  borderWidth: number
): number => {
  const maxSize = Number.POSITIVE_INFINITY
  const padding = 0
  const computed = ((containerWidth - padding - (cols * borderWidth * 2)) / cols)
  return Math.max(minSize, Math.min(maxSize, computed))
}