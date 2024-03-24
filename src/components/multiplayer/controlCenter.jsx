import * as exports from "../../exports.js";
import {useState} from "react";

const Button = ( {value, toggle} ) => {

    return (
        <button onClick={() => toggle()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            {value}
        </button>
    )
}
export default function ControlCenter( {setLoading} ) {
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
                        <Button value={"Session"} toggle={toggleSession} />
                        { sessionVisible && <exports.Session toggle={toggleSession}/> }
                    </div>

                    <div className=""><exports.Restart /></div>

                    <div className="">
                        <Button value={"Chat"} toggle={toggleChatbox} />
                        { chatboxVisible &&
                            <exports.ChatBox toggleLoading={(setThis) => setLoading(setThis)}
                                toggle={toggleChatbox}
                            />
                        }
                    </div>
                </div>

            </div>
        </>
    )
}