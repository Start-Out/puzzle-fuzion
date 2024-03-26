import * as exports from "../../exports.js"
import {useNavigate} from "react-router-dom";

export default function SettingsAlert({ text, toggle }) {

    const common_styles = "px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-opacity-50"
    const okay_button = "bg-blue-600 hover:bg-blue-700  " + common_styles + " focus:ring-blue-400"
    const cancel_button = "bg-red-700 hover:bg-red-800 text-white " + common_styles + " focus:ring-red-400"

    const navigate = useNavigate()

    const handleNavigate = () => navigate("/connections")

    return (
        <>
            <exports.Backdrop />
            <div className="fixed inset-0 flex justify-center items-center" onClick={() => toggle()}>
                <div className="p-6 rounded-lg shadow-lg bg-gray-200 w-[80vw] md:w-[30vw] text-center"
                     onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-lg font-semibold text-pf-dark-text mb-4 ">ALERT!</h2>
                    <p className="text-pf-dark-text mb-6">{text}</p>
                    <div className="flex justify-center gap-5">
                        <button className={okay_button} onClick={handleNavigate} >
                            Proceed
                        </button>
                        <button className={cancel_button} onClick={() => toggle()} >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
