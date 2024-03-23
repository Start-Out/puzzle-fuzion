import {useDispatch, useSelector} from "react-redux";
import {getCategories, getGameName, getName, getStartingBoard, getWords, updateBoard} from "../../redux/createSlice.js";
import { useMutation } from "convex/react";
import { api } from "/convex/_generated/api"
import {useNavigate} from "react-router-dom";


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

    const createGame = useMutation(api.connections.createGame)

    const navigate = useNavigate()

    const handleCreate = () => {
        if (!gameName || !name || (gameName === "") || name  === "") {
            alert("The game name and the created by fields must be field!")
            return
        }

        if (startingBoard.some(row => row.some(word => word === ""))) {
            alert("Please enter all clues before submitting!")
            return
        }

        if (Object.values(categories).some(value => value === "")) {
            alert("Please enter all the category fields before submitting!")
            return
        }

        alert("Submitting")
        console.log("Submitting!")

        const result = buildBoard(name, startingBoard, categories, solution)
        console.log("result: ", result)

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
                console.log("res: ", res);
                navigate(`/connections/${res}`);
                return res; // Make sure to return res or the specific data you need
            })
            .catch(error => {
                console.error("Error:", error);
            });

    }

    return (
        <div className={"flex flex-row gap-5 justify-center items-center mt-10"}>
            <Button value={"Create"} onClick={handleCreate}/>
        </div>
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
