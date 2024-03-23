import {useState} from "react";
import { useMutation } from "convex/react";
import { api } from "/convex/_generated/api"

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
        <div className={"flex flex-col items-center justify-center min-h-[50vh] min-w-[60vw] " +
            "bg-gray-200 rounded-[10px]"}>
            <div className="w-full max-w-xs">
                <>
                    <h1 className={"font-bold text-[3rem] text-black text-center mb-10"}>
                        { !isSignupActive ? "Log in" : "Sign up"}
                    </h1>
                </>
                {
                    !isSignupActive ? (
                        <form onSubmit={handleLogin} className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-name">
                                    Name
                                </label>
                                <input
                                    name="name"
                                    className={"shadow appearance-none border rounded w-full py-2 px-3 " +
                                        "text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                                    id="login-name"
                                    type="text"
                                    placeholder="Name"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-password">
                                    Password
                                </label>
                                <input
                                    name="password"
                                    className={"shadow appearance-none border rounded w-full py-2 px-3 " +
                                        "text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"}
                                    id="login-password"
                                    type="password"
                                    placeholder="**********" />
                            </div>
                            <div className="flex items-center justify-between">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                    Login
                                </button>
                                <button className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                    onClick={ () => setIsSignupActive(true)}
                                >
                                    Sign up
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSignup} className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-name">
                                    Name
                                </label>
                                <input
                                    name="name"
                                    className={"shadow appearance-none border rounded w-full py-2 px-3 " +
                                        "text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}
                                    id="login-name"
                                    type="text"
                                    placeholder="Name"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-password">
                                    Password
                                </label>
                                <input
                                    name="password"
                                    className={"shadow appearance-none border rounded w-full py-2 px-3 " +
                                        "text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"}
                                    id="login-password"
                                    type="password"
                                    placeholder="**********" />
                            </div>
                            <div className="flex items-center justify-between">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                    Sign Up
                                </button>
                                <button className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                        onClick={ () => setIsSignupActive(false)}
                                >
                                    Login
                                </button>
                            </div>
                        </form>

                    )
                }
            </div>
        </div>
    );
}