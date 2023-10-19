import { createSlice } from '@reduxjs/toolkit';

import { IUser } from '../../types/user';
import type { RootState } from '../store';

export type Token = string;
interface AuthState {
  token: Token | null;
  user: IUser | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: { type: string; payload: Token }) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectToken = (state: RootState) => state.auth.token;
export default authSlice.reducer;
