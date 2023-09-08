const SET_SYMBOL = 'symbol/SET'

const setSymbol = (symbol, name) => ({
    type: SET_SYMBOL,
    symbol,
    name
  })
  export const searchSymbolData = (keyword) => async (dispatch) => {
    try {
      const response = await fetch(`/api/search/${keyword}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data + "----------------")

      dispatch(setSymbol(data));
    } catch (error) {
      console.error('Error searching data:', error);

    }
  };


  const initialState = {
    symbol: '',
    name: '',
    data: null,
  };
  const searchReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_SYMBOL:
        return {
          ...state,
          symbol: action.symbol,
          name: action.name,
          data: action.data,
        };

      default:
        return state;
    }
  };

  export default searchReducer;
