import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import LoadingSymbol from "../LoadingSymbol";
import * as stockActions from "../../store/stocks";
import * as portfolioActions from "../../store/portfolio";
import * as monthlyActions from "../../store/monthly";
import * as weeklyActions from "../../store/weekly";
import "./portfolio.css";

function PortfolioPage() {
  const [portfolioIsLoaded, setPortfolioIsLoaded] = useState(false);
  const [stocksIsLoaded, setStocksIsLoaded] = useState(false);
  const [toggle, setToggle] = useState(false);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [hoverPrice, setHoverPrice] = useState(false);
  const [daily, setDaily] = useState(true);
  const [monthly, setMonthly] = useState(false);
  const [weekly, setWeekly] = useState(false);
  const [stockData, setStockData] = useState({});
  const [tickerData, setTickerData] = useState(false);
  const portfolios = useSelector((state) => state.portfolios);
  const stockInfo = useSelector((state) => state.stocks);
  const weeklyInfo = useSelector((state) => state.weekly);
  const monthlyInfo = useSelector((state) => state.monthly);

  useEffect(() => {
    const getData = async () => {
      const res = await dispatch(portfolioActions.getPortfoliosByUser(userId));
      let tickers = Object.values(res);
      setTickerData(tickers);
      tickers.forEach(async (ticker) => {
        await dispatch(stockActions.stockDataDaily(ticker.symbol));
        await dispatch(monthlyActions.stockDataMonthly(ticker.symbol));
        await dispatch(weeklyActions.stockDataWeekly(ticker.symbol));
      });
    };

    getData().then(setTimeout(() => setStocksIsLoaded(true), 3000));

    console.log(tickerData);
  }, [dispatch, userId, daily, monthly, weekly]);

  // const formatTickers = () => {
  //     const data1 = portfolioIsLoaded && Object.values(portfolios[userId]);
  //     const tickerData1 = [];
  //     if (data1.length) {
  //       data1?.forEach((portfolio) => {
  //         tickerData1.push({
  //           symbol: portfolio["symbol"],
  //           quantity: portfolio["quantity"],
  //           avgPrice: portfolio["avgPrice"],
  //         });
  //         setTickerData(tickerData1);
  //         setToggle(true);
  //         return tickerData;
  //       });
  //     }}

  function formattedData(ticker, state) {
    let data2 =
      stocksIsLoaded &&(daily ? Object.values(state[ticker]["Time Series (Daily)"]) : (weekly ? Object.values(state[ticker]['Weekly Time Series']) : Object.values(state[ticker]['Monthly Time Series'])))
    const newData = [];
    if (data2.length) {
      data2.forEach((dataPoint) => {
        newData.push(dataPoint["4. close"]);
      });
    }
    return newData;
  }

  const formattedLabels = () => {
    let ticker = stocksIsLoaded && tickerData[0]["symbol"];
    return (
      stocksIsLoaded && Object.keys(stockInfo[ticker]["Time Series (Daily)"])
    );
  };

  const formattedDataPortfolio = (state) => {
    let newData = {};
    let count;
    Object.values(tickerData).forEach((stock) => {
      let oldData = formattedData(stock.symbol, state);
      count = 0;
      oldData.forEach((data) => {
        if (newData[`${count}`]) {
          newData[`${count}`] = newData[`${count}`] + (data * stock.quantity);
        } else newData[`${count}`] = data * stock.quantity;
        count++;
      });
    });
    return Object.values(newData);
  };

  // const formattedDataWeekly = (state) => {
  //   let newData = {};
  //   let count;
  //   Object.values(tickerData).forEach((stock) => {
  //     let oldData = formattedData(stock.symbol, monthlyInfo);
  //     count = 0;
  //     oldData.forEach((data) => {
  //       if (newData.count) {
  //         newData[`${count}`] = newData.count + data * stock.quantity;
  //       } else newData.count = data * stock.quantity;
  //       count++;
  //     });
  //   });
  //   return Object.values(newData);
  // };

  const graphColor = formattedChange > 0 ? "rgb(0, 243, 0)" : "rgb(255, 0, 0)";

  let data = {
    labels: formattedLabels(),
    datasets: [
      {
        label: `Daily Price`,
        backgroundColor: graphColor,
        borderColor: graphColor,
        data: daily
          ? formattedDataPortfolio(stockInfo)
          : (weekly
          ? formattedDataPortfolio(weeklyInfo)
          : formattedDataPortfolio(monthlyInfo)),
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

  // if(portfolioIsLoaded) {
  //   formatTickers()
  //   getStockData()
  // }

  let options = stocksIsLoaded && {
    responsive: true,
    borderWidth: 4,
    pointRadius: 0.2,
    pointHoverRadius: 1,
    spanGaps: false,
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

  const dailyToggle = () => {
    setDaily(true);
    setWeekly(false);
    setMonthly(false);
  };

  const weeklyToggle = () => {
    setWeekly(true);
    setDaily(false);
    setMonthly(false);
  };

  const monthlyToggle = () => {
    setMonthly(true);
    setWeekly(false);
    setDaily(false);
  };
  const changeId =
    stocksIsLoaded && formattedChange > 0
      ? "portfolio_percent_change_plus"
      : "portfolio_percent_change_minus";
  const formattedChange =
    stocksIsLoaded &&
    data?.datasets[0].data[0] -
      data?.datasets[0].data[data?.datasets[0].data.length - 1];

  const formattedPercentChange =
    stocksIsLoaded &&
    (
      (formattedChange /
        data?.datasets[0].data[data.datasets[0].data.length - 1]) *
      100
    ).toFixed(2);
  return stocksIsLoaded ? (
    <>
      <div id="portfolio_container">
        <div id="portfolio_info_container">
          {<h1>My Portfolio</h1>}
          <h2 id="portfolio_price">
            $
            {hoverPrice ||
              data.datasets[0].data[0].toFixed(
                2
              )}
          </h2>
          <h3 id={changeId}>
            {formattedChange.toFixed(2) > 0
              ? "+" + formattedChange.toFixed(2)
              : `${formattedChange.toFixed(2)}`}
            (
            {formattedPercentChange > 0
              ? "+" + formattedPercentChange
              : `${formattedPercentChange}`}
            %) {daily ? "Today" : "As of " + formattedLabels()[0]}
          </h3>
        </div>
        <div id="portfolioChart">
          <Line data={data} options={options} />
        </div>

        <div id="chart-buttons">
          <label className="chart-radio">
            <input type="radio" name="radio" onClick={dailyToggle} />
            <span className="name">Daily</span>
          </label>
          <label className="chart-radio">
            <input type="radio" name="radio" onClick={weeklyToggle} />
            <span className="name">Weekly</span>
          </label>

          <label className="chart-radio">
            <input type="radio" name="radio" onClick={monthlyToggle} />
            <span className="name">Monthly</span>
          </label>
        </div>
      </div>
    </>
  ) : (
    <LoadingSymbol />
  );
}
export default PortfolioPage;
