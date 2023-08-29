import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import * as stockActions from '../../store/stocks'


function APItest() {
    const { ticker } = useParams();
    const dispatch= useDispatch();
    const [isLoaded, setIsLoaded] = useState(false)
    const stockInfo = useSelector((state) => state.stocks)

    useEffect(() => {
        dispatch(stockActions.stockData(ticker)).then(() => setIsLoaded(true))
    }, [dispatch, ticker])

        // console.log(stockInfo)

    return isLoaded && (
        <>
        <div>
            {stockInfo}
        </div>
        </>
    )

}

export default APItest
