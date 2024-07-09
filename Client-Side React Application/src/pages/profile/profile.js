import React from 'react';
import { useState, useEffect } from 'react';

import { GetBaseEndpoint } from '../../utils/BaseEndpoint';
import AlertWindow from '../../components/alert';
import Authenticate from './authenticate';
import Authenticated from './authenticated';

const Profile = () => {
  const baseEndpoint = GetBaseEndpoint();
  const [render, setRender] = useState('loading');
  const [alert, setAlert] = useState(null);

  useEffect(() => {onload()}, []);
  async function onload() {
    var token = localStorage.getItem('token');
    if (token) {
      let response = await fetch(baseEndpoint + '/volcano/1', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      if (response.status === 200) {
        setRender('authenticated');
        return;
      } else if (response.status === 401) {
        setAlert('Session expired. Please login again.');
        setRender('authenticate');
        return;
      }
    } else {
      setRender('authenticate');
      return;
    }
  }

  function logIn() {
    setRender('authenticated');
    return;
  }

  function logOut() {
    setAlert('Logged out.');
    setRender('authenticate');
    return;
  }

  return (
    <div className="pt-24 pb-4 flex flex-col items-center justify-evenly flex-10a">
      <div className="flex flex-col items-center w-full">
        <span after="PROFILE" className="highlighted-heading text-7xl text-center">
          PROFILE
        </span>

        {render === 'loading' ? <AlertWindow loader={true}/>
          : render === 'authenticated' ? <Authenticated logOut={logOut}/>
            : render === 'authenticate' ? <Authenticate logIn={logIn} initialAlert={alert}/>
              : <></>
        }

      </div>
    </div >
  );
}

export default Profile;