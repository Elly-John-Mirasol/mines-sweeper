import React from 'react'
import { Button } from '../ui/Button'

interface GameHeaderProps {
  darkMode: boolean
  onToggleDarkMode: () => void
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  darkMode,
  onToggleDarkMode
}) => {
  return (
    <div className="flex justify-between items-center w-full mb-6 mt-2">
      <h1 className="text-4xl font-bold text-center">Minesweeper</h1>
      <Button 
        onClick={onToggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-4"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? '☀️' : '🌙'}
      </Button>
    </div>
  )
}