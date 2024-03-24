import * as exports from "../../exports.js";
import {useState} from "react";

export default function ControlCenter( {setLoading} ) {
    const [chatboxVisible, setChatboxVisible] = useState(false)

    const toggleChatbox = () => setChatboxVisible(prev => !prev)

    return (
        <>
            {   // backdrop
                chatboxVisible && (
                    <div className="fixed inset-0 bg-black min-h-screen bg-opacity-50 z-10"
                         onClick={toggleChatbox}></div>
                )
            }
            <div className="absolute top-[10vh] right-0 p-4 z-20">
                <button onClick={toggleChatbox} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    Chat
                </button>
                {chatboxVisible && <exports.ChatBox toggleLoading={(setThis) => setLoading(setThis)} />}
            </div>
        </>
    )
}