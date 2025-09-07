# Minesweeper Game

A classic Minesweeper game built with React, React hooks, TypeScript, and Tailwind CSS with animations.

## Features

- Three difficulty levels: Beginner (9x9 with 10 mines), Intermediate (16x16 with 40 mines), and Expert (16x30 with 99 mines)
- Left-click to reveal cells
- Right-click to flag potential mines (cycles: flag → question → none)
- Mobile long-press to flag
- Number indicators showing adjacent mines
- Game over when clicking on a mine
- Win condition when all non-mine cells are revealed
- Timer to track gameplay duration
- Mine counter showing remaining unflagged mines
- Animations for cell reveals, flagging, and game over
- Responsive design that works on mobile and desktop (board auto‑scales)
- Dark mode toggle
- High score tracking
- First-click protection (never hit a mine on first click)
- Chord functionality (middle-click to reveal multiple cells)
- Hints: reveal a random safe cell (Beginner: 3, Intermediate: 2, Expert: 1)
- Keyboard shortcuts: R (restart), H (hint), 1/2/3 (difficulty), D (dark mode)
- Reset best time per difficulty

## Technologies Used

- React
- React Hooks (useState, useEffect, useCallback)
- TypeScript
- Tailwind CSS for styling
- Custom animations

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Development

- Run type checking:
  ```
  npm run typecheck
  ```
- Run linting:
  ```
  npm run lint
  ```

## How to Play

- Left-click to reveal a cell
- Right-click to flag a potential mine
- Middle-click (or left+right click) on a revealed number to chord (reveal adjacent cells when correct number of flags are placed)
- The numbers indicate how many mines are adjacent to that cell
- Win by revealing all cells that don't contain mines
- Lose by clicking on a mine

## Build for Production

To build the app for production:

```
npm run build
```

The build files will be in the `dist` directory.

## License

MIT
