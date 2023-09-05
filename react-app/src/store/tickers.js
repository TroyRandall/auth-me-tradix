const GET_TICKER_DATA = "stocks/GET_TICKER_DATA";
const SEARCH_TICKER_INFO = "stocks/SEARCH_TICKER_DATA"

const tickerData = (data) => ({
  type: GET_TICKER_DATA,
  payload: data,
});

const tickerSearch = (data) => ({
  type: SEARCH_TICKER_INFO,
  payload: data
})

export const stockTickerInfo = (ticker) => async (dispatch) => {
  const response = await fetch(`/api/stocks/${ticker}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(tickerData(data));
  } else {
    throw new Error('Unable to complete request please try again')
}
};

export const stockTickerSearch = (ticker) => async (dispatch) => {
  const response = await fetch(`/api/stocks/${ticker}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(tickerSearch(data));
  }
}

const initialState = { tickers: null };

const tickersReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_TICKER_DATA:
      newState = Object.assign({}, state);
      newState[action.payload['bestMatches'][0]['1. symbol']] = action.payload['bestMatches'][0];
      return newState;
    case SEARCH_TICKER_INFO:
      newState = Object.assign({}, state);
      newState.bestMatches = action.payload['bestMatches'];
      return newState;
    default:
      return state;
  }
};

export default tickersReducer;
