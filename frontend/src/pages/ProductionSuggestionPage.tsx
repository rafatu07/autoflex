import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductionSuggestion } from '../store/slices/productionSuggestionSlice'
import type { RootState } from '../store'
import { formatCurrencyBr } from '../utils/format'

export function ProductionSuggestionPage() {
  const dispatch = useDispatch()
  const { data, loading, error } = useSelector((s: RootState) => s.productionSuggestion)

  useEffect(() => {
    dispatch(fetchProductionSuggestion() as any)
  }, [dispatch])

  if (loading && !data) return <div className="loading">Carregando sugestão de produção...</div>
  if (error && !data)
    return (
      <div className="card">
        <h1>Sugestão de produção</h1>
        <p className="error-msg">{error}</p>
        <button type="button" onClick={() => dispatch(fetchProductionSuggestion() as any)}>
          Tentar novamente
        </button>
      </div>
    )

  const items = data?.items ?? []
  const totalValue = data?.totalValue ?? 0

  return (
    <div className="card">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <h1>Sugestão de produção</h1>
        <button type="button" onClick={() => dispatch(fetchProductionSuggestion() as any)} disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Produtos e quantidades que podem ser produzidos com o estoque atual de matérias-primas, priorizados pelo valor do produto.
      </p>
      {error && <p className="error-msg">{error}</p>}
      {items.length === 0 ? (
        <p className="loading">Nenhum produto pode ser produzido com o estoque atual ou não há produtos/matérias-primas cadastrados.</p>
      ) : (
        <>
          <div className="list-desktop" style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Código do produto</th>
                  <th>Nome do produto</th>
                  <th>Quantidade</th>
                  <th>Valor unitário</th>
                  <th>Valor total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productCode}</td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrencyBr(Number(item.valuePerUnit))}</td>
                    <td>{formatCurrencyBr(Number(item.totalValue))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="list-mobile">
            {items.map((item) => (
              <div key={item.productId} className="list-card">
                <div className="list-card-row">
                  <span className="list-card-label">Código</span>
                  <span>{item.productCode}</span>
                </div>
                <div className="list-card-row">
                  <span className="list-card-label">Nome</span>
                  <span>{item.productName}</span>
                </div>
                <div className="list-card-row">
                  <span className="list-card-label">Quantidade</span>
                  <span>{item.quantity}</span>
                </div>
                <div className="list-card-row">
                  <span className="list-card-label">Valor unitário</span>
                  <span>{formatCurrencyBr(Number(item.valuePerUnit))}</span>
                </div>
                <div className="list-card-row">
                  <span className="list-card-label">Valor total</span>
                  <span>{formatCurrencyBr(Number(item.totalValue))}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1rem', fontWeight: 600 }}>
            Valor total: {formatCurrencyBr(Number(totalValue))}
          </p>
        </>
      )}
    </div>
  )
}
