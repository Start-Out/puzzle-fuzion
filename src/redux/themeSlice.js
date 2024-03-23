import {createSlice} from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name: "theme",
    initialState: { theme_dark: false},
    reducers: {
        toggleTheme(state, action) {
            state.theme_dark = !state.theme_dark
        }
    },
    selectors: {
        getTheme(selectSlice) {
            return selectSlice.theme_dark
        }
    }
})

export default themeSlice.reducer
export const { toggleTheme } = themeSlice.actions
export const { getTheme } = themeSlice.selectors