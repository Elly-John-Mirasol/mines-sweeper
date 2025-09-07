import { DifficultyLevel, HighScores } from '../types'
import { STORAGE_KEYS, DEFAULT_HIGH_SCORE } from '../constants/gameConfig'

/**
 * Get saved difficulty from localStorage
 */
export const getSavedDifficulty = (): DifficultyLevel => {
  const saved = localStorage.getItem(STORAGE_KEYS.DIFFICULTY) as DifficultyLevel | null
  return saved === 'beginner' || saved === 'intermediate' || saved === 'expert' ? saved : 'beginner'
}

/**
 * Save difficulty to localStorage
 */
export const saveDifficulty = (difficulty: DifficultyLevel): void => {
  localStorage.setItem(STORAGE_KEYS.DIFFICULTY, difficulty)
}

/**
 * Get saved dark mode setting from localStorage
 */
export const getSavedDarkMode = (): boolean => {
  const savedMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE)
  return savedMode ? JSON.parse(savedMode) : false
}

/**
 * Save dark mode setting to localStorage
 */
export const saveDarkMode = (darkMode: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode))
}

/**
 * Get all high scores from localStorage
 */
export const getHighScores = (): HighScores => {
  return {
    beginner: parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE_BEGINNER) || DEFAULT_HIGH_SCORE.toString()),
    intermediate: parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE_INTERMEDIATE) || DEFAULT_HIGH_SCORE.toString()),
    expert: parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE_EXPERT) || DEFAULT_HIGH_SCORE.toString())
  }
}

/**
 * Save high score for a specific difficulty
 */
export const saveHighScore = (difficulty: DifficultyLevel, score: number): void => {
  const key = difficulty === 'beginner' ? STORAGE_KEYS.HIGH_SCORE_BEGINNER :
              difficulty === 'intermediate' ? STORAGE_KEYS.HIGH_SCORE_INTERMEDIATE :
              STORAGE_KEYS.HIGH_SCORE_EXPERT
  localStorage.setItem(key, score.toString())
}

/**
 * Reset high score for a specific difficulty
 */
export const resetHighScore = (difficulty: DifficultyLevel): void => {
  saveHighScore(difficulty, DEFAULT_HIGH_SCORE)
}