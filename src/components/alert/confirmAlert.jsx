import * as exports from "../../exports.js"

export default function ConfirmAlert({ text, onOk, onCancel }) {

    const common_styles = "px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-opacity-50"

    const okay_button = "bg-blue-500 hover:bg-blue-600  " + common_styles + " focus:ring-blue-400"

    const cancel_button = "bg-red-600 hover:bg-red-700 text-white " + common_styles + " focus:ring-red-400"

    return (
        <>
            <exports.Backdrop />
            <div className="fixed inset-0 flex justify-center items-center" onClick={() => onCancel()}>
                <div className="p-6 rounded-lg shadow-lg bg-gray-200 w-[80vw] md:w-[30vw] text-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-lg font-semibold text-pf-dark-text mb-4 ">ALERT!</h2>
                    <p className="text-pf-dark-text mb-6">{text}</p>
                    <div className="flex justify-center gap-5">
                        <button className={okay_button} onClick={() => onOk()} >
                            Yes
                        </button>
                        <button className={cancel_button} onClick={() => onCancel()} >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
