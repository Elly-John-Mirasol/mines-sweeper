import { useState, useEffect, useCallback } from 'react'
import { Board, DifficultyLevel, GameStatus, HighScores } from '../types'
import { getSavedDifficulty, getSavedDarkMode, getHighScores, saveDifficulty, saveDarkMode, saveHighScore, resetHighScore } from '../utils/storage'
import { HINTS_PER_DIFFICULTY } from '../constants/gameConfig'

export const useGameState = () => {
  const [difficulty, setDifficultyState] = useState<DifficultyLevel>(getSavedDifficulty)
  const [board, setBoard] = useState<Board>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting')
  const [minesLeft, setMinesLeft] = useState<number>(0)
  const [time, setTime] = useState<number>(0)
  const [timerInterval, setTimerInterval] = useState<number | null>(null)
  const [isFirstClick, setIsFirstClick] = useState<boolean>(true)
  const [hintsLeft, setHintsLeft] = useState<number>(HINTS_PER_DIFFICULTY.beginner)
  const [highScores, setHighScores] = useState<HighScores>(getHighScores)
  const [darkMode, setDarkModeState] = useState<boolean>(getSavedDarkMode)

  // Persist difficulty selection
  const setDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setDifficultyState(newDifficulty)
    saveDifficulty(newDifficulty)
    setHintsLeft(HINTS_PER_DIFFICULTY[newDifficulty])
  }, [])

  // Toggle dark mode
  const toggleDarkMode = useCallback((): void => {
    const newMode = !darkMode
    setDarkModeState(newMode)
    saveDarkMode(newMode)
  }, [darkMode])

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Start the timer
  const startTimer = useCallback((): void => {
    if (timerInterval) return
    
    const interval = window.setInterval(() => {
      setTime(prevTime => prevTime + 1)
    }, 1000)
    
    setTimerInterval(interval)
  }, [timerInterval])

  // Stop the timer
  const stopTimer = useCallback((): void => {
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
  }, [timerInterval])

  // Update high score if new best time
  const updateHighScore = useCallback((newTime: number): void => {
    if (newTime < highScores[difficulty]) {
      const newHighScores = { ...highScores, [difficulty]: newTime }
      setHighScores(newHighScores)
      saveHighScore(difficulty, newTime)
    }
  }, [difficulty, highScores])

  // Reset high score for current difficulty
  const resetCurrentHighScore = useCallback((): void => {
    const newHighScores = { ...highScores, [difficulty]: 999 }
    setHighScores(newHighScores)
    resetHighScore(difficulty)
  }, [difficulty, highScores])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [timerInterval])

  return {
    // State
    difficulty,
    board,
    gameStatus,
    minesLeft,
    time,
    isFirstClick,
    hintsLeft,
    highScores,
    darkMode,

    // Setters
    setDifficulty,
    setBoard,
    setGameStatus,
    setMinesLeft,
    setTime,
    setIsFirstClick,
    setHintsLeft,

    // Actions
    toggleDarkMode,
    startTimer,
    stopTimer,
    updateHighScore,
    resetCurrentHighScore
  }
}