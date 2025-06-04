export function changeSearchQuery(query: string) {
    return { type: "CHANGE_SEARCH_QUERY", payload: { query } };
}


export function clearSearchQuery() {
    return { type: "CLEAR_SEARCH_QUERY" };
}

const initialState = {query: localStorage.getItem("SearchQuery") ? localStorage.getItem("SearchQuery") : ""};

export default function searchBarReducer(state = initialState, action) {
    switch (action.type) {
        case "CHANGE_SEARCH_QUERY": {
            state = action.payload;
            localStorage.setItem("SearchQuery", action.payload.query);
            return {...state};
        }
        case "CLEAR_SEARCH_QUERY": {
            localStorage.removeItem("SearchQuery");
            return {...state};
        }
        default:
            return state;
    }
}