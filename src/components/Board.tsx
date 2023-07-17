import { useEffect, useState } from "react";
import Square from "./Square";
import Swal from "sweetalert2";
import "../style/style.css";

const Board = () => {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [lastWinners, setLastWinners] = useState<string[]>([]);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [gameOver, setGameOver] = useState(false);
  const [draw, setDraw] = useState(false);
  const [undoAvailable, setUndoAvailable] = useState(false);
  const [redoAvailable, setRedoAvailable] = useState(false);
  const [movesHistory, setMovesHistory] = useState<string[][]>([]);

  useEffect(() => {
    const storedWinners = localStorage.getItem("lastWinners");
    if (storedWinners) {
      setLastWinners(JSON.parse(storedWinners));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lastWinners", JSON.stringify(lastWinners));
  }, [lastWinners]);

  useEffect(() => {
    if (gameOver || draw) {
      setUndoAvailable(false);
      setRedoAvailable(false);
    }
  }, [gameOver, draw]);

  const checkWinner = (squares: string[]) => {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  };

  const handleSquareClick = (i: number) => {
    if (gameOver || draw || squares[i]) {
      return;
    }

    const updatedSquares = [...squares];
    updatedSquares[i] = xIsNext ? "X" : "O";

    const updatedMovesHistory = [...movesHistory];
    updatedMovesHistory.push(updatedSquares);

    setSquares(updatedSquares);
    setMovesHistory(updatedMovesHistory);
    setUndoAvailable(true);
    setRedoAvailable(false);

    const winner = checkWinner(updatedSquares);
    if (winner) {
      setGameOver(true);
      let winnerName;
      if (winner === "X") {
        winnerName = player1Name;
      } else {
        winnerName = player2Name;
      }
      setLastWinners([...lastWinners, winnerName]);
      Swal.fire("Winner", `${winnerName} wins!`, "success" );
      setInterval(() => {
        window.location.reload()
      }, 1200)
    } else if (updatedSquares.filter((square) => square === null).length === 0) {
      setGameOver(true);
      setDraw(true);
      Swal.fire("Draw", "The game ends in a draw.", "info");
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const handleUndo = () => {
    if (movesHistory.length < 2) {
      return;
    }

    const updatedMovesHistory = [...movesHistory];
    const previousMove = updatedMovesHistory.pop()!;
    setMovesHistory(updatedMovesHistory);
    setSquares(previousMove);
    setXIsNext(!xIsNext);
    setUndoAvailable(updatedMovesHistory.length > 1);
    setRedoAvailable(true);
    setGameOver(false);
    setDraw(false);
  };

  const handleRedo = () => {
    if (movesHistory.length < 1) {
      return;
    }

    const nextMove = movesHistory[movesHistory.length - 1];
    setSquares(nextMove);
    setXIsNext(!xIsNext);
    setUndoAvailable(true);
    setRedoAvailable(false);
    setGameOver(false);
    setDraw(false);
  };

  const restartGame = () => {
    setSquares(Array(9).fill(null));
    setGameOver(false);
    setDraw(false);
    setUndoAvailable(false);
    setRedoAvailable(false);
    setMovesHistory([]);
  };
const resetAllWinners = () => {
    localStorage.clear();
    window.location.reload()
}
  return (
    <>
      <div className="my-4">
        <h1 className="text-center heading">TIC-TAC-TOE</h1>
      </div>
      <div className="container d-flex justify-content-center">
        <div className="board-row">
          <Square
            value={squares[0]}
            onClick={() => handleSquareClick(0)}
            disabled={gameOver || draw}
          />
          <Square
            value={squares[1]}
            onClick={() => handleSquareClick(1)}
            disabled={gameOver || draw}
          />
          <Square
            value={squares[2]}
            onClick={() => handleSquareClick(2)}
            disabled={gameOver || draw}
          />
        </div>
        <div className="board-row">
          <Square
            value={squares[3]}
            onClick={() => handleSquareClick(3)}
            disabled={gameOver || draw}
          />
          <Square
            value={squares[4]}
            onClick={() => handleSquareClick(4)}
            disabled={gameOver || draw}
          />
          <Square
            value={squares[5]}
            onClick={() => handleSquareClick(5)}
            disabled={gameOver || draw}
          />
        </div>
        <div className="board-row">
          <Square
            value={squares[6]}
            onClick={() => handleSquareClick(6)}
            disabled={gameOver || draw}
          />
          <Square
            value={squares[7]}
            onClick={() => handleSquareClick(7)}
            disabled={gameOver || draw}
          />
          <Square
            value={squares[8]}
            onClick={() => handleSquareClick(8)}
            disabled={gameOver || draw}
          />
        </div>
      </div>
      <div className="d-flex justify-content-center mt-5">
        <button className="restart-button" onClick={restartGame}>
          Restart Game
        </button>
      </div>
      <div className="mt-5">
        <h2>Last Winners:</h2>
        {lastWinners.length > 0 ? (
          <ul>
            {lastWinners.map((winner, index) => (
              <li key={index}>{winner}</li>
            ))}
          </ul>
        ) : (
          <p>No winners yet.</p>
        )}
      </div>
      <button type="button" onClick={resetAllWinners} className="reset-button">RESET</button>
    </>
  );
};

export default Board;
