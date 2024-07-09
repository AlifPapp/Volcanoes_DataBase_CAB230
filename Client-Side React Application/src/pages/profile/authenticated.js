import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const Authenticated = ({ logOut }) => {

    const logout = () => {
        document.activeElement.blur();
        localStorage.removeItem('token');
        logOut();
        return;
    }

    const copy_token = () => {
        document.activeElement.blur();
        navigator.clipboard.writeText(localStorage.getItem('token'));

        document.getElementById('copy_token').children[0].classList.add('hidden');
        document.getElementById('copy_token').children[1].classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('copy_token').children[0].classList.remove('hidden');
            document.getElementById('copy_token').children[1].classList.add('hidden');
        }, 1000);
    }

    return (
        <div className="mt-6 flex flex-col text-2xl font-bold text-center">
            <div className="text-justify">
                <div className="flex-flex-row">
                    <span>Token:</span>
                    <button
                        id="copy_token"
                        onClick={copy_token}
                        className="ml-2 text-2xl font-medium transition ease-in-out hover:opacity-50 focus:translate-y-1">
                        <FontAwesomeIcon icon={faCopy} />
                        <FontAwesomeIcon icon={faCheck} className="hidden" />
                    </button>
                </div>
                <span>Type: <span id="token_type" className="font-medium">Bearer</span></span>
            </div>

            <div className="mt-4">
                <button
                    onClick={logout}
                    className="button px-6">
                    <span className="leading-[2.5rem] text-xl font-bold">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Authenticated;