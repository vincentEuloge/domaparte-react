import { createSlice } from '@reduxjs/toolkit';
import type { ForkEffect } from 'redux-saga/effects';
import type {
  ActionCreatorWithPayload,
  CaseReducerActions,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from '@reduxjs/toolkit';

import { createAsyncSaga } from './createAsyncSaga';
import type {
  CreateSagaSliceOptions,
  CreateSagaSliceOptionsWithExtra,
  SagaCaseReducerActions,
  SagaSlice,
  SagaSliceCaseReducers,
} from './createSagaSlice.type';

export function createSagaSlice<
  Out,
  In,
  State,
  CR extends SliceCaseReducers<State>,
  SagaCaseReducers extends SagaSliceCaseReducers<State, Out, In>,
  Name extends string = string
>(
  {
    sagas: sagasOption,
    ...restOptions
  }: CreateSagaSliceOptions<Out, In, State, CR, Name, SagaCaseReducers>,
): SagaSlice<Out, In, State, CR, Name, SagaCaseReducers> {
  const sagas: ForkEffect<never>[] = [];
  const sagasActions: {[K: string]: ActionCreatorWithPayload<unknown, string>} = {};
  const sliceOptions: CreateSagaSliceOptionsWithExtra<State, CR, Name> = {
    ...restOptions,
    extraReducers: {},
  };

  Object.entries(sagasOption).forEach((
    [
      sagaName,
      {
        strategy, onAction, onPending, onFulfilled, onRejected,
      },
    ],
  ) => {
    const typePrefix = `${sliceOptions.name}/${sagaName}`;
    const action = createAsyncSaga(
      typePrefix,
      strategy,
      onAction,
    );

    if (onPending) sliceOptions.extraReducers[action.pending.type] = onPending;
    sliceOptions.extraReducers[action.fulfilled.type] = onFulfilled;
    if (onRejected) sliceOptions.extraReducers[action.rejected.type] = onRejected;
    sagas.push(action.saga);
    sagasActions[sagaName] = action as ActionCreatorWithPayload<unknown, string>;
  });

  const slice = createSlice(
    { reducers: {} as ValidateSliceCaseReducers<State, CR>, ...sliceOptions },
  );

  const actions = {
    ...slice.actions,
    ...sagasActions,
  } as CaseReducerActions<CR> & SagaCaseReducerActions<Out, In, State, SagaCaseReducers>;
  const { name, reducer, caseReducers } = slice;
  return {
    name, actions, caseReducers, reducer, sagas,
  };
}
