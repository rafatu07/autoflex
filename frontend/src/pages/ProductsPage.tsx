import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProduct,
  clearCurrent,
  clearError,
} from '../store/slices/productsSlice'
import { fetchRawMaterialsAll } from '../store/slices/rawMaterialsSlice'
import { Pagination } from '../components/Pagination'
import type { ProductDTO, ProductRawMaterialItemDTO } from '../services/api'
import type { RootState } from '../store'

const PAGE_SIZE = 10
const emptyProduct: ProductDTO = { code: '', name: '', value: 0, rawMaterials: [] }

export function ProductsPage() {
  const dispatch = useDispatch()
  const { list, current, loading, error, page, totalPages, totalElements, pageSize } = useSelector((s: RootState) => s.products)
  const { allList: rawMaterialsList } = useSelector((s: RootState) => s.rawMaterials)
  const [form, setForm] = useState<ProductDTO>(emptyProduct)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: PAGE_SIZE }) as any)
    dispatch(fetchRawMaterialsAll() as any)
  }, [dispatch])

  const handlePageChange = (newPage: number) => {
    dispatch(fetchProducts({ page: newPage, size: pageSize || PAGE_SIZE }) as any)
  }

  useEffect(() => {
    if (current) {
      setForm({
        id: current.id,
        code: current.code,
        name: current.name,
        value: current.value,
        rawMaterials: (current.rawMaterials || []).map((rm) => ({
          id: rm.id,
          rawMaterialId: rm.rawMaterialId,
          rawMaterialCode: rm.rawMaterialCode,
          rawMaterialName: rm.rawMaterialName,
          quantityRequired: rm.quantityRequired,
        })),
      })
      setEditingId(current.id ?? null)
      setShowForm(true)
    }
  }, [current])

  const openNew = () => {
    dispatch(clearCurrent())
    setForm(emptyProduct)
    setEditingId(null)
    setShowForm(true)
    dispatch(clearError())
  }

  const openEdit = (id: number) => {
    dispatch(fetchProduct(id) as any)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    dispatch(clearCurrent())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body: ProductDTO = {
      code: form.code.trim(),
      name: form.name.trim(),
      value: Number(form.value),
      rawMaterials: (form.rawMaterials || []).filter((r) => r.rawMaterialId && r.quantityRequired > 0),
    }
    if (editingId != null) {
      dispatch(updateProduct({ id: editingId, body }) as any).then((r: any) => {
        if (!r.error) closeForm()
      })
    } else {
      dispatch(createProduct(body) as any).then((r: any) => {
        if (!r.error) closeForm()
      })
    }
  }

  const addRawMaterialRow = () => {
    setForm((f) => ({
      ...f,
      rawMaterials: [...(f.rawMaterials || []), { rawMaterialId: 0, quantityRequired: 0 }],
    }))
  }

  const updateRawMaterialRow = (index: number, field: keyof ProductRawMaterialItemDTO, value: number) => {
    setForm((f) => {
      const next = [...(f.rawMaterials || [])]
      const item = { ...next[index], [field]: value }
      next[index] = item
      return { ...f, rawMaterials: next }
    })
  }

  const removeRawMaterialRow = (index: number) => {
    setForm((f) => ({
      ...f,
      rawMaterials: (f.rawMaterials || []).filter((_, i) => i !== index),
    }))
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Excluir este produto?')) dispatch(deleteProduct(id) as any)
  }

  if (loading && list.length === 0) return <div className="loading">Carregando produtos...</div>

  return (
    <div className="card">
      <h1>Produtos</h1>
      {error && (
        <div className="error-msg">
          {error}
          <button type="button" className="secondary" onClick={() => dispatch(clearError())}>
            Fechar
          </button>
        </div>
      )}
      <div className="actions" style={{ marginBottom: '1rem' }}>
        <button type="button" onClick={openNew}>
          Novo produto
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1rem' }}>
          <h2>{editingId != null ? 'Editar produto' : 'Novo produto'}</h2>
          <div className="form-group">
            <label>Código</label>
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              required
              placeholder="ex.: PROD-001"
            />
          </div>
          <div className="form-group">
            <label>Nome</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="Nome do produto"
            />
          </div>
          <div className="form-group">
            <label>Valor (unidade)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
              required
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h3>Matérias-primas (composição)</h3>
            {(form.rawMaterials || []).map((row, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: '0.5rem',
                  alignItems: 'end',
                  marginBottom: '0.5rem',
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Matéria-prima</label>
                  <select
                    value={row.rawMaterialId}
                    onChange={(e) => updateRawMaterialRow(index, 'rawMaterialId', Number(e.target.value))}
                    required
                  >
                    <option value={0}>Selecionar...</option>
                    {rawMaterialsList.map((rm) => (
                      <option key={rm.id} value={rm.id}>
                        {rm.code} – {rm.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Quantidade necessária</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    value={row.quantityRequired || ''}
                    onChange={(e) => updateRawMaterialRow(index, 'quantityRequired', Number(e.target.value))}
                  />
                </div>
                <button type="button" className="secondary danger" onClick={() => removeRawMaterialRow(index)}>
                  Remover
                </button>
              </div>
            ))}
            <button type="button" className="secondary" onClick={addRawMaterialRow}>
              Adicionar matéria-prima
            </button>
          </div>

          <div className="actions" style={{ marginTop: '1rem' }}>
            <button type="submit">{editingId != null ? 'Atualizar' : 'Criar'}</button>
            <button type="button" className="secondary" onClick={closeForm}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="list-desktop" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Valor</th>
              <th>Matérias-primas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>{p.code}</td>
                <td>{p.name}</td>
                <td>{Number(p.value).toFixed(2)}</td>
                <td>{(p.rawMaterials || []).length} item(ns)</td>
                <td>
                  <button type="button" className="secondary" onClick={() => openEdit(p.id!)}>
                    Editar
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(p.id!)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="list-mobile">
        {list.map((p) => (
          <div key={p.id} className="list-card">
            <div className="list-card-row">
              <span className="list-card-label">Código</span>
              <span>{p.code}</span>
            </div>
            <div className="list-card-row">
              <span className="list-card-label">Nome</span>
              <span>{p.name}</span>
            </div>
            <div className="list-card-row">
              <span className="list-card-label">Valor</span>
              <span>{Number(p.value).toFixed(2)}</span>
            </div>
            <div className="list-card-row">
              <span className="list-card-label">Matérias-primas</span>
              <span>{(p.rawMaterials || []).length} item(ns)</span>
            </div>
            <div className="list-card-actions">
              <button type="button" className="secondary" onClick={() => openEdit(p.id!)}>
                Editar
              </button>
              <button type="button" className="danger" onClick={() => handleDelete(p.id!)}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize || PAGE_SIZE}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
