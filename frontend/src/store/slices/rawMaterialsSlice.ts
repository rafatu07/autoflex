import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { rawMaterialsApi, RawMaterialDTO } from '../../services/api'

export const fetchRawMaterials = createAsyncThunk(
  'rawMaterials/fetchPage',
  ({ page = 0, size = 10 }: { page?: number; size?: number } = {}) =>
    rawMaterialsApi.list(page ?? 0, size ?? 10)
)
export const fetchRawMaterialsAll = createAsyncThunk('rawMaterials/fetchAll', () => rawMaterialsApi.listAll())
export const fetchRawMaterial = createAsyncThunk('rawMaterials/fetchOne', (id: number) => rawMaterialsApi.get(id))
export const createRawMaterial = createAsyncThunk('rawMaterials/create', (body: RawMaterialDTO) =>
  rawMaterialsApi.create(body)
)
export const updateRawMaterial = createAsyncThunk(
  'rawMaterials/update',
  ({ id, body }: { id: number; body: RawMaterialDTO }) => rawMaterialsApi.update(id, body)
)
export const deleteRawMaterial = createAsyncThunk('rawMaterials/delete', (id: number) => rawMaterialsApi.delete(id))

interface RawMaterialsState {
  list: RawMaterialDTO[]
  allList: RawMaterialDTO[]
  current: RawMaterialDTO | null
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  totalElements: number
  pageSize: number
}

const initialState: RawMaterialsState = {
  list: [],
  allList: [],
  current: null,
  loading: false,
  error: null,
  page: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 10,
}

const rawMaterialsSlice = createSlice({
  name: 'rawMaterials',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRawMaterials.fulfilled, (state, { payload }) => {
        state.loading = false
        state.list = payload.content
        state.page = payload.number
        state.totalPages = payload.totalPages
        state.totalElements = payload.totalElements
        state.pageSize = payload.size
      })
      .addCase(fetchRawMaterialsAll.fulfilled, (state, { payload }) => {
        state.allList = payload
      })
      .addCase(fetchRawMaterials.rejected, (state, { error }) => {
        state.loading = false
        state.error = error.message || 'Failed to load raw materials'
      })
      .addCase(fetchRawMaterial.fulfilled, (state, { payload }) => {
        state.current = payload
      })
      .addCase(createRawMaterial.fulfilled, (state, { payload }) => {
        state.list = state.list.some((p) => p.id === payload.id) ? state.list.map((p) => (p.id === payload.id ? payload : p)) : [...state.list, payload]
        state.allList = state.allList.some((p) => p.id === payload.id) ? state.allList.map((p) => (p.id === payload.id ? payload : p)) : [...state.allList, payload]
        state.totalElements += 1
        state.current = payload
        state.error = null
      })
      .addCase(createRawMaterial.rejected, (state, { error }) => {
        state.error = error.message || 'Failed to create raw material'
      })
      .addCase(updateRawMaterial.fulfilled, (state, { payload }) => {
        const i = state.list.findIndex((p) => p.id === payload.id)
        if (i >= 0) state.list[i] = payload
        const j = state.allList.findIndex((p) => p.id === payload.id)
        if (j >= 0) state.allList[j] = payload
        state.current = payload
        state.error = null
      })
      .addCase(updateRawMaterial.rejected, (state, { error }) => {
        state.error = error.message || 'Failed to update raw material'
      })
      .addCase(deleteRawMaterial.fulfilled, (state, { meta }) => {
        state.list = state.list.filter((p) => p.id !== meta.arg)
        state.allList = state.allList.filter((p) => p.id !== meta.arg)
        state.totalElements = Math.max(0, state.totalElements - 1)
        if (state.current?.id === meta.arg) state.current = null
      })
  },
})

export const { clearCurrent, clearError } = rawMaterialsSlice.actions
export default rawMaterialsSlice.reducer
