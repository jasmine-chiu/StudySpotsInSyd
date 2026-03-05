// import { useState, useEffect } from 'react';

import React from "react"
import {
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom"

import Dash from "./Dash"
import Map from "./Map"
import Shuttle from "./Shuttle"
// import Header from "./Header"

export const url = "http://localhost:5173";

const Pages = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Dash />} />
                <Route path="/map" element={<Map />} />
                <Route path="/shuttle" element={<Shuttle />} />
            </Routes> 
        </>
    );
}

export default Pages;
