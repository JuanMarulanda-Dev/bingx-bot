import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TradeState {
  results: any[];
  isExecuting: boolean;  // Cambiamos isLoading por isExecuting para ser más específicos
  error: string | null;
}

const initialState: TradeState = {
  results: [],
  isExecuting: false,
  error: null
};

export const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setTradeResults: (state, action: PayloadAction<any[]>) => {
      state.results = action.payload;
    },
    setExecuting: (state, action: PayloadAction<boolean>) => {
      state.isExecuting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setTradeResults, setExecuting, setError } = tradeSlice.actions;
export default tradeSlice.reducer; 