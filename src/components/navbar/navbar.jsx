import { useState } from 'react';
import { NavLink, Outlet } from "react-router-dom";
import {useDispatch} from "react-redux";
import {toggleNav} from "../../redux/navbarSlice.js";
import * as exports from "../../exports.js"

// eslint-disable-next-line react/prop-types
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

    const handleNavOpen = () => {
        setIsOpen(prev => !prev)
        dispatch(toggleNav())
    }

    const handleCloseNav = () => {
        setIsOpen(false)
        dispatch(toggleNav())
    }

    return (
        <>
            <nav className="bg-gray-800 h-[7vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <NavLink to={"/"} className="text-white font-bold">
                                    <img src={exports.puzzle_fuzion} alt={"logo"}
                                        className={"w-[55px] h-auto rounded-[10px]"}
                                    />
                                </NavLink>
                            </div>
                            <div className="hidden md:block">
                                <ul className="ml-10 flex items-baseline space-x-4">
                                    <LinkTag to={"/wordle"} value={"Wordle"} />
                                    <LinkTag to={"/connections"} value={"Connections"} />
                                    <LinkTag to={"/multiplayer"} value={"Multiplayer"} />
                                    <LinkTag to={"/create"} value={"Create"} />
                                    <LinkTag to={"/settings"} value={"Settings"} />
                                </ul>
                            </div>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button onClick={handleNavOpen} className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <span className="sr-only">Open main menu</span>
                                {/* Icon for menu button */}
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Overlay mobile menu */}
            <div className={`${isOpen ? "fixed inset-0 z-10 bg-black bg-opacity-50" : "hidden"} md:hidden`}
                 onClick={handleCloseNav}
            >
                <div className={`${isOpen ? "fixed inset-0 z-20 flex justify-end" : "hidden"}`}>
                    <div className="bg-gray-800 w-64 h-[55vh] rounded-[10px] overflow-y-auto">
                        <button onClick={() => handleNavOpen()} className="p-4 text-gray-400 hover:text-white">
                            <div onClick={() => handleNavOpen()}>
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </button>
                        <ul className="px-2 pt-2 pb-3 space-y-5">
                            <li className={liStyle} onClick={() => setIsOpen(false)}><LinkTag to={"/"} value={"Home"} onClick={() => setIsOpen(false)}/></li>
                            <li className={liStyle} onClick={() => setIsOpen(false)}><LinkTag to={"/wordle"} value={"Wordle"} onClick={() => setIsOpen(false)}/></li>
                            <li className={liStyle} onClick={() => setIsOpen(false)}><LinkTag to={"/connections"} value={"Connections"} onClick={() => setIsOpen(false)}/></li>
                            <li className={liStyle} onClick={() => setIsOpen(false)}><LinkTag to={"/multiplayer"} value={"Multiplayer"} onClick={() => setIsOpen(false)}/></li>
                            <li className={liStyle} onClick={() => setIsOpen(false)}><LinkTag to={"/create"} value={"Create"} onClick={() => setIsOpen(false)}/></li>
                            <li className={liStyle} onClick={() => setIsOpen(false)}><LinkTag to={"/settings"} value={"Settings"} onClick={() => setIsOpen(false)}/></li>
                        </ul>
                    </div>
                </div>
            </div>

            <Outlet />
        </>
    );
}

const liStyle = `border-2 border-gray-600 p-2 text-left rounded`