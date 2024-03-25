import { useQuery as convexQuery } from "convex/react";
import { api } from "/convex/_generated/api"
import {useState, useEffect } from "react";
import * as exports from '../../exports.js'

export default function Multiplayer() {
    const [userId, setUserId] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect( () => {
        const userIdFromSession = sessionStorage.getItem('userId');
        if (userIdFromSession) {
            setUserId(userIdFromSession)
            console.log("from session storage, uid: ", userIdFromSession)
        }

        setTimeout( () => {
            setIsLoading(false)
        }, 1000)

    }, [])

    const user = convexQuery(api.users.getUser, {
        _id: `${userId}`
    })

    return (
        <div className={"flex flex-col items-center justify-center min-h-[95vh] min-w-screen"}>
            {
                isLoading ? <exports.Loading text={"Loading..."} /> : (
                    !user ? <exports.Login /> : <exports.MultiplayerWordle userId={userId} />
                )
            }
        </div>
    );
}