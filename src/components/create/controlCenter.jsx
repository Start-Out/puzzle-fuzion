import {useDispatch, useSelector} from "react-redux";
import {getCategories, getGameName, getName, getStartingBoard, getWords, updateBoard} from "../../redux/createSlice.js";
import { useMutation } from "convex/react";
import { api } from "/convex/_generated/api"
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import * as exports from "../../exports.js"

const Button = ( {value, onClick} ) => {
    return (
        <button
            className={"bg-gray-700 py-3 px-5 " +
                "rounded-[5px] " +
                "hover:bg-pf-connection-select hover:text-black select-none"}
            onClick={onClick}
        >{value}</button>
    )
}

export default function CreateControlCenter() {
    const dispatch = useDispatch()
    const solution = useSelector(getWords)
    const categories = useSelector(getCategories)
    const name = useSelector(getName)
    const gameName = useSelector(getGameName)
    const startingBoard = useSelector(getStartingBoard)
    const [gameId, setGameId] = useState("")
    const createGame = useMutation(api.connections.createGame)



    const [isAlert, setIsAlert] = useState(false)
    const [alertText, setAlertText] = useState("")

    const handleAlert = () => setIsAlert(prev => !prev)

    const handleCreate = () => {
        if (!gameName || !name || (gameName === "") || name  === "") {
            setAlertText("The game name and the created by fields must be filled!")
            setIsAlert(true)
            return
        }

        if (Object.values(categories).some(value => value === "")) {
            setAlertText("Please enter all the category fields before submitting!")
            setIsAlert(true)
            return
        }

        if (startingBoard.some(row => row.some(word => word === ""))) {
            setAlertText("Please enter all clues before submitting!")
            setIsAlert(true)
            return
        }

        const result = buildBoard(name, startingBoard, categories, solution)

        dispatch(updateBoard({
            board: result
        }))

        const handleCreation = async () => {
            const stringified = JSON.stringify(result)

            return await createGame({
                gameName: gameName,
                data: stringified
            })
        }

        handleCreation()
            .then(res => {
                setGameId(res)
                return res;
            })
            .catch(error => {
                console.error("Error:", error);
            });

        setAlertText("Your connection puzzle has been created! Redirect to connections page?")
        setIsAlert(true)
    }

    const navigate = useNavigate()

    const handleOkay = () => {
        navigate(`/connections/${gameId}`)
    }

    return (
        <>
            <div className={"flex flex-row gap-5 justify-center items-center mt-10"}>
                <Button value={"Create"} onClick={handleCreate}/>
            </div>
            {isAlert && <exports.NavigateAlert text={alertText} onOk={handleOkay} onCancel={handleAlert} />}
        </>
    )
}

const buildBoard = (name, startingBoard, categories, solution) => {
    // Create the board object by iterating over the categories and mapping them to their solutions
    const board = Object.keys(categories).reduce((acc, key) => {
        const categoryName = categories[key];
        const categorySolutions = solution[key];

        acc[categoryName] = {
            level: parseInt(key), // Ensure the level is an integer
            members: categorySolutions
        };

        return acc;
    }, {});

    // Assemble the final object
    return {
        name,
        board,
        startingBoard
    };
}
