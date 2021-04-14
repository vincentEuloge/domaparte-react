import type { ForkEffect } from 'redux-saga/effects';
import type {
  Action,
  CaseReducer,
  CaseReducerActions,
  PayloadAction,
  Slice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from '@reduxjs/toolkit';

type Actions<T extends keyof any = string> = Record<T, Action>; //eslint-disable-line
type CaseReducers<S, AS extends Actions> = {
  [T in keyof AS]: AS[T] extends Action ? CaseReducer<S, AS[T]> : void;
};

export interface CreateSagaSliceOptions<
  Out,
  In,
  State = unknown,
  CR extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string,
  SagaCaseReducers extends SagaSliceCaseReducers<State, Out, In>
    = SagaSliceCaseReducers<State, Out, In>,
> {
  name: Name;
  initialState: State;
  reducers?: ValidateSliceCaseReducers<State, CR>;
  sagas: SagaCaseReducers extends {
    [K: string]: Saga<State, Out, In>;
  } ? SagaCaseReducers : {
    [K: string]: Saga<State, Out, In>;
  }
}

export interface CreateSagaSliceOptionsWithExtra<
  State = unknown,
  CR extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string,
> {
  name: Name;
  initialState: State;
  reducers?: ValidateSliceCaseReducers<State, CR>;
  extraReducers: CaseReducers<State, any>; //eslint-disable-line
}

export type SagaSliceCaseReducers<State, Out, In> = {
  [K: string]: Saga<State, Out, In>;
};

interface Saga<
  State,
  ActionResult,
  ActionParameter,
> {
  strategy: 'takeEvery' | 'takeLeading' | 'takeLatest';
  onAction(arg: ActionParameter): Promise<ActionResult>;
  onPending?: CaseReducer<State, PayloadAction<{init: ActionParameter}>>;
  onFulfilled: CaseReducer<State, PayloadAction<{init: ActionParameter, result: ActionResult}>>;
  onRejected?: CaseReducer<State, PayloadAction<{init: ActionParameter, error: Error}>>;
}

export interface SagaSlice<
  Out = unknown,
  In = unknown,
  State = unknown,
  CR extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string,
  SagaCaseReducers extends SagaSliceCaseReducers<State, Out, In>
    = SagaSliceCaseReducers<State, Out, In>,
> extends Slice<
  State, CR, Name
>{
  actions: CaseReducerActions<CR> & SagaCaseReducerActions<Out, In, State, SagaCaseReducers>;
  sagas: ForkEffect<never>[];
}

export type SagaCaseReducerActions<
  Out, In, State, SagaCaseReducers extends SagaSliceCaseReducers<State, Out, In>
> = {
  [Type in keyof SagaCaseReducers]: Parameters<SagaCaseReducers[Type]['onAction']>[0] extends undefined ? () => void : (arg: Parameters<SagaCaseReducers[Type]['onAction']>[0]) => void
}
