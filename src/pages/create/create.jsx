import * as exports from "../../exports.js"
import {useState, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getStartingBoard, updateGameName, updateName} from "../../redux/createSlice.js";

export default function Create() {
    const dispatch = useDispatch()
    let startingBoard = useSelector(getStartingBoard)
    const [gameName, setGameName] = useState("")
    const [createdBy, setCreatedBy] = useState("")
    const [shuffledNumbers, setShuffledNumbers] = useState([])

    // scrollbar dynamic styling + setting posIndex for Cards
    const scrollRef = useRef()
    useEffect(() => {
        const handleMouseOver = () => {
            scrollRef.current.classList.add('scrollbar-style');
        };
        const handleMouseOut = () => {
            scrollRef.current.classList.remove('scrollbar-style');
        };

        const scrollDiv = scrollRef.current;
        scrollDiv.addEventListener('mouseover', handleMouseOver);
        scrollDiv.addEventListener('mouseout', handleMouseOut);


        // Create an array of numbers from 0 to 15
        const numbers = Array.from({ length: 16 }, (_, i) => i);

        // Fisher-Yates Shuffle Algorithm
        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Swap elements
            }
        }

        // Shuffle the array
        shuffleArray(numbers);
        setShuffledNumbers(numbers)

        startingBoard = [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]]
        return () => {
            scrollDiv.removeEventListener('mouseover', handleMouseOver);
            scrollDiv.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    const handleGameName = (e) => {
        const gameName = e.target.value
        setGameName(gameName)
        dispatch(updateGameName({
            gameName: gameName
        }))
    }

    const handleCreatedChange = (e) => {
        const name = e.target.value
        setCreatedBy(name)
        dispatch(updateName({
            name: name
        }))
    }

    return (
        <div className={"md:grid grid-cols-2 gap-10 p-5 "}>
            <div className={"md:overflow-auto md:max-h-[88vh] p-5 " +
                "bg-gray-700 rounded-lg shadow-lg " +
                "scrollbar-hide mx-auto"}
                 ref={scrollRef}
            >
                <div className={"flex flex-col justify-center items-center " +
                    "gap-4"}
                >
                    <input type={"text"} value={gameName} placeholder={"Game name..."}
                           className={class_game_created_input + ' text-[1.4rem]'}
                           onChange={(e) => handleGameName(e)}/>
                    <input type={"text"} value={createdBy} placeholder={"Created by..."}
                           className={class_game_created_input + ' text-[1.2rem] mb-10'}
                           onChange={(e) => handleCreatedChange(e)}/>
                </div>
                <div className={"grid grid-rows-4 gap-5"}>
                    <exports.CategoryCard
                        posIndex={shuffledNumbers.slice(0, 4)}
                        level={0} category={"Fruits"} clues={["Mango", "Lychee", "Apple", "Jackfruit"]}/>
                    <exports.CategoryCard
                        posIndex={shuffledNumbers.slice(4, 8)}
                        level={1} category={"Cars"} clues={["Honda", "Toyota", "Kia", "Nissan"]}/>
                    <exports.CategoryCard
                        posIndex={shuffledNumbers.slice(8, 12)}
                        level={2} category={"Tech Companies"} clues={["Tesla", "Samsung", "Intel", "HP"]}/>
                    <exports.CategoryCard
                        posIndex={shuffledNumbers.slice(12, 16)}
                        level={3} category={"Celebrity first names"} clues={["Cillian", "Ryan", "Cristiano", "Margot"]}/>
                </div>
            </div>
            <div className={"md:flex flex-col justify-center items-center "}>
                <div className={"grid grid-rows-2 gap-2 text-center"}>
                    <div
                        className={"font-bold text-[1.4rem] mt-10"}
                    >{gameName || "Game name..."}</div>
                    <div
                        className={"text-[1.3rem] italic"}
                    >{createdBy ? "by "+createdBy : "Created by..."}</div>
                </div>
                <div className={"flex flex-wrap justify-center gap-4 " +
                    "py-16 md:px-10 md:w-[50vw] max-w-6xl " +
                    "bg-gray-800 rounded-lg shadow-md "}>
                    {
                        startingBoard.map((wordRow, index) => {
                                return wordRow.map((word, wordIndex) => (
                                    <exports.WordBox key={`${index}-${wordIndex}`} word={word} />
                                ));
                            }
                        )
                    }
                </div>
                <div>
                    <exports.CreateControlCenter />
                </div>
            </div>
        </div>
    )
}

const class_game_created_input = `bg-transparent text-white rounded-[10px] max-w-[70%] md:max-w-full text-center`