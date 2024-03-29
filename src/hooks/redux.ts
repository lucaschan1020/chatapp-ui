import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppState, AppDispatch } from '@/state';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
