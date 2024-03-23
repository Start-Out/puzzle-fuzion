import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

import {Provider} from "react-redux";
import {store} from "./redux/store.js";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const queryClient = new QueryClient()
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ConvexProvider client={convex}>
                <Provider store={store}>
                    <App />
                </Provider>
            </ConvexProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
