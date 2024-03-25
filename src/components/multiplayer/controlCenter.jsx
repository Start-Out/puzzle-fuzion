import * as exports from "../../exports.js";
import {useState} from "react";


export default function ControlCenter() {
    const [chatboxVisible, setChatboxVisible] = useState(false)
    const [restartVisible, setRestartVisible] = useState(false)
    const [sessionVisible, setSessionVisible] = useState(false)

    const toggleChatbox = () => setChatboxVisible(prev => !prev)
    const toggleRestart = () => setRestartVisible(prev => !prev)
    const toggleSession = () => setSessionVisible(prev => !prev)

    return (
        <>
            <div className={"p-4"}>
                <div className={"flex flex-row gap-2"}>
                    <div>
                        <Button value={"Join/Invite"} toggle={toggleSession} />
                        { sessionVisible && <exports.Session toggle={toggleSession}/> }
                    </div>

                    <div>
                        <Button value={"Restart"} toggle={toggleRestart} />
                        { restartVisible && <exports.Restart toggle={toggleRestart}/> }
                    </div>

                    <div>
                        <Button value={"Chat"} toggle={toggleChatbox} />
                        { chatboxVisible && <exports.ChatBox toggle={toggleChatbox} /> }
                    </div>
                </div>

            </div>
        </>
    )
}

const Button = ( {value, toggle} ) => {
    if (value === "Restart") {
        return (
            <button onClick={() => toggle()}
                    className={`bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full`}>
                {value}
            </button>
        )
    }
    else if (value === "Join/Invite") {
        return (
            <button onClick={() => toggle()}
                    className={`bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full`}>
                {value}
            </button>
        )
    }
    return (
        <button onClick={() => toggle()}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full`}>
            {value}
        </button>
    )
}