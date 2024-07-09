import React from 'react';
import { useState, useEffect } from 'react';

import { Map, Marker } from "pigeon-maps";

const VolcanoMap = ({ data }) => {
    const [centerValue, setCenterValue] = useState([0, 0]);
    const [zoomValue, setZoomValue] = useState(1);

    useEffect(() => { onload(); }, []);
    function onload() {
        setZoomValue(11);
        setCenterValue([parseFloat(data.latitude), parseFloat(data.longitude)]);
    }

    return (
        <Map
            defaultCenter={[0, 0]}
            defaultZoom={1}
            center={centerValue}
            zoom={zoomValue}
            width="100%" height="100%" >
            <Marker width={50} anchor={centerValue} />
        </Map>
    )
}

export default VolcanoMap;