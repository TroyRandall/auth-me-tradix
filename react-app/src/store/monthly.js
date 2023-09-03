
const GET_MONTHLY_DATA = "monthly/GET_STOCK_DATA"

const getMonthly = (data) => ({
    type: GET_MONTHLY_DATA,
    payload: data
})

export const stockDataMonthly = (ticker) => async (dispatch) => {
    const response = await fetch(`/api/stocks/monthly/${ticker}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getMonthly(data));
  }
}

const initialState = { monthly: null };

const stocksMonthlyReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_MONTHLY_DATA:
      newState = Object.assign({}, state);
      newState[action.payload["Meta Data"]["2. Symbol"]] = action.payload;
      return newState;
    default:
      return state;
  }
};

export default stocksMonthlyReducer;
