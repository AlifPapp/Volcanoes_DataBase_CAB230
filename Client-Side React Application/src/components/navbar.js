import React from "react"
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <navbar className="fixed top-0 w-full bg-white dark:bg-black z-50">
            <div className="max-w-2xl mx-auto">
                <div className="flex flex-row justify-between items-center p-4 py-6 border-b-4 border-red-700">
                    <Link to="/" className="flex col items-center">
                        <span className="text-xl md:text-2xl font-bold text-red-600 hover:text-red-700">
                            Home
                        </span>
                    </Link>

                    <Link to="/volcanoes" className="text-xl md:text-2xl font-bold text-red-600 hover:text-red-700">
                        Search
                    </Link>

                    <Link to="/profile" className="text-xl md:text-2xl font-bold text-red-600 hover:text-red-700">
                        Profile
                    </Link>
                </div>
            </div>
        </navbar>
    );
};

export default NavBar;