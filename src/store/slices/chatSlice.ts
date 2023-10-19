import { createSlice } from '@reduxjs/toolkit';

import { IMessageData } from '../../types/chat';
import type { RootState } from '../store';

interface CounterState {
  messages: IMessageData[];
}

const initialState: CounterState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: { type: string; payload: IMessageData[] }) => {
      state.messages = action.payload;
    },
  },
});

export const { setMessages } = chatSlice.actions;

export const selectMessages = (state: RootState) => state.chat.messages;
export default chatSlice.reducer;
