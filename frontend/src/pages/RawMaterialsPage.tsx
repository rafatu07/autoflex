import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  fetchRawMaterial,
  clearCurrent,
  clearError,
} from '../store/slices/rawMaterialsSlice'
import { Pagination } from '../components/Pagination'
import type { RawMaterialDTO } from '../services/api'
import type { RootState } from '../store'

const PAGE_SIZE = 10
const emptyRawMaterial: RawMaterialDTO = { code: '', name: '', stockQuantity: 0 }

export function RawMaterialsPage() {
  const dispatch = useDispatch()
  const { list, current, loading, error, page, totalPages, totalElements, pageSize } = useSelector((s: RootState) => s.rawMaterials)
  const [form, setForm] = useState<RawMaterialDTO>(emptyRawMaterial)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchRawMaterials({ page: 0, size: PAGE_SIZE }) as any)
  }, [dispatch])

  const handlePageChange = (newPage: number) => {
    dispatch(fetchRawMaterials({ page: newPage, size: pageSize || PAGE_SIZE }) as any)
  }

  useEffect(() => {
    if (current) {
      setForm({
        id: current.id,
        code: current.code,
        name: current.name,
        stockQuantity: current.stockQuantity,
      })
      setEditingId(current.id ?? null)
      setShowForm(true)
    }
  }, [current])

  const openNew = () => {
    dispatch(clearCurrent())
    setForm(emptyRawMaterial)
    setEditingId(null)
    setShowForm(true)
    dispatch(clearError())
  }

  const openEdit = (id: number) => {
    dispatch(fetchRawMaterial(id) as any)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    dispatch(clearCurrent())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body: RawMaterialDTO = {
      code: form.code.trim(),
      name: form.name.trim(),
      stockQuantity: Number(form.stockQuantity),
    }
    if (editingId != null) {
      dispatch(updateRawMaterial({ id: editingId, body }) as any).then((r: any) => {
        if (!r.error) closeForm()
      })
    } else {
      dispatch(createRawMaterial(body) as any).then((r: any) => {
        if (!r.error) closeForm()
      })
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Excluir esta matéria-prima?')) dispatch(deleteRawMaterial(id) as any)
  }

  if (loading && list.length === 0) return <div className="loading">Carregando matérias-primas...</div>

  return (
    <div className="card">
      <h1>Matérias-primas</h1>
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
          Nova matéria-prima
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1rem' }}>
          <h2>{editingId != null ? 'Editar matéria-prima' : 'Nova matéria-prima'}</h2>
          <div className="form-group">
            <label>Código</label>
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              required
              placeholder="ex.: RM-001"
            />
          </div>
          <div className="form-group">
            <label>Nome</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="Nome da matéria-prima"
            />
          </div>
          <div className="form-group">
            <label>Quantidade em estoque</label>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={form.stockQuantity}
              onChange={(e) => setForm((f) => ({ ...f, stockQuantity: Number(e.target.value) }))}
              required
            />
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
              <th>Quantidade em estoque</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((rm) => (
              <tr key={rm.id}>
                <td>{rm.code}</td>
                <td>{rm.name}</td>
                <td>{Number(rm.stockQuantity).toFixed(4)}</td>
                <td>
                  <button type="button" className="secondary" onClick={() => openEdit(rm.id!)}>
                    Editar
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(rm.id!)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="list-mobile">
        {list.map((rm) => (
          <div key={rm.id} className="list-card">
            <div className="list-card-row">
              <span className="list-card-label">Código</span>
              <span>{rm.code}</span>
            </div>
            <div className="list-card-row">
              <span className="list-card-label">Nome</span>
              <span>{rm.name}</span>
            </div>
            <div className="list-card-row">
              <span className="list-card-label">Quantidade em estoque</span>
              <span>{Number(rm.stockQuantity).toFixed(4)}</span>
            </div>
            <div className="list-card-actions">
              <button type="button" className="secondary" onClick={() => openEdit(rm.id!)}>
                Editar
              </button>
              <button type="button" className="danger" onClick={() => handleDelete(rm.id!)}>
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
