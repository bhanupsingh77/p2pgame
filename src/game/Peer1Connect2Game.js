import React from "react";
export default function Peer1Connect2Game() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center bg-gray-100">
      <div className="h-96 sm:w-5/12 flex flex-col bg-white rounded shadow-xl  justify-center items-center sm:self-center ">
        <div className="mb-6 text-3xl font-bold">
          <h1>Waiting for Peer</h1>
        </div>
        <div>
          <div
            style={{ borderTopColor: "gray" }}
            className="w-16 h-16 border-t-4 border-4 border-solid border-gray-300 rounded-full animate-spin"
          ></div>
        </div>
      </div>
    </div>
  );
}
