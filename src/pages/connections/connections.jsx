import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import * as exports from "../../exports.js"
import {useDispatch, useSelector} from "react-redux";
import {
    getAttempts,
    getCreator,
    getGameName,
    getStartingBoard,
    setBoard,
    setCreator, setGameName,
    setStartingBoard
} from "../../redux/connectionSlice.js";
import {useParams} from "react-router-dom";

import {useQuery as convexQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {getNavbarOpen} from "../../redux/navbarSlice.js";

export default function Connections(  ) {
    const {game_id} = useParams()
    const _id = game_id
    const [query, setQuery] = useState(false)

    const game = convexQuery(api.connections.getGame, {_id: _id || "hla"})

    console.log("game: ", game)
    const dispatch = useDispatch()
    const startingBoard = useSelector(getStartingBoard)
    const creator = useSelector(getCreator)
    const gameName = useSelector(getGameName)
    const navbarOpen = useSelector(getNavbarOpen)

    const date = new Date().toLocaleDateString('en-CA', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Los_Angeles'
    });

    const {isLoading, error, data, isSuccess} = useQuery({
        queryKey: ["getTodaysGame", date],
        queryFn: async () => {
            const response = await fetch(`https://qyvst5d5rh.execute-api.us-east-2.amazonaws.com/default/getTodaysGame`)
            if (!response) {throw new Error("Network response was not okay!")}

            const data = await response.json()
            console.log("data: ", data)
            console.log("starting board: ", data.startingBoard)
            return data
        },
        enabled: query === true,
    })

    useEffect( () => {
        if (isSuccess) {
            setQuery(false)
            dispatch(setBoard({
                board: data.board
            }))
            if ( startingBoard.length === 1) {
                dispatch(setStartingBoard({
                    startingBoard: data.startingBoard
                }))
            }
        }
    }, [isSuccess])

    // query for connection
    useEffect( () => {
        console.log("game id: ", game_id)

        if (game_id) {
            setQuery(false)
        }
        else {
            setQuery(true)
        }

        // Logic to scroll
        const scrollToPosition = () => {
            const screenHeight = window.innerHeight;
            const scrollTarget = screenHeight * 0.5; // Adjust the multiplier as needed
            window.scrollTo({
                top: scrollTarget,
                behavior: 'smooth' // For smooth scrolling
            });
        };

        scrollToPosition();
    }, [])


    useEffect(() => {
        if (game && game.data) {
            const board = JSON.parse(game.data);

            dispatch(setBoard({
                board: board.board
            }))
            dispatch(setCreator({
                createdBy: board.name
            }))
            dispatch(setGameName({
                gameName: game.gameName
            }))
            if ( startingBoard.length === 1) {
                dispatch(setStartingBoard({
                    startingBoard: board.startingBoard
                }))
            }
        }
    }, [game, startingBoard])

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[93vh] bg-gray-900 text-white">
                <div className={"select-none text-gray-600 " +
                    "mt-0 sm:mt-10 mb-10 "}
                >
                    <h1 className={"text-4xl font-bold text-center"}>
                        {gameName ? gameName : "Connections"}
                    </h1>
                    {
                        creator ? (
                            <h2 className={"text-2xl font-bold text-center italic"}>By {creator}</h2>
                        ) : <></>
                    }
                </div>
                {isLoading? (
                    <exports.Loading />
                ) : error ? (
                    <div className="text-red-500">There was an error: {error.message}</div>
                ) : (
                    startingBoard && (
                        <div className="w-full flex flex-col items-center gap-8 px-4 md:px-8">
                            <div className="flex flex-wrap justify-center gap-4 pt-12 pb-12 max-w-3xl bg-gray-800 rounded-lg shadow-md">
                                {
                                    startingBoard.map((wordRow, index) => {
                                        if (wordRow[0] && wordRow[0].includes("hla")) {
                                            // Extract category and words for special handling
                                            const category = wordRow[1];
                                            const words = wordRow[2];
                                            const level = wordRow[3];
                                            return (
                                                <exports.WordBox
                                                    key={index}
                                                    word={null} correct={true} level={level}
                                                    category={category} listOfWords={words}
                                                />
                                            );
                                        } else {
                                            // Regular word rendering for rows without "hla"
                                            return wordRow.map((word, wordIndex) => (
                                                <exports.WordBox key={`${index}-${wordIndex}`} word={word} />
                                            ));
                                        }
                                    })
                                }
                            </div>
                            <exports.Mistakes />
                            <div className="w-full max-w-6xl">
                                <exports.ControlCenter />
                            </div>
                        </div>
                    )
                )}
                {
                    game && !navbarOpen && <ShareButton />
                }
            </div>

        </>
    )
}


const ShareButton = () => {
    const [isShareVisible, setIsShareVisible] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    const shareUrl = window.location.href; // Gets the current URL

    const copyToClipboardFallback = (text) => {
        // Create a temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select(); // Select the text
        try {
            const successful = document.execCommand('copy'); // Attempt to copy
            const msg = successful ? 'Copied!' : 'Failed!';
            setCopySuccess(msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            setCopySuccess("Failed!");
        }
        document.body.removeChild(textarea); // Clean up
        setTimeout(() => setCopySuccess(''), 2000); // Reset message after 2 seconds
    };

    const copyToClipboard = () => {
        if (!navigator.clipboard) {
            copyToClipboardFallback(shareUrl);
            return;
        }
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000); // Reset message after 2 seconds
        }, (err) => {
            console.error('Failed to copy: ', err);
            setCopySuccess("Failed!");
        });
    };

    // This function is called when the backdrop is clicked
    const closeShare = () => setIsShareVisible(false);

    return (
        <>
            {isShareVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-29" onClick={closeShare}></div> // Backdrop
            )}
            <div className="fixed top-[10vh] right-[10vw] z-30 min-w-screen">
                <button
                    className="bg-blue-500 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center opacity-75 hover:opacity-100"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent propagation to the backdrop
                        setIsShareVisible(!isShareVisible);
                    }}
                >
                    <img width="30" src="https://img.icons8.com/fluency-systems-regular/48/share--v1.png" alt="share--v1"/>
                </button>
                {isShareVisible && (
                    <div className="mt-4 p-4 bg-gray-600 rounded-lg shadow-lg text-center">
                        <p className="text-sm">Share this URL with your friends:</p>
                        <div className={"flex flex-col justify-center items-center"}>
                            <input
                                className="text-center p-2 border border-gray-300 rounded w-full my-2 text-black bg-gray-400 max-w-[180px]"
                                value={shareUrl}
                                readOnly
                            />
                            <button
                                className="bg-green-600 text-white font-bold py-1 px-4 rounded hover:bg-green-700"
                                onClick={copyToClipboard}
                            >
                                Copy Link
                            </button>
                        </div>
                        {copySuccess && <p className="text-green-500 mt-2">{copySuccess}</p>}
                    </div>
                )}
            </div>
        </>

    );
};

// use tanstack @https://qyvst5d5rh.execute-api.us-east-2.amazonaws.com/default/getTodaysGame
// https://s9c7abw9dj.execute-api.us-east-2.amazonaws.com/default/getGame?gameId=282