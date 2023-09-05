import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { isBefore, isAfter } from "date-fns";

import LoadingSymbol from "../LoadingSymbol";
import * as stockActions from "../../store/stocks";
import * as portfolioActions from "../../store/portfolio";
import * as monthlyActions from "../../store/monthly";
import * as weeklyActions from "../../store/weekly";
import "./portfolio.css";

function PortfolioChart() {
  const [idx, setIdx] = useState(false);
  const [stocksIsLoaded, setStocksIsLoaded] = useState(false);
  const [createdAt, setCreatedAt] = useState(false);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [hoverPrice, setHoverPrice] = useState(false);
  const [daily, setDaily] = useState(true);
  const [monthly, setMonthly] = useState(false);
  const [weekly, setWeekly] = useState(false);
  const [tickerData, setTickerData] = useState(false);
  const portfolios = useSelector((state) => state.portfolios);
  const stockInfo = useSelector((state) => state.stocks);
  const weeklyInfo = useSelector((state) => state.weekly);
  const monthlyInfo = useSelector((state) => state.monthly);
  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    const getData = async () => {
      const res = await dispatch(portfolioActions.getPortfoliosByUser(userId));
      let tickers = Object.values(res[`${userId}`]);
      setTickerData(tickers);
      let created = tickers[0]?.created_at
      tickers.forEach(async (ticker) => {
        if(isBefore(new Date (ticker.created_at), new Date(created))){ created=ticker.created_at}

        await dispatch(stockActions.stockDataDaily(ticker.symbol));
        await dispatch(monthlyActions.stockDataMonthly(ticker.symbol));
        await dispatch(weeklyActions.stockDataWeekly(ticker.symbol));
      });
      setCreatedAt(created)
    };

    getData().then(setTimeout(() => setStocksIsLoaded(true), 5000));
  }, [dispatch, userId, daily, monthly, weekly]);

  function formattedData(ticker, state) {
    let data2 =
      stocksIsLoaded &&
      (daily
        ? Object.values(state[ticker]["Time Series (Daily)"])
        : weekly
        ? Object.values(state[ticker]["Weekly Time Series"])
        : Object.values(state[ticker]["Monthly Time Series"]));
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
      stocksIsLoaded &&
      (daily
        ? Object.keys(stockInfo[ticker]["Time Series (Daily)"])
        : weekly
        ? Object.keys(weeklyInfo[ticker]["Weekly Time Series"]).slice(idx - 30)
        : Object.keys(monthlyInfo[ticker]["Monthly Time Series"]).slice(idx - 30))
    );
  };

  const formattedDataPortfolio = (state) => {
    let newData = {};
    let count;
    console.log(tickerData)
    Object.values(tickerData).forEach((stock) => {
      let oldData = formattedData(stock.symbol, state).reverse();
      let index = 0;
      count = 0;
      let labels = stocksIsLoaded && formattedLabels().reverse();
      oldData.forEach((data) => {
        if (
          !isBefore(new Date(labels[`${count}`]), new Date(stock.created_at))
        ) {
          newData[`${count}`]
            ? (newData[`${count}`] =
                newData[`${count}`] + data * stock.quantity)
            : (newData[`${count}`] = data * stock.quantity);
        } else if (!newData[`${count}`]) newData[`${count}`] = 0;
        count++;
      });
      index++
      if(index === Object.values(tickerData).length -1) setIdx(count)
    })

    if(state === weeklyInfo || state === monthlyInfo){
      return (Object.values(newData).reverse()).slice(idx - 30)
    }

    return Object.values(newData).reverse();
  };

  const formattedChangeWeekly = () => {
    let weeklyData = formattedDataPortfolio(weeklyInfo);
    return weeklyData[weeklyData.length - 1] - weeklyData[0];
  };
  const formattedChangeMonthly = () => {
    let monthlyData = formattedDataPortfolio(monthlyInfo);
    return monthlyData[monthlyData.length - 1] - monthlyData[0];
  };
  const changeId = daily
    ? formattedChange > 0
      ? "stock_details_percent_change_plus"
      : "stock_details_percent_change_minus"
    : weekly
    ? formattedChangeWeekly() > 0
      ? "stock_details_percent_change_plus"
      : "stock_details_percent_change_minus"
    : formattedChangeMonthly() > 0
    ? "stock_details_percent_change_plus"
    : "stock_details_percent_change_minus";

  const graphColor = daily
    ? formattedChange > 0
      ? "rgb(0, 243, 0)"
      : "rgb(255, 0, 0)"
    : weekly
    ? formattedChangeWeekly() > 0
      ? "rgb(0, 243, 0)"
      : "rgb(255, 0, 0)"
    : formattedChangeMonthly() > 0
    ? "rgb(0, 243, 0)"
    : "rgb(255, 0, 0)";

  let data = {
    labels: formattedLabels(),
    datasets: [
      {
        label: `Portfolio Price`,
        backgroundColor: graphColor,
        borderColor: graphColor,
        data: daily
          ? formattedDataPortfolio(stockInfo)
          : weekly
          ? formattedDataPortfolio(weeklyInfo)
          : formattedDataPortfolio(monthlyInfo),
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
        grid:{
          display: false,
        },
        min: -4000,
        ticks: {
          display: false
        }
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
      },},

      events: [
        "mouseenter",
        "mouseleave",
        "mouseout",
        "mousemove",
        "myEventCatcher",
      ],

      onHover: function (e, item) {
        if (item.length) {
          setHoverPrice(
            item[0]["element"]["$context"]["parsed"]["y"].toFixed(2) || false
          );
        } else setHoverPrice(false);
        if (e.type === "mouseout") {
          setHoverPrice(false);
        }
      },}


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
  const formatDates = () => {
    let labels = formattedLabels()
    let count = 0
    labels.forEach((label) => {
      if(isAfter(new Date(createdAt), new Date (label))) {
        count++
      } else {

        return count
      }
    } )
    return count

  }

  const formattedChange =
    stocksIsLoaded &&
    Number(
      daily
        ? data?.datasets[0].data[data?.datasets[0].data.length - 1] -
            data?.datasets[0].data[data?.datasets[0].data.length - 2]
        : data?.datasets[0].data[data?.datasets[0].data.length - 1] -
            data?.datasets[0].data[0]
    );

  const formattedPercentChange =
    stocksIsLoaded &&
    (daily ? (((formattedChange / data?.datasets[0].data[data.datasets[0].data.length-2]) * 100).toFixed(2)) :  ( weekly ? ((formattedChangeWeekly() / data?.datasets[0].data[formatDates()]) *100).toFixed(2)  : (formattedChangeMonthly() / data?.datasets[0].data[formatDates()]*100).toFixed(2)))

  return stocksIsLoaded ? (
    <>
      <div id="portfolio_container">
        <div id="portfolio_info_container">
          {<h1>My Portfolio</h1>}
          <h2 id="portfolio_price">
            $
            {Number(hoverPrice).toLocaleString("en-US") ||
              data.datasets[0].data[data.datasets[0].data.length - 1]
                .toFixed(2)
                .toLocaleString("en-US")}
          </h2>
          <h3 id={changeId}>
            {formattedChange.toFixed(2).toLocaleString("en-US") > 0
              ? "+$" + formattedChange.toLocaleString("en-US")
              : `-$${Math.abs(formattedChange).toLocaleString("en-US")}`}
            (
            {formattedPercentChange > 0
              ? "+" + formattedPercentChange
              : `${formattedPercentChange}`}
            %) {daily ? "Today" : "As of " + formattedLabels()[30]}
          </h3>
        </div>
        <div id="portfolioChart">
          <Line data={data} options={options} id="portfolioChart2" />
        </div>

        <div id="chart-buttons">
          <label className="chart-radio">
            <input
              type="radio"
              name="radio"
              onClick={dailyToggle}
              checked={daily || false}
            />
            <span className="name">Daily</span>
          </label>
          <label className="chart-radio">
            <input
              type="radio"
              name="radio"
              onClick={weeklyToggle}
              checked={weekly || false}
            />
            <span className="name">Weekly</span>
          </label>

          <label className="chart-radio">
            <input
              type="radio"
              name="radio"
              onClick={monthlyToggle}
              checked={monthly || false}
            />
            <span className="name">Monthly</span>
          </label>
        </div>
      </div>
    </>
  ) : (
    <LoadingSymbol />
  );
}
export default PortfolioChart;
