import { useEffect, useState } from "react";
import { DuplicateIcon, ArrowCircleLeftIcon } from "@heroicons/react/outline";
import Peer1Connect2Game from "./Peer1Connect2Game.js";
const GameProtocol = require("../component/Test02.js");

export default function Peer1Start({
  libp2p,
  peer1,
  updatePeer2,
  handleGameStateReset,
}) {
  const [loading, setLoading] = useState(false);
  const [connectionState, setConnectionState] = useState(false);
  const [peerId2, setPeerId2] = useState(null);
  useEffect(() => {
    console.log("entered");
    console.log(connectionState, "-1");
    if (connectionState) {
      // setLoading(false);
      updatePeer2(peerId2);
    } else if (loading) {
      alert("Failed to connnect to peer try again");
      setLoading(false);
    }
  });
  //delay function
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  const VerifyPeerInRelayServer = async (libp2p, peer2) => {
    //checking peer in relay server list
    libp2p.peerStore.peers.forEach(async (peerData) => {
      // If they dont support the game protocol, ignore
      console.log("r0", peerData.id.toB58String());
      if (
        peerData.protocols.includes(GameProtocol.PROTOCOL) &&
        peer2 === peerData.id.toB58String()
      ) {
        console.log("r", peerData.id.toB58String());
        setPeerId2(peer2);
        setConnectionState(true);
        console.log(connectionState, "lol");
        return;
      } else {
        return;
      }
    });
  };
  const handleConnection = async (e) => {
    e.preventDefault();
    // console.log("9", e.target.elements["peer2Id"].value === null);
    let peer2 = e.target.elements["peer2Id"].value;
    if (!peer2) {
      alert("Enter peerId you want to connect to");
      return;
    }
    if (peer2 === peer1.toB58String()) {
      alert("You have entered you own id ");
      return;
    }
    console.log(connectionState, "0");
    setLoading(true);
    VerifyPeerInRelayServer(libp2p, peer2);
    await sleep(1000);
    // console.log(connectionState, "2");
    // if (connectionState) {
    //   setLoading(false);
    //   updatePeer2(peer2);
    // } else {
    //   setLoading(false);
    //   alert("Failed to connnect to peer try again");
    // }
  };

  return (
    <div>
      {loading ? (
        <Peer1Connect2Game />
      ) : (
        <div className="h-screen w-screen flex flex-col justify-center bg-gray-100">
          <div>
            <button
              onClick={handleGameStateReset}
              className="m-2 sm:m-4 absolute top-0 hover:text-red-500"
            >
              <ArrowCircleLeftIcon className="h-8 w-8 sm:h-14 sm:w-14" />
            </button>
          </div>
          <div className="h-96 sm:w-5/12 flex flex-col bg-white rounded shadow-xl  justify-center items-center sm:self-center ">
            <div className="mb-6 text-3xl font-bold">
              <h1>Your Peer Id:</h1>
              <div className="flex">
                <h1 className="mr-4">{`${peer1
                  .toB58String()
                  .slice(0, 8)}...`}</h1>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(peer1.toB58String());
                  }}
                >
                  <DuplicateIcon className="animate-bounce my-auto h-6 w-6 text-blue-500" />
                </button>
              </div>
            </div>
            <div>
              <form
                onSubmit={(e) => handleConnection(e)}
                className="flex flex-col items-center  text-3xl font-bold"
              >
                <label forhtml="peer2Id">Connect to peerId: </label>
                <input
                  id="peer2Id"
                  type="text"
                  className="w-60 mt-4 border-2 border-blue-500 rounded"
                ></input>
                <div>
                  <input
                    type="submit"
                    value="Connect"
                    className="mx-1 w-32 sm:w-36 h-12 mt-8 text-white text-xl sm:text-2xl font-bold bg-red-500 border-4 rounded border-red-300 hover:bg-red-400 cursor-pointer"
                  />
                  <input
                    type="reset"
                    value="Reset"
                    className="w-32 sm:w-36 h-12 mt-8 text-white text-xl sm:text-2xl font-bold bg-red-500 border-4 rounded border-red-300 hover:bg-red-400 cursor-pointer"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
