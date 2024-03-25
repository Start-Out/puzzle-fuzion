import { NavLink } from 'react-router-dom';
import {motion} from "framer-motion";

export default function NotFound () {
    const h1Variants = {
        initial: {},
        animate: {
            rotate: [2, -2, 2],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }

    }

    const buttonVariants = {
        initial: {
            opacity: 0,
            scale: 1,
        },
        animate: {
            opacity: 1,
            transition: { duration: 2, ease: "easeOut" },
        },
        whileHover: {
            scale: 1.2,
            transition: { duration: 0.2, type: "spring", stiffness: 100 },
        },
        whileTap: {
            scale: 0.95,
            transition: { duration: 0.2 },
        },
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center p-5 bg-gray-900 bg-opacity-50">
            <div className={"flex flex-col items-center text-center select-none " +
                "bg-gradient-to-b from-gray-800 to-gray-600 px-4 py-10 rounded-lg shadow-xl"}>
                <motion.h1
                    className={"text-8xl font-extrabold text-transparent bg-clip-text " +
                        "bg-gradient-to-r from-gray-300 to-gray-400"}
                    variants={h1Variants}
                    initial="initial"
                    animate="animate"
                >
                    404
                </motion.h1>
                <p className="mt-3 mb-5 text-xl font-semibold text-gray-200 shadow-md p-3 rounded-lg bg-opacity-50 bg-black">
                    Oops! The page you're looking for isn't here.
                </p>
                <p className="mb-8 text-lg text-gray-200 italic">
                    Maybe it was never here, or it's just hiding in a puzzle &nbsp;
                    <span style={{
                        fontStyle: "normal"
                    }}>🤔</span>
                </p>
                <NavLink
                    to="/"
                    className={"bg-pf-setting text-gray-100 font-bold py-3 px-6 rounded-full " +
                        "hover:bg-pf-setting-h select-none cursor-pointer"}
                >
                    <motion.div
                        variants={buttonVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="whileHover"
                        whileTap="whileTap"
                    >
                        🏠 Take Me Home
                    </motion.div>
                </NavLink>
            </div>
        </div>
    );
}
