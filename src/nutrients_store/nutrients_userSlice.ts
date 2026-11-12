import { createSlice } from '@reduxjs/toolkit';

interface INutrients_UserState {
  nutrients_username: string;
  nutrients_isAuthenticated: number; // 0 - гость, 1 - авторизован
  nutrients_error: string | null;
}

const initialState: INutrients_UserState = {
  nutrients_username: '',
  nutrients_isAuthenticated: 0,
  nutrients_error: null,
};

const nutrients_userSlice = createSlice({
  name: 'nutrients_user',
  initialState,
  reducers: {
    nutrients_loginSuccess(state, action) {
      state.nutrients_username = action.payload;
      state.nutrients_isAuthenticated = 1; // Ставим 1 при входе
      state.nutrients_error = null;
    },
    nutrients_loginFailure(state, action) {
      state.nutrients_error = action.payload;
      state.nutrients_isAuthenticated = 0;
    },
    nutrients_logoutSuccess(state) {
      state.nutrients_username = '';
      state.nutrients_isAuthenticated = 0; // Ставим 0 при выходе
      state.nutrients_error = null;
    }
  }
});

export const { nutrients_loginSuccess, nutrients_loginFailure, nutrients_logoutSuccess } = nutrients_userSlice.actions;
export default nutrients_userSlice.reducer;