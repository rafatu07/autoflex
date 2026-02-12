interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalElements: number
  pageSize: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalElements,
  pageSize,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const start = currentPage * pageSize + 1
  const end = Math.min((currentPage + 1) * pageSize, totalElements)

  return (
    <div className="pagination">
      <span className="pagination-info">
        {totalElements === 0
          ? 'Nenhum item'
          : `${start}-${end} de ${totalElements}`}
      </span>
      <div className="pagination-buttons">
        <button
          type="button"
          className="secondary"
          disabled={currentPage <= 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </button>
        <span className="pagination-pages">
          Página {currentPage + 1} de {totalPages || 1}
        </span>
        <button
          type="button"
          className="secondary"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  )
}
