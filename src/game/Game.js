import { useEffect, useState } from "react";
import GameLandingPage from "./GameLandingPage.js";
import Peer1Start from "./Peer1Start.js";
import Peer2Join from "./Peer2Join.js";
import TicTacToe from "./TicTacToe.js";

export default function Game({ libp2p, peer1, peer2, updatePeer2 }) {
  const [gameState, setGameState] = useState("initial");

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
        }}
        onGameJoin={() => {
          setGameState("gameJoined");
        }}
      />
    );
  }

  if (gameState === "gameStarted") {
    return (
      <Peer1Start libp2p={libp2p} peer1={peer1} updatePeer2={updatePeer2} />
    );
  }

  if (gameState === "gameJoined") {
    return <Peer2Join />;
  }

  if (gameState === "gameStartedConnected2peer2") {
    return <TicTacToe libp2p={libp2p} />;
  }
}
