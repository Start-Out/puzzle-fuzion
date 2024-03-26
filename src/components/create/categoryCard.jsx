import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import { updateCategory, updateStartingBoard, updateWords} from "../../redux/createSlice.js";

const Clues = ({value, classes, posIndex, level, index}) => {
    const [text, setText] = useState( "");

    const dispatch = useDispatch();

    useEffect(() => {
        // Dispatch update only if text is set and position is known
        if (text) {
            dispatch(updateStartingBoard({
                position: posIndex,
                word: text.toUpperCase()
            }));
            dispatch(updateWords({
                level: level,
                words: text.toUpperCase(),
                posIndex: index
            }))
        }
    }, [text, dispatch]);

    return (
        <>
            <input
                type={"text"}
                value={text}
                placeholder={value}
                className={`max-w-full bg-transparent border-2 border-black
                 p-1 rounded-[5px] text-[1rem] placeholder-gray-700 ${classes}`}
                onChange={(e) => setText((e.target.value))}
            />
        </>
    );
};

export default function CategoryCard( { level, category, clues = ["Apple", "Grape", "Jackfruit", "Mango"], posIndex } ) {
    const levelColors = {
        0: 'rgba(248,223,109,0.89)',
        1: '#A1C35A',
        2: '#B1C3EF',
        3: '#BA81C5',
    };
    const backgroundColor = levelColors[level]

    const dispatch = useDispatch()
    const [userCategory, setUserCategory] = useState("")

    const handleCategoryChange = (e) => {
        setUserCategory(e.target.value)
    }

    useEffect( () => {
        dispatch(updateCategory({
            level: level,
            categoryName: userCategory
        }))
    }, [userCategory])

    // save this to the store

    return (
        <div className={`w-[80vw] md:max-w-[40vw] ` +
            "mx-auto sm:mx-0 rounded-[10px] p-5 " +
            "grid grid-rows-2 gap-5 " +
            "text-black shadow-lg "}
             style={{backgroundColor}}
        >
            <div className={""}>
                <div className={"font-bold text-[1.2rem] mb-2"}>Category</div>
                <input value={userCategory}
                       placeholder={category}
                       className={`max-w-[100%] bg-transparent p-1 rounded-[5px] text-[1.1rem] 
                       text-[1rem] placeholder-gray-700 border-2 border-black`}
                       onChange={(e) => handleCategoryChange(e)}
                />
            </div>
            <div>
                <div className={"font-bold text-[1.2rem]"}>Clues</div>
                <div className={"grid grid-cols-4 gap-3 sm:gap-5"}>
                    {clues.map((clue, index) => (
                        <Clues
                            index={index}
                            level={level}
                            key={index}
                            value={clue}
                            classes="cursor-pointer"
                            posIndex={posIndex[index]}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}