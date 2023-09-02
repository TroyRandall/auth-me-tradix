import { useEffect, useState } from "react";
import { getOneDayPrices } from "../../until/util2";

const StockPrice = ({symbol}) => {
    const [price, setPrice] = useState({curr:0, diff:0})
    const getData = async () => {
        const { data } = await getOneDayPrices(symbol, true);
        const curr = data.reduce((p, c) => c || p)

        setPrice({curr, diff: curr - data[0]})
    }
    useEffect(() => {
        getData()
    })
    const diffFormatter = diff => {
        const sign = diff >= 0 ? '+' : '-'
        return `${sign}${Math.abs(diff).toFixed(2)}%`
    }
    return(
        <>
         <div className="tab-table-content">{`$${price.curr.toFixed(2)}`}</div>
            <div className={price.diff < 0 ? 'pricediff-color-change tab-table-content' : 'pricediff-color tab-table-content'}>{diffFormatter(price.diff)}</div>
        </>
    )
}

export default StockPrice
