import { createBrowserRouter, RouterProvider, ScrollRestoration } from "react-router-dom";
import * as exports from "./exports.js";
import "./index.css"

const router = createBrowserRouter( [
    {
        path: "/",
        element: (
            <> <ScrollRestoration /> <exports.Navbar /> </>
        ),
        errorElement: ( <> <h1>404: Some Error Has Occurred</h1> </> ),
        children: [
            {
                path: "/",
                element: <exports.Home />
            },
            {
                path: "/wordle",
                element: <exports.Wordle />
            },
            {
                path: "/connections",
                element: <exports.Connections />,
                children: [
                    {
                        path: ":game_id",
                        element: <exports.Connections />
                    }
                ]
            },
            {
                path: "/multiplayer",
                element: <exports.Multiplayer />
            },
            {
                path: "/create",
                element: <exports.Create />
            },
            {
                path: "/settings",
                element: <exports.Settings />
            }
        ]
    }
])

export const App = () => {
    return (
        <main
            className={"bg-pf-dark-background text-pf-light-text min-h-screen flex flex-col overflow-hidden"}
        >
            <RouterProvider router={router}/>
        </main>
    );
};
