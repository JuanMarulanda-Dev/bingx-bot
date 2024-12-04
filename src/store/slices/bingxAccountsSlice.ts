import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface BingXAccount {
  apiKey: string;
  secretKey: string;
  owner: string;
}

interface BingXAccountsState {
  accounts: BingXAccount[];
  loading: boolean;
  error: string | null;
}

const initialState: BingXAccountsState = {
  accounts: [],
  loading: false,
  error: null,
};

export const loadBingXAccounts = createAsyncThunk(
  'bingxAccounts/load',
  async () => {
    const accounts = await import('C:/Bingx/accounts.json');
    return accounts.default;
  }
);

const bingxAccountsSlice = createSlice({
  name: 'bingxAccounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBingXAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadBingXAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload.accounts as BingXAccount[];
      })
      .addCase(loadBingXAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar las cuentas';
      });
  },
});

export default bingxAccountsSlice.reducer; 