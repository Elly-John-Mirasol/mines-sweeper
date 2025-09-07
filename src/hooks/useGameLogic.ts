import { useCallback } from 'react'
import { Board, DifficultyLevel, GameStatus } from '../types'
import { 
  createEmptyBoard, 
  placeMines, 
  calculateNeighborMines, 
  moveFirstClickMine, 
  floodFill, 
  revealAllMines, 
  checkWinCondition 
} from '../utils/gameUtils'
import { GAME_CONFIG } from '../constants/gameConfig'

interface UseGameLogicProps {
  difficulty: DifficultyLevel
  board: Board
  setBoard: (board: Board) => void
  isFirstClick: boolean
  setIsFirstClick: (value: boolean) => void
  gameStatus: GameStatus
  setGameStatus: (status: GameStatus) => void
  minesLeft: number
  setMinesLeft: (value: number) => void
  startTimer: () => void
  stopTimer: () => void
  updateHighScore: (time: number) => void
  time: number
}

export const useGameLogic = ({
  difficulty,
  board,
  setBoard,
  isFirstClick,
  setIsFirstClick,
  gameStatus,
  setGameStatus,
  minesLeft,
  setMinesLeft,
  startTimer,
  stopTimer,
  updateHighScore,
  time
}: UseGameLogicProps) => {

  // Initialize the game board
  const initializeBoard = useCallback((): void => {
    const { mines } = GAME_CONFIG[difficulty]
    setMinesLeft(mines)
    setIsFirstClick(true)
    
    // Create empty board
    const newBoard = createEmptyBoard(difficulty)
    
    // Place mines randomly
    placeMines(newBoard, difficulty)
    
    // Calculate neighbor mines
    calculateNeighborMines(newBoard, difficulty)
    
    setBoard(newBoard)
    setGameStatus('waiting')
  }, [difficulty, setBoard, setGameStatus, setMinesLeft, setIsFirstClick])

  // Handle win condition
  const handleWin = useCallback((boardState: Board, currentTime: number): void => {
    const { rows, cols } = GAME_CONFIG[difficulty]
    
    setGameStatus('won')
    stopTimer()
    
    // Flag all mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (boardState[r][c].isMine) {
          boardState[r][c].isFlagged = true
        }
      }
    }
    
    setMinesLeft(0)
    updateHighScore(currentTime)
  }, [difficulty, setGameStatus, stopTimer, setMinesLeft, updateHighScore])

  // Reveal a cell
  const revealCell = useCallback((row: number, col: number): void => {
    if (gameStatus === 'lost' || gameStatus === 'won') return
    
    // Start the game and timer on first click
    if (gameStatus === 'waiting') {
      setGameStatus('playing')
      startTimer()
    }
    
    // Copy the board to avoid direct mutation
    const newBoard: Board = JSON.parse(JSON.stringify(board))
    
    // If the cell is already revealed or flagged, do nothing
    if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) return
    
    // First click protection: if it's a mine on first click, move it
    if (isFirstClick && newBoard[row][col].isMine) {
      moveFirstClickMine(newBoard, row, col, difficulty)
    }
    
    setIsFirstClick(false)
    
    // Reveal the cell
    newBoard[row][col].isRevealed = true
    
    // If it's a mine, game over
    if (newBoard[row][col].isMine) {
      revealAllMines(newBoard, difficulty)
      setGameStatus('lost')
      stopTimer()
    } else {
      // If it's an empty cell (0 neighbor mines), reveal neighbors recursively
      if (newBoard[row][col].neighborMines === 0) {
        floodFill(newBoard, row, col, difficulty)
      }
      
      // Check if the game is won
      if (checkWinCondition(newBoard, difficulty)) {
        handleWin(newBoard, time)
      }
    }
    
    setBoard(newBoard)
  }, [board, gameStatus, isFirstClick, difficulty, setGameStatus, startTimer, stopTimer, setIsFirstClick, setBoard, handleWin, time])

  // Toggle flag on a cell
  const toggleFlagAt = useCallback((row: number, col: number): void => {
    if (gameStatus === 'lost' || gameStatus === 'won' || board[row][col].isRevealed) return
    
    if (gameStatus === 'waiting') {
      setGameStatus('playing')
      startTimer()
    }
    
    const newBoard: Board = JSON.parse(JSON.stringify(board))
    const cell = newBoard[row][col]
    const wasFlagged = cell.isFlagged
    
    if (!cell.isFlagged && !cell.hasQuestionMark) {
      // none -> flag
      cell.isFlagged = true
      cell.hasQuestionMark = false
    } else if (cell.isFlagged) {
      // flag -> question
      cell.isFlagged = false
      cell.hasQuestionMark = true
    } else {
      // question -> none
      cell.isFlagged = false
      cell.hasQuestionMark = false
    }
    
    // Update mines left counter based on flag changes
    if (wasFlagged && !cell.isFlagged) {
      setMinesLeft(minesLeft + 1)
    } else if (!wasFlagged && cell.isFlagged) {
      setMinesLeft(minesLeft - 1)
    }
    setBoard(newBoard)
  }, [board, gameStatus, setGameStatus, startTimer, setBoard, minesLeft, setMinesLeft])

  // Chord action (middle click or left+right click)
  const chordAction = useCallback((row: number, col: number): void => {
    if (gameStatus === 'lost' || gameStatus === 'won') return
    if (!board[row][col].isRevealed) return
    
    const { rows, cols } = GAME_CONFIG[difficulty]
    const newBoard: Board = JSON.parse(JSON.stringify(board))
    const cell = newBoard[row][col]
    
    // Count adjacent flags
    let flagCount = 0
    for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
        if (r === row && c === col) continue
        if (newBoard[r][c].isFlagged) flagCount++
      }
    }
    
    // If flagCount matches neighborMines, reveal all non-flagged adjacent cells
    if (flagCount === cell.neighborMines) {
      let hitMine = false
      
      for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
          if (r === row && c === col) continue
          
          const adjacentCell = newBoard[r][c]
          if (!adjacentCell.isRevealed && !adjacentCell.isFlagged) {
            adjacentCell.isRevealed = true
            
            // If we hit a mine, game over
            if (adjacentCell.isMine) {
              hitMine = true
            } else if (adjacentCell.neighborMines === 0) {
              // If it's an empty cell, flood fill
              floodFill(newBoard, r, c, difficulty)
            }
          }
        }
      }
      
      if (hitMine) {
        revealAllMines(newBoard, difficulty)
        setGameStatus('lost')
        stopTimer()
      } else if (checkWinCondition(newBoard, difficulty)) {
        handleWin(newBoard, time)
      }
      
      setBoard(newBoard)
    }
  }, [board, gameStatus, difficulty, setBoard, setGameStatus, stopTimer, handleWin, time])

  // Use hint: reveal a random safe cell
  const handleHint = useCallback((hintsLeft: number, setHintsLeft: (fn: (prev: number) => number) => void): void => {
    if (hintsLeft <= 0 || gameStatus === 'lost' || gameStatus === 'won') return
    
    const { rows, cols } = GAME_CONFIG[difficulty]
    const candidates: Array<{ r: number, c: number }> = []
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = board[r][c]
        if (!cell.isMine && !cell.isRevealed && !cell.isFlagged) {
          candidates.push({ r, c })
        }
      }
    }
    
    if (candidates.length === 0) return
    
    const pick = candidates[Math.floor(Math.random() * candidates.length)]
    
    if (gameStatus === 'waiting') {
      setGameStatus('playing')
      startTimer()
    }
    
    const newBoard: Board = JSON.parse(JSON.stringify(board))
    const cell = newBoard[pick.r][pick.c]
    cell.isRevealed = true
    
    if (cell.neighborMines === 0) {
      floodFill(newBoard, pick.r, pick.c, difficulty)
    }
    
    setHintsLeft(prev => Math.max(0, prev - 1))
    
    if (checkWinCondition(newBoard, difficulty)) {
      handleWin(newBoard, time)
    }
    
    setBoard(newBoard)
  }, [board, gameStatus, difficulty, setBoard, setGameStatus, startTimer, handleWin, time])

  return {
    initializeBoard,
    revealCell,
    toggleFlagAt,
    chordAction,
    handleHint
  }
}