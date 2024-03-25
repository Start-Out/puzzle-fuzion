import { createBrowserRouter, RouterProvider, ScrollRestoration } from "react-router-dom";
import * as exports from "./exports.js";
import "./index.css"

const router = createBrowserRouter( [
    {
        path: "/",
        element: (
            <> <ScrollRestoration /> <exports.Navbar /> </>
        ),
        errorElement: <exports.NotFound />,
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
            className={"bg-gradient-to-b from-gray-800 to-gray-900 text-pf-light-text min-h-[100vh] flex flex-col"}
        >
            <RouterProvider router={router}/>
        </main>
    );
};
