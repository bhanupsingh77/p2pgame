import React from "react";

export default function Loading() {
  return (
    <div className="h-screen w-screen flex juastify-center">
      <div
        style={{ borderTopColor: "gray" }}
        className="w-16 h-16 border-t-4 border-4 border-solid border-gray-300 rounded-full animate-spin"
      ></div>
    </div>
  );
}
