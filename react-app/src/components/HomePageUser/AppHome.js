import React from 'react';
import AppMainNavBar from '../MainUserNav/MainUserNav';
import { useSelector } from 'react-redux';
import './AppHome.css'

const AppHome = () => {
    return (
        <>
        <AppMainNavBar />
        <div className="app-home-container">
            <div className="app-home">
                <div className="app-home-left">
                    <div id="app-home-chart-container">
                        {/*will put chart here */}

                        <div className="buying-power-section">
                            <p className="buying-power-section-label">Buying Power</p>
                            {/* will put buying power herep> */}
                        </div>
                    </div>
                    <div className="app-home-news-container">
                        {/* will put news components here> */}
                    </div>
                </div>
                <div className="app-home-right">
                    {/* will put wathclist here */}
                </div>
            </div>
        </div>
    </>
);

}
export default AppHome
