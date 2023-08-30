import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";

import * as stockActions from '../../store/stocks'


function APItest() {
    const { ticker } = useParams();
    const dispatch= useDispatch();
    const [isLoaded, setIsLoaded] = useState(false)
    const stockInfo = useSelector((state) => state.stocks)

    useEffect(() => {
        dispatch(stockActions.stockData(ticker)).then(() => setIsLoaded(true))
    }, [dispatch, ticker])

    const formattedLabels = () => {
        return Object.keys(stockInfo[ticker]['Time Series (Daily)'])
    }

    const formattedData = () => {
        data = Object.values(stockInfo[ticker]['Time Series (Daily)'])
        const newData = []
        data.forEach((dataPoint) => {
            newData.push(dataPoint['4. close'])
        })
        return newData
    }

    let data = isLoaded && {
        labels: formattedLabels(),
        datasets: [
          {
            label: `${ticker} Daily Price`,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: formattedData()
          },
        ],
      };

        // if(isLoaded) {
        //     console.log(stockInfo)
        //     const values = Object.values(stockInfo[ticker]['Time Series (Daily)'])
        //     const keys = Object.keys(stockInfo[ticker]['Time Series (Daily)'])
        //     const stockChart = new Chart()
        // }

    return isLoaded && (
        <>
        <div>
            <Line data={data} />
        </div>
        </>
    )

}

export default APItest
