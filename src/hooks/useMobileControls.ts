import { useRef } from 'react'
import { LONG_PRESS_DURATION } from '../constants/gameConfig'

export const useMobileControls = (onLongPress: (row: number, col: number) => void) => {
  const longPressTimer = useRef<number | null>(null)

  const handleTouchStart = (row: number, col: number) => {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current)
    longPressTimer.current = window.setTimeout(() => {
      onLongPress(row, col)
    }, LONG_PRESS_DURATION)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  return {
    handleTouchStart,
    handleTouchEnd
  }
}