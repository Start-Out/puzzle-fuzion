import { useDispatch, useSelector } from "react-redux";
import {
    getAttempts,
    getBoard,
    getSelection, resetSelection,
    shuffleStartingBoard, updateAttempts,
    updateProgress
} from "../../redux/connectionSlice.js";
import {useState} from "react";
import * as exports from "../../exports.js";

const Button = ( {value, onClick} ) => {
    return (
        <button
            className={"bg-gray-700 py-3 px-5 " +
                "rounded-[5px] " +
                "hover:bg-pf-connection-select hover:text-black select-none"}
            onClick={onClick}
        >{value}</button>
    )
}

export default function ControlCenter() {
    const dispatch = useDispatch()
    const selection = useSelector(getSelection)
    const board = useSelector(getBoard)

    const attemptsLeft = useSelector(getAttempts)

    const [isAlert, setIsAlert] = useState(false)
    const [alertText, setAlertText] = useState("")
    const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
    const [showIncorrectIndicator, setShowIncorrectIndicator] = useState(false)
    const [showOneAwayIndicator, setShowOneAwayIndicator] = useState(false)

    const handleAlert = () => setIsAlert(prev => !prev)

    const handleSuccessIndicator = () => {
        setShowSuccessIndicator(true);
        setTimeout(() => {
            setShowSuccessIndicator(false);
        }, 1500); // Auto-hide after 1 second
    };

    const handleIncorrectIndicator = () => {
        setShowIncorrectIndicator(true);
        setTimeout(() => {
            setShowIncorrectIndicator(false);
        }, 1500); // Auto-hide after 1 second
    };

    const handleOneAwayIndicator = () => {
        setShowOneAwayIndicator(true);
        setTimeout(() => {
            setShowOneAwayIndicator(false);
        }, 1500); // Auto-hide after 1 second
    };

    const handleSubmit = () => {
        if (attemptsLeft < 1) {
            setAlertText("You have ran out of attempts!")
            setIsAlert(true)
            return
        }

        if (selection.length < 4) {
            setAlertText("You must choose at least four words!")
            setIsAlert(true)
            return
        }

        const result = analyze(selection, board)

        if (result.matchType === 1) {
            // handle the correct scenario
            dispatch(updateProgress({
                level: result.level,
                progress: selection
            }))
            handleSuccessIndicator()
        }
        else if (result.matchType === 0) {
            dispatch(updateAttempts())
            handleOneAwayIndicator()
        }
        else {
            dispatch(updateAttempts())
            handleIncorrectIndicator()
        }
    }

    const handleShuffle = () => {
        dispatch(shuffleStartingBoard())
    }

    const handleDeselection = () => {
        dispatch(resetSelection())
    }

    return (
        <>
            <div className={"flex flex-row gap-5 justify-center items-center "}>
                <Button value={"Shuffle"} onClick={handleShuffle}/>
                <Button value={"Deselect All"} onClick={handleDeselection}/>
                <Button value={"Submit"} onClick={handleSubmit}/>
            </div>
            {
                isAlert && <exports.InfoAlert text={alertText} toggle={handleAlert} />
            }
            {
                showSuccessIndicator &&
                <exports.ConnectionIndicator text={"Correct!"}/>
            }
            {
                showOneAwayIndicator &&
                <exports.ConnectionIndicator text={"One away!"}/>
            }
            {
                showIncorrectIndicator &&
                <exports.ConnectionIndicator text={"Incorrect!"}/>
            }
        </>
    )
}

const analyze = (selection, board) => {
    let matchResult = { matchType: -1, category: null, level: null };

    // Convert user selection to uppercase for case-insensitive comparison
    const userSelectionUpper = selection.map(word => word.toUpperCase());

    Object.entries(board).forEach(([category, details]) => {
        const { members, level } = details; // Extract level here
        // Convert members to uppercase for case-insensitive comparison
        const membersUpper = members.map(word => word.toUpperCase());

        const matchCount = membersUpper.filter(word => userSelectionUpper.includes(word)).length;

        if (matchCount === members.length) {
            matchResult = { matchType: 1, category: category, level: level }; // Exact match found, include level
        } else if (matchCount === members.length - 1 && matchResult.matchType !== 1) {
            matchResult = { matchType: 0, category: category, level: level }; // Near match found, include level
        }
    });

    return matchResult;
};
