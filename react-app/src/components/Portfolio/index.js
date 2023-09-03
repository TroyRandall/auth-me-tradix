import React, { useEffect, useState } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [hoverPrice, setHoverPrice] = useState(false);
  const [daily, setDaily] = useState(true);
  const [monthly, setMonthly] = useState(false);
  const [weekly, setWeekly] = useState(false);
  const portfolios = useSelector((state) => state.portfolios);
  const stockInfo = useSelector((state) => state.stocks);

  useEffect(() => {
    const getData = async () => {
      await dispatch(portfolioActions.getPortfoliosByUser(userId)).then(() =>
        setIsLoaded(true)
      );
    };

    getData();
    if (isLoaded) {
    }
  }, [userId, dispatch]);

  const data1 = isLoaded && Object.values(portfolios[userId]);
  const tickerData = [];
  isLoaded &&
    data1.forEach((portfolio) => {
      tickerData.push([
        portfolio["symbol"],
        portfolio["quantity"],
        portfolio["avgPrice"],
      ]);
    });

  function formattedData(ticker) {
    if (isLoaded) {
      data = isLoaded && Object.values(stockInfo[ticker]["Time Series (Daily)"]);
      const newData = [];
      console.log(data)

      data.forEach((dataPoint) => {
        newData.push(dataPoint);
      });
      return newData;
    }
  }

  //   const formattedDataMonthly = () => {
  //     console.log(monthlyInfo);
  //     data = Object.values(monthlyInfo["Monthly Time Series"]);
  //     const newData = [];
  //     data.forEach((dataPoint) => {
  //       newData.push(dataPoint["4. close"]);
  //     });
  //     return newData;
  //   };

  //   const formattedDataWeekly = () => {
  //     data = Object.values(weeklyInfo["Weekly Time Series"]);
  //     const newData = [];
  //     data.forEach((dataPoint) => {
  //       newData.push(dataPoint["4. close"]);
  //     });
  //     return newData;
  //   };
  const formattedDailyData = async () => {
    let ticker = tickerData[0];
    let newData = {};
    tickerData.forEach((stock) => {
      setIsLoaded(false);
      dispatch(stockActions.stockDataDaily(ticker)).then(() =>
        setIsLoaded(true)
      );
      let daily = formattedData(ticker);
      let count = 0;
      daily.forEach((stock) => {
        if (newData.count === undefined) {
          newData.count = stock * tickerData[1];
        } else {
          newData.count = newData.count + stock * tickerData[1];
        }
        count++;
      });
    });
    console.log(Object.values(newData));
    return Object.values(newData);
  };

  const formattedNewWeekly = (ticker) => {
    if (isLoaded) {
      let ticker = tickerData[0];
      let newData = {};
      tickerData.forEach(() => {
        setIsLoaded(false);
        dispatch(weeklyActions.stockDataWeekly(ticker)).then(() =>
          setIsLoaded(true)
        );
        let daily = formattedData(ticker);
        let count = 0;
        daily.forEach((stock) => {
          if (newData.count === undefined) {
            newData.count = stock * tickerData[1];
          } else {
            newData.count = newData.count + stock * tickerData[1];
          }
          count++;
        });
      });
      console.log(Object.values(newData));
      return Object.values(newData);
    }
  };
  const newData = isLoaded && formattedDailyData();
  const ticker = tickerData[0];
  const formattedChange =
    isLoaded;
    // newData[newData.length - 1]["4. close"] -
    //   newData[newData.length - 1]["1. open"];

  const graphColor =
    isLoaded && formattedChange > 0 ? "rgb(0, 243, 0)" : "rgb(255, 0, 0)";
  //   (daily
  //     ? formattedChange > 0
  //       ? "rgb(0, 243, 0)"
  //       : "rgb(255, 0, 0)"
  //     : weekly
  //     ? formattedChangeWeekly > 0
  //       ? "rgb(0, 243, 0)"
  //       : "rgb(255, 0, 0)"
  //     : formattedChangeMonthly > 0
  //     ? "rgb(0, 243, 0)"
  //     : "rgb(255, 0, 0)")

  let data = isLoaded && {
    labels: Object.keys(stockInfo[tickerData[0]]["Time Series (Daily)"]),
    datasets: [
      {
        label: `${ticker} Daily Price`,
        backgroundColor: graphColor,
        borderColor: graphColor,
        data: newData,
        //   ? formattedData()
        //   : weekly
        //   ? formattedDataWeekly()
        //   : formattedDataMonthly(),
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
  const dailyToggle = () => {
    return setDaily(true), setWeekly(false), setMonthly(false);
  };

  const weeklyToggle = () => {
    return setWeekly(true), setDaily(false), setMonthly(false);
  };

  const monthlyToggle = () => {
    return setMonthly(true), setWeekly(false), setDaily(false);
  };
  return isLoaded ? (
    <>
      <div id="lineChart">
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
    </>
  ) : (
    <LoadingSymbol />
  );
}
export default PortfolioPage;
