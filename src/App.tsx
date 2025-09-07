import { useRef, useEffect, useCallback } from 'react'
import './styles/App.css'

// Hooks
import { useGameState } from './hooks/useGameState'
import { useGameLogic } from './hooks/useGameLogic'
import { useResponsiveBoard } from './hooks/useResponsiveBoard'
import { useMobileControls } from './hooks/useMobileControls'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

// Constants
import { HINTS_PER_DIFFICULTY } from './constants/gameConfig'

// Components
import { GameHeader } from './components/Game/GameHeader'
import { GameControls } from './components/Game/GameControls'
import { GameStatus } from './components/Game/GameStatus'
import { GameBoard } from './components/Game/GameBoard'
import { GameInstructions } from './components/Game/GameInstructions'

function App() {
  const boardRef = useRef<HTMLDivElement | null>(null)
  
  // Game state management
  const {
    difficulty,
    board,
    gameStatus,
    minesLeft,
    time,
    isFirstClick,
    hintsLeft,
    highScores,
    darkMode,
    setDifficulty,
    setBoard,
    setGameStatus,
    setMinesLeft,
    setTime,
    setIsFirstClick,
    setHintsLeft,
    toggleDarkMode,
    startTimer,
    stopTimer,
    updateHighScore,
    resetCurrentHighScore
  } = useGameState()

  // Game logic
  const {
    initializeBoard,
    revealCell,
    toggleFlagAt,
    chordAction,
    handleHint
  } = useGameLogic({
    difficulty,
    board,
    setBoard,
    isFirstClick,
    setIsFirstClick,
    gameStatus,
    setGameStatus,
    minesLeft,
    setMinesLeft,
    startTimer,
    stopTimer,
    updateHighScore,
    time
  })

  // Responsive board sizing
  const cellSize = useResponsiveBoard(difficulty, boardRef)

  // Mobile controls
  const { handleTouchStart, handleTouchEnd } = useMobileControls(toggleFlagAt)

  // Start a new game
  const startNewGame = useCallback((): void => {
    setTime(0)
    stopTimer()
    initializeBoard()
    setHintsLeft(HINTS_PER_DIFFICULTY[difficulty])
  }, [setTime, stopTimer, initializeBoard, setHintsLeft, difficulty])

  // Handle hint usage
  const handleUseHint = (): void => {
    handleHint(hintsLeft, setHintsLeft)
  }

  // Toggle flag on right-click
  const handleRightClick = (e: React.MouseEvent, row: number, col: number): void => {
    e.preventDefault() // Prevent context menu from opening
    toggleFlagAt(row, col)
  }

  // Handle mouse down for chord (left + right click)
  const handleMouseDown = (e: React.MouseEvent, row: number, col: number): void => {
    // Left + right click (simulates middle click)
    if (e.buttons === 3) {
      chordAction(row, col)
    }
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onRestart: startNewGame,
    onHint: handleUseHint,
    onDifficultyChange: setDifficulty,
    onToggleDarkMode: toggleDarkMode
  })

  // Initialize the game on mount and when difficulty changes
  useEffect(() => {
    setTime(0)
    stopTimer()
    initializeBoard()
    setHintsLeft(HINTS_PER_DIFFICULTY[difficulty])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty])

  return (
    <div className="game-container">
      <div className="w-full max-w-md mx-auto mb-6 flex flex-col items-center">
        <GameHeader
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        
        <GameControls
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onNewGame={startNewGame}
          onUseHint={handleUseHint}
          hintsLeft={hintsLeft}
          gameStatus={gameStatus}
        />
        
        <GameStatus
          minesLeft={minesLeft}
          time={time}
          gameStatus={gameStatus}
          isFirstClick={isFirstClick}
          onNewGame={startNewGame}
          darkMode={darkMode}
          highScores={highScores}
          difficulty={difficulty}
          onResetHighScore={resetCurrentHighScore}
        />
      </div>
      
      <GameBoard
        board={board}
        cellSize={cellSize}
        darkMode={darkMode}
        gameStatus={gameStatus}
        onCellClick={revealCell}
        onCellRightClick={handleRightClick}
        onCellMiddleClick={chordAction}
        onCellMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        boardRef={boardRef}
      />
      
      <GameInstructions
        gameStatus={gameStatus}
        darkMode={darkMode}
      />
    </div>
  )
}

export default App