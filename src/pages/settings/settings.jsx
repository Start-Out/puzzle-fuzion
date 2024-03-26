import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getAttempts, setAttempts} from "../../redux/connectionSlice.js";
import { NavLink } from "react-router-dom";
import * as exports from "../../exports.js"

export default function Settings() {
    const [mistake, setMistake] = useState(0);
    const dispatch = useDispatch();
    const mistakesAllowed = useSelector(getAttempts)
    const [isAlert, setIsAlert] = useState(false)
    const [alertText, setAlertText] = useState("")

    const handleAlert = () => setIsAlert(prev => !prev)

    const handleChange = (event) => {
        // const value = Math.max(0, Math.min(100, Number(event.target.value)));
        const value = Number(event.target.value)
        setMistake(value);
    };

    const saveSettings = () => {
        if (mistake >= 0 && mistake <= 100) {
            dispatch(setAttempts({ attempts: mistake }));
            setAlertText("Settings for Connections saved successfully!")
            setIsAlert(true)
        }
    };

    useEffect( () => {
        setMistake(mistakesAllowed)
    }, [])

    return (
        <>
            <div className="min-h-screen flex justify-center items-center bg-gray-800">
                <div className="w-full max-w-lg mx-auto my-10 p-8 bg-gray-700 text-white rounded-lg shadow-2xl">
                    <h2 className="text-3xl font-bold text-center mb-6">Game Settings</h2>

                    {/* Connections Game Settings */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-100 py-5">Connections</h3>
                        <div className="bg-gray-600 p-4 rounded-lg shadow-inner">
                            <div className="flex justify-between items-center">
                                <label htmlFor="mistakesAllowed" className="block text-lg font-medium text-gray-200">
                                    Mistakes Allowed:
                                </label>
                                <input
                                    type="number"
                                    id="mistakesAllowed"
                                    name="mistakesAllowed"
                                    min="0"
                                    max="100"
                                    value={mistake}
                                    onChange={handleChange}
                                    className={"mt-1 block w-2/5 p-2 text-lg text-gray-700 " +
                                        "border border-gray-300 rounded-md shadow-sm"}
                                />
                            </div>
                            <button
                                onClick={saveSettings}
                                className={"mt-4 w-full py-3 px-4 text-lg font-semibold " +
                                    "rounded-md text-white bg-green-600 hover:bg-green-700"}
                            >
                                Save Connections Settings
                            </button>
                        </div>
                    </div>

                    {/* More games settings can be added here in the future */}
                </div>
            </div>
            {isAlert && <exports.SettingsAlert text={alertText} toggle={handleAlert} />}
        </>
    );
}
