import productionSuggestionReducer, {
  fetchProductionSuggestion,
  clear,
} from './productionSuggestionSlice'

describe('productionSuggestionSlice', () => {
  const initialState = {
    data: null,
    loading: false,
    error: null,
  }

  it('should return initial state', () => {
    expect(productionSuggestionReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should set loading on fetchProductionSuggestion.pending', () => {
    const state = productionSuggestionReducer(
      initialState,
      fetchProductionSuggestion.pending('', undefined, undefined)
    )
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should set data on fetchProductionSuggestion.fulfilled', () => {
    const payload = { items: [], totalValue: 100 }
    const state = productionSuggestionReducer(
      { ...initialState, loading: true },
      fetchProductionSuggestion.fulfilled(payload, '', undefined)
    )
    expect(state.loading).toBe(false)
    expect(state.data).toEqual(payload)
    expect(state.error).toBeNull()
  })

  it('should set error on fetchProductionSuggestion.rejected', () => {
    const state = productionSuggestionReducer(
      { ...initialState, loading: true },
      fetchProductionSuggestion.rejected(new Error('Network error'), '', undefined)
    )
    expect(state.loading).toBe(false)
    expect(state.error).toContain('Network error')
  })

  it('should clear data and error on clear', () => {
    const state = productionSuggestionReducer(
      { data: { items: [], totalValue: 0 }, loading: false, error: 'err' },
      clear()
    )
    expect(state.data).toBeNull()
    expect(state.error).toBeNull()
  })
})
