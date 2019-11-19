import { createStore, applyMiddleware, compose } from 'redux';
import myReducer from './reducer';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './saga';

const sagaMiddleware = createSagaMiddleware();
// @ts-ignore
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    myReducer,
    composeEnhancer(applyMiddleware(sagaMiddleware)) 
);

sagaMiddleware.run(rootSaga);
