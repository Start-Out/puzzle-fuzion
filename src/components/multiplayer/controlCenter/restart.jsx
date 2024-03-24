export default function Restart() {
    const restartGame = () => {
        sessionStorage.removeItem("gameId")
        window.location.reload();
    }

    return (
        <button
            onClick={restartGame}
            className={"px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg shadow-lg " +
                "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 " +
                "transition duration-150 ease-in-out"}
        >
            Restart Game
        </button>
    )
}