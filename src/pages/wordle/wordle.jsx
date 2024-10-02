import { useQuery as convexQuery, useAction } from "convex/react";
import { api } from "/convex/_generated/api"
import {useEffect, useState} from "react";
import * as exports from "../../exports.js"
import {useDispatch} from "react-redux";
import {setWordleWord} from "../../redux/wordleSlice.js";
import moment from "moment-timezone";

export default function Wordle () {
    const performMyAction = useAction(api.action.getWord);
    const data = convexQuery(api.wordle.get)
    const dispatch = useDispatch()
    const [isAlert, setIsAlert] = useState(false)
    const [alertText, setAlertText] = useState("")

    const handleToggle = () => setIsAlert(prev => !prev)

    useEffect( () => {
        if (!data) {
            performMyAction()
                .catch((error) => console.error("Convex action error: ", error));
        }
        sessionStorage.setItem("wordle_play", "true")
    }, [])

    useEffect(() => {
        if (data) {
            // Ensure data is loaded
            const localDate = new Date().toLocaleDateString('en-CA');
            const localWordEntry = data.find(entry => entry.day === localDate);

            if (localWordEntry) {
                dispatch(setWordleWord({
                    word: localWordEntry.word
                }))
            }
            else {
                if (sessionStorage.getItem("wordle_play") !== "true") {
                    setIsAlert(true)
                    setAlertText("Permission denied to obtain local timezone, using system default timezone: America/Los_Angeles (PST)")
                }
                const pstDate = moment().tz('America/Los_Angeles').format('YYYY-MM-DD');
                const localWordEntry = data.find(entry => entry.day === pstDate);
                if (!localWordEntry) {
                    setIsAlert(true)
                    setAlertText("Error fetching today's wordle word!")
                } else {
                    dispatch(setWordleWord({
                        word: localWordEntry.word
                    }));
                }
            }
        }
    }, [data]);

    return (
        <>
            <div className="flex flex-col justify-center items-center p-4 mt-[7vh]">
                <div className={"text-4xl md:text-5xl font-bold text-gray-300 mb-10 cursor-default select-none"}>
                    Wordle</div>
                <div className={"wordle-content max-h-[70vh]"}>
                    <exports.Input />
                    <exports.Keyboard />
                </div>
            </div>
            {
                isAlert && <exports.InfoAlert
                toggle={handleToggle}
                text={alertText}
            />}
        </>
    );
}