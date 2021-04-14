import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import type { Store, Reducer } from 'redux';
import type { Saga, Task } from 'redux-saga';
import type { ForkEffect } from 'redux-saga/effects';

import { reducer as app, sagas } from './models';

const sagaMiddleware = createSagaMiddleware();

interface MyStore extends Store {
  injectSaga?: (
    key: string,
    asyncSaga: Saga<Generator<ForkEffect<never>, void, unknown>[]>
  ) => void;
  injectReducer?: (
    key: string,
    asyncReducer: Reducer
  ) => void;
 }

function createReducer(asyncReducers = {}): Reducer {
  return combineReducers({
    app,
    ...asyncReducers,
  });
}

const store: MyStore = createStore(
  createReducer(),
  {},
  applyMiddleware(sagaMiddleware),
);

// Add a dictionary to keep track of the registered async reducers and sagas
const asyncReducers: {[key: string]: Reducer} = {};
const asyncSagas: {[key: string]: Task} = {};

// Add injectSaga method to our store
store.injectSaga = (key, asyncSaga) => {
  // We won't run saga if it is already injected
  if (asyncSagas[key]) return;
  // Sagas return task when they executed, which can be used to cancel them
  // Save the task if we want to cancel it in the future
  asyncSagas[key] = sagaMiddleware.run(asyncSaga);
};

store.injectSaga('root', sagas);

// Create an inject reducer function
// This function adds the async reducer, and creates a new combined reducer
store.injectReducer = (key, asyncReducer) => {
  asyncReducers[key] = asyncReducer;
  store.replaceReducer(createReducer(asyncReducers));
};

export default store;
