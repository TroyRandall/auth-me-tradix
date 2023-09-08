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
    // const percentage = ((props.price - props.openPrice) / props.openPrice) * 100;

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
//     const StockChart = null;
//     if (percentage > 0) {
//     StockChart = StockChart_increase;
//   } else {
//     StockChart = StockChart_decrease;
//   }

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
        <div className='roww'>
        <div className={styles.container} id='row-intro'>

            <Link to={`/stocks/${symbol}`}>
                <div className="">{symbol}</div>
            </Link>
            </div>
            {/* <div className="row__chart">
            <img id="stockchartpic" height={40}  src="https://raw.githubusercontent.com/ZakiRangwala/Robinhood-Clone/cde46d27cc0529e0785185793170e757688eee82/src/stock2.svg"></img>
      </div> */}


        </div> :
        <PlaceHolder height={60} />
    )
}

export default SmallChart
