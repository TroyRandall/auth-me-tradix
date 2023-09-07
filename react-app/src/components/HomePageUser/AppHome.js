import React from 'react';
import AppMainNavBar from '../MainUserNav/MainUserNav';
import { useSelector } from 'react-redux';
import Watchlist from '../Watchlist';
import AllNews from '../News/GetAllNews';
import PortfolioChart from '../Portfolio'
import './AppHome.css'

const AppHome = () => {
    const buyingPower = useSelector(state => state.session.user?.buyingPower);
    const usDollar = Intl.NumberFormat("en-us", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    return (
        <>
        <AppMainNavBar />
        <div className="app-home-container">
            <div className="app-home">
                <div className="app-home-left">
                    <div id="app-home-chart-container">
                    <PortfolioChart />

                    {/* had to move this into the portfolio Chart item itself to allow it to format with the stock assets items below */}
                        {/* <div className="buying-power-section">
                            <p className="buying-power-section-label">Buying Power</p>
                            <p className="buying-power-section-content">${usDollar.format(buyingPower)}</p>
                        </div> */}
                    </div>
                    <div className="app-home-news-container">
                       {/* <AllNews /> */}
                    </div>
                </div>
                <div className="app-home-right">
                    <Watchlist />
                </div>
            </div>
        </div>
    </>
);

}
export default AppHome
