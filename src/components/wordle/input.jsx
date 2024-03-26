import {useSelector} from "react-redux";
import {getGuesses, getStatuses} from "../../redux/wordleSlice.js";

function Box( {letter, status} ) {
    const backgroundColor = (status) => {
        switch (status) {
            case 'correct':
                return 'rgba(56,161,105,0.86)';
            case 'present':
                return 'rgba(237,137,54,0.84)';
            case 'absent':
                return '#414141';
            default:
                return 'transparent';
        }
    };
    return (
        <div
            style={{
                backgroundColor: backgroundColor(status),
                border: backgroundColor(status) !== 'transparent' && 'none',
                borderRadius: backgroundColor(status) !== 'transparent' && '5px'
            }}

            className={`w-[12vw] h-[12vw] sm:w-[8vw] sm:h-[8vw] md:w-[7vw] md:h-[7vw] lg:w-[4vw] lg:h-[4vw] 
                        border-2 border-gray-700 
                        flex items-center justify-center 
                        text-lg sm:text-xl md:text-3xl
                        font-bold text-white 
                        cursor-default select-none`}
            >
            {letter}
        </div>
    )
}

export default function Input() {
    const guesses = useSelector(getGuesses)
    const statuses = useSelector(getStatuses)

    return (
        <div className="flex justify-center w-[75%] sm:w-[50%] md:w-[80%] lg:w-[50%] max-h-[100%] mx-auto px-4">
            <div className="w-full max-w-4xl">
                {[...Array(6)].map((_, rowIndex) => (
                    <div key={rowIndex}
                         className="grid grid-cols-5 gap-[6px] mb-[6px] ">
                        {[...Array(5)].map((_, colIndex) => {
                            const letter = guesses[rowIndex][colIndex];
                            const status = statuses[rowIndex][colIndex];
                            return <Box key={`${rowIndex}-${colIndex}`} letter={letter} status={status}/>;
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}