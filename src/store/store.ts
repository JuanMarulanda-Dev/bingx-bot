import { configureStore } from '@reduxjs/toolkit';
import bingxAccountsReducer from './slices/bingxAccountsSlice';

export const store = configureStore({
  reducer: {
    bingxAccounts: bingxAccountsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 