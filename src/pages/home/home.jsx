import { NavLink } from "react-router-dom";
import * as exports from "../../exports.js"

export default function Home() {
    return (
        <div className="flex flex-col justify-center flex-grow text-center mt-[5vh]">
            <h1 className="text-4xl font-bold text-gray-200 mb-12 mt-8 select-none">Welcome to PuzzleFuzion!</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 max-w-6xl w-full mx-auto text-black text-[1.2rem] last-child-center">
                <NavLink to={"/wordle"} className="group relative overflow-hidden bg-blue-500 hover:bg-blue-600 rounded-lg hover:text-[1.3rem] py-8 px-4 shadow-lg transform hover:scale-105 transition-all transition duration-500 ease-in-out">
                    <img src={exports.wordle_icon} alt={"wordle icon"} className="w-16 h-16 mb-4 mx-auto group-hover:animate-bounce" />
                    Play Wordle
                </NavLink>
                <NavLink to={"/connections"} className="group relative overflow-hidden bg-green-500 hover:bg-green-600 rounded-lg hover:text-[1.3rem] py-8 px-4 shadow-lg transform hover:scale-105 transition-all transition duration-500 ease-in-out">
                    <img src={exports.connections_icon} alt={"connection icon"} className="w-16 h-16 mb-4 mx-auto group-hover:animate-slowSpin" />
                    Play Connections
                </NavLink>
                <NavLink to={"/multiplayer"} className={"group relative overflow-hidden bg-yellow-500 hover:bg-yellow-600 rounded-lg hover:text-[1.3rem] py-8 px-4 shadow-lg transform hover:scale-105 transition-all transition duration-500 ease-in-out"} >
                    <img src={exports.multiplayer_icon} alt={"multiplayer icon"} className={"w-16 h-16 mb-4 mx-auto group-hover:animate-pop"} />
                    Play With Friends
                </NavLink>
                <NavLink to={"/create"} className="group relative overflow-hidden bg-purple-400 hover:bg-purple-500 rounded-lg hover:text-[1.3rem] py-8 px-4 shadow-lg transform hover:scale-105 transition-all transition duration-500 ease-in-out">
                    <img src={exports.create_icon} alt={"create your own puzzle icon"} className="w-16 h-16 mb-4 mx-auto group-hover:animate-pulse" />
                    Create Your Own Puzzle
                </NavLink>
                <NavLink to={"/settings"} className="group relative overflow-hidden bg-pf-setting hover:bg-pf-setting-h rounded-lg hover:text-[1.3rem] py-8 px-4 shadow-lg transform hover:scale-105 transition-all transition duration-500 ease-in-out">
                    <img src={exports.settings_icon} alt={"settings icon"} className="w-16 h-16 mb-4 mx-auto group-hover:animate-wiggle" />
                    Settings
                </NavLink>
            </div>
        </div>
    );
}