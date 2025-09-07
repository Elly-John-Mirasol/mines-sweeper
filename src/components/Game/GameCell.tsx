import React from 'react'
import { Cell } from '../../types'

interface GameCellProps {
  cell: Cell
  cellSize: number
  darkMode: boolean
  gameStatus: string
  onCellClick: () => void
  onCellRightClick: (e: React.MouseEvent) => void
  onCellMiddleClick: () => void
  onCellMouseDown: (e: React.MouseEvent) => void
  onTouchStart: () => void
  onTouchEnd: () => void
  ariaLabel: string
}

export const GameCell: React.FC<GameCellProps> = ({
  cell,
  cellSize,
  darkMode,
  gameStatus,
  onCellClick,
  onCellRightClick,
  onCellMiddleClick,
  onCellMouseDown,
  onTouchStart,
  onTouchEnd,
  ariaLabel
}) => {
  // Get cell class based on its state
  const getCellClass = (): string => {
    let baseClass = "cell-btn w-12 h-12 flex items-center justify-center border-2 transition-all duration-200 text-xl font-bold min-w-[3rem] min-h-[3rem] "
    
    if (!cell.isRevealed) {
      baseClass += darkMode 
        ? "bg-gray-700 border-t-gray-600 border-l-gray-600 border-r-gray-900 border-b-gray-900 hover:bg-gray-600 active:border-t-gray-900 active:border-l-gray-900 active:border-r-gray-600 active:border-b-gray-600 "
        : "bg-gray-300 border-t-gray-100 border-l-gray-100 border-r-gray-600 border-b-gray-600 hover:bg-gray-200 active:border-t-gray-600 active:border-l-gray-600 active:border-r-gray-100 active:border-b-gray-100 "
      
      if (cell.isFlagged) {
        baseClass += "text-red-600 font-bold animate-pop"
      } else if (cell.hasQuestionMark) {
        baseClass += "text-yellow-500 italic"
      }
    } else {
      baseClass += darkMode
        ? "bg-gray-600 border-gray-500 "
        : "bg-gray-200 border-gray-400 "
      
      if (cell.isMine) {
        baseClass += "bg-red-500 animate-shake"
      } else {
        baseClass += "animate-flip"
      }
      
      // Different colors for different numbers
      if (cell.neighborMines === 1) baseClass += "text-blue-400 "
      else if (cell.neighborMines === 2) baseClass += "text-green-400 "
      else if (cell.neighborMines === 3) baseClass += "text-red-400 "
      else if (cell.neighborMines === 4) baseClass += "text-purple-400 "
      else if (cell.neighborMines === 5) baseClass += "text-rose-400 "
      else if (cell.neighborMines === 6) baseClass += "text-teal-400 "
      else if (cell.neighborMines === 7) baseClass += "text-white "
      else if (cell.neighborMines === 8) baseClass += "text-gray-300 "
    }
    
    return baseClass
  }

  // Render cell content based on its state
  const getCellContent = (): React.ReactNode => {
    if (!cell.isRevealed) {
      if (cell.isFlagged) return <span>🚩</span>
      if (cell.hasQuestionMark) return <span>❓</span>
      return ''
    }
    if (cell.isMine) return <span>💣</span>
    return cell.neighborMines === 0 ? '' : cell.neighborMines
  }

  return (
    <button
      type="button"
      className={getCellClass()}
      style={{
        width: cellSize,
        height: cellSize,
        minWidth: cellSize,
        minHeight: cellSize,
        fontSize: Math.max(12, Math.floor(cellSize * 0.55))
      }}
      onClick={onCellClick}
      onContextMenu={onCellRightClick}
      onAuxClick={onCellMiddleClick} // Middle click
      onMouseDown={onCellMouseDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      disabled={gameStatus === 'lost' || gameStatus === 'won'}
      aria-label={ariaLabel}
    >
      {getCellContent()}
    </button>
  )
}