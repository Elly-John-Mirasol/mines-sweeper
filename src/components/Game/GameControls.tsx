import React from 'react'
import { DifficultyLevel } from '../../types'
import { Button } from '../ui/Button'

interface GameControlsProps {
  difficulty: DifficultyLevel
  onDifficultyChange: (difficulty: DifficultyLevel) => void
  onNewGame: () => void
  onUseHint: () => void
  hintsLeft: number
  gameStatus: string
}

export const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  onDifficultyChange,
  onNewGame,
  onUseHint,
  hintsLeft,
  gameStatus
}) => {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 w-full">
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        <Button 
          onClick={() => onDifficultyChange('beginner')}
          variant={difficulty === 'beginner' ? 'primary' : 'secondary'}
        >
          Beginner
        </Button>
        <Button 
          onClick={() => onDifficultyChange('intermediate')}
          variant={difficulty === 'intermediate' ? 'primary' : 'secondary'}
        >
          Intermediate
        </Button>
        <Button 
          onClick={() => onDifficultyChange('expert')}
          variant={difficulty === 'expert' ? 'primary' : 'secondary'}
        >
          Expert
        </Button>
      </div>
      
      <div className="flex flex-wrap items-center gap-2" style={{ marginLeft: 'auto' }}>
        <Button 
          onClick={onUseHint}
          disabled={hintsLeft <= 0 || gameStatus === 'lost' || gameStatus === 'won'}
          variant="secondary"
          title="Reveal a safe cell (H)"
        >
          Hint ({hintsLeft})
        </Button>
        <Button 
          onClick={onNewGame}
          variant="success"
          title="Start a new game (R)"
        >
          New Game
        </Button>
      </div>
    </div>
  )
}