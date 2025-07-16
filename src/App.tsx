import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { Board, Cell, DifficultyLevel, GameConfig, GameStatus, HighScores } from './types'

function App() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner')
  const [board, setBoard] = useState<Board>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting')
  const [minesLeft, setMinesLeft] = useState<number>(0)
  const [time, setTime] = useState<number>(0)
  const [timerInterval, setTimerInterval] = useState<number | null>(null)
  const [isFirstClick, setIsFirstClick] = useState<boolean>(true)
  const [highScores, setHighScores] = useState<HighScores>({
    beginner: parseInt(localStorage.getItem('highScore_beginner') || '999'),
    intermediate: parseInt(localStorage.getItem('highScore_intermediate') || '999'),
    expert: parseInt(localStorage.getItem('highScore_expert') || '999')
  })
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('minesweeper_darkMode')
    return savedMode ? JSON.parse(savedMode) : false
  })

  // Toggle dark mode
  const toggleDarkMode = (): void => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('minesweeper_darkMode', JSON.stringify(newMode))
  }

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Game configurations
  const gameConfig: Record<DifficultyLevel, GameConfig> = {
    beginner: { rows: 9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 }
  }

  // Initialize the game board
  const initializeBoard = useCallback((): void => {
    const { rows, cols, mines } = gameConfig[difficulty]
    setMinesLeft(mines)
    setTime(0)
    setIsFirstClick(true)
    
    // Create empty board
    const newBoard: Board = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    )
    
    // Place mines randomly
    let minesPlaced = 0
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * cols)
      
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true
        minesPlaced++
      }
    }
    
    // Calculate neighbor mines
    calculateNeighborMines(newBoard)
    
    setBoard(newBoard)
    setGameStatus('waiting')
  }, [difficulty])

  // Calculate neighbor mines for all cells
  const calculateNeighborMines = (boardState: Board): void => {
    const { rows, cols } = gameConfig[difficulty]
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (boardState[row][col].isMine) continue
        
        let count = 0
        // Check all 8 neighbors
        for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
            if (r === row && c === col) continue
            if (boardState[r][c].isMine) count++
          }
        }
        
        boardState[row][col].neighborMines = count
      }
    }
  }

  // Start a new game
  const startNewGame = (): void => {
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
    
    initializeBoard()
  }

  // Start the timer
  const startTimer = (): void => {
    if (timerInterval) return
    
    const interval = window.setInterval(() => {
      setTime(prevTime => prevTime + 1)
    }, 1000)
    
    setTimerInterval(interval)
  }

  // Reveal a cell
  const revealCell = (row: number, col: number): void => {
    if (gameStatus === 'lost' || gameStatus === 'won') return
    
    // Start the game and timer on first click
    if (gameStatus === 'waiting') {
      setGameStatus('playing')
      startTimer()
    }
    
    // Copy the board to avoid direct mutation
    const newBoard: Board = JSON.parse(JSON.stringify(board))
    
    // If the cell is already revealed or flagged, do nothing
    if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) return
    
    // First click protection: if it's a mine on first click, move it
    if (isFirstClick && newBoard[row][col].isMine) {
      moveFirstClickMine(newBoard, row, col)
    }
    
    setIsFirstClick(false)
    
    // Reveal the cell
    newBoard[row][col].isRevealed = true
    
    // If it's a mine, game over
    if (newBoard[row][col].isMine) {
      revealAllMines(newBoard)
      setGameStatus('lost')
      if (timerInterval) {
        clearInterval(timerInterval)
        setTimerInterval(null)
      }
    } else {
      // If it's an empty cell (0 neighbor mines), reveal neighbors recursively
      if (newBoard[row][col].neighborMines === 0) {
        floodFill(newBoard, row, col)
      }
      
      // Check if the game is won
      checkWinCondition(newBoard)
    }
    
    setBoard(newBoard)
  }

  // Move a mine from the first clicked cell to another location
  const moveFirstClickMine = (boardState: Board, row: number, col: number): void => {
    const { rows, cols } = gameConfig[difficulty]
    
    // Remove the mine from the clicked cell
    boardState[row][col].isMine = false
    
    // Find a new spot for the mine
    let minePlaced = false
    while (!minePlaced) {
      const newRow = Math.floor(Math.random() * rows)
      const newCol = Math.floor(Math.random() * cols)
      
      // Make sure we don't place it on the clicked cell or another mine
      if ((newRow !== row || newCol !== col) && !boardState[newRow][newCol].isMine) {
        boardState[newRow][newCol].isMine = true
        minePlaced = true
      }
    }
    
    // Recalculate neighbor mines
    calculateNeighborMines(boardState)
  }

  // Flood fill algorithm to reveal empty cells
  const floodFill = (boardState: Board, row: number, col: number): void => {
    const { rows, cols } = gameConfig[difficulty]
    const queue: Array<{row: number, col: number}> = [{row, col}]
    
    while (queue.length > 0) {
      const {row: r, col: c} = queue.shift()!
      
      // Check all 8 neighbors
      for (let nr = Math.max(0, r - 1); nr <= Math.min(rows - 1, r + 1); nr++) {
        for (let nc = Math.max(0, c - 1); nc <= Math.min(cols - 1, c + 1); nc++) {
          // Skip the cell itself
          if (nr === r && nc === c) continue
          
          const cell = boardState[nr][nc]
          // Skip revealed or flagged cells
          if (cell.isRevealed || cell.isFlagged) continue
          
          // Reveal this cell
          cell.isRevealed = true
          
          // If this is also an empty cell, add it to the queue
          if (cell.neighborMines === 0) {
            queue.push({row: nr, col: nc})
          }
        }
      }
    }
  }

  // Chord action (middle click or left+right click)
  const chordAction = (row: number, col: number): void => {
    if (gameStatus === 'lost' || gameStatus === 'won') return
    if (!board[row][col].isRevealed) return
    
    const { rows, cols } = gameConfig[difficulty]
    const newBoard: Board = JSON.parse(JSON.stringify(board))
    const cell = newBoard[row][col]
    
    // Count adjacent flags
    let flagCount = 0
    for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
        if (r === row && c === col) continue
        if (newBoard[r][c].isFlagged) flagCount++
      }
    }
    
    // If flagCount matches neighborMines, reveal all non-flagged adjacent cells
    if (flagCount === cell.neighborMines) {
      let hitMine = false
      
      for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
          if (r === row && c === col) continue
          
          const adjacentCell = newBoard[r][c]
          if (!adjacentCell.isRevealed && !adjacentCell.isFlagged) {
            adjacentCell.isRevealed = true
            
            // If we hit a mine, game over
            if (adjacentCell.isMine) {
              hitMine = true
            } else if (adjacentCell.neighborMines === 0) {
              // If it's an empty cell, flood fill
              floodFill(newBoard, r, c)
            }
          }
        }
      }
      
      if (hitMine) {
        revealAllMines(newBoard)
        setGameStatus('lost')
        if (timerInterval) {
          clearInterval(timerInterval)
          setTimerInterval(null)
        }
      } else {
        checkWinCondition(newBoard)
      }
      
      setBoard(newBoard)
    }
  }

  // Toggle flag on a cell
  const toggleFlag = (e: React.MouseEvent, row: number, col: number): void => {
    e.preventDefault() // Prevent context menu from opening
    
    if (gameStatus === 'lost' || gameStatus === 'won' || board[row][col].isRevealed) return
    
    // Start the game and timer on first click
    if (gameStatus === 'waiting') {
      setGameStatus('playing')
      startTimer()
    }
    
    // Copy the board to avoid direct mutation
    const newBoard: Board = JSON.parse(JSON.stringify(board))
    
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
    
    // Update mines left count
    setMinesLeft(prevMinesLeft => 
      newBoard[row][col].isFlagged ? prevMinesLeft - 1 : prevMinesLeft + 1
    )
    
    setBoard(newBoard)
  }

  // Reveal all mines when game is lost
  const revealAllMines = (boardState: Board): void => {
    const { rows, cols } = gameConfig[difficulty]
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (boardState[r][c].isMine) {
          boardState[r][c].isRevealed = true
        }
      }
    }
  }

  // Check if the game is won
  const checkWinCondition = (boardState: Board): void => {
    const { rows, cols, mines } = gameConfig[difficulty]
    let revealedCount = 0
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (boardState[r][c].isRevealed && !boardState[r][c].isMine) {
          revealedCount++
        }
      }
    }
    
    // If all non-mine cells are revealed, the game is won
    if (revealedCount === rows * cols - mines) {
      setGameStatus('won')
      if (timerInterval) {
        clearInterval(timerInterval)
        setTimerInterval(null)
      }
      
      // Flag all mines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (boardState[r][c].isMine) {
            boardState[r][c].isFlagged = true
          }
        }
      }
      
      setMinesLeft(0)
      
      // Check if this is a new high score
      if (time < highScores[difficulty]) {
        const newHighScores = { ...highScores, [difficulty]: time }
        setHighScores(newHighScores)
        localStorage.setItem(`highScore_${difficulty}`, time.toString())
      }
    }
  }

  // Format time display (e.g., 001, 023, 999)
  const formatTime = (time: number): string => {
    return time.toString().padStart(3, '0')
  }

  // Initialize the game on mount and when difficulty changes
  useEffect(() => {
    startNewGame()
  }, [difficulty, initializeBoard])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [timerInterval])

  // Get cell class based on its state
  const getCellClass = (cell: Cell): string => {
    let baseClass = "cell-btn w-12 h-12 flex items-center justify-center border-2 transition-all duration-200 text-xl font-bold min-w-[3rem] min-h-[3rem] "
    
    if (!cell.isRevealed) {
      baseClass += darkMode 
        ? "bg-gray-700 border-t-gray-600 border-l-gray-600 border-r-gray-900 border-b-gray-900 hover:bg-gray-600 active:border-t-gray-900 active:border-l-gray-900 active:border-r-gray-600 active:border-b-gray-600 "
        : "bg-gray-300 border-t-gray-100 border-l-gray-100 border-r-gray-600 border-b-gray-600 hover:bg-gray-200 active:border-t-gray-600 active:border-l-gray-600 active:border-r-gray-100 active:border-b-gray-100 "
      
      if (cell.isFlagged) {
        baseClass += "text-red-600 font-bold animate-pop"
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
  const getCellContent = (cell: Cell): React.ReactNode => {
    if (!cell.isRevealed) {
      return cell.isFlagged ? <span>🚩</span> : '';
    }
    
    if (cell.isMine) {
      return <span>💣</span>;
    }
    
    return cell.neighborMines === 0 ? '' : cell.neighborMines;
  }

  // Get emoji for game status
  const getStatusEmoji = (): string => {
    if (gameStatus === 'won') return '😎'
    if (gameStatus === 'lost') return '😵'
    return isFirstClick ? '🙂' : '😊'
  }

  return (
    <div className="game-container">
      <div className="w-full max-w-md mx-auto mb-6 flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-6 mt-2">
          <h1 className="text-4xl font-bold text-center">Minesweeper</h1>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-4"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        {/* Game controls */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center w-full">
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <button 
              onClick={() => setDifficulty('beginner')}
              className={`btn ${difficulty === 'beginner' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Beginner
            </button>
            <button 
              onClick={() => setDifficulty('intermediate')}
              className={`btn ${difficulty === 'intermediate' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Intermediate
            </button>
            <button 
              onClick={() => setDifficulty('expert')}
              className={`btn ${difficulty === 'expert' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Expert
            </button>
          </div>
          
          <button 
            onClick={startNewGame}
            className="btn btn-success ml-auto mt-3 sm:mt-0"
          >
            New Game
          </button>
        </div>
        
        {/* High scores */}
        <div className="mb-4 text-sm font-medium">
          Best time: <span className="font-mono">{formatTime(highScores[difficulty])}</span>
        </div>
        
        {/* Game status */}
        <div className={`flex justify-between w-full mb-4 px-4 py-3 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-gray-700 text-white'}`}>
          <div className="tooltip">
            <div className="bg-black px-3 py-1 rounded font-mono">
              {formatTime(minesLeft)}
            </div>
            <span className="tooltip-text">Mines remaining</span>
          </div>
          
          <button 
            onClick={startNewGame}
            className="text-2xl hover:scale-110 transition-transform mx-2"
            aria-label="Start new game"
          >
            {getStatusEmoji()}
          </button>
          
          <div className="tooltip">
            <div className="bg-black px-3 py-1 rounded font-mono">
              {formatTime(time)}
            </div>
            <span className="tooltip-text">Time elapsed</span>
          </div>
        </div>
      </div>
      
      {/* Game board - centered and responsive */}
      <div className="w-full flex justify-center items-center mb-6">
        <div className={`game-board ${darkMode ? 'bg-gray-800' : 'bg-gray-400'} ${gameStatus === 'lost' ? 'shake' : ''}`}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClass(cell)}
                  onClick={() => revealCell(rowIndex, colIndex)}
                  onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                  onAuxClick={() => chordAction(rowIndex, colIndex)} // Middle click
                  onMouseDown={(e) => {
                    // Left + right click (simulates middle click)
                    if (e.buttons === 3) {
                      chordAction(rowIndex, colIndex)
                    }
                  }}
                  disabled={gameStatus === 'lost' || gameStatus === 'won'}
                  aria-label={`Cell at row ${rowIndex + 1}, column ${colIndex + 1}`}
                >
                  {getCellContent(cell)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Game instructions */}
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
    </div>
  )
}

export default App 