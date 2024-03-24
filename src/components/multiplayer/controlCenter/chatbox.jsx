import {api} from "../../../../convex/_generated/api.js";
import {useEffect, useRef, useState} from "react";
import { useQuery as convexQuery, useMutation } from "convex/react";

const PlayerMessage = ({ player, message }) => (
    <div className="flex flex-col items-start justify-start mb-7">
        <div className="mb-1 text-sm font-bold">{player}</div>
        <div className="max-w-[80%] border-b border-dashed">{message}</div>
    </div>
);

const YourMessage = ({ message }) => (
    <div className="flex flex-col items-end justify-end mb-4 pr-10">
        <div className="mb-1 text-sm font-bold text-white">You</div>
        <div className="max-w-[80%] border-b border-dashed">{message}</div>
    </div>
);

export default function ChatBox ( {toggle} ) {
    const [userName, setUserName] = useState("")
    const [userId, setUserId] = useState("")
    const [gameId, setGameId] = useState("")
    const [newMessageText, setNewMessageText] = useState("")

    const sendMessage = useMutation(api.messages.sendMessage)
    const messages = convexQuery(api.messages.getMessages, {gameId: gameId})

    useEffect( () => {
        const userIdFromSession = sessionStorage.getItem('userId');
        if (userIdFromSession) {
            setUserId(userIdFromSession)
            console.log("from session storage, uid: ", userIdFromSession)
        }

        const gameIdFromSession = sessionStorage.getItem('gameId');
        if (gameIdFromSession) {
            setGameId(gameIdFromSession)
            console.log("from session storage, gid: ", gameIdFromSession)
        }

    }, [gameId])

    const user = convexQuery(api.users.getUser, {
        _id: `${userId}`
    })

    useEffect( () => {
        if (user) {
            console.log("user: ", user.name)
            setUserName(user.name)
        }
    }, [user])



    const messagesEndRef = useRef()
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSendMessage = (e) => {
        const send = async () => {
            e.preventDefault();
            await sendMessage({
                userId: userId, gameId: gameId, sender: userName, body: newMessageText
            });
            setNewMessageText("");
        }
        send()
    }

    return (
        <>
            <div className="fixed inset-0 bg-black min-h-screen bg-opacity-50 "></div>
            <div className={"fixed inset-0 flex justify-center items-center "} onClick={() => toggle()}>
                <div className={"chat bg-gray-800 text-white rounded-lg shadow-lg " +
                    "flex flex-col justify-between max-w-md mx-auto my-4 z-60"}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 border-b border-gray-700">
                        <p>
                            Connected as <strong className="text-yellow-300">{userName}</strong>
                        </p>
                    </div>
                    <div className="h-[40vh] overflow-auto p-4 space-y-2">
                        {messages?.map((message) =>
                            message.sender === userName ? (
                                <YourMessage
                                    key={message._id}
                                    message={message.body}
                                />
                            ) : (
                                <PlayerMessage
                                    key={message._id}
                                    player={message.sender}
                                    message={message.body}
                                />
                            )
                        )}
                        <div ref={messagesEndRef} /> {/* Invisible element at the end of messages */}
                    </div>
                    <form onSubmit={handleSendMessage} className="flex items-center p-4 border-t border-gray-700">
                        <input
                            className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 mr-2"
                            value={newMessageText}
                            onChange={async (e) => {
                                const text = e.target.value;
                                setNewMessageText(text);
                            }}
                            placeholder="Write a message…"
                            type="text"
                        />
                        <button
                            type="submit"
                            disabled={!newMessageText}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}


