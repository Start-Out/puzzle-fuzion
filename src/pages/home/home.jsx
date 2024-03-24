import { NavLink } from "react-router-dom";
import * as exports from "../../exports.js"

export default function Home() {
    return (
        <div className="flex flex-col justify-center flex-grow text-center bg-gradient-to-br from-cyan-300 to-blue-500 min-h-screen">
            <h1 className="text-4xl font-bold text-white mb-12 mt-8">Welcome to PuzzleFuzion!</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 max-w-6xl w-full mx-auto text-white">
                <NavLink to={"/wordle"} className="group relative overflow-hidden bg-blue-500 hover:bg-blue-700 rounded-lg py-8 px-4 shadow-lg transform hover:scale-105 transition duration-500 ease-in-out">
                    <img src={exports.wordle_icon} alt={"wordle icon"} className="w-16 h-16 mb-4 mx-auto group-hover:animate-bounce" />
                    Play Wordle
                </NavLink>
                <NavLink to={"/connections"} className="group relative overflow-hidden bg-green-500 hover:bg-green-700 rounded-lg py-8 px-4 shadow-lg transform hover:scale-105 transition duration-500 ease-in-out">
                    <img src={exports.connections_icon} alt={"connection icon"} className="w-16 h-16 mb-4 mx-auto group-hover:animate-slowSpin" />
                    Play Connections
                </NavLink>
                <NavLink to={"/create"} className="group relative overflow-hidden bg-purple-500 hover:bg-purple-700 rounded-lg py-8 px-4 shadow-lg transform hover:scale-105 transition duration-500 ease-in-out">
                    <img src={exports.create_icon} alt={"create your own puzzle icon"} className="w-16 h-16 mb-4 mx-auto group-hover:animate-pulse" />
                    Create Your Own Puzzle
                </NavLink>
                <NavLink to={"/settings"} className="group relative overflow-hidden bg-gray-500 hover:bg-gray-700 rounded-lg py-8 px-4 shadow-lg transform hover:scale-105 transition duration-500 ease-in-out">
                    <img src={exports.settings_icon} alt={"settings icon"} className="w-16 h-16 mb-4 mx-auto group-hover:animate-wiggle" />
                    Settings
                </NavLink>
            </div>
        </div>
    );
}