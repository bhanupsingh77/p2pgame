import React from "react";

export default function Peer2Join({
  peerId = "qwestqwestqwestqwestqwestqwestqwestqwestqwestqwestqwestqwest",
}) {
  return (
    <div className="h-screen w-screen flex flex-col justify-center bg-gray-100">
      <div className="h-96 sm:w-5/12 flex flex-col bg-white rounded shadow-xl  justify-center items-center sm:self-center ">
        <div className="mb-6 text-3xl font-bold">
          <h1>Your Peer Id:</h1>
          <h1>{`${peerId.slice(0, 8)}...`}</h1>
        </div>
        <div>
          <form className="flex flex-col items-center  text-3xl font-bold">
            <span forhtml="peer1Id">Join peerId: </span>
            <input
              id="peer1Id"
              type="text"
              className="w-60 mt-4 border-2 border-blue-500 rounded"
            ></input>
            <button className="w-32 sm:w-36 h-12 mt-8 text-white text-xl sm:text-2xl font-bold bg-red-500 border-4 rounded border-red-300 hover:bg-red-400">
              Join
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
