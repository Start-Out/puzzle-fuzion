import { NavLink } from "react-router-dom";

export default function Home() {
  return (
      <div className="flex flex-col justify-center flex-grow text-center">
          <div className="font-bold text-xl mb-8">
              Welcome to PuzzleFuzion!
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 max-w-4xl w-full mx-auto">
              <NavLink to={"/wordle"} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-8 px-4 rounded`}> Play Wordle </ NavLink>
              <NavLink to={"/connections"} className={`bg-green-500 hover:bg-green-700 text-white font-bold py-8 px-4 rounded`}> Play Connections </NavLink>
              <NavLink to={"/create"} className={`bg-purple-500 hover:bg-purple-700 text-white font-bold py-8 px-4 rounded`}> Create Your Own Puzzle </NavLink>
              <NavLink to={"/settings"} className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-8 px-4 rounded`}> Settings </NavLink>
          </div>
      </div>
  );
}