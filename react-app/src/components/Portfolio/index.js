import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, Redirect } from "react-router-dom";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { isBefore, isAfter } from "date-fns";

import LoadingSymbol from "../LoadingSymbol";
import SellStockForm from "../StockSellForm";
import DeletePortfolioForm from "../DeletePortfolio";
import * as stockActions from "../../store/stocks";
import * as portfolioActions from "../../store/portfolio";
import * as monthlyActions from "../../store/monthly";
import * as weeklyActions from "../../store/weekly";
import "./portfolio.css";
import LandingHomeFooter from "../LandingPage/LandingHomeFooter";

function PortfolioChart({ current }) {
  const [idx, setIdx] = useState(false);
  const [stocksIsLoaded, setStocksIsLoaded] = useState(false);
  const [createdAt, setCreatedAt] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const [hoverPrice, setHoverPrice] = useState(false);
  const [daily, setDaily] = useState(true);
  const [monthly, setMonthly] = useState(false);
  const [weekly, setWeekly] = useState(false);
  const [tickerData, setTickerData] = useState(false);
  const portfolios = useSelector((state) => state.portfolios[userId]);
  const stockInfo = useSelector((state) => state.stocks);
  const weeklyInfo = useSelector((state) => state.weekly);
  const monthlyInfo = useSelector((state) => state.monthly);
  const buyingPower = useSelector((state) => state.session.user?.buyingPower);
  const usDollar = Intl.NumberFormat("en-us", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  useEffect(() => {
    const getData = async () => {
      const res = await dispatch(portfolioActions.getPortfoliosByUser(userId));
      let tickers = Object.values(res[`${userId}`]);
      const newTickers = {};
      tickers.forEach((ticker) => {
        if (!newTickers[ticker.symbol])
          newTickers[ticker.symbol] = [ticker.symbol, ticker.created_at];
      });
      if (tickers.length > 0) {
        setTickerData([...tickers]);
        let created = tickers[0]?.created_at;
        Object.values(newTickers).forEach(async (ticker) => {
          if (isBefore(new Date(ticker[1]), new Date(created))) {
            created = ticker[1];
          }

          // await dispatch(stockActions.stockDataDaily(ticker.symbol));
          await dispatch(stockActions.stockDataDaily(ticker[0]));
          await dispatch(monthlyActions.stockDataMonthly(ticker[0]));
          await dispatch(weeklyActions.stockDataWeekly(ticker[0]));
        });
        setCreatedAt(created);
      } else {
        await dispatch(stockActions.stockDataDaily("tsla"));
        await dispatch(monthlyActions.stockDataMonthly("tsla"));
        await dispatch(weeklyActions.stockDataWeekly("tsla"));
      }
    };
    if (userId) {
      getData().then(() => {
        if (!current) history.push("/login");
        else if (current?.id !== userId) {
          return <Redirect to={`/portfolios/${userId}`} />;
        }
      });

      const delayLoad = setTimeout(() => {
        setStocksIsLoaded(true);
        const chartContainer = document.getElementById("portfolioChart");
        console.log(chartContainer);
        let chart = chartContainer?.childNodes[0];
        chartContainer.addEventListener("mouseleave", () => {
          setHoverPrice(false);
        });
      }, 5000);
      return () => {
        clearTimeout(delayLoad);
      };
    }
  }, []);

  function formattedData(ticker, state) {
    let data2 =
      stocksIsLoaded &&
      tickerData &&
      (daily
        ? Object.values(state[ticker]["Time Series (Daily)"])
        : weekly
        ? Object.values(state[ticker]["Weekly Time Series"])
        : Object.values(state[ticker]["Monthly Time Series"]));
    const newData = [];
    if (data2?.length) {
      data2.forEach((dataPoint) => {
        newData.push(dataPoint["4. close"]);
      });
    }

    return newData;
  }

  const formattedLabels = () => {
    if (tickerData) {
      let ticker = stocksIsLoaded && tickerData[0]["symbol"];
      return (
        stocksIsLoaded &&
        (daily
          ? Object.keys(stockInfo[ticker]["Time Series (Daily)"])
          : weekly
          ? Object.keys(weeklyInfo[ticker]["Weekly Time Series"]).slice(
              idx - 30
            )
          : Object.keys(monthlyInfo[ticker]["Monthly Time Series"]).slice(
              idx - 30
            ))
      );
    } else {
      return (
        stocksIsLoaded &&
        (daily
          ? Object.keys(stockInfo["tsla"]["Time Series (Daily)"])
          : weekly
          ? Object.keys(weeklyInfo["tsla"]["Weekly Time Series"]).slice(
              idx ? idx - idx / 5 : 0
            )
          : Object.keys(monthlyInfo["tsla"]["Monthly Time Series"]).slice(
              idx ? idx - idx / 5 : 0
            ))
      );
    }
  };

  const formatValue = () => {
    if (Object.values(stockInfo).length > 1 && portfolios) {
      let formatted = [];
      Object.values(portfolios).forEach((portfolio) => {
        if (!portfolio?.sold_at) {
          formatted.push({
            symbol: portfolio?.symbol,
            quantity: portfolio?.quantity,
          });
        }
      });
      let count = 0;
      formatted.forEach((ticker) => {
        count =
          count +
          Object.values(
            stockInfo[ticker?.symbol]?.["Time Series (Daily)"]
          )?.reverse()[0]?.["4. close"] *
            ticker?.quantity;
      });
      return count;
    } else return 0;
  };
  const formattedDataPortfolio = (state) => {
    let newData = {};
    let count;
    if (stocksIsLoaded) {
      if (tickerData && portfolios) {
        Object.values(portfolios).forEach((stock) => {
          let oldData = formattedData(stock.symbol, state).reverse();
          let index = 0;
          count = 0;
          let labels = stocksIsLoaded && formattedLabels().reverse();
          oldData.forEach((data) => {
            const createdDate = new Date(stock.created_at);
            const today = new Date();
            if (!stock.sold_at) {
              if (
                !isBefore(
                  new Date(labels[`${count}`]),
                  new Date(stock.created_at)
                )
              ) {
                newData[`${count}`]
                  ? (newData[`${count}`] =
                      newData[`${count}`] + data * stock.quantity)
                  : (newData[`${count}`] = data * stock.quantity);
              } else if (!newData[`${count}`]) newData[`${count}`] = 0;
              count++;
            } else {
              if (
                !isBefore(
                  new Date(labels[`${count}`]),
                  new Date(stock.created_at)
                ) &&
                isBefore(new Date(labels[`${count}`]), new Date(stock.sold_at))
              ) {
                newData[`${count}`]
                  ? (newData[`${count}`] =
                      newData[`${count}`] + data * stock.quantity)
                  : (newData[`${count}`] = data * stock.quantity);
              } else {
                if (!newData[`${count}`]) newData[`${count}`] = 0;
              }
              count++;
            }
          });
          index++;
          if (index === Object.values(portfolios).length - 1) setIdx(count);
        });
      } else {
        newData = {};
        let count = 0;
        let labels = stocksIsLoaded && formattedLabels();
        stocksIsLoaded &&
          labels?.forEach((label) => {
            newData[`${count}`] = 0;
            count++;
          });
        return Object.values(newData);
      }
    } else {
      newData = {};
      let count = 0;
      let labels = stocksIsLoaded && formattedLabels();
      stocksIsLoaded &&
        labels?.forEach((label) => {
          newData[`${count}`] = 0;
          count++;
        });
      return Object.values(newData);
    }

    if (state === weeklyInfo || state === monthlyInfo) {
      return Object.values(newData)
        .reverse()
        .slice(idx - 30);
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
    ? formattedChange
      ? formattedChange >= 0
        ? "stock_details_percent_change_plus"
        : "stock_details_percent_change_minus"
      : formattedDataPortfolio(stockInfo)[
          formattedDataPortfolio(stockInfo).length - 1
        ] -
          formattedDataPortfolio(stockInfo)[
            formattedDataPortfolio(stockInfo).length - 2
          ] >=
        0
      ? "stock_details_percent_change_plus"
      : "stock_details_percent_change_minus"
    : weekly
    ? formattedChangeWeekly() >= 0
      ? "stock_details_percent_change_plus"
      : "stock_details_percent_change_minus"
    : formattedChangeMonthly() >= 0
    ? "stock_details_percent_change_plus"
    : "stock_details_percent_change_minus";

  const graphColor = daily
    ? formattedChange
      ? formattedChange >= 0
        ? "rgb(0, 243, 0)"
        : "rgb(255, 0, 0)"
      : formattedDataPortfolio(stockInfo)[
          formattedDataPortfolio(stockInfo).length - 1
        ] -
          formattedDataPortfolio(stockInfo)[
            formattedDataPortfolio(stockInfo).length - 2
          ] >=
        0
      ? "rgb(0, 243, 0)"
      : "rgb(255, 0, 0)"
    : weekly
    ? formattedChangeWeekly() > 0
      ? "rgb(0, 243, 0)"
      : "rgb(255, 0, 0)"
    : formattedChangeMonthly() > 0
    ? "rgb(0, 243, 0)"
    : "rgb(255, 0, 0)";

  let data = stocksIsLoaded && {
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
      y: portfolios
        ? Object.values(portfolios).length > 3 && tickerData
          ? data?.datasets[0].data[data?.datasets[0].data.length - 1] > 1000
            ? {
                grid: {
                  display: false,
                },
                min: -4000,
                ticks: {
                  display: false,
                },
              }
            : {
                grid: {
                  display: false,
                },
                max: 1000,
                min: -1000,
                ticks: {
                  display: false,
                },
              }
          : {
              grid: {
                display: false,
              },
              max: 1000,
              min: -1000,
              ticks: {
                display: false,
              },
            }
        : {
            grid: {
              display: false,
            },
            max: 1000,
            min: -1000,
            ticks: {
              display: false,
            },
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
      if (e.type === "mouseleave") {
        setHoverPrice(false);
      }
    },
    onmouseout: function (e, item) {
      console.log(e.type);
      setHoverPrice(false);
    },
    onmouseleave: function (e, item) {
      console.log(e.type);
      setHoverPrice(false);
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
  const formatDates = () => {
    let labels = formattedLabels();
    let count = 0;
    labels.forEach((label) => {
      if (isAfter(new Date(createdAt), new Date(label))) {
        count++;
      } else {
        return count;
      }
    });
    return count;
  };

  const formattedChange = Number(
    daily
      ? formattedDataPortfolio(stockInfo)[
          formattedDataPortfolio(stockInfo).length - 1
        ] -
          formattedDataPortfolio(stockInfo)[
            formattedDataPortfolio(stockInfo).length - 2
          ]
      : data?.datasets[0].data[data?.datasets[0].data.length - 1] -
          data?.datasets[0].data[0]
  );

  const formattedPercentChange =
    stocksIsLoaded &&
    (daily
      ? (
          (formattedChange /
            data?.datasets[0].data[data.datasets[0].data.length - 2]) *
          100
        ).toFixed(2) > 100
        ? 100
        : (
            (formattedChange /
              data?.datasets[0].data[data.datasets[0].data.length - 2]) *
            100
          ).toFixed(2)
      : weekly
      ? (
          (formattedChangeWeekly() / data?.datasets[0].data[formatDates()]) *
          100
        ).toFixed(2)
      : (
          (formattedChangeMonthly() / data?.datasets[0].data[formatDates()]) *
          100
        ).toFixed(2));

  return stocksIsLoaded ? (
    <>
      <div id="portfolio_container">
        <p class="portfolio-chart-warning">
          {" "}
          The Portfolio Chart Will Not Update In Real-Time, and Will Not Update
          before 8am and After 4:30pm Eastern Time Monday-Friday or On The
          Weekends. It Will Update With New Information The Next Time The Market
          Is Open.
        </p>
        <DeletePortfolioForm
          price={formatValue()}
          setStocksIsLoaded={setStocksIsLoaded}
        />
        <div id="portfolio_info_container">
          {<h1>My Portfolio</h1>}
          <h2 id="portfolio_price">
            $
            {hoverPrice
              ? Number(hoverPrice).toLocaleString("en-US")
              : formatValue().toLocaleString("en-US")}
          </h2>
          <h3 id={changeId}>
            {formattedChange.toFixed(2).toLocaleString("en-US") >= 0
              ? "+$" +
                Number(formattedChange.toFixed(2)).toLocaleString("en-US")
              : "-$" +
                Math.abs(formattedChange).toFixed(2).toLocaleString("en-US")}
            (
            {stocksIsLoaded
              ? formattedPercentChange >= 0
                ? formattedPercentChange >= 0
                  ? "+" + formattedPercentChange
                  : `${formattedPercentChange}`
                : 0
              : 0}
            %){" "}
            {stocksIsLoaded
              ? daily
                ? "Today"
                : "As of " + (createdAt ? createdAt.slice(0, 16) : "Today")
              : ""}
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
            <span className="name">1D</span>
          </label>
          <label className="chart-radio">
            <input
              type="radio"
              name="radio"
              onClick={weeklyToggle}
              checked={weekly || false}
            />
            <span className="name">1W</span>
          </label>

          <label className="chart-radio">
            <input
              type="radio"
              name="radio"
              onClick={monthlyToggle}
              checked={monthly || false}
            />
            <span className="name">1M</span>
          </label>
        </div>
        <div className="buying-power-section">
          <p className="buying-power-section-label">Buying Power</p>
          <p className="buying-power-section-content">
            ${usDollar.format(buyingPower)}
          </p>
        </div>

        <div id="portfolio-assets">
          <div id="stock-asset-container">
            <div className="stock-asset-item">Name</div>
            <div className="stock-asset-item">Symbol</div>
            <div className="stock-asset-item">Quantity</div>
            <div className="stock-asset-item">Average Price</div>
            <div className="stock-asset-item">Purchased On</div>
            <div className="stock-asset-item">Sold On</div>
            <div className="stock-asset-item">Sell Stock Button</div>
          </div>
          {stocksIsLoaded &&
            portfolios?.length > 0 &&
            Object.values(portfolios)?.map((portfolio) => {
              return (
                <SellStockForm
                  portfolio={portfolio}
                  stocksIsLoaded={stocksIsLoaded}
                  key={portfolio.id}
                />
              );
            })}
        </div>
      </div>
    </>
  ) : (
    <LoadingSymbol />
  );
}
export default PortfolioChart;
