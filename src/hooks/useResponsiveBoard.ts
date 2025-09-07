import { useState, useEffect, RefObject } from 'react'
import { DifficultyLevel } from '../types'
import { GAME_CONFIG, DEFAULT_CELL_SIZE, MIN_CELL_SIZE, CELL_BORDER_WIDTH } from '../constants/gameConfig'
import { calculateCellSize } from '../utils/gameUtils'

export const useResponsiveBoard = (difficulty: DifficultyLevel, boardRef: RefObject<HTMLDivElement | null>) => {
  const [cellSize, setCellSize] = useState<number>(DEFAULT_CELL_SIZE)

  // Compute responsive cell size based on wrapper width and columns
  useEffect(() => {
    const recalc = () => {
      const cols = GAME_CONFIG[difficulty].cols
      const container = boardRef.current?.parentElement // outer flex center container
      const available = container ? container.clientWidth : window.innerWidth
      
      const computed = calculateCellSize(available, cols, MIN_CELL_SIZE, CELL_BORDER_WIDTH)
      setCellSize(computed)
    }
    
    recalc()
    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [difficulty, boardRef])

  return cellSize
}