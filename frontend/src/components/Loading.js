import React, { useState } from 'react';

import Loader from "react-spinners/BarLoader";

import '../assets/css/loader.css';

const LoadingSpinner = () => (
    <div>
        <div className="loader">
            <Loader
                color="#81A34A"
                cssOverride={{
                    width: '7680px',
                    height: '5px'
                }}
            />
        </div>
        <div className="loader-overlay">
        </div>
    </div>
)
;

export default LoadingSpinner;