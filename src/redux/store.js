import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "./themeSlice.js"
import wordleReducer from "./wordleSlice.js";
import connectionReducer from "./connectionSlice.js"
import createReducer from "./createSlice.js"
import navbarReducer from "./navbarSlice.js"

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        wordle: wordleReducer,
        connections: connectionReducer,
        create: createReducer,
        navbar: navbarReducer
    }
})

store.subscribe( () => {
    console.log("== store: ", store.getState())
})