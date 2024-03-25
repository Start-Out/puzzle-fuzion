import { useSelector, useDispatch } from "react-redux";
import {
    getCursor,
    getGuesses,
    updateGuess,
    submitGuess,
    removeGuess,
    getWordleWord,
    updateResult
} from "../../redux/wordleSlice.js";
import {useEffect, useState} from "react";
import * as exports from "../../exports.js"
import {useQuery} from "@tanstack/react-query";

export default function Keyboard() {

    const dispatch = useDispatch()
    const guesses = useSelector(getGuesses)
    let cursor = useSelector(getCursor)
    const wordleWord = useSelector(getWordleWord)

    const [wordToCheck, setWordToCheck] = useState('')
    const [prevWord, setPrevWord] = useState("")
    const [queriedWord, setQueriedWord] = useState("")
    const [checkWord, setCheckWord] = useState(false);
    const [letterStatuses, setLetterStatuses] = useState({});
    const [gameDone, setGameDone] = useState(sessionStorage.getItem("game_done") || "")

    const [isAlert, setIsAlert] = useState(false)
    const [alertText, setAlertText] = useState("")

    const handleAlert = () => setIsAlert(prev => !prev)

    const handleClick = (letter, event) => {
        if (!gameDone || sessionStorage.getItem("game_done") === "true") {
            if (letter === "Enter") {
                handleSubmit()
                event.target.blur()
                return
            }
            else if (letter === "hla") {
                dispatch(removeGuess())
                event.target.blur()
                return
            }
            dispatch(updateGuess({letter: letter.toLowerCase()}))
            event.target.blur()
        }
    }


    const handleSubmit = () => {
        if (!gameDone || sessionStorage.getItem("game_done") === "true") {
            if (cursor.col === 4) {
                const word = guesses[cursor.row].join('');

                if (cursor.row > 0 && guesses[cursor.row-1].join('') === guesses[cursor.row].join('')) {
                    setAlertText("You entered the same word again!")
                    setIsAlert(true)
                }
                setWordToCheck(word)
                setCheckWord(true)
            }
            else {
                setAlertText("Please enter five letter to guess!")
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

            // Check if any modifier key is pressed
            const isModifierKey = event.ctrlKey || event.altKey || event.shiftKey || event.metaKey;
            if (isModifierKey) {
                return;
            }

            if (!gameDone || sessionStorage.getItem("game_done") === "true") {
                if (event.key === 'Enter') {
                    handleSubmit();
                }
                else if (event.key >= 'a' && event.key <= 'z') {
                    dispatch(updateGuess({letter: event.key.toLowerCase()}))
                }
                else if (event.key === 'Backspace') {
                    dispatch(removeGuess())
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [cursor, gameDone]);


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

            if (data[0] && data[0].meanings.length > 0 && !gameDone
                && sessionStorage.getItem("game_done") !== "true" && prevWord !== wordToCheck) {
                setPrevWord(wordToCheck)

                // analyzeWord
                const result = analyzeWord(wordToCheck, wordleWord)
                // save the guess to store
                dispatch(submitGuess());
                dispatch(updateResult({
                    row: cursor.row,
                    result: result
                }))
                updateLetterStatuses(result, wordToCheck)

                if (result.every(value => value === 'correct') && !gameDone && sessionStorage.getItem("game_done") !== "true") {
                    setGameDone(true)
                    setAlertText(`Great job! The word was indeed '${wordleWord}'` )
                    sessionStorage.setItem("game_done", "true")
                }
                else if(cursor.row === 5) {
                    setGameDone(true)
                    setAlertText(`:( You ran out of attempts! The word was '${wordleWord}'`)
                    sessionStorage.setItem("game_done", "true")
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
            // Check if the letter status is 'correct' in the current or new results,
            // or if it's 'present' and not already marked 'correct'.
            if ((status === 'correct') || (status === 'present' && newStatuses[char.toUpperCase()] !== 'correct')) {
                newStatuses[char.toUpperCase()] = status;
            }
            // If the letter is absent and not already marked, update it.
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

    return (
        <>
            <div className={"flex flex-col items-center justify-center gap-2 p-4 mx-auto max-h-[100%]"}>
                {keyboard_keys.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-2 max-w-[90vw] md:max-w-[50vw] ">
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
                                    disabled={gameDone || sessionStorage.getItem("game_done") === "true"}
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
            {isAlert && <exports.InfoAlert text={alertText} toggle={handleAlert} />}
            {(sessionStorage.getItem("game_done") === "true") && gameDone
                && <exports.GameCompleteAlert text={alertText || "You have already used your attempt for today!"} />}
        </>
    )
}

// Responsive button classes
const buttonBaseClasses = "bg-pf-keyboard-background hover:bg-gray-400 " +
    "text-pf-light-text font-bold " +
    "rounded shadow " +
    "h-[7vh] select-none "
const defaultButtonClasses = "w-[7.7vw] md:w-[4vw] ";
const enterButtonClasses = "w-[13vw] p-1 text-[1rem] md:w-[6vw] ";
const backButtonClasses = "w-[10vw] p-1 md:w-[5vw] md:p-2 ";

const keyboard_keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'hla']
]

const analyzeWord = (word, wordleWord) => {
    let result = [];

    // Convert wordleWord into an array to manipulate its characters
    let wordleChars = wordleWord.split('');

    word.split('').forEach((char, index) => {
        if (wordleChars[index] === char) {
            result.push('correct');
        } else if (wordleChars.includes(char)) {
            result.push('present');
        } else {
            result.push('absent');
        }
    });

    return result
};