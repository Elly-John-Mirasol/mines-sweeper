import React from 'react'
import { Board } from '../../types'
import { GameCell } from './GameCell'

interface GameBoardProps {
  board: Board
  cellSize: number
  darkMode: boolean
  gameStatus: string
  onCellClick: (row: number, col: number) => void
  onCellRightClick: (e: React.MouseEvent, row: number, col: number) => void
  onCellMiddleClick: (row: number, col: number) => void
  onCellMouseDown: (e: React.MouseEvent, row: number, col: number) => void
  onTouchStart: (row: number, col: number) => void
  onTouchEnd: () => void
  boardRef: React.RefObject<HTMLDivElement | null>
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  cellSize,
  darkMode,
  gameStatus,
  onCellClick,
  onCellRightClick,
  onCellMiddleClick,
  onCellMouseDown,
  onTouchStart,
  onTouchEnd,
  boardRef
}) => {
  // Don't render if board is empty
  if (!board || board.length === 0) {
    return (
      <div className="w-full flex justify-center items-center mb-6">
        <div 
          ref={boardRef} 
          className={`game-board ${darkMode ? 'bg-gray-800' : 'bg-gray-400'}`}
        >
          <div className="p-8 text-center">Loading game...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center items-center mb-6">
      <div 
        ref={boardRef} 
        className={`game-board ${darkMode ? 'bg-gray-800' : 'bg-gray-400'} ${gameStatus === 'lost' ? 'shake' : ''}`}
      >
        {board.map((row, rowIndex) => {
          if (!row || row.length === 0) return null
          return (
            <div key={rowIndex} className="flex" style={{ gap: 0 }}>
              {row.map((cell, colIndex) => {
                if (!cell) return null
                return (
              <GameCell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                cellSize={cellSize}
                darkMode={darkMode}
                gameStatus={gameStatus}
                onCellClick={() => onCellClick(rowIndex, colIndex)}
                onCellRightClick={(e) => onCellRightClick(e, rowIndex, colIndex)}
                onCellMiddleClick={() => onCellMiddleClick(rowIndex, colIndex)}
                onCellMouseDown={(e) => onCellMouseDown(e, rowIndex, colIndex)}
                onTouchStart={() => onTouchStart(rowIndex, colIndex)}
                onTouchEnd={onTouchEnd}
                ariaLabel={`Cell at row ${rowIndex + 1}, column ${colIndex + 1}`}
              />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}