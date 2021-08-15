import { useEffect, useState } from "react";
import GameLandingPage from "./GameLandingPage.js";
import Peer1Start from "./Peer1Start.js";
import Peer2Join from "./Peer2Join.js";
import TicTacToe from "./TicTacToe.js";

export default function Game({
  libp2p,
  peer1,
  peer2,
  updatePeer2,
  handlePeer2Reset,
}) {
  const [gameState, setGameState] = useState("initial");
  const [gameMode, setGameMode] = useState(null);

  const handleGameStateReset = () => {
    setGameState("initial");
    setGameMode(null);
    handlePeer2Reset();
  };

  useEffect(() => {
    if (peer2) {
      setGameState("gameStartedConnected2peer2");
    }
  }, [peer2]);

  if (gameState === "initial") {
    return (
      <GameLandingPage
        onGameStart={() => {
          setGameState("gameStarted");
          setGameMode("started");
        }}
        onGameJoin={() => {
          setGameState("gameJoined");
          setGameMode("joined");
        }}
      />
    );
  }

  if (gameState === "gameStarted") {
    return (
      <Peer1Start
        libp2p={libp2p}
        peer1={peer1}
        updatePeer2={updatePeer2}
        handleGameStateReset={handleGameStateReset}
      />
    );
  }

  if (gameState === "gameJoined") {
    return (
      <Peer2Join
        libp2p={libp2p}
        peer1={peer1}
        updatePeer2={updatePeer2}
        handleGameStateReset={handleGameStateReset}
      />
    );
  }

  if (gameState === "gameStartedConnected2peer2" && gameMode === "started") {
    return <TicTacToe libp2p={libp2p} player={"X"} />;
  }
  if (gameState === "gameStartedConnected2peer2" && gameMode === "joined") {
    return <TicTacToe libp2p={libp2p} player={"O"} />;
  }
}
