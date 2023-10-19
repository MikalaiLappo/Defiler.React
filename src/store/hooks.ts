import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import { type AppDispatch, type RootState, store } from './store';

export const useAppDispatch: AppDispatch = store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
