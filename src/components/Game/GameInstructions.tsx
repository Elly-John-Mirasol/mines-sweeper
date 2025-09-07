import React from 'react'
import { GameStatus } from '../../types'

interface GameInstructionsProps {
  gameStatus: GameStatus
  darkMode: boolean
}

export const GameInstructions: React.FC<GameInstructionsProps> = ({
  gameStatus,
  darkMode
}) => {
  return (
    <div className="max-w-md text-center mx-auto">
      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
        <p className="mb-2"><strong>How to play:</strong></p>
        <p>• Left-click to reveal a cell</p>
        <p>• Right-click to flag a potential mine</p>
        <p>• Middle-click on a revealed number to chord (reveal adjacent cells)</p>
        <p>• Win by revealing all non-mine cells</p>
      </div>
      
      {gameStatus === 'won' && (
        <div className="text-green-500 font-bold animate-bounce">
          You won! 🎉
        </div>
      )}
      
      {gameStatus === 'lost' && (
        <div className="text-red-500 font-bold">
          Game over! Try again.
        </div>
      )}
    </div>
  )
}