//constants

const GET_STOCK_DATA = 'stocks/GET_STOCK_DATA'

const getStocks = (ticker, data) => ({
    type: GET_STOCK_DATA,
    payload: {ticker, data}
})

export const stockData = (ticker) => async (dispatch) => {
    // url =f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={ticker}&apikey={key}'
    // r = requests.get(url)
    console.log('--------first')
    const response = await fetch(`/api/stocks/${ticker}`)
    console.log('---------second')
    console.log(response, '------- this is the response!!!!!!!')
    if (response.ok){
        // const data = await response.json()
        // console.log(data)
        // if(data.errors){
        //     return;
        // }

        dispatch(getStocks(ticker, response));
    }
}

const initialState = {stocks: null}

export default function reducer(state = initialState, action) {
    let newState;
	switch (action.type) {
		case GET_STOCK_DATA:
			newState = Object.assign({}, state)
            newState[action.payload.ticker] = action.payload.data
            return newState
		default:
			return state;
	}
}
