import React from 'react'
import { DifficultyLevel, GameStatus as GameStatusType, HighScores } from '../../types'
import { formatTime } from '../../utils/gameUtils'
import { Button } from '../ui/Button'

interface GameStatusProps {
  minesLeft: number
  time: number
  gameStatus: GameStatusType
  isFirstClick: boolean
  onNewGame: () => void
  darkMode: boolean
  highScores: HighScores
  difficulty: DifficultyLevel
  onResetHighScore: () => void
}

export const GameStatus: React.FC<GameStatusProps> = ({
  minesLeft,
  time,
  gameStatus,
  isFirstClick,
  onNewGame,
  darkMode,
  highScores,
  difficulty,
  onResetHighScore
}) => {
  // Get emoji for game status
  const getStatusFace = (): string => {
    if (gameStatus === 'won') return '😎'
    if (gameStatus === 'lost') return '😵'
    return isFirstClick ? '🙂' : '😐'
  }

  return (
    <>
      {/* High scores */}
      <div className="mb-4 text-sm font-medium flex items-center gap-3">
        <span>Best time: <span className="font-mono">{formatTime(highScores[difficulty])}</span></span>
        <Button
          variant="secondary"
          size="sm"
          onClick={onResetHighScore}
          title="Reset best time for this difficulty"
        >
          Reset Best
        </Button>
      </div>
      
      {/* Game status */}
      <div className={`flex justify-between w-full mb-4 px-4 py-3 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-gray-700 text-white'}`}>
        <div className="tooltip">
          <div className="bg-black px-3 py-1 rounded font-mono">
            {minesLeft}
          </div>
          <span className="tooltip-text">Mines remaining</span>
        </div>
        
        <button 
          type="button"
          onClick={onNewGame}
          className="text-2xl hover:scale-110 transition-transform mx-2"
          aria-label="Start new game"
        >
          {getStatusFace()}
        </button>
        
        <div className="tooltip">
          <div className="bg-black px-3 py-1 rounded font-mono">
            {formatTime(time)}
          </div>
          <span className="tooltip-text">Time elapsed</span>
        </div>
      </div>
    </>
  )
}