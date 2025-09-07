import { useEffect } from 'react'
import { DifficultyLevel } from '../types'

interface UseKeyboardShortcutsProps {
  onRestart: () => void
  onHint: () => void
  onDifficultyChange: (difficulty: DifficultyLevel) => void
  onToggleDarkMode: () => void
}

export const useKeyboardShortcuts = ({
  onRestart,
  onHint,
  onDifficultyChange,
  onToggleDarkMode
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return
      
      const key = e.key.toLowerCase()
      
      switch (key) {
        case 'r':
          onRestart()
          break
        case 'h':
          onHint()
          break
        case '1':
          onDifficultyChange('beginner')
          break
        case '2':
          onDifficultyChange('intermediate')
          break
        case '3':
          onDifficultyChange('expert')
          break
        case 'd':
          onToggleDarkMode()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onRestart, onHint, onDifficultyChange, onToggleDarkMode])
}