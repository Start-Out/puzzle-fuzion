import { useQuery as convexQuery } from "convex/react";
import { api } from "/convex/_generated/api"
import {useState, useEffect } from "react";
import * as exports from '../../exports.js'

export default function Multiplayer() {
    const [userId, setUserId] = useState("")
    const [loading, setLoading] = useState(true)
    const [chatboxVisible, setChatboxVisible] = useState(false)

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

    const toggleChatbox = () => setChatboxVisible(prev => !prev)

    return (
        <div className={"flex flex-col items-center justify-center min-h-[95vh] min-w-screen"}>
            {
                loading ?
                <exports.Loading /> :
                user !== null ?
                <>
                    {   // backdrop
                        chatboxVisible && (
                        <div className="fixed inset-0 bg-black min-h-screen bg-opacity-50 z-10" onClick={toggleChatbox}></div>
                    )}
                    <div className="absolute top-[10vh] right-0 p-4 z-20">
                        <button onClick={toggleChatbox} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                            Chat
                        </button>
                        {chatboxVisible && <exports.ChatBox toggleLoading={(setThis) => setLoading(setThis)} />}
                    </div>
                    <exports.MultiplayerWordle userId={userId} />
                </> :
                <>
                    <exports.Login />
                </>
            }
        </div>
    );
}