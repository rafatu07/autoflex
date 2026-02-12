import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './slices/productsSlice'
import rawMaterialsReducer from './slices/rawMaterialsSlice'
import productionSuggestionReducer from './slices/productionSuggestionSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    productionSuggestion: productionSuggestionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
