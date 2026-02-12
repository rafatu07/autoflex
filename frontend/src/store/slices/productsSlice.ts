import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productsApi, ProductDTO } from '../../services/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchPage',
  ({ page = 0, size = 10 }: { page?: number; size?: number } = {}) =>
    productsApi.list(page ?? 0, size ?? 10)
)
export const fetchProduct = createAsyncThunk('products/fetchOne', (id: number) => productsApi.get(id))
export const createProduct = createAsyncThunk('products/create', (body: ProductDTO) => productsApi.create(body))
export const updateProduct = createAsyncThunk(
  'products/update',
  ({ id, body }: { id: number; body: ProductDTO }) => productsApi.update(id, body)
)
export const deleteProduct = createAsyncThunk('products/delete', (id: number) => productsApi.delete(id))

interface ProductsState {
  list: ProductDTO[]
  current: ProductDTO | null
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  totalElements: number
  pageSize: number
}

const initialState: ProductsState = {
  list: [],
  current: null,
  loading: false,
  error: null,
  page: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 10,
}

const productsSlice = createSlice({
  name: 'products',
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false
        state.list = payload.content
        state.page = payload.number
        state.totalPages = payload.totalPages
        state.totalElements = payload.totalElements
        state.pageSize = payload.size
      })
      .addCase(fetchProducts.rejected, (state, { error }) => {
        state.loading = false
        state.error = error.message || 'Failed to load products'
      })
      .addCase(fetchProduct.fulfilled, (state, { payload }) => {
        state.current = payload
      })
      .addCase(createProduct.fulfilled, (state, { payload }) => {
        state.list = state.list.some((p) => p.id === payload.id) ? state.list.map((p) => (p.id === payload.id ? payload : p)) : [...state.list, payload]
        state.current = payload
        state.error = null
      })
      .addCase(createProduct.rejected, (state, { error }) => {
        state.error = error.message || 'Failed to create product'
      })
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        const i = state.list.findIndex((p) => p.id === payload.id)
        if (i >= 0) state.list[i] = payload
        state.current = payload
        state.error = null
      })
      .addCase(updateProduct.rejected, (state, { error }) => {
        state.error = error.message || 'Failed to update product'
      })
      .addCase(deleteProduct.fulfilled, (state, { meta }) => {
        state.list = state.list.filter((p) => p.id !== meta.arg)
        state.totalElements = Math.max(0, state.totalElements - 1)
        if (state.current?.id === meta.arg) state.current = null
      })
  },
})

export const { clearCurrent, clearError } = productsSlice.actions
export default productsSlice.reducer
