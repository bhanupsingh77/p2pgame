import React from "react";

export default function Loading({ displayMessage = null }) {
  return (
    <div className="h-screen w-screen flex flex-col border-2 border-red-300 sm:items-center justify-center bg-white">
      {displayMessage ? (
        <div className="mb-4">
          <p className="text-center text-3xl font-bold">{displayMessage}</p>
        </div>
      ) : null}
      <div
        style={{ borderTopColor: "gray" }}
        className="mx-auto w-16 h-16 border-t-4 border-4 border-solid border-gray-300 rounded-full animate-spin"
      ></div>
    </div>
  );
}
