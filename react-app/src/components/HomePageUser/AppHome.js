import React from "react";
import AppMainNavBar from "../MainUserNav/MainUserNav";
import { useSelector } from "react-redux";
import Watchlist from "../Watchlist";
import AllNews from "../News/GetAllNews";
import PortfolioChart from "../Portfolio";
import List from "../Watchlist2/Watchlist2";
import "./AppHome.css";
import { useHistory, Redirect } from "react-router-dom";
import { useParams } from "react-router-dom";

const AppHome = () => {
  const buyingPower = useSelector((state) => state.session.user?.buyingPower);
  const portfolios = useSelector((state) => state.portfolios);
  const currentUser = useSelector((state) => state.session.user);
  const { userId } = useParams();
  const history = useHistory();
  const usDollar = Intl.NumberFormat("en-us", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });



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
              <AllNews />
            </div>
          </div>
          <div className="app-home-right">
            <List />
            {/* <Watchlist /> */}
          </div>
        </div>
      </div>
    </>
  );
};
export default AppHome;
