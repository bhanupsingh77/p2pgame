import React from "react";

export default function GameLandingPage({ onGameStart, onGameJoin }) {
  return (
    <div className="pt-2 sm:pt-24 sm:h-screen border-2 border-red-300 flex flex-col-reverse sm:flex-row sm:justify-evenly">
      <div className="mx-auto sm:mx-0 mt-4 sm:mt-32 sm:align-center h-60 w-64 sm:w-96 text-2xl sm:text-4xl ">
        <p>Have Fun!</p>
        <h1>Play PvP (peer vs peer)</h1>
        <p>
          We will take care of your <strong>privacy,data,security</strong>{" "}
        </p>
        {/* for a seprate page maybe */}
        {/* <p>How can you trust us ?</p>
        <p>
          we have a open sourse code, let directly communicate with other user
          without any middle man in between , your data is stored in dstorage{" "}
        </p> */}
      </div>
      <div className="flex flex-col  h-4/5 text-2xl sm:text-4xl font-bold">
        <h1 className="mb-4 text-center uppercase tracking-widest">
          Tic Tac Toe
        </h1>
        <div className="mx-auto h-60 w-60 sm:h-72 sm:w-72 relative box-content bg-black border-4 border-black shadow-xl">
          <iframe
            src="https://giphy.com/embed/YnZPEeeC7q6pQEZw1I"
            // width="100%"
            // height="100%"
            // style="position:absolute"
            // frameBorder="0"
            // class="giphy-embed"
            // allowFullScreen
            className="h-full w-full absolute"
          ></iframe>
        </div>
        {/* <p>
          <a href="https://giphy.com/gifs/animals-animal-puppy-YnZPEeeC7q6pQEZw1I">
            via GIPHY
          </a>
        </p> */}
        <div className="flex self-center">
          <button
            className="mx-1 w-32 sm:w-36 h-12 mt-8 text-white text-xl sm:text-2xl font-bold bg-red-500 border-4 rounded border-red-300 hover:bg-red-400"
            onClick={onGameStart}
          >
            Start Game
          </button>
          <button
            className="mx-1 w-32 sm:w-36 h-12 mt-8 text-white text-xl sm:text-2xl font-bold bg-red-500 border-4 rounded border-red-300 hover:bg-red-400"
            onClick={onGameJoin}
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
}
