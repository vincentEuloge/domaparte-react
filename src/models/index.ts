import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import type { AllEffect, ForkEffect } from 'redux-saga/effects';

import { slice as temperaturesSlice } from './temperatures';

const actions = {
  [temperaturesSlice.name]: temperaturesSlice.actions,
};

const reducer = combineReducers({
  [temperaturesSlice.name]: temperaturesSlice.reducer,
});
function* sagas(): Generator<AllEffect<ForkEffect<never>>, void, unknown> {
  yield all([
    ...temperaturesSlice.sagas,
  ]);
}

interface AppStore {
  [temperaturesSlice.name]: ReturnType<typeof temperaturesSlice.reducer>;
}

export { actions, reducer, sagas };
export type {
  AppStore,
};
