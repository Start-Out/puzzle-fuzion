import { useQuery as convexQuery, useAction } from "convex/react";
import { api } from "/convex/_generated/api"
import { useEffect, useState, useRef } from "react";
import * as exports from "../../exports.js"
import {useDispatch} from "react-redux";
import {setWordleWord} from "../../redux/wordleSlice.js";
import moment from "moment-timezone";

export default function Wordle () {
    const [wordle, setWordle] = useState({day: '', word: ''});
    const performMyAction = useAction(api.action.getWord);
    const data = convexQuery(api.wordle.get)
    const dispatch = useDispatch()

    console.log("initial data: ", data)

    useEffect( () => {
        async function callAction() {
            await performMyAction();
        }

        callAction()
            .catch((error) => console.log("ERROR: ", error));

    }, [])

    useEffect(() => {
        if (data) {
            // Ensure data is loaded
            const localDate = new Date().toLocaleDateString('en-CA');
            const localWordEntry = data.find(entry => entry.day === localDate);

            if (localWordEntry) {
                setWordle(localWordEntry);
                dispatch(setWordleWord({
                    word: localWordEntry.word
                }))
            }
            else {
                alert("Permission denied to obtain local timezone, using system default timezone: America/Los_Angeles (PST)")
                const pstDate = moment().tz('America/Los_Angeles').format('YYYY-MM-DD');
                const localWordEntry = data.find(entry => entry.day === pstDate);
                if (!localWordEntry) {
                    alert("No word entry found for today in PST timezone. Check data or defaults.");
                } else {
                    setWordle(localWordEntry);
                    dispatch(setWordleWord({
                        word: localWordEntry.word
                    }));
                }
            }
        }
    }, [data]);

    const containerRef = useRef(null);

    console.log("Guess word: ", wordle.word);
    return (
        <div ref={containerRef} className="flex flex-col justify-center items-center p-4 overflow-y-hidden">
            <div className={"sm:block text-4xl md:text-5xl font-bold text-gray-800 mb-10 cursor-default " +
                "select-none"}>Wordle</div>
            <div className={"wordle-content max-h-[70vh]"}>
                <exports.Input />
                <exports.Keyboard />
            </div>
        </div>
    );
}