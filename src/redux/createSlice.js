import {createSlice} from "@reduxjs/toolkit";

const startingBoard = [
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
]

const createPageSlice = createSlice({
    name: "create",
    initialState: { startingBoard: startingBoard, board: {}, gameName: "", name: "", categories: {}, words: {
            0: ["", "", "", ""],
            1: ["", "", "", ""],
            2: ["", "", "", ""],
            3: ["", "", "", ""]
        }},
    reducers: {
        updateStartingBoard(state, action) {
            const {position, word} = action.payload

            // Assuming a 4x4 grid
            const gridSize = 4;
            const row = Math.floor(position / gridSize);
            const col = position % gridSize;

            // Update the board at the calculated row and column
            state.startingBoard[row][col] = word;
        },
        updateBoard(state, action) {
            state.board = action.payload.board
        },
        updateCategory(state, action) {
            const {level, categoryName} = action.payload

            state.categories[level] = categoryName
        },
        updateWords(state, action) {
            const {level, words, posIndex} = action.payload

            state.words[level][posIndex] = words
        },
        updateName(state, action) {
            state.name = action.payload.name
        },
        updateGameName(state, action) {
            state.gameName = action.payload.gameName
        },
        reset(state) {
            state.startingBoard = startingBoard
            state.board = {}
            state.gameName = ""
            state.name = ""
            state.categories = {}
            state.words = {
                0: ["", "", "", ""],
                1: ["", "", "", ""],
                2: ["", "", "", ""],
                3: ["", "", "", ""]
            }
        }
    },
    selectors: {
        getStartingBoard: (state) => state.startingBoard,
        getBoard: (state) => state.board,
        getGameName: (state) => state.gameName,
        getName: (state) => state.name,
        getCategories: (state) => state.categories,
        getWords: (state) => state.words
    }
})

export default createPageSlice.reducer
export const { updateStartingBoard, updateWords, updateCategory, updateName, updateGameName, updateBoard, reset } = createPageSlice.actions
export const { getStartingBoard, getGameName, getName, getCategories, getWords } = createPageSlice.selectors
