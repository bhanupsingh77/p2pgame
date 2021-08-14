// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js
import useLocalStorageState from "../customhooks/useLocalStorageState.js";
import * as React from "react";

function Board({ squares, onClick }) {
  function renderSquare(i) {
    return (
      <button
        className="h-20 w-20 bg-white border border-black text-5xl font-bold text-center float-left"
        onClick={() => onClick(i)}
      >
        {squares[i]}
      </button>
    );
  }

  return (
    <div className="flex">
      <div className="">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
}

function calculateNextValue(squares) {
  const xSquaresCount = squares.filter((r) => r === "X").length;
  const oSquaresCount = squares.filter((r) => r === "O").length;
  return oSquaresCount === xSquaresCount ? "X" : "O";
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function TicTacToe() {
  const [history, setHistory] = useLocalStorageState("tic-tac-toe:history", [
    Array(9).fill(null),
  ]);
  const [currentStep, setCurrentStep] = useLocalStorageState(
    "tic-tac-toe:step",
    0
  );

  const currentSquares = history[currentStep];
  const winner = calculateWinner(currentSquares);
  const nextValue = calculateNextValue(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return;
    }

    const newHistory = history.slice(0, currentStep + 1);
    const squares = [...currentSquares];

    squares[square] = nextValue;
    setHistory([...newHistory, squares]);
    setCurrentStep(newHistory.length);
  }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setCurrentStep(0);
  }

  const moves = history.map((stepSquares, step) => {
    const desc = step ? `Go to move #${step}` : "Go to game start";
    const isCurrentStep = step === currentStep;
    return (
      <li key={step}>
        <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
          {desc} {isCurrentStep ? "(current)" : null}
        </button>
      </li>
    );
  });

  return (
    <div className="h-screen w-screen flex flex-col sm:items-center justify-center bg-gray-100">
      <div className="p-2 sm:w-1/2 xl:h-1/2  flex flex-col sm:justify-center bg-white shadow-xl rounded">
        <div className="mx-auto box-content h-60 w-60 border-2 border-red-200 rounded">
          <Board onClick={selectSquare} squares={currentSquares} />
        </div>
        <div className="mx-auto text-xl font-bold">
          <div>{status}</div>
          {/* <ol>{moves}</ol> */}
        </div>
        <button
          className="w-32 sm:w-36 h-12 mx-auto mt-8 text-white text-xl sm:text-2xl font-bold bg-red-500 border-4 rounded border-red-300 hover:bg-red-400"
          onClick={restart}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default TicTacToe;
