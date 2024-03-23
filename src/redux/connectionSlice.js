import {createSlice} from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: "connections",
    initialState: { selection: [], board: {}, progress: {}, startingBoard: [[]], createdBy: "", gameName: "", attempts: 4 },
    reducers: {
        updateSelection(state, action) {
            state.selection.push(action.payload.word)
        },
        removeSelection(state, action) {
            const userWord = action.payload.word

            const index = state.selection.findIndex(word => word === userWord)

            if (index !== -1) {
                state.selection.splice(index, 1)
            }
        },
        setBoard(state, action) {
            state.board = action.payload.board
        },
        setStartingBoard(state, action) {
            state.startingBoard = action.payload.startingBoard
        },
        updateProgress(state, action) {
            const {level, progress} = action.payload
            state.progress[level] = progress
            state.selection = []

            // Flatten the startingBoard for easier manipulation
            let flattenedWords = state.startingBoard.flat();

            // Remove words that are in progress
            let filteredWords = flattenedWords.filter(word => !progress.includes(word) || word.includes('hla'));

            // Injecting the updated row at the earliest non-"hla" position
            const firstNonHlaIndex = state.startingBoard.findIndex(row => !row[0].includes("hla"));
            if (firstNonHlaIndex !== -1) {
                const categoryName = Object.keys(state.board).find(key => state.board[key].level === level);

                // Prepare the updated row
                const updatedRow = [`hla${firstNonHlaIndex}`, categoryName, progress.join(", "), level.toString()];
                const newArray = [...updatedRow]
                newArray.push(...filteredWords)

                filteredWords = newArray
            }

            // Reconstruct the startingBoard to its original shape
            const newStartingBoard = [];
            for (let i = 0; i < filteredWords.length; i += 4) {
                newStartingBoard.push(filteredWords.slice(i, i + 4));
            }

            state.startingBoard = newStartingBoard;

        },
        shuffleStartingBoard(state) {
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    // Generate random index
                    const j = Math.floor(Math.random() * (i + 1));
                    // Swap elements at indices i and j
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

            // Separate rows with "hla" and without "hla"
            const hlaRows = state.startingBoard.filter(row => row.some(word => word.includes("hla")));
            const nonHlaRows = state.startingBoard.filter(row => !row.some(word => word.includes("hla")));

            // Flatten the non-"hla" rows, shuffle, and then re-chunk them into 4x4 structure
            const flatNonHlaWords = nonHlaRows.flat();
            shuffleArray(flatNonHlaWords);
            let reshuffledNonHlaRows = [];
            for (let i = 0; i < flatNonHlaWords.length; i += 4) {
                reshuffledNonHlaRows.push(flatNonHlaWords.slice(i, i + 4));
            }

            // Update state with the new board configuration
            state.startingBoard = [...hlaRows, ...reshuffledNonHlaRows];
        },
        resetSelection(state) {
            state.selection = []
        },
        setCreator(state, action) {
            state.createdBy = action.payload.createdBy
        },
        setGameName(state, action) {
            state.gameName = action.payload.gameName
        },
        updateAttempts(state) {
            state.attempts = state.attempts - 1
        },
        setAttempts(state, action) {
            state.attempts = action.payload.attempts
        }
    },
    selectors: {
        getSelection: (state) => state.selection,
        getBoard: (state) => state.board,
        getProgress: (state) => state.progress,
        getStartingBoard: (state) => state.startingBoard,
        getCreator: (state) => state.createdBy,
        getGameName: (state) => state.gameName,
        getAttempts: (state) => state.attempts
    }
})

export default connectionSlice.reducer
export const { updateSelection, removeSelection, setBoard, updateProgress, setStartingBoard, shuffleStartingBoard, resetSelection, setCreator, setGameName, updateAttempts, setAttempts } = connectionSlice.actions
export const { getSelection, getBoard, getProgress, getStartingBoard, getCreator, getGameName, getAttempts } = connectionSlice.selectors