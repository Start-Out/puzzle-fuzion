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
            <div className={"p-4 z-20"}>
                <div className={"flex flex-row gap-2"}>
                    <div>
                        <Button value={"Session"} toggle={toggleSession} color={"purple"}/>
                        { sessionVisible && <exports.Session toggle={toggleSession}/> }
                    </div>

                    <div>
                        <Button value={"Restart"} toggle={toggleRestart} color={"red"}/>
                        { restartVisible && <exports.Restart toggle={toggleRestart}/> }
                    </div>

                    <div>
                        <Button value={"Chat"} toggle={toggleChatbox} color={"blue"}/>
                        { chatboxVisible && <exports.ChatBox toggle={toggleChatbox} /> }
                    </div>
                </div>

            </div>
        </>
    )
}

const Button = ( {value, toggle, color} ) => {
    if (color === "red") {
        return (
            <button onClick={() => toggle()}
                    className={`bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full`}>
                {value}
            </button>
        )
    }
    return (
        <button onClick={() => toggle()}
                className={`bg-${color}-500 hover:bg-${color}-700 text-white font-bold py-2 px-4 rounded-full`}>
            {value}
        </button>
    )
}