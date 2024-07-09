import React from "react"
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import { GetBaseEndpoint } from '../../utils/BaseEndpoint';
import AlertWindow from '../../components/alert';

import MiscInfo from './misc_info';
import Map from './map';
import PopDensity from './pop_density';

const Volcano = () => {
  const baseEndpoint = GetBaseEndpoint();
  const token = localStorage.getItem('token');

  const [render, setRender] = useState('loading');
  const [alert, setAlert] = useState(null);
  const [volcanoData, setVolcanoData] = useState(null);

  useEffect(() => { onload(); }, []);
  async function onload() {
    let Url = window.location.href;
    Url = Url.split('/volcano')[1];
    let params = new URLSearchParams(Url);
    let id = params.get('id');

    if (id === null) {
      setAlert({ title: 'ERROR', content: (<>Missing volcano ID parameter in URL.<br></br>Go to <Link to="/volcanoes" className="text-red-600">Volcanoes</Link> to select a volcano.</>) });
      setRender('alert');
      return;
    }

    if (isNaN(id) || id < 1) {
      setAlert({ title: 'ERROR', content: (<>Invalid volcano ID parameter in URL.<br></br>Go to <Link to="/volcanoes" className="text-red-600">Volcanoes</Link> to select a volcano.</>) });
      setRender('alert');
      return;
    }

    fetchVolcanoData(id, token);
  }

  const fetchVolcanoData = async (id, token = null) => {
    const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
    const response = await fetch(baseEndpoint + '/volcano/' + id, { method: 'GET', headers });

    if (response.status === 200) {
      const data = await response.json();
      setVolcanoData(data);
      setRender('volcano');
      return true;
    } else if (response.status === 401) {
      fetchVolcanoData(id);
    } else {
      setAlert({
        title: 'ERROR',
        content: (
          <>
            <span className="font-semibold">Response:</span> {response.status + ' ' + response.statusText}<br />
            Failed to fetch volcano data.<br />
            Go back to <Link to="/volcanoes" className="text-red-600">Volcanoes</Link>
          </>
        )
      });
      setRender('alert');
      return false;
    }
  };

  const [resize, setresize] = useState(0);
  let resizeTimeout;
  window.onresize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 400);
  };

  const handleResize = () => {
    if (render === 'volcano') {
      setresize(resize + 1)
    }
  };

  return (
    <div className="pt-24 flex flex-col items-center justify-evenly flex-10a">
      <div id="volcano" className="flex flex-col items-center">
        {
          render === 'volcano' ?
            <>
              <span after="VOLCANO" className="highlighted-heading text-7xl text-center">
                VOLCANO
              </span>
              <div className="m-4 grid grid-cols-1 lg:grid-cols-3 gap-4" key={resize}>
                <div className="p-2 flex flex-col justify-evenly rounded-md border-4 border-red-700 h-[50vh] w-[50vh] max-w-[90vw]">
                  {<MiscInfo data={volcanoData} />}
                </div>

                <div className="p-2 flex flex-col justify-evenly rounded-md border-4 border-red-700 h-[50vh] w-[50vh] max-w-[90vw]">
                  {<Map data={volcanoData} />}
                </div>

                <div className="p-2 flex flex-col justify-evenly rounded-md border-4 border-red-700 w-[50vh] max-w-[90vw]">
                  {<PopDensity data={volcanoData} />}
                </div>
              </div>
            </>
            : render === 'loading' ? <AlertWindow title="LOADING" loader={true} />
              : render === 'alert' ? <AlertWindow title={alert.title} content={alert.content} />
                : <></>
        }
      </div>
    </div>
  );
}

export default Volcano;