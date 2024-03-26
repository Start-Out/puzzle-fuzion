import {motion} from "framer-motion";

export default function ConnectionIndicator({text} ) {

    return (
        <div className={"fixed flex items-center justify-center top-[15vh] left-0 right-0"}>
            <motion.div
                className={"bg-black bg-opacity-60 w-[100px] h-[5vh] text-center " +
                    "flex justify-center items-center rounded-[10px]"}
                initial={{
                    y: -100,
                }}
                animate={{
                    y: 0,
                    transition: {
                        duration: 0.5
                    }
                }}
            >
                {text}
            </motion.div>
        </div>
    )
}