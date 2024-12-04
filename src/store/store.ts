import { configureStore } from '@reduxjs/toolkit';
import tradeReducer from './slices/tradeSlice';

export const store = configureStore({
  reducer: {
    trade: tradeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 