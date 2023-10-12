import './home.css';
import './css/loader.css';
import React from "react";

export default function Loader() {

    return (
        <div className="loader-container">
            <div className="loader">
                <div className="shape"></div>
            </div>
        </div>
    )
}