const SET_SYMBOL = 'symbol/SET'


export const setSymbol = (symbol, name) => ({
  type: SET_SYMBOL,
  symbol,
  name
})

const initialState = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
}

const tickerReducer = ( state = initialState, action ) => {
  switch(action.type){
      case SET_SYMBOL:
          return {symbol: action.symbol, name: action.name}
      default:
          return state
  }
}

export default tickerReducer

// // const setSymbol = (symbol, name) => ({
// //     type: SET_SYMBOL,
// //     symbol,
// //     name
// //   })
//   const setSymbol = (keyword) => ({
//     type: SET_SYMBOL,
//     keyword
//   })
//   export const searchSymbolData = (keyword) => async (dispatch) => {
//     try {
//       const response = await fetch(`/api/search/${keyword}`);
//       console.log(keyword + "-----right here")

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();

//       dispatch(setSymbol(keyword));
//     } catch (error) {
//       console.error('Error searching data:', error);

//     }
//   };


//   const initialState = {
//     keyword: '',
//     data: [],
//   };
//   const searchReducer = (state = initialState, action) => {
//     switch (action.type) {
//       case SET_SYMBOL:
//         console.log('SET_SYMBOL action received:', action);
//         return {
//           ...state,
//           keyword: action.keyword,
//         //   symbol: action.symbol,
//         // //   name: action.name,
//         //   data: action.data,
//         };

//       default:
//         return state;
//     }
//   };

//   export default searchReducer;
// actions/searchActions.js

// export const SEARCH_START = 'search/START';
// export const SEARCH_SUCCESS = 'search/SUCCESS';
// export const SEARCH_FAILURE = 'search/FAILURE';

// export const searchStart = () => ({
//   type: SEARCH_START,
// });

// export const searchSuccess = (results) => ({
//   type: SEARCH_SUCCESS,
//   payload: results,
// });

// export const searchFailure = (error) => ({
//   type: SEARCH_FAILURE,
//   payload: error,
// });
// export const searchStocks = (keyword) => async (dispatch) => {
//     try {
//       dispatch(searchStart());


//       const alphaVantageResponse = await fetch(`/api/search/${keyword}`);
//       const alphaVantageData = await alphaVantageResponse.json();


//     //   const localDatabaseResponse = await fetch(`/api/local-database-search/${keyword}`);
//     //   const localDatabaseData = await localDatabaseResponse.json();

//       // Combine data from both sources (modify this structure based on your requirements)
//       const combinedData = {
//         alphaVantageData,
//         // localDatabaseData,
//       };

//       dispatch(searchSuccess(combinedData));
//     } catch (error) {
//       dispatch(searchFailure(error.message || 'An error occurred while searching.'));
//     }
//   };

// const initialState = {
//     isLoading: false,
//     error: null,
//     results: [],
//   };

//   const searchReducer = (state = initialState, action) => {
//     switch (action.type) {
//       case SEARCH_START:
//         return {
//           ...state,
//           isLoading: true,
//           error: null,
//         };
//       case SEARCH_SUCCESS:
//         return {
//           ...state,
//           isLoading: false,
//           results: action.payload,
//         };
//       case SEARCH_FAILURE:
//         return {
//           ...state,
//           isLoading: false,
//           error: action.payload,
//         };
//       default:
//         return state;
//     }
//   };

//   export default searchReducer;
