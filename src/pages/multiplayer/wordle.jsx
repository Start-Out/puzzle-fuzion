import {useQuery as convexQuery, useAction, useMutation} from "convex/react";
import { api } from "/convex/_generated/api"
import { useEffect, useState } from "react";
import * as exports from "../../exports.js"
import moment from "moment-timezone";

const initial_guess = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
]

export default function Wordle ({userId} ) {
    const [wordle, setWordle] = useState({day: '', word: ''});
    const performMyAction = useAction(api.action.getWord);
    const data = convexQuery(api.wordle.get)

    const [gameId, setGameId] = useState(() => sessionStorage.getItem('gameId') || "");
    const [run, setRun] = useState(false)

    const createGame = useMutation(api.games.createGame)
    const gameDetails = convexQuery(api.games.getGame, { _id: gameId });

    const [anonGameSession, setAnonGameSession] = useState("")
    const [sessionOptionsVisible, setSessionOptionsVisible] = useState(false);

    // game session creation
    useEffect( () => {
        const handleCreation = async () => {
            if (gameId === "" && wordle.word !== "") {
                const response = await createGame({
                    userId: userId,
                    guesses: initial_guess,
                    word: wordle.word,
                    cursor: [0, -1],
                    statuses: initial_guess
                });
                sessionStorage.setItem('gameId', response);
                setGameId(response);
            }
            else {
                console.log("from game session storage: ", gameId)
            }
        }

        handleCreation()
            .then(() => {
                console.log("created session: ", gameId)
            })

    }, [wordle, run])

    useEffect( () => {
        if (gameDetails) {
            console.log("initial game: ", gameDetails.guesses)
        }
    }, [gameDetails])

    // getting the wordle word
    useEffect( () => {
        async function callAction() {
            await performMyAction();
        }

        callAction()
            .catch((error) => console.log("ERROR: ", error));

    }, [])
    useEffect(() => {
        if (data) {
            // Ensure data is loaded
            const localDate = new Date().toLocaleDateString('en-CA');
            const localWordEntry = data.find(entry => entry.day === localDate);

            if (localWordEntry) {
                setWordle(localWordEntry);
                setRun(prev => !prev)
            }
            else {
                alert("Permission denied to obtain local timezone, using system default timezone: America/Los_Angeles (PST)")
                const pstDate = moment().tz('America/Los_Angeles').format('YYYY-MM-DD');
                const localWordEntry = data.find(entry => entry.day === pstDate);
                if (!localWordEntry) {
                    alert("No word entry found for today in PST timezone. Check data or defaults.");
                } else {
                    setWordle(localWordEntry);
                    setRun(prev => !prev)
                }
            }
        }
    }, [data]);

    const handleJoinSession = () => {
        sessionStorage.setItem("gameId", anonGameSession)
        setGameId(anonGameSession)
        window.location.reload()
    }

    const restartGame = () => {
        sessionStorage.removeItem("gameId")
        window.location.reload();
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(gameId).then(() => {
            // Optionally, notify the user that the code was copied successfully
            alert('Invitation code copied to clipboard.');
        });
    };

    const toggleSessionOptions = () => {
        setSessionOptionsVisible(prev => !prev);
    };

    return (
        <div className="flex flex-col justify-center items-center p-4 overflow-y-hidden max-h-screen min-w-screen bg-gray-900 text-white">
            <div className="hidden sm:block text-4xl md:text-5xl font-bold mb-10 select-none">
                Multiplayer
            </div>
            <div className={"absolute top-[10vh] left-0 p-4 z-20 " +
                "max-w-[20vw]"}
            >
                <button onClick={toggleSessionOptions}
                        className={"bg-purple-500 hover:bg-purple-700 " +
                            "text-white font-bold py-2 px-4 rounded-full "}
                >
                    Session Options
                </button>
                {sessionOptionsVisible && (
                    <div className="mt-4 p-4 bg-gray-800 rounded-md">
                        <div className="text-lg mb-4 flex items-center space-x-2">
                            <div className="bg-gray-700 border border-gray-600 rounded-md px-2 max-w-xs overflow-hidden text-ellipsis">
                                Invitation code: <span className="font-bold">{gameId}</span>
                            </div>
                            <button onClick={copyToClipboard} className="bg-green-600 hover:bg-green-700 rounded-md shadow px-2 py-1">
                                Copy
                            </button>
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={anonGameSession}
                                onChange={(e) => setAnonGameSession(e.target.value)}
                                placeholder="Enter session ID"
                            />
                            <button onClick={handleJoinSession} className="w-full bg-blue-600 hover:bg-blue-700 rounded-md shadow py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
                                Join Game
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="wordle-content mt-8 flex flex-col items-center space-y-4">
                <button
                    onClick={restartGame}
                    className={"px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg shadow-lg " +
                        "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 " +
                        "transition duration-150 ease-in-out"}
                >
                    Restart Game
                </button>
                <exports.MultiplayerInput gameId={gameId}/>
                <exports.MultiplayerKeyboard gameId={gameId}/>
            </div>
        </div>
    );
}