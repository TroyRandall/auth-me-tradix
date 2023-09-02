
const GET_COMPANY_DATA = "companies/GET_COMPANY_DATA"

const companyData = (data) => ({
    type: GET_COMPANY_DATA,
    payload: data
})

export const companyDataFetch = (ticker) => async (dispatch) => {
    const response = await fetch(`/api/stocks/company/${ticker}`);
    if(response.ok){
        const data = await response.json();
        dispatch(companyData(data));
    }
};

const initialState = { companies: null };

const companiesReducer = (state=initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_COMPANY_DATA:
            newState = Object.assign({}, state)
            newState[action.payload['Symbol']] = action.payload;
            return newState
        default:
            return state;
    }

}

export default companiesReducer;
