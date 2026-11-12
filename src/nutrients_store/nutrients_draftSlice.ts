import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { nutrients_api } from '../nutrients_modules/nutrients_api_instance';

interface INutrients_DraftState {
  nutrients_draftId: number | null;
  nutrients_isDraft: boolean;
  nutrients_data: {
    name: string;
    dailyNorm: number | string;
    unit: string;
    description: string;
    imageKey: string;
    videoKey: string;
  };
}

const initialState: INutrients_DraftState = {
  nutrients_draftId: null,
  nutrients_isDraft: false,
  nutrients_data: {
    name: '',
    dailyNorm: '',
    unit: '',
    description: '',
    imageKey: '',
    videoKey: ''
  }
};

export const nutrients_fetchDraft = createAsyncThunk(
  'draft/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await nutrients_api.api.nutrientsControllerGetDraft();
      return response.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const nutrients_createDraftAsync = createAsyncThunk(
  'draft/create',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      await nutrients_api.api.nutrientsControllerCreate(
        formData as any,
        { type: 'multipart/form-data' as any }
      );
      dispatch(nutrients_fetchDraft());
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания');
    }
  }
);

export const nutrients_publishDraftAsync = createAsyncThunk(
  'draft/publish',
  async ({ id, data }: { id: number, data: any }, { dispatch, rejectWithValue }) => {
    try {
      await nutrients_api.api.nutrientsControllerPublish(id, data);
      
      // Жестко очищаеncz черновик во фронтенде сразу после публикации
      dispatch(nutrients_clearDraft());
      
      return true;
    } catch (error) {
      return rejectWithValue('Ошибка публикации');
    }
  }
);

const nutrients_draftSlice = createSlice({
  name: 'nutrients_draft',
  initialState,
  reducers: {
    nutrients_updateDraftData(state, action) {
      state.nutrients_data = { ...state.nutrients_data, ...action.payload };
    },
    nutrients_clearDraft(state) {
      state.nutrients_draftId = null;
      state.nutrients_isDraft = false;
      state.nutrients_data = initialState.nutrients_data;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(nutrients_fetchDraft.fulfilled, (state, action: any) => {
      // Если данные пришли, записываем. Если пришла пустота - очищаем!
      if (action.payload && action.payload.id) {
        state.nutrients_draftId = action.payload.id;
        state.nutrients_isDraft = true;
        state.nutrients_data = {
          name: action.payload.name || '',
          dailyNorm: action.payload.dailyNorm || '',
          unit: action.payload.unit || '',
          description: action.payload.description || '',
          imageKey: action.payload.imageKey || '',
          videoKey: action.payload.videoKey || ''
        };
      } else {
        state.nutrients_draftId = null;
        state.nutrients_isDraft = false;
        state.nutrients_data = initialState.nutrients_data;
      }
    });
    
    // Если сервер ответил ошибкой (например 404 Not Found), тоже всё сбрасываем
    builder.addCase(nutrients_fetchDraft.rejected, (state) => {
        state.nutrients_draftId = null;
        state.nutrients_isDraft = false;
        state.nutrients_data = initialState.nutrients_data;
    });
  }
});

export const { nutrients_updateDraftData, nutrients_clearDraft } = nutrients_draftSlice.actions;
export default nutrients_draftSlice.reducer;