const ADD_PORTFOLIO_ITEM = 'portfolio/ADD_PORTFOLIO_ITEM'

const addPortfolio = (data) => ({
    type: ADD_PORTFOLIO_ITEM,
    payload: data
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
