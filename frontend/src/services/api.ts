const API_BASE = '/api'

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!res.ok) {
    const data = text ? JSON.parse(text) : { message: res.statusText }
    throw new Error(data.message || `HTTP ${res.status}`)
  }
  return text ? JSON.parse(text) : (undefined as T)
}

export interface ProductDTO {
  id?: number
  code: string
  name: string
  value: number
  rawMaterials?: ProductRawMaterialItemDTO[]
}

export interface ProductRawMaterialItemDTO {
  id?: number
  rawMaterialId: number
  rawMaterialCode?: string
  rawMaterialName?: string
  quantityRequired: number
}

export interface RawMaterialDTO {
  id?: number
  code: string
  name: string
  stockQuantity: number
}

export interface ProductionSuggestionItemDTO {
  productId: number
  productCode: string
  productName: string
  quantity: number
  valuePerUnit: number
  totalValue: number
}

export interface ProductionSuggestionResponseDTO {
  items: ProductionSuggestionItemDTO[]
  totalValue: number
}

export interface PageResponseDTO<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export const productsApi = {
  list: (page = 0, size = 10) =>
    fetch(`${API_BASE}/products?page=${page}&size=${size}`).then((r) =>
      handleResponse<PageResponseDTO<ProductDTO>>(r)
    ),
  get: (id: number) =>
    fetch(`${API_BASE}/products/${id}`).then((r) => handleResponse<ProductDTO>(r)),
  create: (body: ProductDTO) =>
    fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => handleResponse<ProductDTO>(r)),
  update: (id: number, body: ProductDTO) =>
    fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => handleResponse<ProductDTO>(r)),
  delete: (id: number) =>
    fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' }).then((r) => {
      if (!r.ok) return r.text().then((t) => { throw new Error(JSON.parse(t).message) })
    }),
}

export const rawMaterialsApi = {
  list: (page = 0, size = 10) =>
    fetch(`${API_BASE}/raw-materials?page=${page}&size=${size}`).then((r) =>
      handleResponse<PageResponseDTO<RawMaterialDTO>>(r)
    ),
  listAll: () =>
    fetch(`${API_BASE}/raw-materials/all`).then((r) => handleResponse<RawMaterialDTO[]>(r)),
  get: (id: number) =>
    fetch(`${API_BASE}/raw-materials/${id}`).then((r) => handleResponse<RawMaterialDTO>(r)),
  create: (body: RawMaterialDTO) =>
    fetch(`${API_BASE}/raw-materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => handleResponse<RawMaterialDTO>(r)),
  update: (id: number, body: RawMaterialDTO) =>
    fetch(`${API_BASE}/raw-materials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => handleResponse<RawMaterialDTO>(r)),
  delete: (id: number) =>
    fetch(`${API_BASE}/raw-materials/${id}`, { method: 'DELETE' }).then((r) => {
      if (!r.ok) return r.text().then((t) => { throw new Error(JSON.parse(t).message) })
    }),
}

export const productionSuggestionApi = {
  get: () =>
    fetch(`${API_BASE}/production-suggestion`).then((r) =>
      handleResponse<ProductionSuggestionResponseDTO>(r)
    ),
}
