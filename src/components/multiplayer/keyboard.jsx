import {useEffect, useState} from "react";
import * as exports from "../../exports.js"
import {useQuery} from "@tanstack/react-query";
import {useMutation, useQuery as convexQuery} from "convex/react"
import {api} from "../../../convex/_generated/api.js";

export default function Keyboard( {gameId} ) {
    const keyboard_keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'hla']
    ]

    const toggleGameDone = useMutation(api.games.toggleGameDone)
    const submitGuess = useMutation(api.games.submitGuess)
    const updateGuess = useMutation(api.games.updateGuess)
    const removeGuess = useMutation(api.games.removeGuess)
    const gameDetails = convexQuery(api.games.getGame, { _id: gameId });
    const [guesses, setGuesses] = useState([])


    const [wordToCheck, setWordToCheck] = useState('')
    const [prevWord, setPrevWord] = useState("")
    const [queriedWord, setQueriedWord] = useState("")
    const [checkWord, setCheckWord] = useState(false);
    const [letterStatuses, setLetterStatuses] = useState({});
    const [gameDone, setGameDone] = useState(false)

    const [cursor, setCursor] = useState([])
    const [wordleWord, setWordleWord] = useState("")

    const [isAlert, setIsAlert] = useState(false)
    const [alertText, setAlertText] = useState("")

    const handleAlert = () => setIsAlert(prev => !prev)

    let inputQueue = [];

    useEffect( () => {
        if (gameDetails) {
            setGuesses(() => {
                return gameDetails.guesses
            })
            setCursor(() => {
                return gameDetails.cursor
            })
            setWordleWord(() => {
                return gameDetails.word
            })
            setGameDone( () => {
                return gameDetails.gameDone
            })
        }
    }, [gameDetails])

    const handleClick = (letter, event) => {
        if (!gameDone) {
            if (letter === "Enter") {
                handleSubmit()
                event.target.blur()
                return
            }
            else if (letter === "hla") {
                removeGuess({ _id: gameId, cursor: cursor} )
                    .then(res => res ? true : alert("Something went wrong! Please try again : ("))

                event.target.blur()
                return
            }

            updateGuess({ _id: gameId, cursor: cursor, letter: letter.toLowerCase()} )
                .then(res => res ? true : alert("Something went wrong! Please try again : ("))

            event.target.blur()
        }
    }

    const handleSubmit = () => {
        if (!gameDone) {
            if (cursor[1] === 4) {
                const word = guesses[cursor[0]].join('');
                if (cursor[0] > 0 && guesses[cursor[0]-1].join('') === guesses[cursor[0]].join('')) {
                    setAlertText("You entered the same word again!")
                    setIsAlert(true)
                }
                setWordToCheck(word)
                setCheckWord(true)
            }
            else {
                setAlertText("Please enter five letters to guess!")
                setIsAlert(true)
            }
        }
    }

    // Listen for the Enter key press
    useEffect(() => {
        const handleKeyPress = (event) => {
            const tagName = document.activeElement.tagName.toLowerCase();
            if (tagName === 'input' || tagName === 'textarea') {
                return;
            }

            const isModifierKey = event.ctrlKey || event.altKey || event.shiftKey || event.metaKey;
            if (isModifierKey) {
                return;
            }

            if (!gameDone) {
                if (event.key === 'Enter') {
                    handleSubmit();
                }
                else if (event.key >= 'a' && event.key <= 'z') {
                    addToQueue( {gameId, cursor, letter: event.key.toLowerCase()} )
                }
                else if (event.key === 'Backspace') {
                    removeGuess({ _id: gameId, cursor: cursor} )
                        .then(res => res ? true : alert("Something went wrong! Please try again : ("))
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [cursor, gameDone]);


    const processQueue = () => {
        if (inputQueue.length === 0) return;

        const { gameId, cursor, letter } = inputQueue.shift();
        updateGuess({ _id: gameId, cursor: cursor, letter: letter.toLowerCase() })
            .then(res => {
                if (res) {
                    processQueue();
                } else {
                    alert("Calma! Too many request at a time to backend!");
                }
            });
    };

    const addToQueue = (input) => {
        inputQueue.push(input);
        if (inputQueue.length === 1) {
            // If the queue was empty before adding, start processing immediately
            processQueue();
        }
    };

    const {isLoading} = useQuery({
        queryKey: ["word", wordToCheck],
        queryFn: async () => {
            if (wordToCheck === queriedWord) {
                return
            }

            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToCheck}`);
            if (!response.ok) {
                setAlertText(`${wordToCheck} is an invalid word!`)
                setIsAlert(true)
                setQueriedWord(wordToCheck)
                return
            }
            const data = await response.json()

            setQueriedWord(data[0].word)

            if (data[0] && data[0].meanings.length > 0 && !gameDone && prevWord !== wordToCheck) {
                setPrevWord(wordToCheck)

                submitGuess({ _id: gameId, cursor: cursor, guess: wordToCheck} )
                    .then(result => {
                        updateLetterStatuses(result, wordToCheck)
                    })

                if (wordToCheck === wordleWord && !gameDone) {
                    // setGameDone(true)
                    toggleGameDone({ _id: gameId} )
                        .then(res => res ? true : alert("something went wrong!"))
                    setAlertText(`Great job! The word was indeed '${wordleWord}'` )
                    setGameDone(true)
                }
                else if(cursor[0] === 5) {
                    setAlertText(`You guys have ran out of attempts! The correct word was '${wordleWord}' :(`)
                    setGameDone(true)
                }
            }
            return data;
        },
        enabled: checkWord,
        onSettled: () => {
            setCheckWord(false);
        },
    });

    const updateLetterStatuses = (result, word) => {
        const newStatuses = {...letterStatuses};
        word.split('').forEach((char, index) => {
            const status = result[index];
            if ((status === 'correct') || (status === 'present' && newStatuses[char.toUpperCase()] !== 'correct')) {
                newStatuses[char.toUpperCase()] = status;
            }
            else if (status === 'absent' && !newStatuses[char.toUpperCase()]) {
                newStatuses[char.toUpperCase()] = status;
            }
        });
        setLetterStatuses(newStatuses);
    };
    const checkBackground = (letter) => {
        const status = letterStatuses[letter];
        switch (status) {
            case 'correct':
                return 'rgba(56,161,105,0.86)';
            case 'present':
                return 'rgba(237,137,54,0.84)';
            case 'absent':
                return '#414141';
            default:
                return 'rgb(140,140,140)'; // default keyboard background
        }
    };

    // Responsive button classes
    const buttonBaseClasses = "bg-pf-keyboard-background hover:bg-gray-400 " +
        "text-pf-light-text font-bold " +
        "rounded shadow " +
        "h-[6.7vh] select-none "
    const defaultButtonClasses = "w-[8vw] md:w-[4vw] text-[1.2rem] sm:text-[1.4rem]";
    const enterButtonClasses = "w-[13vw] p-1 text-[1rem] md:w-[6vw] ";
    const backButtonClasses = "w-[10vw] p-1 md:w-[5vw] md:p-2 ";

    return (
        <>
            <div className={"flex flex-col items-center justify-center gap-[6px] sm:gap-2 p-4 mx-auto max-h-[100%]"}>
                {keyboard_keys.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-[5px] sm:gap-2 max-w-[90vw] md:max-w-[50vw] ">
                        {row.map((letter, letterIndex) => {
                            return (
                                <button
                                    style={{ backgroundColor: checkBackground(letter)}}
                                    key={`${rowIndex}-${letterIndex}`}
                                    className={`${buttonBaseClasses}` +
                                        `${letter === "Enter" ?
                                            `${enterButtonClasses}` : letter === "hla" ?
                                                `${backButtonClasses}` : `${defaultButtonClasses}`} `}
                                    onClick={(event) => handleClick(letter, event)}
                                    disabled={gameDone}
                                >
                                    {
                                        letter === 'hla' ?
                                            <img src={exports.keyboard_dark_mode_backspace} alt={"backspace"} /> :
                                            letter
                                    }
                                </button>
                            )
                        })}
                    </div>
                ))}
            </div>
            {isLoading && <exports.Loading />}
            {isAlert && <exports.InfoAlert text={alertText} toggle={handleAlert}/>}
        </>
    )
}