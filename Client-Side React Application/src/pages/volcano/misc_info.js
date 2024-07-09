import React from 'react';

const MiscInfo = ({ data }) => {
    const keys = ['name', 'country', 'region', 'subregion', 'last_eruption', 'summit', 'elevation', 'latitude', 'longitude'];

    const sortedData = Object.fromEntries(Object.entries(data).sort((a, b) => keys.indexOf(a[0]) - keys.indexOf(b[0])));

    return (
            <div className='max-w-fit m-auto'>
                {Object.entries(sortedData).map(([key, value]) => {
                    if (keys.includes(key)) {
                        let k = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ':';
                        let v = value;
                        if (key === 'summit') v += ' m';
                        if (key === 'elevation') v += ' ft';

                        return (
                            <div key={key} className="flex flex-row items-baseline">
                                <span className="font-bold text-2xl">{k}</span>
                                <span id={key} className="ml-4 text-xl ">{v}</span>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
    );
};

export default MiscInfo;
