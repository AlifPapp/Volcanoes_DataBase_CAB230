import React, { useState } from 'react';

import { GetBaseEndpoint, CheckBaseEndpoint } from '../utils/BaseEndpoint';

const EditBaseEndpoint = ({onResolved}) => {
    const baseEndpoint = GetBaseEndpoint();
    const [BEInputValue, setBEInputValue] = useState(baseEndpoint);
    const [BECheckMSG, setBECheckMSG] = useState(<>Base endpoint invalid. <br></br>Please input a valid base endpoint.</>);

    const handleSaveClick = async () => {
        document.activeElement.blur();
        let input = BEInputValue;
        if (!input) return;

        if (input.slice(-1) === '/') {
            input = input.slice(0, -1);
        }

        setBECheckMSG(<>Awaiting response from server...</>);
        let check = await CheckBaseEndpoint(input);
        if (check === false) {
            setBECheckMSG(<>Base endpoint invalid. <br></br>Please input a valid base endpoint.</>);
            return;
        }
        onResolved();
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-2 flex flex-col items-center rounded-md">
                <span>
                    {BECheckMSG ? BECheckMSG : null}
                </span>
            </div>
            <div className="flex flex-row items-center">
                <input
                    type="text"
                    value={BEInputValue}
                    onChange={(e) => setBEInputValue(e.target.value)}
                    className="input-box font-bold"
                    placeholder={baseEndpoint}
                />
                <button
                    onClick={handleSaveClick}
                    className="button"
                >
                    <span className="text-base">Save</span>
                </button>
            </div>
        </div>
    );
};

export default EditBaseEndpoint; 