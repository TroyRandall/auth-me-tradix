//constants

const GET_STOCK_DATA = "stocks/GET_STOCK_DATA";


const getStocks = (data) => ({
  type: GET_STOCK_DATA,
  payload: data,
});


export const stockDataDaily = (ticker) => async (dispatch) => {
  // url =f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={ticker}&apikey={key}'
  // r = requests.get(url)
  const response = await fetch(`/api/stocks/daily/${ticker}`);
  // if (response.status === 304) return null
  if (response.ok) {
    const data = await response.json();
       dispatch(getStocks(data));
  }else {
    throw new Error('Unable to complete request please try again')
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
    default:
      return state;
  }
};

export default stocksReducer;
