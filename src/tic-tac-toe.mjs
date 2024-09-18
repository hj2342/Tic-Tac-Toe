// tic-tac-toe.js

function repeat(initVal, length) {
  return Array(length).fill(initVal);
}    

function generateBoard(rows, cols, initialValue) {
  const blankValue = initialValue || " ";
  return repeat(blankValue, rows * cols);
}

function boardFromString(s) {
  // Check if the string contains only valid characters
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== ' ' && s[i] !== 'X' && s[i] !== 'O') {
      return null;
    }
  }

  // Check if the string length is a perfect square
  const length = s.length;
  const size = Math.sqrt(length);
  if (Math.sqrt(s.length) % 1 !== 0) {
      return null;
    } 

  // Convert the string to an array
  return s.split('');
}

// Converts row and column coordinates to a single index in a one-dimensional array
function rowColToIndex(board, row, col) {
  const size = Math.sqrt(board.length);  // Calculate the size (width/height) of the board by taking the square root of the board's length
  return row * size + col;
}

// Converts a single index in a one-dimensional array back to row and column coordinates
function indexToRowCol(board, i) {
  const size = Math.sqrt(board.length);
// Return an object containing the row and column as properties
return {
    row: Math.floor(i / size),
    col: i % size
  };
}

// Sets a cell on the board with a given letter
function setBoardCell(board, letter, row, col) {
  const newBoard = board.slice();  // Create a shallow copy of the board
  newBoard[rowColToIndex(board, row, col)] = letter;  // Set the cell
  return newBoard;
}

// Convert algebraic notation (e.g., "A1") to row and column numbers
function algebraicToRowCol(algebraicNotation) {
  if (typeof algebraicNotation !== 'string' || algebraicNotation.length < 2) {
    return undefined;
  }

  const rowLetter = algebraicNotation.charAt(0);
  let colNumber = '';

  // Extract column number
  for (let i = 1; i < algebraicNotation.length; i++) {
    const char = algebraicNotation.charAt(i);
    if (char >= '0' && char <= '9') {
      colNumber += char;
    } else {
      return undefined;  // Invalid character in column number
    }
  }

  // Validate row letter
  if (rowLetter < 'A' || rowLetter > 'Z') {
    return undefined;
  }

  // Convert row letter to number (0-based)
  const row = rowLetter.charCodeAt(0) - 'A'.charCodeAt(0);
  // Convert column string to number (0-based)
  const col = parseInt(colNumber, 10) - 1;

  if (isNaN(col) || col < 0) {
    return undefined;
  }

  return { row, col };
}

// Place a letter on the board using algebraic notation
function placeLetter(board, letter, algebraicNotation) {
  const { row, col } = algebraicToRowCol(algebraicNotation);
  return setBoardCell(board, letter, row, col);
}

function getWinner(board) {
  const size = Math.sqrt(board.length);
  if (!Number.isInteger(size)) {
      return undefined; // Invalid board
  }

  // Helper function to check if all elements in an array are the same and not empty
  function checkLine(cells) {
      return cells.every(cell => cell === cells[0] && cell !== ' ');
  }

  // Check rows
  for (let row = 0; row < size; row++) {
      const rowCells = board.slice(row * size, (row + 1) * size);
      if (checkLine(rowCells)) {
          return rowCells[0];
      }
  }

  // Check columns
  for (let col = 0; col < size; col++) {
      const colCells = Array.from({length: size}, (_, i) => board[i * size + col]);
      if (checkLine(colCells)) {
          return colCells[0];
      }
  }

  // Check diagonals
  const diagonal1 = Array.from({length: size}, (_, i) => board[i * size + i]);
  const diagonal2 = Array.from({length: size}, (_, i) => board[i * size + (size - 1 - i)]);
  
  if (checkLine(diagonal1)) {
      return diagonal1[0];
  }
  if (checkLine(diagonal2)) {
      return diagonal2[0];
  }

  // No winner found
  return undefined;
}

function isBoardFull(board) {
  // Check if every cell is not empty
  return board.every(cell => cell !== ' ');
}

function isValidMove(board, algebraicNotation) {
  // Convert algebraic notation to row and column
  const position = algebraicToRowCol(algebraicNotation);
  if (!position) return false;
  
  const { row, col } = position;
  const size = Math.sqrt(board.length);
  
  // Check if position is within board boundaries
  if (row < 0 || row >= size || col < 0 || col >= size) {
    return false;
  }
  
  // Check if the cell is empty
  return board[rowColToIndex(board, row, col)] === ' ';
}

export {
  generateBoard,
  boardFromString,
  rowColToIndex,
  indexToRowCol,
  setBoardCell,
  algebraicToRowCol,
  placeLetter,
  getWinner,
  isBoardFull,
  isValidMove
};