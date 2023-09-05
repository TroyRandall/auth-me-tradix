const LOAD_STOCKS = "stock/loadStocks";

export function loadStocks(stock) {
    return {
        type: LOAD_STOCKS,
        stock
    }
}

export const fetchStockPrice = (symbol) => async dispatch => {
    const apiKey = 'R2U6YKJW1SL78Y3Z'
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;

    try {
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          const lastRefreshed = data['Meta Data']['3. Last Refreshed'];
          const currPrice = data['Time Series (1min)'][lastRefreshed]['4. close'];
          // Handle data and dispatch as needed
        }
      } catch (error) {
        console.error('Error fetching stock price:', error);
      }
    };

const watchlistStockReducer = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case LOAD_STOCKS:
            newState = { ...state };
            newState[action.stock.symbol] = {
                currPrice: action.stock.currPrice,
                prePrice: action.stock.prePrice,
                diffPercentage: action.stock.diffPercentage
            }
            return newState;

        default:
            return state;
    }

}

export default watchlistStockReducer;
