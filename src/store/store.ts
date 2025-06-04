import { applyMiddleware, combineReducers } from "redux";
import {legacy_createStore as createStore} from 'redux'
import createSagaMiddleware from "redux-saga";
import cartReducer from "../reducers/cartReducer";
import rootSaga from "../sagas/cart";
import searchBarReducer from "../reducers/searchBarReducer";

const reducer = combineReducers({
  cart: cartReducer,
  search: searchBarReducer
});

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga)


// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

export default store
