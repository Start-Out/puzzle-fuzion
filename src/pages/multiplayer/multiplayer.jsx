import { useQuery as convexQuery } from "convex/react";
import { api } from "/convex/_generated/api"
import {useState, useEffect } from "react";
import * as exports from '../../exports.js'

export default function Multiplayer() {
    const [userId, setUserId] = useState("")
    const [loading, setLoading] = useState(true)


    useEffect( () => {
        const userIdFromSession = sessionStorage.getItem('userId');
        if (userIdFromSession) {
            setUserId(userIdFromSession)
            console.log("from session storage, uid: ", userIdFromSession)
        }
    }, [])

    const user = convexQuery(api.users.getUser, {
        _id: `${userId}`
    })

    useEffect( () => {
        setLoading(false)
    }, [user])



    return (
        <div className={"flex flex-col items-center justify-center min-h-[95vh] min-w-screen"}>
            {
                loading ? <exports.Loading /> :
                user !== null ? <exports.MultiplayerWordle userId={userId} setLoading={setLoading}/> : <exports.Login />
            }
        </div>
    );
}