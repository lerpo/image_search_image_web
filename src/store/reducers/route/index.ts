import { createSlice } from '@reduxjs/toolkit';
import type { IMatchRoute } from '@/types/route';

const initialState: {
  route?: IMatchRoute;
} = {
  route: undefined,
}

export const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    switchRoute: (state, { payload }) => {
      console.log('payload', payload);
      state.route = payload;
    }
  },
  extraReducers(builder) {

  }
});

export const { switchRoute } = routeSlice.actions;

export default routeSlice.reducer;
