import {useSelector} from "react-redux";
import {getAttempts} from "../../redux/connectionSlice.js";

export default function Mistakes() {
    const attempts = useSelector(getAttempts)

    if (attempts > 10) {
        return (
            <div>Mistakes: {attempts}</div>
        )
    }
    return (
        <div className={"flex flex-row gap-1 justify-center items-center select-none"}>
            <div>Mistakes:</div>
            {
                Array.from({ length: attempts }, (_, index) => (
                    <div key={index} className="w-3 h-3 bg-gray-400 rounded-full"></div>
                ))
            }
        </div>
    )
}