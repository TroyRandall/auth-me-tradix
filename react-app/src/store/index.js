import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
<<<<<<< HEAD
import stocksReducer from './stocks'
import sessionReducer from './session';
import tickersReducer from './tickers'

const rootReducer = combineReducers({
  session: sessionReducer,
  stocks: stocksReducer,
  tickers: tickersReducer
=======
import session from './session'
import watchlistReducer from './watchlist';

const rootReducer = combineReducers({
  session,
  watchlists: watchlistReducer

>>>>>>> 84324cda2c39153bd9113d1b25a68816d5e247cc
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
