import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// eslint-disable-next-line
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

import * as stockActions from "../../store/stocks";
import * as tickerActions from "../../store/tickers";
import "./stockDetails.css";

function StockDetails() {
  const { ticker } = useParams();
  const uppercaseTicker = ticker.toUpperCase();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const stockInfo = useSelector((state) => state.stocks);
  const tickerInfo = useSelector((state) => state.tickers[uppercaseTicker]);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(stockActions.stockDataDaily(ticker));
      await dispatch(tickerActions.stockTickerInfo(ticker)).then(() =>
        setIsLoaded(true),
      );
    };

    loadData();
  }, [dispatch, ticker]);

  const formattedLabels = () => {
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

  const formattedChange = isLoaded && Object.values(stockInfo[ticker]["Time Series (Daily)"])[Object.values(stockInfo[ticker]["Time Series (Daily)"]).length -1]['4. close'] - Object.values(stockInfo[ticker]["Time Series (Daily)"])[[Object.values(stockInfo[ticker]["Time Series (Daily)"]).length -1]]['1. open']

  const graphColor = isLoaded && (formattedChange > 0 ? "rgb(0, 128, 0)" : "rgb(255, 0, 0)")

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


  const formattedPercentChange = isLoaded && (formattedChange/Object.values(stockInfo[ticker]["Time Series (Daily)"])[[Object.values(stockInfo[ticker]["Time Series (Daily)"]).length -1]]['1. open'] * 100).toFixed(2)

  const changeId = isLoaded && (formattedChange > 0 ? 'stock_details_percent_change_plus' : 'stock_details_percent_change_minus')

  return (
    isLoaded && (
      <>
        <div id="company-container">
          {<h1>
            {tickerInfo["2. name"].length > 15
              ? tickerInfo["1. symbol"]
              : tickerInfo["2. name"]}
          </h1>}
          <h2 id='stock_details_price' >${Object.values(stockInfo[ticker]["Time Series (Daily)"])[0]['4. close'].slice(0, 6)}</h2>
          <h3 id={changeId} >{formattedChange.toFixed(2) > 0 ? '+' + formattedChange.toFixed(2) : `${formattedChange.toFixed(2)}` }({formattedPercentChange > 0 ? '+' + formattedPercentChange : `${formattedPercentChange}`}%) Today</h3>
        </div>

        <div id="lineChart">
          <Line data={data} />
        </div>
      </>
    )
  );
}

export default StockDetails;
