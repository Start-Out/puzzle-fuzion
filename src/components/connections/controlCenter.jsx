import { useDispatch, useSelector } from "react-redux";
import {
    getAttempts,
    getBoard,
    getSelection, resetSelection,
    shuffleStartingBoard, updateAttempts,
    updateProgress
} from "../../redux/connectionSlice.js";

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

    const handleSubmit = () => {
        if (attemptsLeft === 0) {
            alert("You have ran out of attempts!")
            return
        }

        if (selection.length < 4) {
            alert("You must at least four words!")
            return
        }
        // call analyzeFunction
        const result = analyze(selection, board)

        if (result.matchType === 1) {
            // handle the correct scenario
            dispatch(updateProgress({
                level: result.level,
                progress: selection
            }))
            alert(`Correct! ${result.category}`)
        }
        else if (result.matchType === 0) {
            alert("One away!")
            dispatch(updateAttempts())
        }
        else {
            alert("Incorrect")
            dispatch(updateAttempts())
        }
    }

    const handleShuffle = () => {
        dispatch(shuffleStartingBoard())
    }

    const handleDeselection = () => {
        console.log("deselect all")
        dispatch(resetSelection())
    }

    return (
        <div className={"flex flex-row gap-5 justify-center items-center "}>
            <Button value={"Shuffle"} onClick={handleShuffle}/>
            <Button value={"Deselect All"} onClick={handleDeselection}/>
            <Button value={"Submit"} onClick={handleSubmit}/>
        </div>
    )
}

const analyze = (selection, board) => {
    console.log("analyzing..: ", selection, " vs. ", board);
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
