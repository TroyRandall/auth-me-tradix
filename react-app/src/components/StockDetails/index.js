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
import "./stockDetails.css";

function StockDetails() {
  const { ticker } = useParams();
  const uppercaseTicker = ticker.toUpperCase();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
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
  }, [dispatch, ticker]);

  const formattedLabels = () => {
    console.log(companyInfo);
    console.log(stockInfo[ticker]);
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
    console.log(avg / count);
    return avg / count + "M";
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
      },
    ],
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
  };

  return (
    isLoaded && (
      <>
        <div id="company-grid-container">
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
              {Object.values(stockInfo[ticker]["Time Series (Daily)"])[0][
                "4. close"
              ].slice(0, 6)}
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
            <Line data={data} />
          </div>

          <h3 id="company-description-title">About</h3>
          <p id="company-description">{companyInfo["Description"]}</p>

          <div id="company-financial-data-container">
            <label id="market-share-label">Market cap </label>{" "}
            <p id="market-cap-data"> {formattedMarketCap()}</p>
            <label id="PEratio-label">Price-Earnings Ratio</label>
            <p id="PEratio-data">{companyInfo["PERatio"]}</p>
            <label id="dividend-yield-label">Dividend Yield</label>
            <p id="dividend-yield-data">{companyInfo["DividendYield"]}%</p>
            <label id="avg-volume-label">Average Volume</label>
            <p id="avg-volume-data">{formattedVolume()}</p>
            <label id="high-today-label">High Today</label>
            <p id="high-today-data">
              ${
                Object.values(stockInfo[ticker]["Time Series (Daily)"])[
                  Object.values(stockInfo[ticker]["Time Series (Daily)"])
                    .length - 1
                ]["2. high"]
              }
            </p>
            <label id="low-today-label">Low Today</label>
            <p id='low-today-data'>
              ${
                Object.values(stockInfo[ticker]["Time Series (Daily)"])[
                  Object.values(stockInfo[ticker]["Time Series (Daily)"])
                    .length - 1
                ]["3. low"]
              }
            </p>
            <label id='open-price-label'>Open Price</label>
            <p id='open-price-data'>${ (Object.values(stockInfo[ticker]["Time Series (Daily)"])[
                  Object.values(stockInfo[ticker]["Time Series (Daily)"])
                    .length - 1
                ]["1. open"])}</p>
            <label id='daily-volume-label'>Volume</label>
            <p id='daily-volume-data'>{ (Object.values(stockInfo[ticker]["Time Series (Daily)"])[
                  Object.values(stockInfo[ticker]["Time Series (Daily)"])
                    .length - 1
                ]["5. volume"])}</p>
                <label id='fiftytwo-week-low-label'>52 Week Low</label>
                <p id='fiftytwo-week-low-data'>{companyInfo['52WeekLow']}</p>
                <label id='fiftytwo-week-high-label'>52 Week High</label>
                <p id='fiftytwo-week-high-data'>{companyInfo['52WeekHigh']}</p>
          </div>
        </div>
      </>
    )
  );
}

export default StockDetails;
