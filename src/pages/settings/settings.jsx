import { useState } from 'react';
import {useDispatch} from "react-redux";
import {setAttempts} from "../../redux/connectionSlice.js";

export default function Settings() {
    const [mistakesAllowed, setMistakesAllowed] = useState(0); // Default to 0

    // Update the mistakesAllowed state based on the input
    const handleChange = (event) => {
        setMistakesAllowed(event.target.value);
    };

    const dispatch = useDispatch()

    // Save the settings
    const saveSettings = () => {
        console.log("Saving settings:", mistakesAllowed);
        // Save logic goes here
        dispatch(setAttempts({
            attempts: mistakesAllowed
        }))
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-800">
            <div className="w-full max-w-md mx-auto my-10 p-8 border border-gray-200 shadow-2xl rounded-lg bg-gray-700 text-white">
                <h2 className="text-3xl font-bold text-center mb-6">Settings</h2>
                <div className="bg-gray-600 p-4 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold mb-4 text-gray-100 text-center">Connections Game</h3>
                    <div className="flex flex-col space-y-4">
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
                                value={mistakesAllowed}
                                onChange={handleChange}
                                className="mt-1 block w-2/5 p-2 text-lg text-gray-700 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                        </div>
                    </div>
                </div>
                <button
                    onClick={saveSettings}
                    className="mt-8 w-full py-3 px-4 border border-transparent text-lg font-semibold rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
}
