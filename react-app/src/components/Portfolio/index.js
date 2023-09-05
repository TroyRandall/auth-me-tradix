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
  const [idx, setIdx] = useState(0);
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
      let tickers = Object.values(res[userId]);
      setTickerData(tickers);
      tickers.forEach(async (ticker) => {
        await dispatch(stockActions.stockDataDaily(ticker.symbol));
        await dispatch(monthlyActions.stockDataMonthly(ticker.symbol));
        await dispatch(weeklyActions.stockDataWeekly(ticker.symbol));
      });
    };

    getData().then(setTimeout(() => setStocksIsLoaded(true), 4000));

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
        ? Object.keys(weeklyInfo[ticker]["Weekly Time Series"])
        : Object.keys(monthlyInfo[ticker]["Monthly Time Series"]))
    );
  };

  const formattedDataPortfolio = (state) => {
    let newData = {};
    let count;
    Object.values(tickerData).forEach((stock) => {
      let oldData = formattedData(stock.symbol, state).reverse();
      count = 1;
      oldData.forEach((data) => {
        if (newData[`${count}`]) {
          newData[`${count}`] = newData[`${count}`] + data * stock.quantity;
        } else {
          newData[`${count}`] = data * stock.quantity;
        }
        count++;
      });
    });
    if(state === weeklyInfo || state === monthlyInfo){
      return Object.values(newData).reverse().slice(count - 30)
    }

    return Object.values(newData).reverse();
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
        label: `Daily Price`,
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

  plugins: [{
    id: 'myEventCatcher',
    afterEvent(chart, args, pluginOptions) {
      const event = args.event;
      console.log(event.type);
      if (event.type === 'mouseout') {

        setHoverPrice(false)
      }
  }}],
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
    events: ['mouseenter', 'mouseleave', 'mouseout', 'mousemove', 'myEventCatcher'],

    onHover: function (e, item) {
      if (item.length) {
        setHoverPrice(
          item[0]["element"]["$context"]["parsed"]["y"].toFixed(2) || false
        );
      } else setHoverPrice(false);
      console.log(e.type)
      if(e.type === 'mouseout'){
        setHoverPrice(false)
      }
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

  const formattedChange =
    stocksIsLoaded &&
    Number(daily
      ? data?.datasets[0].data[data?.datasets[0].data.length - 1] -
        data?.datasets[0].data[data?.datasets[0].data.length - 2]
      : data?.datasets[0].data[data?.datasets[0].data.length - 1] -
        data?.datasets[0].data[0]);

  const formattedPercentChange =
    stocksIsLoaded &&
    ((formattedChange / data?.datasets[0].data[0]) * 100).toFixed(2);
  return stocksIsLoaded ? (
    <>
      <div id="portfolio_container">
        <div id="portfolio_info_container">
          {<h1>My Portfolio</h1>}
          <h2 id="portfolio_price">
            ${Number(hoverPrice).toLocaleString('en-US') || data.datasets[0].data[data.datasets[0].data.length-1].toFixed(2).toLocaleString('en-US')}
          </h2>
          <h3 id={changeId}>
            {formattedChange.toFixed(2).toLocaleString('en-US') > 0
              ? "+$" + formattedChange.toLocaleString('en-US')
              : `-$${Math.abs(formattedChange).toLocaleString("en-US")}`}
            (
            {formattedPercentChange > 0
              ? "+" + formattedPercentChange
              : `${formattedPercentChange}`}
            %) {daily ? "Today" : "As of " + formattedLabels()[0]}
          </h3>
        </div>
        <div id="portfolioChart">
          <Line data={data} options={options} id='portfolioChart2'/>
        </div>

        <div id="chart-buttons">
          <label className="chart-radio">
            <input type="radio" name="radio" onClick={dailyToggle} checked={daily || false} />
            <span className="name">Daily</span>
          </label>
          <label className="chart-radio">
            <input type="radio" name="radio" onClick={weeklyToggle} checked={weekly || false}/>
            <span className="name">Weekly</span>
          </label>

          <label className="chart-radio">
            <input type="radio" name="radio" onClick={monthlyToggle} checked={monthly || false} />
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
