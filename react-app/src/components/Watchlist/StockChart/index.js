import Chart from 'react-apexcharts'
import { useEffect, useState } from 'react'
import { getOneDayPrices } from '../../until/util2'
import PlaceHolder from '../../PlaceHolder'
import styles from './index.css'
import { Link } from 'react-router-dom'

const SmallChart = ({ symbol }) => {
    const [allData, setAllData] = useState({})
    const [color, setColor] = useState('#5ac53b')
    const [isLoaded, setIsLoaded] = useState(false)
    const [prices, setPrices] = useState({curr: 0, diff: 0})
    const [isRealtime, setIsRealtime] = useState(false)

    const diffFormatter = diff => {
        const sign = diff >= 0 ? '+' : '-'
        return `${sign}${Math.abs(diff).toFixed(2)}%`
    }

    const setChart = (data) => {
        setAllData({
            series: [{
                data
            }],
            // categories: Array(40).fill('1')
        })
        setColor(data[0] <= data.reduce((p, c) => c || p) ? '#5ac53b' : '#ec5e2a')
    }

    const getOneDayData = async () => {
        const res = Array(40).fill(null);
        const { data, realtime } = await getOneDayPrices(symbol, true);

        const curr = data.reduce((p, c) => c || p, null);

        setPrices({ curr, diff: curr - data[0] });
        data.forEach((d, i) => {
            res[i] = d;
        });

        setChart(res);

        setIsRealtime(realtime);
        setIsLoaded(true);
    }

    useEffect(() => {
        getOneDayData()
    }, [])

    useEffect(() => {
        if(isRealtime) { setTimeout(async () => {await getOneDayData()}, 5000) }
    }, [isRealtime, allData])

    return (
        isLoaded ?
        <div className={styles.container}>
            <Link to={`/stocks/${symbol}`}>
                <div className={styles.symbol}>{symbol}</div>
            </Link>
            <Chart
                series={allData.series}
                options={{
                    chart: {
                        animations: { enabled: false },
                        type: 'line',
                        zoom: { enabled: false },
                        toolbar: { show: false },
                        parentHeightOffset: 0,
                    },
                    colors: [color],
                    xaxis: { labels: { show: false }},
                    yaxis: {
                        labels: { show: false },

                    },
                    grid: { show: false },
                    stroke: {
                        width: 1.5,
                    },
                    legend: {
                        show: false,
                    },
                    tooltip: {
                        enabled: false,
                    },
                }}
                height={80}
                width={140}
            />
          <div>
                {prices.curr !== null ? (
                    <div>{`$${prices.curr.toFixed(2)}`}</div>
                ) : (
                    <div>No data available</div>
                )}
                <div style={{ color }}>{diffFormatter(prices.diff)}</div>
            </div>
        </div> :
        <PlaceHolder height={60} />
    )
}

export default SmallChart
