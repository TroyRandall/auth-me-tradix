const ADD_PORTFOLIO_ITEM = "portfolio/ADD_PORTFOLIO_ITEM";
const GET_TRADIX_PORTFOLIOS = "portfolio/GET_TRADIX_PORTFOLIOS";

const addPortfolio = (data) => ({
  type: ADD_PORTFOLIO_ITEM,
  payload: data,
});

const getTradixPortfolios = (data, id) => ({
  type: GET_TRADIX_PORTFOLIOS,
  payload: {
    data: data,
    id: id,
  },
});

export const addPortfolioItem = (portfolio) => async (dispatch) => {
  let { id, tickerSymbol, quantity, avgPrice } = portfolio;
  const response = await fetch(`/api/portfolio/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: id,
      symbol: tickerSymbol,
      name: tickerSymbol,
      quantity: quantity,
      avg_price: avgPrice,
    }),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(addPortfolio(data));
    console.log(data);
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

//still working on this route for the reducer will continue tomorrow

// export const deletePortfolioItem = (id, name) => (dispatch) => {
//     const response = await fetch(`/api/portolfios/${id}`, {
//         method: 'POST',
//         headers: {
// 			"Content-Type": "application/json",
// 		},

//     }
//     )
// }

export const getPortfoliosByUser = (id) => async (dispatch) => {
  const response = await fetch(`/api/portfolio/${id}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getTradixPortfolios(data, id));
    return data;
  } else {
    throw new Error("Unable to complete request please try again");
  }
};

const initialState = { portfolios: null };

const portfolioReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_TRADIX_PORTFOLIOS:
      newState = Object.assign({}, state);
      newState[action.payload.id] = action.payload.data;
      return newState;
    case ADD_PORTFOLIO_ITEM:
      newState = Object.assign({}, state);
      newState['newPortfolio'] = action.payload;
    default:
      return state;
  }
};

export default portfolioReducer;
