//constants

const GET_STOCK_DATA = "stocks/GET_STOCK_DATA";
const GET_TICKER_DATA = 'stocks/GET_TICKER_DATA'

const getStocks = (data) => ({
  type: GET_STOCK_DATA,
  payload: data,
});

const tickerData = (data) => ({
    type: GET_TICKER_DATA,
    payload: data
})

export const stockDataDaily = (ticker) => async (dispatch) => {
  // url =f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={ticker}&apikey={key}'
  // r = requests.get(url)
  const response = await fetch(`/api/stocks/daily/${ticker}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getStocks(data));
  }
};

export const stockTickerInfo = (ticker) => async (dispatch) => {
    const response = await fetch(`/api/stocks/${ticker}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(tickerData(data));
    }
};

const initialState = { stocks: null };

const stocksReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_STOCK_DATA:
      newState = Object.assign({}, state);
      newState[action.payload["Meta Data"]["2. Symbol"]] = action.payload;
      return newState;
    //   VVV move this into its own reducer for tickers, will make following dataflow for graphing much easier VVVVV
    case GET_TICKER_DATA:
        newState = Object.assign({}, state);
        newState[action.payload["Meta Data"]["2. Symbol"]] = action.payload;
        return newState
    default:
      return state;
  }
};

export default stocksReducer;
