import { useSelector as _useSelector, useDispatch as _useDispatch } from 'react-redux';
import store from '@/store';

export function useSelector<K extends keyof ReturnType<typeof store.getState>>(state: K): ReturnType<typeof store.getState>[K] {
  return _useSelector((_store: ReturnType<typeof store.getState>) => _store[state]);
}

export function useDispatch(): typeof store.dispatch {
  return _useDispatch();
}
