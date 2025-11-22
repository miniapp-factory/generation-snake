'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share } from '@/components/share';
import { url } from '@/lib/metadata';

const SIZE = 4;

function randomTile(board: number[][]) {
  const empty: [number, number][] = [];
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (board[i][j] === 0) empty.push([i, j]);
    }
  }
  if (empty.length === 0) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  board[r][c] = value;
  return board;
}

function initBoard() {
  let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  board = randomTile(board);
  board = randomTile(board);
  return board;
}

function compress(row: number[]) {
  const newRow = row.filter((v) => v !== 0);
  const missing = SIZE - newRow.length;
  return [...newRow, ...Array(missing).fill(0)];
}

function merge(row: number[]) {
  let score = 0;
  for (let i = 0; i < SIZE - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }
  return { row, score };
}

function moveLeft(board: number[][]) {
  let score = 0;
  const newBoard = board.map((row) => {
    const compressed = compress(row);
    const { row: merged, score: sc } = merge(compressed);
    const final = compress(merged);
    score += sc;
    return final;
  });
  return { board: newBoard, score };
}

function transpose(board: number[][]) {
  return board[0].map((_, i) => board.map((row) => row[i]));
}
function reverse(board: number[][]) {
  return board.map((row) => row.slice().reverse());
}

function move(board: number[][], dir: 'up' | 'down' | 'left' | 'right') {
  let newBoard = board;
  let score = 0;
  if (dir === 'up') newBoard = transpose(newBoard);
  if (dir === 'down') newBoard = reverse(transpose(newBoard));
  if (dir === 'right') newBoard = reverse(newBoard);
  const { board: after, score: sc } = moveLeft(newBoard);
  score += sc;
  if (dir === 'up') newBoard = transpose(after);
  if (dir === 'down') newBoard = reverse(transpose(after));
  if (dir === 'right') newBoard = reverse(after);
  return { board: newBoard, score };
}

export default function Game2048() {
  const [board, setBoard] = useState(initBoard);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleMove = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;
    const { board: next, score: sc } = move(board, dir);
    if (JSON.stringify(next) !== JSON.stringify(board)) {
      const newScore = score + sc;
      const withTile = randomTile(next);
      setBoard(withTile);
      setScore(newScore);
      if (checkGameOver(withTile)) setGameOver(true);
    }
  };

  const checkGameOver = (b: number[][]) => {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (b[i][j] === 0) return false;
        if (i < 3 && b[i][j] === b[i + 1][j]) return false;
        if (j < 3 && b[i][j] === b[i][j + 1]) return false;
      }
    }
    return true;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl font-bold">2048</div>
      <div className="text-lg">Score: {score}</div>
      <div className="grid grid-cols-4 gap-2">
        {board.flat().map((v, i) => (
          <div
            key={i}
            className={`w-12 h-12 flex items-center justify-center rounded-md ${
              v === 0 ? 'bg-gray-200' : 'bg-blue-400 text-white'
            }`}
          >
            {v !== 0 ? v : ''}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => handleMove('up')}>↑</Button>
        <Button onClick={() => handleMove('left')}>←</Button>
        <Button onClick={() => handleMove('right')}>→</Button>
        <Button onClick={() => handleMove('down')}>↓</Button>
      </div>
      {gameOver && <div className="text-red-600 font-semibold">Game Over!</div>}
      <Share text={`I scored ${score} in 2048! ${url}`} />
    </div>
  );
}
