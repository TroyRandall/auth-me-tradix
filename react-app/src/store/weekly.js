
const GET_WEEKLY_DATA = "weekly/GET_STOCK_DATA"

const getWeekly = (data) => ({
    type: GET_WEEKLY_DATA,
    payload: data
})

export const stockDataWeekly = (ticker) => async (dispatch) => {
    const response = await fetch(`/api/stocks/weekly/${ticker}`);
    if (response.status === 304) return null
  if (response.ok) {
    const data = await response.json();
    dispatch(getWeekly(data));
  } else {
    throw new Error('Unable to complete request please try again')
}
}

const initialState = {weekly: null};

const stocksWeeklyReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_WEEKLY_DATA:
      newState = {...state}
      newState[action.payload["Meta Data"]["2. Symbol"]] = action.payload;
      return newState;
    default:
      return state;
  }
};

export default stocksWeeklyReducer;
