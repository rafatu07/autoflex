import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productionSuggestionApi, ProductionSuggestionResponseDTO } from '../../services/api'

export const fetchProductionSuggestion = createAsyncThunk(
  'productionSuggestion/fetch',
  () => productionSuggestionApi.get()
)

interface ProductionSuggestionState {
  data: ProductionSuggestionResponseDTO | null
  loading: boolean
  error: string | null
}

const initialState: ProductionSuggestionState = {
  data: null,
  loading: false,
  error: null,
}

const productionSuggestionSlice = createSlice({
  name: 'productionSuggestion',
  initialState,
  reducers: {
    clear: (state) => {
      state.data = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionSuggestion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductionSuggestion.fulfilled, (state, { payload }) => {
        state.loading = false
        state.data = payload
      })
      .addCase(fetchProductionSuggestion.rejected, (state, { error }) => {
        state.loading = false
        state.error = error.message || 'Failed to load production suggestion'
      })
  },
})

export const { clear } = productionSuggestionSlice.actions
export default productionSuggestionSlice.reducer
