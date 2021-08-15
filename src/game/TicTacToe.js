// import { Web3Storage } from "web3.storage";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { useState, useEffect, useReducer } from "react";
import Loading from "../component/Loading.js";
import {
  send,
  messageReceivedHandler,
  PROTOCOL,
} from "../component/Libp2pUtils.js";

function getAccessToken() {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return 'paste-your-token-here'

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  return process.env.REACT_APP_WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
  return new Web3Storage({
    token: getAccessToken(),
  });
}
function makeFileObjects(gameData) {
  const obj = { gameData };
  const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

  const files = [new File([blob], "gameData.json")];
  return files;
}

async function storeFiles(gameData, setCid) {
  const client = makeStorageClient();
  const cid = await client.put(makeFileObjects(gameData));
  setCid(cid);
  return cid;
}

const sendMessage = async (libp2p, message) => {
  //message sender
  libp2p.peerStore.peers.forEach(async (peerData) => {
    // If they dont support the game protocol, ignore
    if (!peerData.protocols.includes(PROTOCOL)) return;

    // If we're not connected, ignore
    const connection = libp2p.connectionManager.get(peerData.id);
    if (!connection) return;

    try {
      const { stream } = await connection.newStream([PROTOCOL]);
      let messageToSend = JSON.stringify({ message });
      await send(messageToSend, stream);
    } catch (err) {
      console.error("Could not negotiate Game protocol stream with peer", err);
    }
  });
};

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
    ? `Winner: Player ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Player: ${nextValue} Move`;
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

function gameReducerFn(state, newState) {
  return {
    ...state,
    ...newState,
  };
}

function TicTacToe({ libp2p, player }) {
  const [gameState, dispatch] = useReducer(gameReducerFn, {
    history: [Array(9).fill(null)],
    currentStep: 0,
  });
  const [sentMessage, setSentMessage] = useState(false);
  const [gameClient, setGameClient] = useState(false);
  const [gameHistoryCid, setGameHistoryCid] = useState(null);

  useEffect(() => {
    if (sentMessage) {
      let receivedData = JSON.parse(sentMessage.message);
      if (typeof receivedData === "string") {
        if (receivedData === "restart") {
          restart();
        }
      } else {
        dispatch({
          history: receivedData,
          currentStep: receivedData.length - 1,
        });
      }
      // setHistory(receivedData);
      // setCurrentStep(receivedData.length);
    }
  }, [sentMessage]);

  useEffect(() => {
    if (!gameClient) {
      // Add game handler
      libp2p.handle(PROTOCOL, messageReceivedHandler(setSentMessage));

      // Set the game client to so the handler add code doesn't run again
      setGameClient(true);
      return;
    }
  }, []);

  // const currentSquares = history[currentStep];

  const currentSquares = gameState.history[gameState.currentStep];
  const winner = calculateWinner(currentSquares);
  const nextValue = calculateNextValue(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);
  const web3Upload =
    (status.includes("Winner") || status.includes("Scratch")) &&
    gameHistoryCid == null
      ? storeFiles(gameState.history, setGameHistoryCid)
      : null;

  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return;
    }

    if (player === nextValue) {
      const newHistory = gameState.history.slice(0, gameState.currentStep + 1);
      const squares = [...currentSquares];

      squares[square] = nextValue;
      dispatch({
        history: [...newHistory, squares],
        currentStep: newHistory.length,
      });
      // setHistory([...newHistory, squares]);
      // setCurrentStep(newHistory.length);
      sendMessage(libp2p, JSON.stringify([...newHistory, squares]));
    }
  }

  function restart() {
    dispatch({ history: [Array(9).fill(null)], currentStep: 0 });
    setGameHistoryCid(null);
    setSentMessage(false);
    // sendMessage(libp2p, JSON.stringify([Array(9).fill(null)]));
    // setHistory([Array(9).fill(null)]);
    // setCurrentStep(0);
  }
  function playAgain() {
    dispatch({ history: [Array(9).fill(null)], currentStep: 0 });
    setGameHistoryCid(null);
    setSentMessage(false);
    sendMessage(libp2p, JSON.stringify("restart"));
  }

  // const moves = gameState.history.map((stepSquares, step) => {
  //   const desc = step ? `Go to move #${step}` : "Go to game start";
  //   const isCurrentStep = step === gameState.currentStep;
  //   return (
  //     <li key={step}>
  //       <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
  //         {desc} {isCurrentStep ? "(current)" : null}
  //       </button>
  //     </li>
  //   );
  // });

  return (
    <div>
      {(status.includes("Winner") || status.includes("Scratch")) &&
      gameHistoryCid == null ? (
        <Loading displayMessage={"Uploading Game history to web3.storage"} />
      ) : (
        <div className="h-screen w-screen flex flex-col sm:items-center justify-center bg-gray-100">
          <div className="p-2 sm:w-4/6 sm:h-4/6  flex flex-col sm:justify-center bg-white shadow-xl rounded">
            <h1 className="mb-2 mx-auto text-xl font-bold">{`You are Player: ${player}`}</h1>
            <div className="mx-auto box-content h-60 w-60 border-2 border-red-200 rounded">
              <Board onClick={selectSquare} squares={currentSquares} />
            </div>
            <div className="mt-2 mx-auto text-xl font-bold">
              <div>{status}</div>
              {/* <ol>{moves}</ol> */}
            </div>
            {status.includes("Winner") || status.includes("Scratch") ? (
              <button
                className="w-32 sm:w-36 h-12 mx-auto mt-8 text-white text-xl sm:text-2xl font-bold bg-red-500 border-4 rounded border-red-300 hover:bg-red-400"
                onClick={playAgain}
              >
                Play Again
              </button>
            ) : null}
            {gameHistoryCid ? (
              <div className="mt-2 mx-auto text-center text-xl font-bold hover:text-blue-700">
                <a
                  target="_blank"
                  href={`https://${gameHistoryCid}.ipfs.dweb.link/`}
                >
                  Click to view Game history uploded to web3.storage
                </a>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToe;
