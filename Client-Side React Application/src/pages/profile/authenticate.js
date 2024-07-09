import React, { useState } from 'react';

import { GetBaseEndpoint } from '../../utils/BaseEndpoint';

const Authenticate = ({ logIn, initialAlert }) => {
    const baseEndpoint = GetBaseEndpoint();
    const [alert, setAlert] = useState(initialAlert);

    const handleAuthentication = async (e) => {
        if (!e) return;
        let button = e.target.id;
        if (button === undefined || button === '') {
            button = e.target.parentElement.id;
        }
        if (button !== 'login' && button !== 'register') {
            return;
        }
        document.activeElement.blur();

        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        if (!email || !password) {
            setAlert('Email and Password are required!');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            setAlert('Invalid Email!');
            return;
        }

        let request_url = button === 'login' ? '/user/login' : '/user/register';
        let response = await fetch(baseEndpoint + request_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        let data = await response.json();

        if (button === 'login') {
            if (response.status === 200) {
                localStorage.setItem('token', data.token);
                logIn();
                return;
            }
        } else if (button === 'register') {
            if (response.status === 201) {
                setAlert('Registered successfully.');
                return;
            }
        }
        setAlert(data.message);
    }

    return (
        <div className="mt-6 flex flex-col text-2xl font-bold text-center">
            <input id="email" type="email" placeholder="Email" className="input-box px-4 mt-2 font-bold" />
            <input id="password" type="password" placeholder="Password" className="input-box px-4 mt-2 font-bold" />

            {alert && (
                <div className="mt-4 flex flex-col items-center rounded-md border-2 border-red-700">
                    <span className="p-4 text-center text-lg">
                        {alert}
                    </span>
                </div>
            )}

            <div className="mt-4 flex flex-row justify-evenly">
                <button
                    id="login"
                    onClick={handleAuthentication}
                    className="button px-6">
                    <span className="leading-[2.5rem] text-xl font-bold">Login</span>
                </button>
                <button
                    id="register"
                    onClick={handleAuthentication}
                    className="button px-6">
                    <span className="leading-[2.5rem] text-xl font-bold">Register</span>
                </button>
            </div>
        </div>
    );
};

export default Authenticate;