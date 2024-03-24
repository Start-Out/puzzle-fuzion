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

export default function Wordle ( {userId} ) {
    const [wordle, setWordle] = useState({day: '', word: ''});
    const performMyAction = useAction(api.action.getWord);
    const data = convexQuery(api.wordle.get)

    const [gameId, setGameId] = useState(() => sessionStorage.getItem('gameId') || "");
    const [run, setRun] = useState(false)

    const createGame = useMutation(api.games.createGame)
    const gameDetails = convexQuery(api.games.getGame, { _id: gameId });

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
            .catch((error) => alert(`Backend error: ${error}`));

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

    return (
        <div className={"flex flex-col justify-center items-center overflow-y-hidden " +
            "text-white"}>
            <div className="hidden sm:block text-4xl md:text-5xl font-bold mb-10 select-none">Multiplayer</div>
            <div className="wordle-content mt-8 flex flex-col items-center space-y-4">
                <exports.MultiplayerControlCenter />
                <exports.MultiplayerInput gameId={gameId}/>
                <exports.MultiplayerKeyboard gameId={gameId}/>
            </div>
        </div>
    );
}