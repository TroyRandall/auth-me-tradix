//constants

const GET_STOCK_DATA = 'stocks/GET_STOCK_DATA'

const getStocks = (ticker) => ({
    type: GET_STOCK_DATA,
    payload: ticker
})

export const stockData = (ticker, key) => async (dispatch) => {
    // url =f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={ticker}&apikey={key}'
    // r = requests.get(url)
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${key}`)
    if (response.ok){
        const data = response.json()
        if(data.errors){
            return;
        }

        dispatch(getStocks(data));
    }
}


export default function reducer(state = initialState, action) {
	switch (action.type) {
		case GET_STOCK_DATA:
			return { stock: action.payload };
		default:
			return state;
	}
}
