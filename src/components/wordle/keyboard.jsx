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
    const [gameDone, setGameDone] = useState(false)

    const handleClick = (letter, event) => {
        if (!gameDone) {
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
        if (!gameDone) {
            if (cursor.col === 4) {
                const word = guesses[cursor.row].join('');

                if (cursor.row > 0 && guesses[cursor.row-1].join('') === guesses[cursor.row].join('')) {
                    alert("You entered the same word again!")
                }
                setWordToCheck(word)
                setCheckWord(true)
            }
            else {
                alert("Please enter five letters to guess!")
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

            if (!gameDone) {
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
            console.log("wordToCheck: ", wordToCheck)
            console.log("queriedWord: ", queriedWord)

            if (wordToCheck === queriedWord) {
                return
            }

            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToCheck}`);
            if (!response.ok) {
                alert(`${wordToCheck} is an invalid word!`);
                setQueriedWord(wordToCheck)
                return
            }
            const data = await response.json()

            // console.log("data: ", data)
            setQueriedWord(data[0].word)

            if (data[0] && data[0].meanings.length > 0 && !gameDone && prevWord !== wordToCheck) {
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

                if (result.every(value => value === 'correct') && !gameDone) {
                    setGameDone(true)
                    alert("You guessed it right!");
                }
                else if(cursor.row === 5) {
                    alert(`You lost! The word was ${wordleWord}`)
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
            // Only update if the new status is "higher" or if the letter hasn't been added yet
            const status = result[index];
            if (status === 'correct' || status === 'present' && newStatuses[char] !== 'correct' || !newStatuses[char]) {
                newStatuses[char.toUpperCase()] = status;
            }
        });
        setLetterStatuses(newStatuses);
    };
    const checkBackground = (letter) => {
        const status = letterStatuses[letter];
        switch (status) {
            case 'correct':
                return '#38A169'; // green
            case 'present':
                return '#ED8936'; // amber
            case 'absent':
                return '#A0AEC0'; // cool gray
            default:
                return 'rgb(129,131,132)'; // default keyboard background
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
            // Correct character in the correct position
            result.push('correct');
            wordleChars[index] = null; // Mark this character as checked
        } else if (wordleChars.includes(char)) {
            // Correct character in the wrong position
            result.push('present');
            // Mark the first occurrence of this character as checked
            wordleChars[wordleChars.indexOf(char)] = null;
        } else {
            result.push('absent');
        }
    });

    console.log("final result: ", result)
    return result
};