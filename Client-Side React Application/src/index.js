import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css';

import { GetBaseEndpoint, CheckBaseEndpoint } from './utils/BaseEndpoint';

import AlertWindow from './components/alert';
import EditBaseEndpoint from './components/EditBaseEndpoint';

import Navbar from './components/navbar';
import Footer from './components/footer';
import ToggleTheme from './components/ToggleTheme';

import Home from './pages/home/home';
import Volcanoes from './pages/volcanoes/volcanoes';
import Volcano from './pages/volcano/volcano';
import Profile from './pages/profile/profile';
import NoPage from './pages/404/404';

export default function App() {
  const [render, setRender] = useState("loading");

  useEffect(() => { onload() }, []);
  async function onload() {
    let check = await CheckBaseEndpoint(GetBaseEndpoint());
    if (check === false) {
      setRender("editbaseendpoint");
      return;
    }
    setRender(true);
  }

  if (render === "editbaseendpoint") {
    return (
      <>
        <ToggleTheme />
        <AlertWindow
          title="ERROR"
          content={<EditBaseEndpoint onResolved={onload} />}
          full_window={true}
        />
      </>
    )
  }

  if (render === true) {
    return (
      <BrowserRouter basename="/Volcanoes_DataBase_CAB230">
        <Navbar />
        <div className="flex flex-col items-center min-h-screen m-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/volcanoes" element={<Volcanoes />} />
            <Route path="/volcano" element={<Volcano />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
          <ToggleTheme />
          <Footer />
        </div>
      </BrowserRouter>
    );
  }

  if (render === "loading") {
    return (
      <>
        <ToggleTheme />
        <AlertWindow
          title="LOADING"
          loader={true}
          full_window={true}
        />
      </>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
