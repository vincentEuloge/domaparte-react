import { createAction } from '@reduxjs/toolkit';
import {
  call, put, takeEvery, takeLeading, takeLatest,
} from 'redux-saga/effects';
import type {
  ActionCreatorWithPayload, PayloadAction, PayloadActionCreator,
} from '@reduxjs/toolkit';
import type { ForkEffect } from 'redux-saga/effects';

export type ActionSaga<
  ActionPayload = void, FulfilledPayload = void
> = PayloadActionCreator<ActionPayload, string> & {
  pending: ActionCreatorWithPayload<{init: ActionPayload}>;
  fulfilled: ActionCreatorWithPayload<{init: ActionPayload, result: FulfilledPayload}>;
  rejected: ActionCreatorWithPayload<{init: ActionPayload, error: Error}>;
  saga: ForkEffect<never>;
}

export const createAsyncSaga = <
    ActionPayload = void, FulfilledPayload = void,
  >(
    typePrefix: string,
    sagaStrategy: 'takeEvery' | 'takeLeading' | 'takeLatest',
    onSagaCallback: (arg: ActionPayload) => Promise<FulfilledPayload>,
  )
  : ActionSaga<ActionPayload, FulfilledPayload> => {
  const action = createAction(typePrefix) as ActionSaga<ActionPayload, FulfilledPayload>;
  action.pending = createAction(`${typePrefix}/pending`);
  action.fulfilled = createAction(`${typePrefix}/fulfilled`);
  action.rejected = createAction(`${typePrefix}/rejected`);

  const strategy = { takeEvery, takeLatest, takeLeading }[sagaStrategy];

  action.saga = strategy(action.type, function* onSaga(arg: PayloadAction<ActionPayload>) {
    const init = arg.payload;
    yield put(action.pending({ init }));
    try {
      const result = (yield call(onSagaCallback, init)) as FulfilledPayload;
      yield put(action.fulfilled({ init, result }));
    } catch (error) {
      yield put(action.rejected({ init, error }));
    }
  });

  return action;
};
