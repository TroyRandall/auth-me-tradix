import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import stocksReducer from './stocks'
import sessionReducer from './session';
import tickersReducer from './tickers'
import companiesReducer from './companyData'
import watchlistReducer from './watchlist'
import stocksMonthlyReducer from './monthly'
import stocksWeeklyReducer from './weekly'
import portfolioReducer from './portfolio'
import newsReducer from './news';


const rootReducer = combineReducers({
  session: sessionReducer,
  stocks: stocksReducer,
  tickers: tickersReducer,
  companies: companiesReducer,
  watchlists: watchlistReducer,
  monthly: stocksMonthlyReducer,
  weekly: stocksWeeklyReducer,
  news: newsReducer,
  portfolios: portfolioReducer,
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
