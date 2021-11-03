import { configureStore } from '@reduxjs/toolkit';

import application from './application/reducer';
import { updateVersion } from './global/actions';
import multicall from './multicall/reducer';
import transactions from './transactions/reducer';

// TODO: Persist storage
const store = configureStore({
  reducer: {
    application,
    multicall,
    transactions,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ thunk: false }),
  ],
});

store.dispatch(updateVersion());

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
