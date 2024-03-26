import { useState, useEffect } from 'react';
import { NavLink, Outlet } from "react-router-dom";
import {useDispatch} from "react-redux";
import {toggleNav} from "../../redux/navbarSlice.js";
import * as exports from "../../exports.js"
import {motion} from "framer-motion";

const LinkTag = ( {to, value, onClick} ) => {
    return (
        <>
            <NavLink
                to={to}
                className={"px-3 py-2 rounded-md text-base font-medium"}
                onClick={onClick}
            >{value}</NavLink>
        </>
    )
}
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()

    const handleClose = () => {
        setIsOpen(false)
        dispatch(toggleNav())
    }
    const handleNavToggle = () => {
        setIsOpen(prev => !prev)
        dispatch(toggleNav())
    }

    // navbar visibility based on scroll activity
    const [isActive, setIsActive] = useState(true)
    let inactivityTimer

    const handleUserActivity = () => {
        setIsActive(true)

        clearTimeout(inactivityTimer)

        inactivityTimer = setTimeout( () => {
            setIsActive(false)
        }, 3000)

    }

    useEffect( () => {
        const checkScrollable = () => {
            // Check if the document body height is greater than or equal the window height
            const isScrollable = document.body.scrollHeight >= window.innerHeight;
            setIsActive(isScrollable);
        };

        // Run checkScrollable on initial load
        checkScrollable();

        // Check scrollability whenever the window is resized
        window.addEventListener('resize', checkScrollable);
        window.addEventListener("scroll", handleUserActivity);

        return () => {
            window.removeEventListener('resize', checkScrollable);
            window.removeEventListener("scroll", handleUserActivity);
            clearTimeout(inactivityTimer);
        };
    }, [])

    const navbarVariants = {
        hidden: {
            y: "-100%",
            opacity: 0,
            transition: {
                duration: 0.5
            }
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        },
    }

    const mobileNavVariants = {
        initial: {
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.5,
                ease: 'easeIn',
            }
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            }
        },
    }

    const menuContainerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const menuItemVariants = {
        hidden: { opacity: 0, y: 20 }, // Start lower and faded out
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <>

            <motion.nav
                variants={navbarVariants}
                initial={"hidden"}
                animate={isActive ? "visible" : "hidden"}
                className={"bg-pf-navbar z-20 fixed top-0 inset-x-0 sm:relative h-[7vh]"}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4 md:space-x-10">
                        <div className="flex justify-start lg:w-0 lg:flex-1">
                            <NavLink to="/" >
                                <img src={exports.puzzle_fuzion} alt="logo" className="w-[55px] h-auto rounded-[10px]" />
                            </NavLink>
                        </div>
                        <div className="-mr-2 -my-2 md:hidden">
                            <button
                                onClick={handleNavToggle}
                                className="bg-gray-900 p-2 inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <span className="sr-only">Open menu</span>
                                {/* Adjusted icon for menu open/close */}
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    {isOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                    )}
                                </svg>
                            </button>
                        </div>
                        <div className="hidden md:flex space-x-10">
                            <LinkTag to="/wordle" value="Wordle" />
                            <LinkTag to="/connections" value="Connections" />
                            <LinkTag to="/multiplayer" value="Multiplayer" />
                            <LinkTag to="/create" value="Create" />
                            <LinkTag to="/settings" value="Settings" />
                        </div>
                    </div>
                </div>

                {/* Mobile menu, show/hide based on mobile menu state. */}
                {
                    isOpen &&
                    <>
                        <motion.div
                            className={"z-50 absolute top-0 inset-x-0 transform origin-top-right"}
                            variants={mobileNavVariants}
                            initial={"initial"}
                            animate={"animate"}
                        >
                            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-pf-navbar ">
                                <div className="pt-5 pb-6 px-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <NavLink to={"/"} onClick={handleClose}>
                                                <img src={exports.puzzle_fuzion} alt="logo" className="h-11 w-auto rounded-[10px]" />
                                            </NavLink>
                                        </div>
                                        <div className="-mr-2">
                                            <button
                                                onClick={handleNavToggle}
                                                className="bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            >
                                                <span className="sr-only">Close menu</span>
                                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <motion.div
                                        className="mt-6"
                                        variants={menuContainerVariants}
                                        initial={"hidden"}
                                        animate={ isOpen ? "show" : "hidden"}
                                    >
                                        <nav className="grid gap-y-8">
                                            <motion.div variants={menuItemVariants}><LinkTag to="/wordle" value="Wordle" onClick={handleClose}/> </motion.div>
                                            <motion.div variants={menuItemVariants}><LinkTag to="/connections" value="Connections" onClick={handleClose}/> </motion.div>
                                            <motion.div variants={menuItemVariants}><LinkTag to="/multiplayer" value="Multiplayer" onClick={handleClose}/> </motion.div>
                                            <motion.div variants={menuItemVariants}><LinkTag to="/create" value="Create" onClick={handleClose}/> </motion.div>
                                            <motion.div variants={menuItemVariants}><LinkTag to="/settings" value="Settings" onClick={handleClose}/> </motion.div>
                                        </nav>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                }
            </motion.nav>

            <Outlet />
        </>
    );
}