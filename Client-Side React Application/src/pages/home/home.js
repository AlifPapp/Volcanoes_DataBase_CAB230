
import React from 'react';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    return (
        <div className="pt-24 flex flex-col items-center justify-evenly flex-10a">
            <div className="flex flex-col items-center max-w-2xl">
                <h1 after="VOLCANOES" className="highlighted-heading text-6xl md:text-7xl text-center">
                    VOLCANOES
                </h1>

                <span after="WORLDWIDE DATABASE" className="highlighted-heading text-3xl md:text-4xl text-center">
                    WORLDWIDE DATABASE
                </span>

                <p className="mt-2 text-lg md:text-xl">
                    Search by Country and Population Proximity
                </p>

                <div className="mt-8">
                    <Link to="/volcanoes" className="flex flex-row px-4 md:px-6 py-3 md:py-4 rounded-md border-2 border-red-600 animate-pulse text-red-500 font-bold">
                        <span className="text-base md:text-lg">
                            START EXPLORING
                        </span>
                        <span className="flex flex-col pl-2">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-2xl md:text-3xl" />
                        </span>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col items-center max-w-2xl py-6">
                <h1 after="ABOUT" className="highlighted-heading text-6xl md:text-7xl text-center">
                    ABOUT
                </h1>

                <p className="mt-2 px-4 text-justify text-lg md:text-xl">
                    Created for QUT's CAB230 Web Computing unit. It uses a small number of REST endpoints that implement CRUD operations on a database containing publicly available data about volcanoes collated by the Smithsonian Institution's Global Volcanism Program.
                </p>
            </div>
        </div>
    );
}

export default Home;