import {useDispatch, useSelector} from "react-redux";
import {getProgress, getSelection, removeSelection, updateSelection} from "../../redux/connectionSlice.js";
import {useState} from "react";
import * as exports from "../../exports.js"

export default function WordBox( {word, correct, level, category, listOfWords} ) {
    const dispatch = useDispatch()
    const selection = useSelector(getSelection)
    const progress = useSelector(getProgress)
    const [isAlert, setIsAlert] = useState(false)
    const [alertText, setAlertText] = useState("")

    const handleAlert = () => setIsAlert(prev => !prev)

    const handleClick = (word) => {
        // check if the selection exists, if it does, deselect it
        if (selection.find(w => w === word)) {
            dispatch(removeSelection({
                word: word
            }))
            return
        }


        if (selection.length > 3) {
            setAlertText("You have already chosen 4 words!")
            setIsAlert(true)
            return
        }
        dispatch(updateSelection({
            word: word
        }))

    }

    return (
        <>
            {
                !correct ?
                <>
                    <button className={"bg-gray-600 h-[70px] " +
                        "w-1/5 " +
                        "border-2 rounded " +
                        "flex justify-center items-center " +
                        "hover:bg-gray-700 select-none cursor-pointer " +
                        "text-[0.7rem] md:text-[1rem]"}

                         onClick={() => handleClick(word)}
                         style={{
                             backgroundColor: `${getWordColor(progress, word) ? getWordColor(progress, word) 
                                 : selection.includes(word) ? '#EFEFE6' : ''}`,
                             color: `${getWordColor(progress, word) ? 'black' : selection.includes(word) ? 'black' : 'white'}`
                         }}
                            disabled={ !!getWordColor(progress, word)}
                    >
                        {word}
                    </button>
                </> : (
                <>
                    <div className={"bg-gray-600 h-[70px] " +
                        "w-[85vw] sm:w-[86%] " +
                        " rounded w-full " +
                        "flex flex-col justify-center items-center " +
                        "select-none cursor-pointer"}
                            style={{
                                backgroundColor: `${getWordColor(null, null, correct, level)}`,
                                color: `black`
                            }}
                    >
                        <div className={"font-bold text-[1.3rem] md:text-[1.6rem]"}>
                            {category}
                        </div>
                        <div className={"text-[0.9rem] sm:text-[1.2rem] italic"}>
                            {listOfWords}
                        </div>
                    </div>
                </>
                )

            }
            { isAlert && <exports.InfoAlert text={alertText} toggle={handleAlert}/> }
        </>
    )
}

function getWordColor(progress, word, correct, level) {
    // Define a mapping of levels to colors
    const levelColors = {
        0: 'rgba(255,235,59,0.80)', // yellow
        1: 'rgba(76,175,80,0.80)', // green
        2: 'rgba(33,150,243,0.80)', // blue
        3: 'rgba(244,67,54,0.80)', // red
    };

    if (correct) {
        return levelColors[level]
    }
    // Iterate through each level in progress
    for (const [level, wordsArray] of Object.entries(progress)) {
        // Check if the word is included in the current level's array
        if (wordsArray) {
            if (wordsArray.includes(word)) {
                // Return the color associated with this level
                return levelColors[level];
            }
        }
    }

    // If the word was not found in any level, return false
    return false;
}