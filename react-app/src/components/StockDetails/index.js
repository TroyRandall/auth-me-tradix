import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// eslint-disable-next-line
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

import * as stockActions from "../../store/stocks";
import * as tickerActions from "../../store/tickers";
import * as companyActions from "../../store/companyData";
import PurchaseStockForm from "../StockPurchaseForm";
import "./stockDetails.css";

function StockDetails() {
  const { ticker } = useParams();
  const uppercaseTicker = ticker.toUpperCase();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoverPrice, setHoverPrice] = useState(false);
  const stockInfo = useSelector((state) => state.stocks);
  const tickerInfo = useSelector((state) => state.tickers[uppercaseTicker]);
  const companyInfo = useSelector((state) => state.companies[uppercaseTicker]);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(stockActions.stockDataDaily(ticker));
      await dispatch(companyActions.companyDataFetch(ticker));
      await dispatch(tickerActions.stockTickerInfo(ticker)).then(() =>
        setIsLoaded(true)
      );
    };

    loadData();
    if (isLoaded) {
      const myChart = document.getElementById("lineChart");
      myChart.addEventListener("mouseout", () => {
        setHoverPrice(false);
      });
    }
  }, [dispatch, ticker]);

  const formattedLabels = () => {
    return Object.keys(stockInfo[ticker]["Time Series (Daily)"]);
  };

  const formattedData = () => {
    data = Object.values(stockInfo[ticker]["Time Series (Daily)"]);
    const newData = [];
    data.forEach((dataPoint) => {
      newData.push(dataPoint["4. close"]);
    });
    return newData;
  };

  const formattedVolume = () => {
    data = Object.values(stockInfo[ticker]["Time Series (Daily)"]);
    const newData = [];
    data.forEach((dataPoint) => {
      newData.push(dataPoint["5. volume"]);
    });
    let avg = 0;
    let count = 0;
    newData.forEach((dataPoint) => {
      avg += dataPoint;
      count++;
    });
    return avg / count > 1000000000 ? "N/A" : avg / count + "M";
  };

  const formattedChange =
    isLoaded &&
    Object.values(stockInfo[ticker]["Time Series (Daily)"])[
      Object.values(stockInfo[ticker]["Time Series (Daily)"]).length - 1
    ]["4. close"] -
      Object.values(stockInfo[ticker]["Time Series (Daily)"])[
        [Object.values(stockInfo[ticker]["Time Series (Daily)"]).length - 1]
      ]["1. open"];

  const graphColor =
    isLoaded && (formattedChange > 0 ? "rgb(0, 243, 0)" : "rgb(255, 0, 0)");

  let data = isLoaded && {
    labels: formattedLabels(),
    datasets: [
      {
        label: `${ticker} Daily Price`,
        backgroundColor: graphColor,
        borderColor: graphColor,
        data: formattedData(),
        pointHoverRadius: 8,
        fill: false,
        pointBorderColor: "rgba(0, 0, 0, 0)",
        pointBackgroundColor: "rgba(0, 0, 0, 0)",
        pointHoverBackgroundColor: graphColor,
        pointHoverBorderColor: graphColor,
        pointHoverBorderWidth: 3,
      },
    ],
  };

  let options = isLoaded && {
    responsive: true,
    maintainAspectRatio: false,
    borderWidth: 4,
    pointRadius: 0.2,
    pointHoverRadius: 1,
    spanGaps: false,
    maintainAspectRatio: false,
    elements: {
      point: {
        hoverRadius: 3,
      },
    },
    hover: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: false,
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: true,
          callback: function (value, index, ticks) {
            return "•";
          }, // Hide X axis labels
        },
      },
    },
    onHover: function (e, item) {
      if (item.length) {
        setHoverPrice(item[0]["element"]["$context"]["parsed"]["y"] || false);
      } else setHoverPrice(false);
    },
  };

  const formattedPercentChange =
    isLoaded &&
    (
      (formattedChange /
        Object.values(stockInfo[ticker]["Time Series (Daily)"])[
          [Object.values(stockInfo[ticker]["Time Series (Daily)"]).length - 1]
        ]["1. open"]) *
      100
    ).toFixed(2);

  const changeId =
    isLoaded &&
    (formattedChange > 0
      ? "stock_details_percent_change_plus"
      : "stock_details_percent_change_minus");

  const formattedMarketCap = () => {
    if (companyInfo !== undefined) {
      if (
        companyInfo["MarketCapitalization"].length > 9 &&
        companyInfo["MarketCapitalization"].length < 13
      ) {
        return `${companyInfo["MarketCapitalization"].slice(0, 3)}B`;
      } else if (companyInfo["MarketCapitalization"].length < 9) {
        return `${companyInfo["MarketCapitalization"].slice(0, 3)}M`;
      } else {
        return `${companyInfo["MarketCapitalization"].slice(0, 3)}T`;
      }
    }
    return;
  };

  return (
    isLoaded && (
      <>
        <div id="company-grid-container">
          <PurchaseStockForm
            average={
              Object.values(stockInfo[ticker]["Time Series (Daily)"])[
                Object.values(stockInfo[ticker]["Time Series (Daily)"]).length -
                  1
              ]["4. close"]
            }
            isLoaded={isLoaded}
            change={formattedChange > 0 ? "+" : "-"}
          />

          <div id="company-info-container">
            {
              <h1>
                {tickerInfo["2. name"].length > 15
                  ? tickerInfo["1. symbol"]
                  : tickerInfo["2. name"]}
              </h1>
            }
            <h2 id="stock_details_price">
              $
              {hoverPrice ||
                Object.values(stockInfo[ticker]["Time Series (Daily)"])[
                  Object.values(stockInfo[ticker]["Time Series (Daily)"])
                    .length - 1
                ]["4. close"].slice(0, 6)}
            </h2>
            <h3 id={changeId}>
              {formattedChange.toFixed(2) > 0
                ? "+" + formattedChange.toFixed(2)
                : `${formattedChange.toFixed(2)}`}
              (
              {formattedPercentChange > 0
                ? "+" + formattedPercentChange
                : `${formattedPercentChange}`}
              %) Today
            </h3>
          </div>

          <div id="lineChart">
            <Line data={data} options={options} />
          </div>

          <h3 id="stock-lending-title" className='info-div-title'>Stock Lending</h3>
          <p id="stock-lending-info">
            You're currently not taking advantage of an income opportunity. You
            could change that today.
          </p>

          <h3 id="company-description-title" className='info-div-title'>About</h3>
          <p id="company-description">
            {companyInfo !== undefined ? companyInfo["Description"] : ""}
          </p>

          <div id="company-financial-data-container">
            <div className='info-div'>
              <label id="market-share-label" className='info-div-title'>Market cap </label>{" "}
              <p id="market-cap-data"> {formattedMarketCap()}</p>
            </div>
            <div className='info-div'>
              <label id="PEratio-label" className='info-div-title'>Price-Earnings Ratio</label>
              <p id="PEratio-data">
                {" "}
                {companyInfo !== undefined ? companyInfo["PERatio"] : ""}
              </p>
            </div>
            <div className='info-div'>
              <label id="dividend-yield-label" className='info-div-title'>Dividend Yield</label>
              <p id="dividend-yield-data">
                {companyInfo !== undefined ? ["DividendYield"] : ""}%
              </p>
            </div>
            <div className='info-div'>
              <label id="avg-volume-label">Average Volume</label>
              <p id="avg-volume-data">{formattedVolume()}</p>
            </div>
            <div className='info-div'>
              <label id="high-today-label" className='info-div-title'>High Today</label>
              <p id="high-today-data">
                $
                {
                  Object.values(stockInfo[ticker]["Time Series (Daily)"])[
                    Object.values(stockInfo[ticker]["Time Series (Daily)"])
                      .length - 1
                  ]["2. high"]
                }
              </p>
            </div>
            <div className='info-div'>
              <label id="low-today-label" className='info-div-title'>Low Today</label>
              <p id="low-today-data">
                $
                {
                  Object.values(stockInfo[ticker]["Time Series (Daily)"])[
                    Object.values(stockInfo[ticker]["Time Series (Daily)"])
                      .length - 1
                  ]["3. low"]
                }
              </p>
            </div>
            <div className='info-div'>
              <label label id="open-price-label" className='info-div-title'>
                Open Price
              </label>
              <p id="open-price-data">
                $
                {
                  Object.values(stockInfo[ticker]["Time Series (Daily)"])[
                    Object.values(stockInfo[ticker]["Time Series (Daily)"])
                      .length - 1
                  ]["1. open"]
                }
              </p>
            </div>
            <div className='info-div'>
              <label id="daily-volume-label" className='info-div-title'>Volume</label>
              <p id="daily-volume-data">
                {
                  Object.values(stockInfo[ticker]["Time Series (Daily)"])[
                    Object.values(stockInfo[ticker]["Time Series (Daily)"])
                      .length - 1
                  ]["5. volume"]
                }
              </p>
            </div>
            <div className='info-div'>
              <label id="fiftytwo-week-low-label" className='info-div-title'>52 Week Low</label>
              <p id="fiftytwo-week-low-data">
                {companyInfo !== undefined ? companyInfo["52WeekLow"] : ""}
              </p>
            </div>
            <div className='info-div'>
              <label id="fiftytwo-week-high-label" className='info-div-title'>52 Week High</label>
              <p id="fiftytwo-week-high-data">
                {companyInfo !== undefined ? ["52WeekHigh"] : ""}
              </p>
            </div>
          </div>
        </div>
      </>
    )
  );
}

export default StockDetails;
