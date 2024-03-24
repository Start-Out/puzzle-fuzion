import {useState} from "react";
import { useMutation } from "convex/react";
import { api } from "/convex/_generated/api"
import * as exports from "../../exports.js"

export default function Login() {
    const [isSignupActive, setIsSignupActive] = useState(false);

    const createUser = useMutation(api.users.createUser)
    const getUser = useMutation(api.users.getUserByNameAndPassword)

    // Placeholder functions for form submission
    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target)
        const name = formData.get('name'); // Use the name attribute of the input
        const password = formData.get('password');

        if (!name || !password) {
            alert("Please fill in all the required fields!")
            return
        }

        const handleGetUser = async () => {
            return await getUser({
                name: name,
                password: password
            })
        }

        handleGetUser().then(response => {
            if (!response) {
                alert("No such user exists!")
                return
            }
            sessionStorage.setItem('userId', response);
            window.location.reload()
        })
    };

    const handleSignup = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target)
        const name = formData.get('name'); // Use the name attribute of the input
        const password = formData.get('password');

        if (!name || !password) {
            alert("Please fill in all the required fields!")
            return
        }

        const handleCreation = async () => {
            return await createUser({
                name: name,
                password: password
            })
        }

        handleCreation().then(response => {
            if (!response) {
                alert("User already exists! Try signing in")
                return
            }
            sessionStorage.setItem('userId', response);
            window.location.reload()
        })
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-black to-blue-700">
            <div className="w-full max-w-md">
                <div className="w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[30vw] mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
                    <div className="px-10 py-8">
                        <h1 className="font-bold text-3xl text-center text-black mb-6">
                            Puzzle Fuzion
                        </h1>
                        {isSignupActive ? (
                            <form onSubmit={handleSignup} className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-gray-600 block">Name</label>
                                    <input
                                        name="name"
                                        className="w-full p-2 border border-gray-300 rounded mt-1"
                                        type="text"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-600 block">Password</label>
                                    <input
                                        name="password"
                                        className="w-full p-2 border border-gray-300 rounded mt-1"
                                        type="password"
                                        placeholder="**********"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium"
                                >
                                    Sign Up
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-gray-600 block">Name</label>
                                    <input
                                        name="name"
                                        className="w-full p-2 border border-gray-300 rounded mt-1"
                                        type="text"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-600 block">Password</label>
                                    <input
                                        name="password"
                                        className="w-full p-2 border border-gray-300 rounded mt-1"
                                        type="password"
                                        placeholder="**********"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium"
                                >
                                    Login
                                </button>
                            </form>
                        )}
                    </div>
                    <div className="px-10 py-4 bg-gray-100 border-t border-gray-200 flex justify-between items-center">
                        {isSignupActive ? (
                            <span className="flex items-center text-gray-600">
                                <img src={exports.signup_icon} alt="Signup" className="w-5 h-5 mr-2" />
                                New here? Sign up!
                            </span>
                        ) : (
                            <span className="flex items-center text-gray-600">
                                <img src={exports.login_icon} alt="Login" className="w-5 h-5 mr-2" />
                                Welcome back!
                              </span>
                        )}
                        <button
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                            onClick={() => setIsSignupActive(!isSignupActive)}
                        >
                            {isSignupActive ? "Log in" : "Sign up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}