import { createSlice } from "@reduxjs/toolkit";

const initial_guess_state = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
]

const result = {
    0: ["", "", "", "", ""],
    1: ["", "", "", "", ""],
    2: ["", "", "", "", ""],
    3: ["", "", "", "", ""],
    4: ["", "", "", "", ""],
    5: ["", "", "", "", ""]
}

const wordleSlice = createSlice({
    name: "wordle",
    initialState: { guesses: initial_guess_state, cursor: {row: 0, col: -1}, wordleWord: '', result: result },
    reducers: {
        updateGuess(state, action) {
            if (state.cursor.col < 4) {
                state.cursor.col += 1
                state.guesses[state.cursor.row][state.cursor.col] = action.payload.letter
            }
        },
        removeGuess(state) {
            if (state.cursor.col > -1 && state.cursor.row !== 6) {
                state.cursor.col -= 1
                state.guesses[state.cursor.row][state.cursor.col+1] = ""
            }
        },
        submitGuess(state) {
            if (state.cursor.row < 6 && state.cursor.col === 4) {
                state.cursor.row += 1
                state.cursor.col = -1
            }
        },
        resetState(state) {
            state.guesses = initial_guess_state
            state.cursor = {row: 0, col: -1}
        },
        setWordleWord(state, action) {
            state.wordleWord = action.payload.word
        },
        updateResult(state, action) {
            state.result[action.payload.row] = action.payload.result
        }
    },
    selectors: {
        getGuesses: (state) => state.guesses,
        getCursor: (state) => state.cursor,
        getWordleWord: (state) => state.wordleWord,
        getStatuses: (state) => state.result
    }
})

export default wordleSlice.reducer
export const { updateGuess, removeGuess, submitGuess, resetState, setWordleWord, updateResult } = wordleSlice.actions
export const { getGuesses, getCursor, getWordleWord, getStatuses } = wordleSlice.selectors