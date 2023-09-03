
const ADD_PORTFOLIO_ITEM = 'portfolio/ADD_PORTFOLIO_ITEM'
const GET_PORTFOLIOS = 'portfolio/GET_PORTFOLIOS'

const addPortfolio = (data) => ({
    type: ADD_PORTFOLIO_ITEM,
    payload: data
})

const getPortfolios = (data, id) => ({
    type: GET_PORTFOLIOS,
    payload: [data, id]
})

export const addPortfolioItem = (portfolio) => async (dispatch) => {
    let {id, symbol,  quantity, avgPrice} = portfolio;
    const response = await fetch(`/api/portfolio/${id}`, {
        method: 'POST',
        headers: {
			"Content-Type": "application/json",
		},
        body: JSON.stringify({
            "user_id": id,
            "symbol": symbol,
            "name": symbol,
            "quantity": quantity,
            "avg_price": avgPrice
        })
    });
    if(response.ok){
        const data = await response.json();
        dispatch(addPortfolio(data))
    }
}


export const getPortfoliosByUser = (id) => async (dispatch) => {
    const response = await fetch(`/api/portfolio/${id}`)
    if (response.ok) {
        const data = await response.json()
        dispatch(getPortfolios(data, id))
    }
}

const initialState = {portfolios: null}

const portfolioReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case GET_PORTFOLIOS:
            newState = Object.assign({}, state);
            newState[action.payload[1]] = action.payload[0]
            return newState;
        default:
            return state;
    }
}

export default portfolioReducer;
