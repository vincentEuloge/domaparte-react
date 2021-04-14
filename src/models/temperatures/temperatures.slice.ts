import { createSagaSlice, asyncState } from '../../utils';
import { getTemperatures } from '../../apis';
import type { AsyncStateType } from '../../utils';
import type { Temperature } from '../../apis';

export const slice = createSagaSlice({
  name: 'temperatures',
  initialState: asyncState.notAsked() as AsyncStateType<Temperature[]>,
  sagas: {
    fetch: {
      strategy: 'takeLeading',
      onAction: getTemperatures,
      onPending: () => asyncState.loading(),
      onFulfilled: (_, action) => asyncState.done(action.payload.result),
      onRejected: (_, action) => asyncState.error(action.payload.error.message),
    },
  },
});
