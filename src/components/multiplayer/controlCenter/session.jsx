import {useState} from "react";

export default function Session( {toggle} ) {
    const [anonGameSession, setAnonGameSession] = useState("")
    const [gameId, setGameId] = useState(() => sessionStorage.getItem('gameId') || "");

    const handleJoinSession = () => {
        sessionStorage.setItem("gameId", anonGameSession)
        setGameId(anonGameSession)
        window.location.reload()
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(gameId).then(() => {
            // Optionally, notify the user that the code was copied successfully
            alert('Invitation code copied to clipboard.');
        });
    };

    return (
        <div className={""}>
            <div className="fixed inset-0 bg-black min-h-screen bg-opacity-50 " ></div>
            <div className={"fixed inset-0 flex justify-center items-center"} onClick={() => toggle()}>
                <div className={"bg-gray-800 rounded-md"}
                     onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-lg mb-4 flex items-center space-x-2">
                        <div className="bg-gray-700 border border-gray-600 rounded-md px-2 max-w-xs overflow-hidden text-ellipsis">
                            Invitation code: <span className="font-bold">{gameId}</span>
                        </div>
                        <button onClick={copyToClipboard} className="bg-green-600 hover:bg-green-700 rounded-md shadow px-2 py-1">
                            Copy
                        </button>
                    </div>
                    <div className="space-y-2">
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={anonGameSession}
                            onChange={(e) => setAnonGameSession(e.target.value)}
                            placeholder="Enter session ID"
                        />
                        <button onClick={handleJoinSession} className="w-full bg-blue-600 hover:bg-blue-700 rounded-md shadow py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
                            Join Game
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}