import { configureStore } from '@reduxjs/toolkit';
import nutrients_listReducer from './nutrients_listSlice';
import nutrients_userReducer from './nutrients_userSlice';
import nutrients_draftReducer from './nutrients_draftSlice';

export const nutrients_store = configureStore({
  reducer: {
    nutrients_list: nutrients_listReducer,
    nutrients_user: nutrients_userReducer,
    nutrients_draft: nutrients_draftReducer,
  },
});

export type RootState = ReturnType<typeof nutrients_store.getState>;
export type AppDispatch = typeof nutrients_store.dispatch;