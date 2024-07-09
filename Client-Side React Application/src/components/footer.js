import React from "react"

const Footer = () => {
    return (
        <div className="flex flex-col items-center max-w-2xl w-full p-3 border-4 border-b-0 border-red-700 rounded-t-3xl">
            <div className="flex flex-row text-sm md:text-base">
                <span>Made by</span>
                <a className="pl-1 transition ease-in-out hover:-translate-y-[1px] hover:font-medium" href="https://alifpapp.me/" target="new">Alif Papp</a>
            </div>
        </div>
    );
};

export default Footer;