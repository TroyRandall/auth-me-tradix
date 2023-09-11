const SEED_NEWS = "news/read"

export const addArticlesToStore = articles => {
    return {
        type: SEED_NEWS,
        articles
    }
}

export const getArticlesFromDb = () => async dispatch => {
    const response = await fetch(`/api/news`)
    if (response.ok) {
        const articles = await response.json()
        dispatch(addArticlesToStore(articles))
    }
}

const newsReducer = (state = {}, action) => {
    switch (action.type) {
        case SEED_NEWS: {
            const newState = { ...state }
            for (const article of action.articles) {
                newState[article["article_link"]] = article
            }
            return newState
        }

            default:
            return state
    }
}

export default newsReducer
