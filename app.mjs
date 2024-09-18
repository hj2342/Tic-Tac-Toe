// app.js
import * as tic from './src/tic-tac-toe.mjs';  // Import all functions from tic-tac-toe module
import { question } from 'readline-sync';  // Import question function for user input
import fs from 'fs';  // Import file system module for reading config file

// Default configuration
let config = {
  board: ' '.repeat(9),  // Create an empty 3x3 board
  playerLetter: 'X',
  computerLetter: 'O',
  computerMoves: []
};

// Check if a configuration file is provided as a command line argument
if (process.argv[2]) {
  // Read the configuration file
  fs.readFile(process.argv[2], 'utf8', (err, data) => {
    if (err) {
      console.error('Configuration file not found');
      process.exit(1);
    }
    config = JSON.parse(data);  // Parse the JSON data into config object
    startGame();
  });
} else {
  startGame();  // Start game with default configuration
}

function startGame() {
  // Initialize the board from the configuration
  let board = tic.boardFromString(config.board);
  
  // Display initial game information
  console.log(`Player is ${config.playerLetter}, Computer is ${config.computerLetter}`);
  
  if (config.computerMoves.length > 0) {
    console.log('Computer will make the following moves:', config.computerMoves);
  }
  
  displayBoard(board);
  
  // Main game loop
  while (!tic.isBoardFull(board) && !tic.getWinner(board)) {
    if (config.playerLetter === 'X') {
      board = playerMove(board);
      if (!tic.isBoardFull(board) && !tic.getWinner(board)) {
        board = computerMove(board);
      }
    } else {
      board = computerMove(board);
      if (!tic.isBoardFull(board) && !tic.getWinner(board)) {
        board = playerMove(board);
      }
    }
  }
  
  // Game over, display final board and result
  displayBoard(board);
  const winner = tic.getWinner(board);
  if (winner) {
    console.log(`${winner === config.playerLetter ? 'Player' : 'Computer'} won!`);
  } else {
    console.log("It's a draw!");
  }
}

function displayBoard(board) {
  var size = Math.sqrt(board.length);  // Calculate board size
  var output = '  ';
  
  // Add column numbers
  for (var i = 1; i <= size; i++) {
    output += i + ' ';
  }
  output += '\n';

  // Add rows with labels and cell contents
  for (var i = 0; i < size; i++) {
    output += String.fromCharCode(65 + i) + ' ';  // Add row label (A, B, C, ...)
    for (var j = 0; j < size; j++) {
      output += board[i * size + j] + ' ';  // Add cell content
    }
    output += '\n';
  }
  
  console.log(output);
}

function playerMove(board) {
  while (true) {
    const move = question("What's your move? > ");
    if (tic.isValidMove(board, move)) {
      board = tic.placeLetter(board, config.playerLetter, move);
      displayBoard(board);
      question('Press enter to show computer\'s move...');
      return board;
    }
    console.log('Your move must be in a valid format, and it must specify an existing empty cell!');
  }
}

function computerMove(board) {
  while (config.computerMoves.length > 0) {
    const move = config.computerMoves[0];
    if (tic.isValidMove(board, move)) {
      config.computerMoves.shift();  // Remove the move only if it's valid and used
      board = tic.placeLetter(board, config.computerLetter, move);
      console.log(`Computer's move: ${move}`);
      displayBoard(board);
      return board;
    } else {
      // console.log(`Scripted move ${move} is invalid. Skipping to next move.`);
      config.computerMoves.shift();  // Remove the invalid move
    }
  }

  // If exhausted all scripted moves or they were all invalid, make a random move
  const move = getRandomMove(board);
  board = tic.placeLetter(board, config.computerLetter, move);
  console.log(`Computer's move (random): ${move}`);
  displayBoard(board);
  return board;
}

function getRandomMove(board) {
  const size = Math.sqrt(board.length);
  while (true) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    const move = String.fromCharCode(65 + row) + (col + 1);  // Convert to algebraic notation
    if (tic.isValidMove(board, move)) {
      return move;
    }
  }
}