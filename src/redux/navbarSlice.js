import {createSlice} from "@reduxjs/toolkit";

const navbarSlice = createSlice({
    name: "navbar",
    initialState: { open: false},
    reducers: {
        toggleNav(state) {
            state.open = !state.open
        },
    },
    selectors: {
        getNavbarOpen: (state) => state.open
    }
})

export default navbarSlice.reducer
export const { toggleNav } = navbarSlice.actions
export const { getNavbarOpen } = navbarSlice.selectors
