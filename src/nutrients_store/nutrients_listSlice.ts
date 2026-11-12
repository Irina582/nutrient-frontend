import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { nutrients_api } from '../nutrients_modules/nutrients_api_instance';
import { NUTRIENTS_MOCK_DATA, type INutrients_Item } from '../nutrients_modules/nutrients_api';

interface INutrients_ListState {
  nutrients_minNorm: string;
  nutrients_maxNorm: string;
  nutrients_items: INutrients_Item[];
  nutrients_loading: boolean;
}

const initialState: INutrients_ListState = {
  nutrients_minNorm: '0',
  nutrients_maxNorm: '150',
  nutrients_items: [],
  nutrients_loading: false,
};

// 4-й Thunk
export const nutrients_fetchList = createAsyncThunk(
  'nutrients/fetchList',
  async (_, { getState, rejectWithValue }) => {
    const { nutrients_list }: any = getState();
    try {
      const response = await nutrients_api.api.nutrientsControllerFindAll({
        minNorm: Number(nutrients_list.nutrients_minNorm),
        maxNorm: Number(nutrients_list.nutrients_maxNorm),
      });
      return response.data as unknown as INutrients_Item[];
    } catch (error) {
      return rejectWithValue('Ошибка сети, используем мок');
    }
  }
);

// 5-й Thunk
export const nutrients_likeAsync = createAsyncThunk(
  'nutrients/like',
  async ({ id, value }: { id: number; value: number }, { dispatch, rejectWithValue }) => {
    try {
      await nutrients_api.api.nutrientsControllerLike(id, { body: { value } } as any);
      dispatch(nutrients_fetchList());
      return true;
    } catch (error) {
      return rejectWithValue('Ошибка при постановке лайка');
    }
  }
);

// 6-й Thunk (Удаление)
export const nutrients_removeAsync = createAsyncThunk(
  'nutrients/remove',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await nutrients_api.api.nutrientsControllerRemove(id);
      dispatch(nutrients_fetchList());
      return id;
    } catch (error) {
      return rejectWithValue('Ошибка при удалении');
    }
  }
);

// 7-й Thunk (Лента - для полного комплекта из 7 Thunk по заданию)
export const nutrients_fetchFeedAsync = createAsyncThunk(
  'nutrients/fetchFeed',
  async (query: { id: string; next: string }, { rejectWithValue }) => {
    try {
      const response = await nutrients_api.api.nutrientsControllerGetFeed(query);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка получения ленты');
    }
  }
);

const nutrients_listSlice = createSlice({
  name: 'nutrients_list',
  initialState,
  reducers: {
    nutrients_setMinNorm(state, action) {
      state.nutrients_minNorm = action.payload;
    },
    nutrients_setMaxNorm(state, action) {
      state.nutrients_maxNorm = action.payload;
    },
    nutrients_resetFilters(state) {
      state.nutrients_minNorm = '0';
      state.nutrients_maxNorm = '150';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(nutrients_fetchList.pending, (state) => {
        state.nutrients_loading = true;
      })
      .addCase(nutrients_fetchList.fulfilled, (state, action) => {
        state.nutrients_loading = false;
        state.nutrients_items = action.payload;
      })
      .addCase(nutrients_fetchList.rejected, (state) => {
        state.nutrients_loading = false;
        state.nutrients_items = NUTRIENTS_MOCK_DATA.filter(
          n => n.nutrients_status === 'опубликован' &&
          n.nutrients_daily_norm >= Number(state.nutrients_minNorm) &&
          n.nutrients_daily_norm <= Number(state.nutrients_maxNorm)
        );
      });
  },
});

export const { nutrients_setMinNorm, nutrients_setMaxNorm, nutrients_resetFilters } = nutrients_listSlice.actions;
export default nutrients_listSlice.reducer;